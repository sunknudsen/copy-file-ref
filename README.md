# Copy File Reference

Copy relative path with line range to clipboard.

**Output format:** `src/foo.ts:42` or `src/foo.ts:42-58`

## Usage

- **Keyboard shortcut:** `cmd+option+shift+c` (macOS) / `ctrl+alt+shift+c` (Windows/Linux) while the editor is focused
- **Right-click menu:** "Copy File Reference (path:line-line)" in the Explorer or editor context menu

Select one or more lines before triggering the command to include the line range.

## Package and install

Install dependencies and build the `.vsix` file:

```console
$ npm install

$ npm run package
```

Then install the generated file:

```console
$ code --install-extension copy-file-ref-*.vsix
```

Reload VS Code when prompted.
