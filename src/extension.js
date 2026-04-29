const vscode = require("vscode")
const path = require("path")

function activate(context) {
  const copyCodeRefCmd = vscode.commands.registerCommand(
    "claude-code-utils.copyCodeRef",
    () => {
      const editor = vscode.window.activeTextEditor
      if (!editor) return

      const doc = editor.document
      const sel = editor.selection

      // Get relative path from workspace root
      const workspaceFolder = vscode.workspace.getWorkspaceFolder(doc.uri)
      const prefix =
        vscode.workspace.workspaceFolders?.length > 1
          ? `${workspaceFolder.name}/`
          : ""
      const filePath = workspaceFolder
        ? prefix + path.relative(workspaceFolder.uri.fsPath, doc.uri.fsPath)
        : doc.uri.fsPath

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
    (uri) => {
      // Use URI from context menu (explorer) or active editor
      const fileUri = uri || vscode.window.activeTextEditor?.document.uri
      if (!fileUri) return

      const filename = path.basename(fileUri.fsPath)

      vscode.env.clipboard.writeText(filename).then(() => {
        vscode.window.setStatusBarMessage(`📋 Copied: ${filename}`, 3000)
      })
    }
  )

  context.subscriptions.push(copyFileNameCmd)
}

function deactivate() {}

module.exports = { activate, deactivate }
