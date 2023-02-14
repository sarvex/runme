package runner

import (
	"bufio"
	"context"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
	"syscall"

	"github.com/creack/pty"
	"github.com/pkg/errors"
	"go.uber.org/multierr"
	"go.uber.org/zap"
)

const (
	envStartFileName = ".env_start"
	envEndFileName   = ".env_end"
)

type command struct {
	ProgramPath string
	Args        []string
	Directory   string
	Session     *Session
	Stdin       io.Reader
	Stdout      io.Writer
	Stderr      io.Writer

	cmd *exec.Cmd

	// pty and tty as pseud-terminal primary and secondary.
	// Might be nil if not allocating a pseudo-terminal.
	pty *os.File
	tty *os.File

	tmpEnvDir string

	wg  sync.WaitGroup
	mu  sync.Mutex
	err error

	logger *zap.Logger
}

func (c *command) seterr(err error) {
	if err == nil {
		return
	}
	c.mu.Lock()
	if c.err == nil {
		c.err = err
	}
	c.mu.Unlock()
}

type commandConfig struct {
	ProgramName string   // a path to shell or a name, for example: "/usr/local/bin/bash", "bash"
	Args        []string // args passed to the program
	Directory   string
	Session     *Session

	Tty    bool // if true, a pseudo-terminal is allocated
	Stdin  io.Reader
	Stdout io.Writer
	Stderr io.Writer

	IsShell  bool // if true then Commands or Scripts is passed to shell as "-c" argument's value
	Commands []string
	Script   string

	Logger *zap.Logger
}

func newCommand(cfg *commandConfig) (*command, error) {
	programPath, err := exec.LookPath(cfg.ProgramName)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	directory := cfg.Directory
	if directory == "" {
		var err error
		directory, err = os.Getwd()
		if err != nil {
			return nil, errors.WithStack(err)
		}
	}

	var (
		extraArgs    []string
		envStorePath string
	)

	if cfg.IsShell && (len(cfg.Commands) > 0 || cfg.Script != "") {
		var err error
		envStorePath, err = os.MkdirTemp("", "")
		if err != nil {
			return nil, errors.WithStack(err)
		}

		var script strings.Builder

		_, _ = script.WriteString("env > " + filepath.Join(envStorePath, envStartFileName) + "\n")

		if len(cfg.Commands) > 0 {
			_, _ = script.WriteString(
				prepareScriptFromCommands(cfg.Commands),
			)
		} else if cfg.Script != "" {
			_, _ = script.WriteString(
				prepareScript(cfg.Script),
			)
		}

		_, _ = script.WriteString("env > " + filepath.Join(envStorePath, envEndFileName) + "\n")

		extraArgs = []string{"-c", script.String()}
	}

	session := cfg.Session
	if session == nil {
		session = NewSession(nil, cfg.Logger)
	}

	cmd := &command{
		ProgramPath: programPath,
		Args:        append(cfg.Args, extraArgs...),
		Directory:   directory,
		Session:     session,
		Stdin:       cfg.Stdin,
		Stdout:      cfg.Stdout,
		Stderr:      cfg.Stderr,
		tmpEnvDir:   envStorePath,
		logger:      cfg.Logger,
	}

	if cfg.Tty {
		var err error
		cmd.pty, cmd.tty, err = pty.Open()
		if err != nil {
			cmd.cleanup()
			return nil, errors.WithStack(err)
		}
	}

	return cmd, nil
}

func (c *command) cleanup() {
	var err error

	if c.tmpEnvDir != "" {
		if e := os.RemoveAll(c.tmpEnvDir); e != nil {
			c.logger.Info("failed to delete tmpEnvDir", zap.Error(e))
			err = multierr.Append(err, e)
		}
	}
	if c.tty != nil {
		if e := c.tty.Close(); e != nil {
			c.logger.Info("failed to close tty", zap.Error(e))
			err = multierr.Append(err, e)
		}
	}
	if c.pty != nil {
		if e := c.pty.Close(); err != nil {
			c.logger.Info("failed to close pty", zap.Error(e))
			err = multierr.Append(err, e)
		}
	}

	c.seterr(err)
}

type startOpts struct {
	DisableEcho bool
}

func (c *command) Start(ctx context.Context) error {
	return c.StartWithOpts(ctx, &startOpts{})
}

func (c *command) StartWithOpts(ctx context.Context, opts *startOpts) error {
	c.cmd = exec.CommandContext(
		ctx,
		c.ProgramPath,
		c.Args...,
	)
	c.cmd.Dir = c.Directory
	c.cmd.Env = append(c.cmd.Env, c.Session.Envs()...)

	if c.tty != nil {
		c.cmd.Stdin = c.tty
		c.cmd.Stdout = c.tty
		c.cmd.Stderr = c.tty

		setSysProcAttrCtty(c.cmd)
	} else {
		c.cmd.Stdin = c.Stdin
		c.cmd.Stdout = c.Stdout
		c.cmd.Stderr = c.Stderr

		// Set the process group ID of the program.
		// It is helpful to stop the program and its
		// children. See command.Stop().
		// Note that Setsid set in setSysProcAttrCtty()
		// already starts a new process group, hence,
		// this call is inside this branch.
		setSysProcAttrPgid(c.cmd)
	}

	if err := c.cmd.Start(); err != nil {
		c.cleanup()
		return errors.WithStack(err)
	}

	if c.tty != nil {
		if opts.DisableEcho {
			// Disable echoing. This solves the problem of duplicating entered line in the output.
			// This is one of the solutions, but there are other methods:
			//   - removing echoed input from the output
			//   - removing the entered line using escape codes
			if err := disableEcho(c.tty.Fd()); err != nil {
				return err
			}
		}

		// Close tty as not needed anymore.
		if err := c.tty.Close(); err != nil {
			c.logger.Info("failed to close tty after starting the command", zap.Error(err))
		}

		c.tty = nil
	}

	if c.pty != nil {
		c.wg.Add(1)
		go func() {
			defer c.wg.Done()
			_, err := io.Copy(c.Stdout, c.pty)
			if err != nil {
				// Linux kernel returns EIO when attempting to read from
				// a master pseudo-terminal which no longer has an open slave.
				// See https://github.com/creack/pty/issues/21.
				if errors.Is(err, syscall.EIO) {
					c.logger.Debug("failed to copy from pty to stdout; handled EIO")
					return
				}
				if errors.Is(err, os.ErrClosed) {
					c.logger.Debug("failed to copy from pty to stdout; handled ErrClosed")
					return
				}

				c.logger.Info("failed to copy from pty to stdout", zap.Error(err))

				c.seterr(err)
			}
		}()

		c.wg.Add(1)
		go func() {
			defer c.wg.Done()
			_, err := io.Copy(c.pty, c.Stdin)
			if err != nil {
				c.logger.Info("failed to copy from stdin to pty", zap.Error(err))
				c.seterr(err)
			} else {
				c.logger.Info("read all from stdin")
			}
		}()
	}

	return nil
}

func (c *command) Stop() error {
	if c.cmd == nil {
		return errors.New("command not started")
	}

	if c.pty != nil {
		if err := c.pty.Close(); err != nil {
			return errors.Wrap(err, "failed to close pty")
		}
	}

	// Try to kill the whole process group. If it fails,
	// fall back to exec.Cmd.Process.Kill().
	if err := killPgid(c.cmd.Process.Pid); err != nil {
		c.logger.Info("failed to kill process group; trying regular process kill", zap.Error(err))
		return errors.WithStack(c.cmd.Process.Kill())
	}
	return nil
}

func (c *command) readEnvFromFile(name string) (result []string, _ error) {
	f, err := os.Open(filepath.Join(c.tmpEnvDir, name))
	if err != nil {
		return nil, errors.WithStack(err)
	}
	defer func() { _ = f.Close() }()

	scanner := bufio.NewScanner(f)
	scanner.Split(bufio.ScanLines)

	for scanner.Scan() {
		result = append(result, scanner.Text())
	}

	return result, errors.WithStack(scanner.Err())
}

func (c *command) collectEnvs() {
	if c.tmpEnvDir == "" {
		return
	}

	startEnvs, err := c.readEnvFromFile(envStartFileName)
	c.seterr(err)

	endEnvs, err := c.readEnvFromFile(envEndFileName)
	c.seterr(err)

	newOrUpdated, _, deleted := diffEnvStores(
		newEnvStore(startEnvs...),
		newEnvStore(endEnvs...),
	)

	c.Session.envStore = newEnvStore(c.cmd.Env...).Add(newOrUpdated...).Delete(deleted...)
}

func (c *command) Wait() error {
	werr := c.cmd.Wait()

	c.collectEnvs()

	c.cleanup()

	c.wg.Wait()

	if werr != nil {
		return errors.WithStack(werr)
	}

	c.mu.Lock()
	defer c.mu.Unlock()
	return c.err
}

func exitCodeFromErr(err error) int {
	if err == nil {
		return 0
	}
	var exiterr *exec.ExitError
	if errors.As(err, &exiterr) {
		status, ok := exiterr.ProcessState.Sys().(syscall.WaitStatus)
		if ok && status.Signaled() {
			// TODO(adamb): will like need to be improved.
			if status.Signal() == os.Interrupt {
				return 130
			} else if status.Signal() == os.Kill {
				return 137
			}
		}
		return exiterr.ExitCode()
	}
	return -1
}