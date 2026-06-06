import * as ts from 'typescript';
import { DependencyExtractor, Document } from '@jfrz38/clean-architecture-highlighter-core';
import { DependencyPosition } from '@jfrz38/clean-architecture-highlighter-core/domain/sources/dependencies/dependency-position';
import { ExtractedDependency } from '@jfrz38/clean-architecture-highlighter-core/domain/sources/dependencies/extracted-dependency';
import { ModuleSpecifierExtractor } from './module-specifier-extractor';
import { NativeDependencyPath } from './native-dependency-path';
import { NativeDocumentPath } from './native-document-path';
import { ScriptKind } from './script-kind';
import { TypeScriptCompilerOptions } from './type-script-compiler-options';
import { TypeScriptModuleResolver } from './type-script-module-resolver';

export class TypeScriptResolvedDependencyExtractor implements DependencyExtractor {
    constructor(
        private readonly moduleSpecifierExtractor: ModuleSpecifierExtractor,
        private readonly compilerOptions: TypeScriptCompilerOptions,
        private readonly moduleResolver: TypeScriptModuleResolver
    ) { }

    public extract(document: Document): ExtractedDependency[] {
        const documentPath = NativeDocumentPath.from(document);
        const sourceFile = ts.createSourceFile(
            documentPath,
            document.getText(),
            ts.ScriptTarget.Latest,
            true,
            ScriptKind.fromPath(documentPath)
        );
        const compilerOptions = this.compilerOptions.forDocument(documentPath);

        return this.moduleSpecifierExtractor.extract(sourceFile)
            .map(moduleSpecifier => this.toDependency(document, documentPath, compilerOptions, sourceFile, moduleSpecifier))
            .filter((dependency): dependency is ExtractedDependency => dependency !== undefined);
    }

    private toDependency(
        document: Document,
        documentPath: string,
        compilerOptions: ts.CompilerOptions,
        sourceFile: ts.SourceFile,
        moduleSpecifier: ts.StringLiteralLike
    ): ExtractedDependency {
        const dependencyPath = this.moduleResolver.resolve(moduleSpecifier.text, documentPath, compilerOptions) ?? moduleSpecifier.text;
        const statement = this.dependencyStatement(moduleSpecifier, sourceFile);
        const startPosition = document.positionAt(statement.getStart(sourceFile));
        const endPosition = document.positionAt(statement.getEnd());

        return new ExtractedDependency(
            NativeDependencyPath.normalize(dependencyPath),
            new DependencyPosition(startPosition.line, startPosition.character, endPosition.line, endPosition.character)
        );
    }

    private dependencyStatement(moduleSpecifier: ts.StringLiteralLike, sourceFile: ts.SourceFile): ts.Node {
        let current: ts.Node = moduleSpecifier;
        while (current.parent && current.parent !== sourceFile) {
            current = current.parent;
        }

        return current;
    }
}
