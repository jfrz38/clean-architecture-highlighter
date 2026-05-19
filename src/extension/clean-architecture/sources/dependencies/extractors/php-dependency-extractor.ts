import { DelimitedDependencyExtractor, RegexDependencyPattern } from "./delimited-dependency-extractor";

export class PhpDependencyExtractor extends DelimitedDependencyExtractor {

    private static readonly USE_REGEX = /^[ \t]*use[ \t]+(?:(?:function|const)[ \t]+)?([^;\r\n]+);[ \t]*(?:\/\/.*)?$/gm;

    constructor() {
        super([{
            regex: PhpDependencyExtractor.USE_REGEX,
            dependencyPaths: (match: RegExpExecArray) => PhpDependencyExtractor.getDependencyPaths(match)
        } satisfies RegexDependencyPattern], '\\', true);
    }

    private static getDependencyPaths(match: RegExpExecArray): string[] {
        const usePath = match[1].trim();
        const groupedUse = usePath.match(/^(.+)\\\{(.+)\}$/);

        if (!groupedUse) {
            return [PhpDependencyExtractor.withoutAlias(usePath).toLowerCase()];
        }

        const [, basePath, groupedImports] = groupedUse;

        return groupedImports
            .split(',')
            .map(selector => selector.trim())
            .filter(Boolean)
            .map(selector => `${basePath}\\${PhpDependencyExtractor.withoutAlias(selector)}`.toLowerCase());
    }

    private static withoutAlias(path: string): string {
        return path.split(/\s+as\s+/i)[0].trim();
    }
}
