import * as ts from 'typescript';

export class TypeScriptModuleResolver {
    public resolve(moduleSpecifier: string, documentPath: string, compilerOptions: ts.CompilerOptions): string | undefined {
        return ts.resolveModuleName(
            moduleSpecifier,
            documentPath,
            compilerOptions,
            ts.sys
        ).resolvedModule?.resolvedFileName;
    }
}
