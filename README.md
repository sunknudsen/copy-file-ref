# Claude Code Utils

Utilities for working with Claude Code.

## Features

### Copy Filename

Copy the current file’s name to clipboard.

**Output format:** `foo.ts`

**Usage:**

- **Keyboard shortcut:** `cmd+option+shift+f` (macOS) / `ctrl+alt+shift+f` (Windows/Linux)
- **Right-click menu:** "Copy Filename"

### Copy Relative Filename

Copy the current file's relative path to clipboard, including workspace folder name in multi-root workspaces.

**Output format:** `src/foo.ts` or `backend/src/foo.ts` (multi-root)

**Usage:**

- **Keyboard shortcut:** `cmd+option+shift+r` (macOS) / `ctrl+alt+shift+r` (Windows/Linux)
- **Right-click menu:** "Copy Relative Filename"

### Copy Code Reference

Copy relative path with line range to clipboard.

**Output format:** `src/foo.ts:42` or `src/foo.ts:42-58`

**Usage:**

- **Keyboard shortcut:** `cmd+option+shift+c` (macOS) / `ctrl+alt+shift+c` (Windows/Linux)
- **Right-click menu:** "Copy Code Reference"

Select one or more lines before triggering the command to include the line range.

## Package and install

Install dependencies and build the `.vsix` file:

```console
$ npm install

$ npm run package
```

Then install the generated file:

```console
$ code --install-extension claude-code-utils-*.vsix
```

Reload VS Code when prompted.
