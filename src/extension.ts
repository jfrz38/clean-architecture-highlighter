import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "cleanarchitecturewarning" is now active!');

	const disposable = vscode.commands.registerCommand('cleanarchitecturewarning.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from CleanArchitectureWarning!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
 