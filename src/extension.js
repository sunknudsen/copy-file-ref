const vscode = require("vscode")
const path = require("path")

// The API does not expose the explorer selection, so explorer keybindings
// pass { source: "explorer" } and the selection is recovered through the
// built-in copyFilePath command (safe since the clipboard is overwritten
// with our result anyway)
async function resolveFileUris(arg) {
  if (arg instanceof vscode.Uri) return [arg]

  if (arg?.source === "explorer") {
    await vscode.commands.executeCommand("copyFilePath")
    const text = await vscode.env.clipboard.readText()
    return text
      .split(/\r?\n/)
      .filter(Boolean)
      .map((filePath) => vscode.Uri.file(filePath))
  }

  const editorUri = vscode.window.activeTextEditor?.document.uri
  return editorUri ? [editorUri] : []
}

// Get relative path from workspace root
function getRelativeFilePath(fileUri) {
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(fileUri)
  if (!workspaceFolder) return fileUri.fsPath

  const prefix =
    vscode.workspace.workspaceFolders?.length > 1
      ? `${workspaceFolder.name}/`
      : ""
  return prefix + path.relative(workspaceFolder.uri.fsPath, fileUri.fsPath)
}

function activate(context) {
  const copyCodeRefCmd = vscode.commands.registerCommand(
    "claude-code-utils.copyCodeRef",
    () => {
      const editor = vscode.window.activeTextEditor
      if (!editor) return

      const doc = editor.document
      const sel = editor.selection

      const filePath = getRelativeFilePath(doc.uri)

      // Lines are 0-indexed internally, +1 for human-readable
      const startLine = sel.start.line + 1
      const endLine = sel.end.line + 1

      const ref =
        startLine === endLine
          ? `${filePath}:${startLine}` // single line
          : `${filePath}:${startLine}-${endLine}` // range

      vscode.env.clipboard.writeText(ref).then(() => {
        vscode.window.setStatusBarMessage(`📋 Copied: ${ref}`, 3000)
      })
    }
  )

  context.subscriptions.push(copyCodeRefCmd)

  const copyFileNameCmd = vscode.commands.registerCommand(
    "claude-code-utils.copyFileName",
    async (arg) => {
      const fileUris = await resolveFileUris(arg)
      if (!fileUris.length) return

      const filenames = fileUris
        .map((fileUri) => path.basename(fileUri.fsPath))
        .join("\n")

      vscode.env.clipboard.writeText(filenames).then(() => {
        vscode.window.setStatusBarMessage(`📋 Copied: ${filenames}`, 3000)
      })
    }
  )

  context.subscriptions.push(copyFileNameCmd)

  const copyRelativeFilenameCmd = vscode.commands.registerCommand(
    "claude-code-utils.copyRelativeFilename",
    async (arg) => {
      const fileUris = await resolveFileUris(arg)
      if (!fileUris.length) return

      const filePaths = fileUris
        .map((fileUri) => getRelativeFilePath(fileUri))
        .join("\n")

      vscode.env.clipboard.writeText(filePaths).then(() => {
        vscode.window.setStatusBarMessage(`📋 Copied: ${filePaths}`, 3000)
      })
    }
  )

  context.subscriptions.push(copyRelativeFilenameCmd)
}

function deactivate() {}

module.exports = { activate, deactivate }
