import { listFilesInWorkspace } from './file-scanner';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "cleanarchitecturehighlighter" is now active!');

	const disposable = vscode.workspace.onDidOpenTextDocument(document => {
		// vscode.window.showInformationMessage('Hello World from CleanArchitectureHighlighter!');
		// listFilesInWorkspace();
		console.log(`File opened: ${document.fileName}`);
		vscode.window.showInformationMessage(`File opened: ${document.fileName}`);
	});

	context.subscriptions.push(disposable);

	vscode.workspace.textDocuments.forEach(document => {
        console.log(`Already opened: ${document.fileName}`);
    });
}

export function deactivate() {}
 