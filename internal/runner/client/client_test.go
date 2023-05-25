package client

import (
	"path/filepath"
	"runtime"
	"testing"

	"github.com/stateful/runme/internal/project"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_ResolveDirectory(t *testing.T) {
	_, b, _, _ := runtime.Caller(0)
	root := filepath.Clean(
		filepath.Join(
			filepath.Dir(b),
			"../../../",
		),
	)

	projectRoot := filepath.Join(root, "examples/frontmatter/cwd")

	// repo path
	rp := func(rel string) string {
		return filepath.Join(root, rel)
	}

	proj, err := project.NewDirectoryProject(projectRoot, false, false, false)
	require.NoError(t, err)

	tasks, err := proj.LoadTasks()
	require.NoError(t, err)

	taskMap := make(map[string]string)

	for _, task := range tasks {
		resolved := ResolveDirectory(root, task)
		taskMap[task.Block.Name()] = resolved
	}

	assert.Equal(t, map[string]string{
		"absolute-pwd":     "/tmp",
		"absolute-rel-pwd": "/",
		"absolute-abs-pwd": "/opt",

		"none-pwd":     rp("examples/frontmatter/cwd"),
		"none-rel-pwd": rp("examples/frontmatter"),
		"none-abs-pwd": "/opt",

		"relative-pwd":     root,
		"relative-rel-pwd": rp("../"),
		"relative-abs-pwd": "/opt",
	}, taskMap)
}