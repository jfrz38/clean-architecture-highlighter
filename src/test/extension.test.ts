import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';
import { Scenario, Diagnostic, Suite } from './suites/types';
import { suites } from './suites/scenarios';

suite('Extension Test Suite', () => {
	const currentWorkspace = 'workspace';

	suites.forEach(async (_suite: Suite) => {
		suite(_suite.name, () => {
			const workspaceRootPath = loadWorkspace();
			_suite.scenarios.forEach(async (scenario: Scenario) => {
				test(scenario.name, async () => {
					try {
						await setConfigurations(_suite.configuration);
						await assertScenario(workspaceRootPath, scenario);
					} finally {
						await vscode.commands.executeCommand('workbench.action.closeAllEditors');
					}
				});
			});
		});
	});

	async function setConfigurations(configuration: any): Promise<void> {
		if (!configuration) {
			return;
		}

		const config = vscode.workspace.getConfiguration('clean-architecture-highlighter');

		for (const key of Object.keys(configuration)) {
			await config.update(key, configuration[key], vscode.ConfigurationTarget.Global);
		}
	}

	async function assertScenario(workspaceRootPath: string, scenario: Scenario) {
		const fileUri = await openFile(workspaceRootPath, scenario);

		await new Promise(resolve => setTimeout(resolve, 500));

		assertDiagnostics(fileUri, scenario.diagnostics);

	}

	function loadWorkspace(): string {
		const workspaceFolders = vscode.workspace.workspaceFolders;
		assert.ok(workspaceFolders && workspaceFolders.length > 0, 'Failed to load workspace.');

		const rootPath = workspaceFolders[0].uri.fsPath;

		const expectedWorkspaceName = path.basename(rootPath);
		assert.strictEqual(expectedWorkspaceName, currentWorkspace, 'Loaded the wrong workspace.');

		return rootPath;
	}

	async function openFile(workspaceRootPath: string, assertion: Scenario): Promise<vscode.Uri> {
		const targetFilePath = path.join(workspaceRootPath, assertion.file);
		const fileUri = vscode.Uri.file(targetFilePath);
		const document = vscode.workspace.openTextDocument(fileUri);

		assert.ok(document, `Could not open specified file: ${targetFilePath}`);

		return fileUri;
	}

	function assertDiagnostics(fileUri: vscode.Uri, diagnostics: Diagnostic[]) {
		const existingDiagnostics = vscode.languages.getDiagnostics(fileUri);

		// console.log("existing diagnostics = ", JSON.stringify(existingDiagnostics, null, 2));
		// console.log("expected diagnostics = ", JSON.stringify(diagnostics, null, 2));

		assert.strictEqual(existingDiagnostics.length, diagnostics.length, 'No existe el mismo número de diagnostics');

		diagnostics.forEach(diagnostic => assertExistsDiagnostic(existingDiagnostics, diagnostic));
	}

	function assertExistsDiagnostic(existingDiagnostics: vscode.Diagnostic[], expectedDiagnostic: Diagnostic) {
		const { message, severity, startLine, endLine } = expectedDiagnostic;

		const found = existingDiagnostics.find((diag) => {
			const actualSeverityName = vscode.DiagnosticSeverity[diag.severity];

			const actualStart = diag.range.start.line;
			const actualEnd = diag.range.end.line;

			const severityMatches = actualSeverityName.toLowerCase() === expectedDiagnostic.severity.toLowerCase();
			const messageMatches = diag.message.trim() === expectedDiagnostic.message.trim();
			const startMatch = actualStart === expectedDiagnostic.startLine;
			const endMatch = actualEnd === expectedDiagnostic.endLine;

			return severityMatches && messageMatches && startMatch && endMatch;
		});

		assert.ok(found, `Not existing diagnostic with message "${message}", severity "${severity}" in lines ${startLine}-${endLine}`);
	}
});
