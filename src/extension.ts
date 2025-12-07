import { SourceFile } from './clean-architecture/sources/source-file';
import * as vscode from 'vscode';
import { Configuration } from './configuration/configuration';
import { AllowedDependencies } from './clean-architecture/restrictions/allowed-dependencies';
import { LayerAlias } from './clean-architecture/sources/layer/layer-alias';
import { ConfigurationOptions } from './configuration/types.configuration';

export function activate(context: vscode.ExtensionContext) {

	const configuration: ConfigurationOptions = Configuration.configuration;
	const allowedDependencies = new AllowedDependencies(
		configuration.layers.domain.allowedDependencies,
		configuration.layers.application.allowedDependencies,
		configuration.layers.infrastructure.allowedDependencies
	);
	const severityLevel: vscode.DiagnosticSeverity = getSeverityLevel(configuration.severityLevel);

	let diagnostics = vscode.languages.createDiagnosticCollection('cleanArchitectureDiagnostics');

	vscode.workspace.textDocuments.forEach(checkFile);

	let onDidOpenTextDocument = vscode.workspace.onDidOpenTextDocument(checkFile);
	let onDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument(event => checkFile(event.document));

	function checkFile(document: vscode.TextDocument) {
		if (!isDocumentInSourceFolder(document.uri, configuration.sourceFolder)) {
			return;
		}

		const aliases = new LayerAlias(
			configuration.layers.domain.aliases,
			configuration.layers.application.aliases,
			configuration.layers.infrastructure.aliases
		);
		const violations = new SourceFile(document, allowedDependencies, aliases).warnings;

		diagnostics.set(document.uri, violations.map(violation => {
			const { startLine, startCharacter, endLine, endCharacter, message } = violation;
			const range = new vscode.Range(
				new vscode.Position(startLine, startCharacter),
				new vscode.Position(endLine, endCharacter)
			);
			return new vscode.Diagnostic(range, message, severityLevel);
		}));

		console.log(`Checking file: ${document.fileName}`);
	}

	context.subscriptions.push(onDidOpenTextDocument);
	context.subscriptions.push(onDidChangeTextDocument);

}

export function deactivate() { }

function getSeverityLevel(level: 'warning' | 'error'): vscode.DiagnosticSeverity {
	if (level === 'error') {
		return vscode.DiagnosticSeverity.Error;
	}
	return vscode.DiagnosticSeverity.Warning;
}

function isDocumentInSourceFolder(path: vscode.Uri, sourceFolder: string): boolean {
	return path.path.includes(`/${sourceFolder}/`);
}
