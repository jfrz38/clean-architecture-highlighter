import { DelimitedDependencyExtractor, RegexDependencyPattern } from "./delimited-dependency-extractor";

export class ScalaDependencyExtractor extends DelimitedDependencyExtractor {

    private static readonly IMPORT_REGEX = /^[ \t]*import[ \t]+([A-Za-z_][\w]*(?:\.(?:[A-Za-z]\w*|_\w+|_|\*))*(?:\.\{[^}\r\n]+\})?)[ \t]*(?:\/\/.*)?$/gm;

    constructor() {
        super([{
            regex: ScalaDependencyExtractor.IMPORT_REGEX,
            dependencyPaths: (match: RegExpExecArray) => ScalaDependencyExtractor.getDependencyPaths(match)
        } satisfies RegexDependencyPattern], '.', true);
    }

    private static getDependencyPaths(match: RegExpExecArray): string[] {
        const importPath = match[1];
        const groupedImport = importPath.match(/^(.*)\.\{([^}]+)\}$/);

        if (!groupedImport) {
            return [ScalaDependencyExtractor.normalizeWildcard(importPath)];
        }

        const [, basePath, groupedImports] = groupedImport;

        return groupedImports
            .split(',')
            .map(selector => ScalaDependencyExtractor.getGroupedImportPath(basePath, selector))
            .filter((path): path is string => path !== undefined);
    }

    private static getGroupedImportPath(basePath: string, selector: string): string | undefined {
        const [importedName, alias] = selector
            .trim()
            .split(/\s*=>\s*/)
            .map(part => part.trim());

        if (!importedName || alias === '_') {
            return undefined;
        }

        return `${basePath}.${ScalaDependencyExtractor.normalizeWildcard(importedName)}`;
    }

    private static normalizeWildcard(value: string): string {
        if (value === '_') {
            return '*';
        }

        return value.replace(/\._(?=\.|$)/g, '.*');
    }
}
