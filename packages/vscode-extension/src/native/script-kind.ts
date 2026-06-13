import * as path from 'path';
import * as ts from 'typescript';

const JAVASCRIPT_EXTENSIONS = new Set(['.js', '.mjs', '.cjs']);

export class ScriptKind {
    public static fromPath(documentPath: string): ts.ScriptKind {
        const extension = path.extname(documentPath).toLowerCase();
        if (JAVASCRIPT_EXTENSIONS.has(extension)) {
            return ts.ScriptKind.JS;
        }

        return ts.ScriptKind.TS;
    }
}
