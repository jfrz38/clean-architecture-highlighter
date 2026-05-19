import { TextDocument } from "vscode";
import { DependencyPosition } from "../dependency-position";
import { ExtractedDependency } from "../extracted-dependency";
import { DependencyExtractor } from "./dependency-extractor";

export class PythonDependencyExtractor implements DependencyExtractor {

    private static readonly IMPORT_REGEX = /^\s*import\s+(.+)$/gm;
    private static readonly FROM_IMPORT_REGEX = /^\s*from\s+([A-Za-z_][\w.]*)\s+import\s+.+$/gm;

    public extract(document: TextDocument): ExtractedDependency[] {
        return [
            ...this.extractImports(document),
            ...this.extractFromImports(document)
        ];
    }

    private extractImports(document: TextDocument): ExtractedDependency[] {
        const dependencies: ExtractedDependency[] = [];
        const text = document.getText();
        let match: RegExpExecArray | null;

        while ((match = PythonDependencyExtractor.IMPORT_REGEX.exec(text))) {
            const modules = match[1]
                .split(',')
                .map(module => module.trim().split(/\s+as\s+/)[0].trim())
                .filter(Boolean);

            dependencies.push(...modules.map(module => this.toDependency(document, match!, module)));
        }

        return dependencies;
    }

    private extractFromImports(document: TextDocument): ExtractedDependency[] {
        const dependencies: ExtractedDependency[] = [];
        const text = document.getText();
        let match: RegExpExecArray | null;

        while ((match = PythonDependencyExtractor.FROM_IMPORT_REGEX.exec(text))) {
            dependencies.push(this.toDependency(document, match, match[1]));
        }

        return dependencies;
    }

    private toDependency(document: TextDocument, match: RegExpExecArray, module: string): ExtractedDependency {
        const startPos = document.positionAt(match.index);
        const endPos = document.positionAt(match.index + match[0].length);
        const position = new DependencyPosition(startPos.line, startPos.character, endPos.line, endPos.character);

        return new ExtractedDependency(this.normalizeModulePath(module), position);
    }

    private normalizeModulePath(module: string): string {
        const normalized = module.replace(/\./g, '/');
        return `/${normalized}/`;
    }
}
