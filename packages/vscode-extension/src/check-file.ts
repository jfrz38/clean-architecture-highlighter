import * as vscode from 'vscode';
import { DependencyExtractorRegistry, LayerAlias, SourceFile } from '@jfrz38/clean-architecture-highlighter-core';
import { State } from './state';

const dependencyExtractors = new DependencyExtractorRegistry();

export function checkFile(document: vscode.TextDocument, state: State, diagnostics: vscode.DiagnosticCollection) {
    if (!state.config.enabledLanguages.includes(document.languageId)) {
        diagnostics.delete(document.uri);
        return;
    }

    if (!isDocumentInSourceFolder(document.uri, state.config.sourceFolder)) {
        diagnostics.delete(document.uri);
        return;
    }

    const extractor = dependencyExtractors.get(document.languageId);
    if (!extractor) {
        diagnostics.delete(document.uri);
        return;
    }

    const aliases = new LayerAlias(
        state.config.layers.domain.aliases,
        state.config.layers.application.aliases,
        state.config.layers.infrastructure.aliases
    );

    const violations = new SourceFile(document, extractor.extract(document), state.allowedDependencies, aliases).violations;

    diagnostics.set(document.uri, violations.map(violation => {
        const range = new vscode.Range(
            new vscode.Position(violation.startLine, violation.startCharacter),
            new vscode.Position(violation.endLine, violation.endCharacter)
        );
        return new vscode.Diagnostic(range, violation.message, state.severityLevel);
    }));
}

function isDocumentInSourceFolder(uri: vscode.Uri, sourceFolder: string): boolean {
    return uri.path.includes(`/${sourceFolder}/`);
}
