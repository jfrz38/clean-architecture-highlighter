import { SourceFile } from './clean-architecture/sources/source-file';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	let diagnostics = vscode.languages.createDiagnosticCollection('cleanArchitectureDiagnostics');

	vscode.workspace.textDocuments.forEach(checkFile);

	let onDidOpenTextDocument = vscode.workspace.onDidOpenTextDocument(checkFile);
	let onDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument(event => checkFile(event.document));

	function checkFile(document: vscode.TextDocument) {
		const violations = new SourceFile(document).warnings;

		diagnostics.set(document.uri, violations.map(violation => {
			const { startLine, startCharacter, endLine, endCharacter, message } = violation;
			const range = new vscode.Range(
				new vscode.Position(startLine, startCharacter), 
				new vscode.Position(endLine, endCharacter)
			);
			return new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Warning);
		}));

		console.log(`Checking file: ${document.fileName}`);
	}

	context.subscriptions.push(onDidOpenTextDocument);
	context.subscriptions.push(onDidChangeTextDocument);

}

export function deactivate() { }

// TODO: Hacer configurable las capas y si es warning o error
// TODO: Que se pueda añadir qué nombre tiene para ti la capa de infraestructura, dominio, aplicación, etc.
