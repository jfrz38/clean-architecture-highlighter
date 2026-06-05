import { CoreDocument } from "../../../../document";
import { DependencyPosition } from "../dependency-position";
import { ExtractedDependency } from "../extracted-dependency";
import { DependencyExtractor } from "./dependency-extractor";

export class RustDependencyExtractor implements DependencyExtractor {

    private static readonly USE_REGEX = /^[ \t]*use[ \t]+([^;\r\n]+);[ \t]*(?:\/\/.*)?$/gm;
    private static readonly MOD_REGEX = /^[ \t]*(?:pub[ \t]+)?mod[ \t]+([A-Za-z_]\w*)[ \t]*;[ \t]*(?:\/\/.*)?$/gm;

    public extract(document: CoreDocument): ExtractedDependency[] {
        return [
            ...this.extractUseDeclarations(document),
            ...this.extractModDeclarations(document)
        ];
    }

    private extractUseDeclarations(document: CoreDocument): ExtractedDependency[] {
        const dependencies: ExtractedDependency[] = [];
        const text = document.getText();
        let match: RegExpExecArray | null;

        RustDependencyExtractor.USE_REGEX.lastIndex = 0;
        while ((match = RustDependencyExtractor.USE_REGEX.exec(text))) {
            const position = this.toPosition(document, match.index, match[0].length);
            dependencies.push(...RustDependencyExtractor.expandUsePath(match[1])
                .map(path => new ExtractedDependency(this.normalizeDependencyPath(path), position)));
        }

        return dependencies;
    }

    private extractModDeclarations(document: CoreDocument): ExtractedDependency[] {
        const dependencies: ExtractedDependency[] = [];
        const text = document.getText();
        let match: RegExpExecArray | null;

        RustDependencyExtractor.MOD_REGEX.lastIndex = 0;
        while ((match = RustDependencyExtractor.MOD_REGEX.exec(text))) {
            const position = this.toPosition(document, match.index, match[0].length);
            dependencies.push(new ExtractedDependency(this.normalizeDependencyPath(match[1]), position));
        }

        return dependencies;
    }

    private static expandUsePath(path: string): string[] {
        const normalizedPath = path.trim();
        const groupStart = normalizedPath.indexOf('{');

        if (groupStart === -1) {
            return [RustDependencyExtractor.withoutAlias(normalizedPath)];
        }

        const groupEnd = RustDependencyExtractor.findMatchingBrace(normalizedPath, groupStart);
        if (groupEnd === -1) {
            return [RustDependencyExtractor.withoutAlias(normalizedPath)];
        }

        const prefix = normalizedPath.slice(0, groupStart);
        const groupContent = normalizedPath.slice(groupStart + 1, groupEnd);
        const suffix = normalizedPath.slice(groupEnd + 1);

        return RustDependencyExtractor.splitTopLevel(groupContent)
            .flatMap(item => RustDependencyExtractor.expandUsePath(`${prefix}${item.trim()}${suffix}`))
            .filter(Boolean);
    }

    private static findMatchingBrace(value: string, startIndex: number): number {
        let depth = 0;

        for (let index = startIndex; index < value.length; index++) {
            const char = value[index];

            if (char === '{') {
                depth++;
            }

            if (char === '}') {
                depth--;
            }

            if (depth === 0) {
                return index;
            }
        }

        return -1;
    }

    private static splitTopLevel(value: string): string[] {
        const items: string[] = [];
        let depth = 0;
        let itemStart = 0;

        for (let index = 0; index < value.length; index++) {
            const char = value[index];

            if (char === '{') {
                depth++;
            } else if (char === '}') {
                depth--;
            } else if (char === ',' && depth === 0) {
                items.push(value.slice(itemStart, index));
                itemStart = index + 1;
            }
        }

        items.push(value.slice(itemStart));
        return items;
    }

    private static withoutAlias(path: string): string {
        return path.split(/\s+as\s+/)[0].trim();
    }

    private toPosition(document: CoreDocument, matchIndex: number, matchLength: number): DependencyPosition {
        const startPos = document.positionAt(matchIndex);
        const endPos = document.positionAt(matchIndex + matchLength);

        return new DependencyPosition(startPos.line, startPos.character, endPos.line, endPos.character);
    }

    private normalizeDependencyPath(path: string): string {
        const normalized = path.replace(/::/g, '/');
        return `/${normalized}/`;
    }
}
