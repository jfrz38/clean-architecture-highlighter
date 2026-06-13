import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';
import { DefaultConfiguration } from '@jfrz38/clean-architecture-highlighter-core';
import type { Diagnostic, Scenario, Suite } from '../../../test/scenarios/out/types';

const { suites } = require('../../../../test/scenarios/out/scenarios') as { suites: Suite[] };

suite('Extension Test Suite', () => {
	const currentWorkspace = 'fixtures';

	suites.forEach(async (_suite: Suite) => {
		suite(_suite.name, () => {
			const workspaceRootPath = loadWorkspace();
			_suite.scenarios.forEach(async (scenario: Scenario) => {
				test(scenario.name, async () => {
					try {
						await setDefaultConfigurations();
						await setConfigurations(_suite.configuration);
						await assertScenario(workspaceRootPath, scenario);
					} finally {
						await vscode.commands.executeCommand('workbench.action.closeAllEditors');
						await setDefaultConfigurations();
					}
				});
			});
		});
	});

	test('uses configured diagnostic severity level', async () => {
		const workspaceRootPath = loadWorkspace();

		try {
			await setDefaultConfigurations();
			await setConfigurations({ severityLevel: 'error' });
			await assertScenario(workspaceRootPath, {
				name: 'Domain layer should use error severity',
				file: 'architecture/typescript/src/domain/domain.ts',
				diagnostics: [
					{
						message: 'domain layer should not depend on infrastructure layer.',
						severity: 'Error',
						startLine: 0,
						endLine: 0
					},
					{
						message: 'domain layer should not depend on application layer.',
						severity: 'Error',
						startLine: 1,
						endLine: 1
					}
				]
			});
		} finally {
			await vscode.commands.executeCommand('workbench.action.closeAllEditors');
			await setDefaultConfigurations();
		}
	});

	test('keeps text import resolution as the default for TypeScript aliases', async () => {
		const workspaceRootPath = loadWorkspace();

		try {
			await setDefaultConfigurations();
			await setConfigurations({ enabledLanguages: ['typescript'], importResolution: 'text' });
			await assertScenario(workspaceRootPath, {
				name: 'TypeScript alias is not resolved in text mode',
				file: 'native-resolution/src/domain/domain.ts',
				diagnostics: []
			});
		} finally {
			await vscode.commands.executeCommand('workbench.action.closeAllEditors');
			await setDefaultConfigurations();
		}
	});

	test('uses native import resolution for TypeScript aliases when enabled', async () => {
		const workspaceRootPath = loadWorkspace();

		try {
			await setDefaultConfigurations();
			await setConfigurations({ enabledLanguages: ['typescript'], importResolution: 'native' });
			await assertScenario(workspaceRootPath, {
				name: 'TypeScript alias is resolved in native mode',
				file: 'native-resolution/src/domain/domain.ts',
				diagnostics: [
					{
						message: 'domain layer should not depend on infrastructure layer.',
						severity: 'Warning',
						startLine: 0,
						endLine: 0
					}
				]
			});
		} finally {
			await vscode.commands.executeCommand('workbench.action.closeAllEditors');
			await setDefaultConfigurations();
		}
	});

	test('uses native import resolution for JavaScript aliases when enabled', async () => {
		const workspaceRootPath = loadWorkspace();

		try {
			await setDefaultConfigurations();
			await setConfigurations({ enabledLanguages: ['javascript'], importResolution: 'native' });
			await assertScenario(workspaceRootPath, {
				name: 'JavaScript alias is resolved in native mode',
				file: 'native-resolution/src/domain/domain.js',
				diagnostics: [
					{
						message: 'domain layer should not depend on infrastructure layer.',
						severity: 'Warning',
						startLine: 0,
						endLine: 0
					}
				]
			});
		} finally {
			await vscode.commands.executeCommand('workbench.action.closeAllEditors');
			await setDefaultConfigurations();
		}
	});

	test('falls back to the existing extractor for non EcmaScript languages when native import resolution is enabled', async () => {
		const workspaceRootPath = loadWorkspace();

		try {
			await setDefaultConfigurations();
			await setConfigurations({ enabledLanguages: ['python'], importResolution: 'native' });
			await assertScenario(workspaceRootPath, {
				name: 'Python keeps existing extractor in native mode',
				file: 'languages/python/src/domain/domain.py',
				diagnostics: [
					{
						message: 'domain layer should not depend on infrastructure layer.',
						severity: 'Warning',
						startLine: 0,
						endLine: 0
					},
					{
						message: 'domain layer should not depend on application layer.',
						severity: 'Warning',
						startLine: 0,
						endLine: 0
					}
				]
			});
		} finally {
			await vscode.commands.executeCommand('workbench.action.closeAllEditors');
			await setDefaultConfigurations();
		}
	});

	async function setConfigurations(configuration: any): Promise<void> {
		if (!configuration) {
			return;
		}

		const config = vscode.workspace.getConfiguration('clean-architecture-highlighter');
		const updates: Thenable<void>[] = [];

		for (const key of ['severityLevel', 'sourceFolder', 'enabledLanguages', 'importResolution']) {
			if (Object.prototype.hasOwnProperty.call(configuration, key)) {
				updates.push(config.update(key, configuration[key], vscode.ConfigurationTarget.Global));
			}
		}

		if (configuration.layers) {
			for (const [layerName, layerContent] of Object.entries(configuration.layers)) {
				if (typeof layerContent !== 'object' || layerContent === null) {
					continue;
				}
				for (const [propName, value] of Object.entries(layerContent)) {
					updates.push(
						config.update(
							`layers.${layerName}.${propName}`,
							value,
							vscode.ConfigurationTarget.Global
						)
					);
				}
			}
		}

		await Promise.all(updates);
	}

	async function setDefaultConfigurations(): Promise<void> {
		await setConfigurations({ ...DefaultConfiguration.default, severityLevel: 'warning', importResolution: 'text' });
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
		const document = await vscode.workspace.openTextDocument(fileUri);

		assert.ok(document, `Could not open specified file: ${targetFilePath}`);

		return fileUri;
	}

	function assertDiagnostics(fileUri: vscode.Uri, diagnostics: Diagnostic[]) {
		const existingDiagnostics = vscode.languages.getDiagnostics(fileUri)
			.filter(diagnostic => diagnostic.message.includes('layer should not depend on'));
		const actualDiagnostics = existingDiagnostics.map(diag => ({
			message: diag.message,
			severity: vscode.DiagnosticSeverity[diag.severity],
			startLine: diag.range.start.line,
			endLine: diag.range.end.line
		}));

		assert.strictEqual(existingDiagnostics.length, diagnostics.length, `Diagnostics count does not match. Actual diagnostics: ${JSON.stringify(actualDiagnostics)}`);

		diagnostics.forEach(diagnostic => assertExistsDiagnostic(existingDiagnostics, diagnostic));
	}

	function assertExistsDiagnostic(existingDiagnostics: vscode.Diagnostic[], expectedDiagnostic: Diagnostic) {
		const { message, severity, startLine, endLine } = expectedDiagnostic;
		const actualDiagnostics = existingDiagnostics.map(diag => ({
			message: diag.message,
			severity: vscode.DiagnosticSeverity[diag.severity],
			startLine: diag.range.start.line,
			endLine: diag.range.end.line
		}));

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

		assert.ok(
			found,
			`Not existing diagnostic with message "${message}", severity "${severity}" in lines ${startLine}-${endLine}. Actual diagnostics: ${JSON.stringify(actualDiagnostics)}`
		);
	}
});
