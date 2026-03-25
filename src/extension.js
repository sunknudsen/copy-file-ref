const vscode = require("vscode")
const path = require("path")

function activate(context) {
  const cmd = vscode.commands.registerCommand("copy-file-ref.copy", () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) return

    const doc = editor.document
    const sel = editor.selection

    // Get relative path from workspace root
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(doc.uri)
    const filePath = workspaceFolder
      ? path.relative(workspaceFolder.uri.fsPath, doc.uri.fsPath)
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
  })

  context.subscriptions.push(cmd)
}

function deactivate() {}

module.exports = { activate, deactivate }
