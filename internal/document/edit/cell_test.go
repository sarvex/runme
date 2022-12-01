package edit

import (
	"testing"

	"github.com/stateful/runme/internal/document"
	"github.com/stateful/runme/internal/renderer/md"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_toCells_Basic(t *testing.T) {
	data := []byte(`# Examples

It can have an annotation with a name:

` + "```" + `sh {name=echo first= second=2}
$ echo "Hello, runme!"
` + "```" + `

> bq 1
> bq 2
>
>     echo 1
>
> b1 3

1. Item 1

   ` + "```" + `sh {name=echo first= second=2}
   $ echo "Hello, runme!"
   ` + "```" + `

   First inner paragraph

   Second inner paragraph

2. Item 2
3. Item 3
`)
	doc := document.New(data, md.Render)
	node, err := doc.Parse()
	require.NoError(t, err)

	cells := toCells(node, data)
	assert.Len(t, cells, 10)
	assert.Equal(t, "# Examples\n", cells[0].Value)
	assert.Equal(t, "It can have an annotation with a name:\n", cells[1].Value)
	assert.Equal(t, "```sh {name=echo first= second=2}\n$ echo \"Hello, runme!\"\n```\n", cells[2].Value)
	assert.Equal(t, "> bq 1\n> bq 2\n>\n>     echo 1\n>\n> b1 3\n", cells[3].Value)
	// TODO: fix this to contain the prefix
	assert.Equal(t, "Item 1\n", cells[4].Value)
	assert.Equal(t, "```sh {name=echo first= second=2}\n$ echo \"Hello, runme!\"\n```\n", cells[5].Value)
	assert.Equal(t, "First inner paragraph\n", cells[6].Value)
	assert.Equal(t, "Second inner paragraph\n", cells[7].Value)
	assert.Equal(t, "2. Item 2\n", cells[8].Value)
	assert.Equal(t, "3. Item 3\n", cells[9].Value)
}

func Test_toCells_NoCodeBlock(t *testing.T) {
	data := []byte(`# Examples

1. Item 1
2. Item 2
3. Item 3
`)
	doc := document.New(data, md.Render)
	node, err := doc.Parse()
	require.NoError(t, err)

	cells := toCells(node, data)
	assert.Len(t, cells, 2)
	assert.Equal(t, "# Examples\n", cells[0].Value)
	assert.Equal(t, "1. Item 1\n2. Item 2\n3. Item 3\n", cells[1].Value)
}

func Test_applyCells(t *testing.T) {
	data := []byte(`# Examples

1. Item 1
2. Item 2
3. Item 3

Last paragraph.
`)

	parse := func() (*document.Node, []*Cell) {
		doc := document.New(data, md.Render)
		node, err := doc.Parse()
		require.NoError(t, err)
		cells := toCells(node, data)
		assert.Len(t, cells, 3)
		return node, cells
	}

	t.Run("SimpleEdit", func(t *testing.T) {
		node, cells := parse()
		cells[0].Value = "# New header\n"
		applyCells(node, cells)
		assert.Equal(t, "# New header\n", string(node.Children()[0].Item().Value()))
	})

	t.Run("AddNewCell", func(t *testing.T) {
		t.Run("First", func(t *testing.T) {
			node, cells := parse()
			cells = append([]*Cell{
				{
					Kind:     MarkupKind,
					Value:    "# Title",
					Metadata: map[string]any{},
				},
			}, cells...)
			applyCells(node, cells)
			assert.Equal(t, "# Title\n", string(node.Children()[0].Item().Value()))
			assert.Equal(t, "# Examples\n", string(node.Children()[1].Item().Value()))
		})

		t.Run("Middle", func(t *testing.T) {
			node, cells := parse()
			cells = append(cells[:2], cells[1:]...)
			cells[1] = &Cell{
				Kind:     MarkupKind,
				Value:    "A new paragraph.\n",
				Metadata: map[string]any{},
			}
			applyCells(node, cells)
			assert.Equal(t, "# Examples\n", string(node.Children()[0].Item().Value()))
			assert.Equal(t, "A new paragraph.\n", string(node.Children()[1].Item().Value()))
			assert.Equal(t, "1. Item 1\n2. Item 2\n3. Item 3\n", string(node.Children()[2].Item().Value()))
		})

		t.Run("Last", func(t *testing.T) {
			node, cells := parse()
			cells = append(cells, &Cell{
				Kind:     MarkupKind,
				Value:    "Paragraph after the last one.\n",
				Metadata: map[string]any{},
			})
			applyCells(node, cells)
			l := len(cells)
			assert.Equal(t, "Last paragraph.\n", string(node.Children()[l-2].Item().Value()))
			assert.Equal(t, "Paragraph after the last one.\n", string(node.Children()[l-1].Item().Value()))
		})
	})

	t.Run("RemoveCell", func(t *testing.T) {
		node, cells := parse()
		cells = append(cells[:1], cells[2:]...)
		applyCells(node, cells)
		assert.Equal(t, "# Examples\n", string(node.Children()[0].Item().Value()))
		assert.Equal(t, "Last paragraph.\n", string(node.Children()[1].Item().Value()))
	})
}

func Test_applyCells_insertCodeInListItem(t *testing.T) {
	data := []byte(`# Examples

1. Item 1
2. Item 2
3. Item 3

End paragraph.
`)

	doc := document.New(data, md.Render)
	node, err := doc.Parse()
	require.NoError(t, err)
	cells := toCells(node, data)
	assert.Len(t, cells, 2)

	cells[1].Value = "1. Item\n   ```sh\n   echo 1\n   ```\n2. Item 2\n3. Item 3\n"
	applyCells(node, cells)
	assert.Len(t, cells, 6)
	assert.Equal(t, "", string(node.Children()[1].Item().Value()))
}
