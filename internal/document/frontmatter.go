package document

import (
	"encoding/json"
	"errors"
	"strings"

	"github.com/pelletier/go-toml/v2"
	parserv1 "github.com/stateful/runme/internal/gen/proto/go/runme/parser/v1"
	"gopkg.in/yaml.v3"
)

type Frontmatter struct {
	Shell string
	Cwd   string
}

type FrontmatterParseInfo struct {
	yaml error
	json error
	toml error

	other error
}

func (fpi FrontmatterParseInfo) YAMLError() error {
	return fpi.yaml
}

func (fpi FrontmatterParseInfo) JSONError() error {
	return fpi.json
}

func (fpi FrontmatterParseInfo) TOMLError() error {
	return fpi.toml
}

func (fpi FrontmatterParseInfo) Error() error {
	return fpi.other
}

func ParseFrontmatter(raw string) (f Frontmatter, info FrontmatterParseInfo) {
	lines := strings.Split(raw, "\n")

	if len(lines) < 2 || strings.TrimSpace(lines[0]) != strings.TrimSpace(lines[len(lines)-1]) {
		info.other = errors.New("invalid frontmatter")
		return
	}

	raw = strings.Join(lines[1:len(lines)-1], "\n")

	bytes := []byte(raw)

	if info.yaml = yaml.Unmarshal(bytes, &f); info.yaml == nil {
		return
	}

	if info.json = json.Unmarshal(bytes, &f); info.json == nil {
		return
	}

	if info.toml = toml.Unmarshal(bytes, &f); info.toml == nil {
		return
	}

	return
}

func (fmtr Frontmatter) ToParser() *parserv1.Frontmatter {
	return &parserv1.Frontmatter{
		Shell: fmtr.Shell,
		Cwd:   fmtr.Cwd,
	}
}
