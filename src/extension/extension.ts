import * as vscode from 'vscode';
import { checkFile } from './check-file';
import { createExtensionContext } from './context';

export function activate(context: vscode.ExtensionContext) {

	const { state, diagnostics } = createExtensionContext();

	const onDidOpenTextDocument = vscode.workspace.onDidOpenTextDocument(document => checkFile(document, state, diagnostics));
	const onDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument(event => checkFile(event.document, state, diagnostics));
	const onDidChangeConfiguration = vscode.workspace.onDidChangeConfiguration(event => {
		if (event.affectsConfiguration('clean-architecture-highlighter')) {
			state.load();
			vscode.workspace.textDocuments.forEach(document => checkFile(document, state, diagnostics));
		}
	});

	context.subscriptions.push(onDidOpenTextDocument);
	context.subscriptions.push(onDidChangeTextDocument);
	context.subscriptions.push(onDidChangeConfiguration);
}

export function deactivate() { }
