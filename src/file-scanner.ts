import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export function listFilesInWorkspace() {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders) {
        return;
    }

    const rootPath = folders[0].uri.fsPath;

    function walk(dir: string) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(fullPath);
            } else {
                console.log(fullPath);
            }
        }
    }

    walk(rootPath);
}
