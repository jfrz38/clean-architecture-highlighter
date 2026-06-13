import * as ts from 'typescript';

const REQUIRE = 'require';

export class ModuleSpecifierExtractor {
    public extract(sourceFile: ts.SourceFile): ts.StringLiteralLike[] {
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
        return ts.isIdentifier(node.expression) && node.expression.text === REQUIRE;
    }
}
