import * as path from 'path';
import * as vscode from 'vscode';
import { AnalyzeSourceFile, DependencyExtractorRegistry, LayerAlias, SourceFolder } from '@jfrz38/clean-architecture-highlighter-core';
import { State } from './state';
import { DependencyExtractorSelector } from './dependency-extractor-selection';
import { NativeDependencyExtractorFactory } from './native/native-dependency-extractor-factory';

const dependencyExtractorSelector = new DependencyExtractorSelector(new DependencyExtractorRegistry(), NativeDependencyExtractorFactory.create());

export function checkFile(document: vscode.TextDocument, state: State, diagnostics: vscode.DiagnosticCollection) {
    if (!state.config.enabledLanguages.includes(document.languageId)) {
        diagnostics.delete(document.uri);
        return;
    }

    const sourceFolder = new SourceFolder(state.config.sourceFolder);
    const workspaceRelativePath = getWorkspaceRelativePath(document.uri);
    if (!sourceFolder.contains(workspaceRelativePath ?? '')) {
        diagnostics.delete(document.uri);
        return;
    }

    const extractor = dependencyExtractorSelector.select(document, {
        languageId: document.languageId,
        importResolution: state.importResolution
    });
    if (!extractor) {
        diagnostics.delete(document.uri);
        return;
    }

    const aliases = new LayerAlias(
        state.config.layers.domain.aliases,
        state.config.layers.application.aliases,
        state.config.layers.infrastructure.aliases
    );

    const violations = new AnalyzeSourceFile(extractor, state.allowedDependencies, aliases).violationsFor(document);

    diagnostics.set(document.uri, violations.map(violation => {
        const range = new vscode.Range(
            new vscode.Position(violation.startLine, violation.startCharacter),
            new vscode.Position(violation.endLine, violation.endCharacter)
        );
        return new vscode.Diagnostic(range, violation.message, state.severityLevel);
    }));
}

function getWorkspaceRelativePath(uri: vscode.Uri): string | undefined {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
    if (!workspaceFolder) {
        return undefined;
    }

    return path.relative(workspaceFolder.uri.fsPath, uri.fsPath);
}
