import * as vscode from 'vscode';
import { LayerAlias } from './clean-architecture/sources/layer/layer-alias';
import { SourceFile } from './clean-architecture/sources/source-file';
import { State } from './state';


export function checkFile(document: vscode.TextDocument, state: State, diagnostics: vscode.DiagnosticCollection) {
    if (!isDocumentInSourceFolder(document.uri, state.config.sourceFolder)) {
        diagnostics.delete(document.uri);
        return;
    }

    const aliases = new LayerAlias(
        state.config.layers.domain.aliases,
        state.config.layers.application.aliases,
        state.config.layers.infrastructure.aliases
    );

    const violations = new SourceFile(document, state.allowedDependencies, aliases).warnings;

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
