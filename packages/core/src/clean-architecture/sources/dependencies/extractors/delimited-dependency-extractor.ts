import { CoreDocument } from "../../../../document";
import { DependencyPosition } from "../dependency-position";
import { ExtractedDependency } from "../extracted-dependency";
import { DependencyExtractor } from "./dependency-extractor";

export type RegexDependencyPattern = {
    regex: RegExp;
    dependencyPaths?: (match: RegExpExecArray) => string[];
};

export abstract class DelimitedDependencyExtractor implements DependencyExtractor {

    private readonly delimiterRegex: RegExp;
    private readonly addTrailingSeparator: boolean;
    private readonly patterns: RegexDependencyPattern[];

    protected constructor(patterns: RegexDependencyPattern[], delimiter = '/', addTrailingSeparator = false) {
        this.patterns = patterns;
        this.delimiterRegex = new RegExp(this.escapeRegExp(delimiter), 'g');
        this.addTrailingSeparator = addTrailingSeparator;
    }

    public extract(document: CoreDocument): ExtractedDependency[] {
        return this.patterns.flatMap(pattern => this.extractMatches(document, pattern));
    }

    private extractMatches(document: CoreDocument, pattern: RegexDependencyPattern): ExtractedDependency[] {
        const dependencies: ExtractedDependency[] = [];
        const text = document.getText();
        let match: RegExpExecArray | null;

        pattern.regex.lastIndex = 0;
        while ((match = pattern.regex.exec(text))) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);
            const position = new DependencyPosition(startPos.line, startPos.character, endPos.line, endPos.character);

            dependencies.push(...this.getDependencyPaths(pattern, match)
                .map(path => new ExtractedDependency(this.normalizeDependencyPath(path), position)));
        }

        return dependencies;
    }

    private getDependencyPaths(pattern: RegexDependencyPattern, match: RegExpExecArray): string[] {
        return pattern.dependencyPaths ? pattern.dependencyPaths(match) : [match[1]];
    }

    protected normalizeDependencyPath(path: string): string {
        const normalized = path.replace(this.delimiterRegex, '/');
        return this.addTrailingSeparator ? `/${normalized}/` : `/${normalized}`;
    }

    private escapeRegExp(value: string): string {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
