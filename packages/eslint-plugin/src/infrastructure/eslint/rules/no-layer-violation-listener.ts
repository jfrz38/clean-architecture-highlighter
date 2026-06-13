import type { Rule } from 'eslint';
import type { LayerViolation, NoLayerViolationChecker } from '../../../application/no-layer-violation-checker';
import {
    AstDependencySource,
    CallExpressionNode,
    ExportDeclarationNode,
    ImportDeclarationNode,
    ImportExpressionNode,
    isStaticRequireCall
} from '../ast-dependency-source';

type ReportViolation = (source: AstDependencySource, violation: LayerViolation) => void;

export class NoLayerViolationListenerFactory {
    constructor(
        private readonly checker: NoLayerViolationChecker,
        private readonly reportViolation: ReportViolation
    ) { }

    public create(): Rule.RuleListener {
        return {
            ImportDeclaration: (node: Rule.Node): void => {
                const importNode = node as ImportDeclarationNode;
                this.check(importNode.source, importNode.importKind === 'type');
            },
            ExportNamedDeclaration: (node: Rule.Node): void => {
                const exportNode = node as ExportDeclarationNode;
                this.check(exportNode.source, exportNode.exportKind === 'type');
            },
            ExportAllDeclaration: (node: Rule.Node): void => {
                const exportNode = node as ExportDeclarationNode;
                this.check(exportNode.source, false);
            },
            ImportExpression: (node: Rule.Node): void => {
                const importNode = node as ImportExpressionNode;
                this.check(importNode.source, false);
            },
            CallExpression: (node: Rule.Node): void => {
                const callNode = node as CallExpressionNode;

                if (!isStaticRequireCall(callNode)) {
                    return;
                }

                this.check(callNode.arguments?.[0], false);
            }
        };
    }

    private check(sourceNode: Parameters<typeof AstDependencySource.from>[0], isTypeOnly: boolean): void {
        const source = AstDependencySource.from(sourceNode, isTypeOnly);

        if (!source) {
            return;
        }

        const violation = this.checker.check(source.specifier);

        if (!violation) {
            return;
        }

        this.reportViolation(source, violation);
    }
}
