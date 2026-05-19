import { TextDocument } from "vscode";
import { DependencyPosition } from "../dependency-position";
import { ExtractedDependency } from "../extracted-dependency";
import { DependencyExtractor } from "./dependency-extractor";

export class JavaDependencyExtractor implements DependencyExtractor {

    private static readonly IMPORT_REGEX = /^\s*import\s+(?:static\s+)?([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*(?:\.\*)?)\s*;/gm;

    public extract(document: TextDocument): ExtractedDependency[] {
        const dependencies: ExtractedDependency[] = [];
        const text = document.getText();
        let match: RegExpExecArray | null;

        while ((match = JavaDependencyExtractor.IMPORT_REGEX.exec(text))) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);
            const position = new DependencyPosition(startPos.line, startPos.character, endPos.line, endPos.character);
            dependencies.push(new ExtractedDependency(this.normalizePackagePath(match[1]), position));
        }

        return dependencies;
    }

    private normalizePackagePath(packagePath: string): string {
        const normalized = packagePath.replace(/\./g, '/');
        return `/${normalized}/`;
    }
}
