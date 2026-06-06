import * as path from 'path';
import * as ts from 'typescript';
import { DependencyExtractor, Document } from '@jfrz38/clean-architecture-highlighter-core';
import { DependencyPosition } from '@jfrz38/clean-architecture-highlighter-core/domain/sources/dependencies/dependency-position';
import { ExtractedDependency } from '@jfrz38/clean-architecture-highlighter-core/domain/sources/dependencies/extracted-dependency';

type CompilerConfiguration = {
    readonly options: ts.CompilerOptions;
};

export class TypeScriptResolvedDependencyExtractor implements DependencyExtractor {
    private readonly configurationByDirectory = new Map<string, CompilerConfiguration>();

    public extract(document: Document): ExtractedDependency[] {
        const documentPath = this.documentPath(document);
        const sourceFile = ts.createSourceFile(
            documentPath,
            document.getText(),
            ts.ScriptTarget.Latest,
            true,
            this.scriptKind(documentPath)
        );
        const compilerOptions = this.compilerOptionsFor(documentPath);

        return this.moduleSpecifiers(sourceFile)
            .map(moduleSpecifier => this.toDependency(document, documentPath, compilerOptions, sourceFile, moduleSpecifier))
            .filter((dependency): dependency is ExtractedDependency => dependency !== undefined);
    }

    private moduleSpecifiers(sourceFile: ts.SourceFile): ts.StringLiteralLike[] {
        const moduleSpecifiers: ts.StringLiteralLike[] = [];

        const visit = (node: ts.Node) => {
            if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
                if (node.moduleSpecifier && ts.isStringLiteralLike(node.moduleSpecifier)) {
                    moduleSpecifiers.push(node.moduleSpecifier);
                }
            }

            if (ts.isCallExpression(node) && ts.isStringLiteralLike(node.arguments[0])) {
                if (this.isRequireCall(node) || node.expression.kind === ts.SyntaxKind.ImportKeyword) {
                    moduleSpecifiers.push(node.arguments[0]);
                }
            }

            ts.forEachChild(node, visit);
        };

        visit(sourceFile);

        return moduleSpecifiers;
    }

    private isRequireCall(node: ts.CallExpression): boolean {
        return ts.isIdentifier(node.expression) && node.expression.text === 'require';
    }

    private toDependency(
        document: Document,
        documentPath: string,
        compilerOptions: ts.CompilerOptions,
        sourceFile: ts.SourceFile,
        moduleSpecifier: ts.StringLiteralLike
    ): ExtractedDependency | undefined {
        const dependencyPath = this.resolveModule(moduleSpecifier.text, documentPath, compilerOptions) ?? moduleSpecifier.text;

        const statement = this.dependencyStatement(moduleSpecifier, sourceFile);
        const startPosition = document.positionAt(statement.getStart(sourceFile));
        const endPosition = document.positionAt(statement.getEnd());

        return new ExtractedDependency(
            this.normalizeDependencyPath(dependencyPath),
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

    private resolveModule(moduleSpecifier: string, documentPath: string, compilerOptions: ts.CompilerOptions): string | undefined {
        const resolvedModule = ts.resolveModuleName(
            moduleSpecifier,
            documentPath,
            compilerOptions,
            ts.sys
        ).resolvedModule;

        return resolvedModule?.resolvedFileName;
    }

    private compilerOptionsFor(documentPath: string): ts.CompilerOptions {
        const directory = path.dirname(documentPath);
        const configPath = ts.findConfigFile(directory, ts.sys.fileExists);
        if (!configPath) {
            return this.defaultCompilerOptions();
        }

        const configDirectory = path.dirname(configPath);
        const cachedConfiguration = this.configurationByDirectory.get(configDirectory);
        if (cachedConfiguration) {
            return cachedConfiguration.options;
        }

        const readConfig = ts.readConfigFile(configPath, ts.sys.readFile);
        if (readConfig.error) {
            return this.defaultCompilerOptions();
        }

        const parsedConfig = ts.parseJsonConfigFileContent(readConfig.config, ts.sys, configDirectory);
        const configuration = { options: { ...this.defaultCompilerOptions(), ...parsedConfig.options } };
        this.configurationByDirectory.set(configDirectory, configuration);

        return configuration.options;
    }

    private defaultCompilerOptions(): ts.CompilerOptions {
        return {
            allowJs: true,
            moduleResolution: ts.ModuleResolutionKind.Node10
        };
    }

    private documentPath(document: Document): string {
        const uri = document.uri as { fsPath?: string; path: string };
        return uri.fsPath ?? uri.path;
    }

    private scriptKind(documentPath: string): ts.ScriptKind {
        const extension = path.extname(documentPath).toLowerCase();
        if (extension === '.js' || extension === '.mjs' || extension === '.cjs') {
            return ts.ScriptKind.JS;
        }

        return ts.ScriptKind.TS;
    }

    private normalizeDependencyPath(dependencyPath: string): string {
        const normalizedPath = dependencyPath.replace(/\\/g, '/');
        return normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
    }
}
