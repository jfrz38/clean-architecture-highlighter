import { DelimitedDependencyExtractor, RegexDependencyPattern } from "./delimited-dependency-extractor";

export class ElixirDependencyExtractor extends DelimitedDependencyExtractor {

    private static readonly DIRECTIVE_REGEX = /^[ \t]*(?:alias|import|require|use)[ \t]+([A-Z][A-Za-z0-9_.]*(?:\.\{[^}\r\n]+\})?)(?:[ \t]*,[^\r\n]*)?$/gm;

    constructor() {
        super([{
            regex: ElixirDependencyExtractor.DIRECTIVE_REGEX,
            dependencyPaths: match => ElixirDependencyExtractor.getDependencyPaths(match)
        } satisfies RegexDependencyPattern], '.', true);
    }

    private static getDependencyPaths(match: RegExpExecArray): string[] {
        const modulePath = match[1];
        const groupedAlias = modulePath.match(/^(.*)\.\{([^}]+)\}$/);

        if (!groupedAlias) {
            return [modulePath.toLowerCase()];
        }

        const [, basePath, groupedModules] = groupedAlias;

        return groupedModules
            .split(',')
            .map(moduleName => moduleName.trim())
            .filter(Boolean)
            .map(moduleName => `${basePath}.${moduleName}`.toLowerCase());
    }
}
