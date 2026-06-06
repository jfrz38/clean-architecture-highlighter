import * as path from 'path';
import * as vscode from 'vscode';

export class WorkspaceRelativePath {
    public static from(uri: vscode.Uri): string | undefined {
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
        if (!workspaceFolder) {
            return undefined;
        }

        return path.relative(workspaceFolder.uri.fsPath, uri.fsPath);
    }
}
