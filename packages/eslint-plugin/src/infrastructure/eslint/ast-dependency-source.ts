import type { Rule } from 'eslint';
import { DependencySpecifier } from '../../domain/dependency-specifier';

export type SourceNode = Rule.Node & {
    value?: unknown;
};

export type ImportDeclarationNode = Rule.Node & {
    source?: SourceNode;
    importKind?: string;
};

export type ExportDeclarationNode = Rule.Node & {
    source?: SourceNode | null;
    exportKind?: string;
};

export type ImportExpressionNode = Rule.Node & {
    source?: SourceNode;
};

export type CallExpressionNode = Rule.Node & {
    callee?: {
        type?: string;
        name?: string;
    };
    arguments?: SourceNode[];
};

export class AstDependencySource {
    constructor(
        public readonly node: SourceNode,
        public readonly specifier: DependencySpecifier
    ) { }

    public static from(source: SourceNode | null | undefined, isTypeOnly: boolean): AstDependencySource | undefined {
        if (!source) {
            return undefined;
        }

        const specifier = DependencySpecifier.from(source.value, isTypeOnly);

        if (!specifier) {
            return undefined;
        }

        return new AstDependencySource(source, specifier);
    }
}

export function isStaticRequireCall(node: CallExpressionNode): boolean {
    return node.callee?.type === 'Identifier' && node.callee.name === 'require';
}
