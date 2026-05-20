import { DelimitedDependencyExtractor, RegexDependencyPattern } from "./delimited-dependency-extractor";

export class DartDependencyExtractor extends DelimitedDependencyExtractor {

    private static readonly DIRECTIVE_REGEX = /^[ \t]*(?:@[A-Za-z_]\w*(?:\([^)]*\))?[ \t]*)*(?:import|export|part)[ \t]+["']([^"'\r\n]+)["'](?:[ \t]+(?:as|show|hide)[^;\r\n]*)?[ \t]*;[ \t]*(?:\/\/.*)?$/gm;

    constructor() {
        super([{
            regex: DartDependencyExtractor.DIRECTIVE_REGEX,
            dependencyPaths: match => [DartDependencyExtractor.normalizeDartDependency(match[1])]
        } satisfies RegexDependencyPattern], '/', true);
    }

    private static normalizeDartDependency(path: string): string {
        return path
            .replace(/^package:[^/]+\//, '')
            .replace(/\\/g, '/');
    }
}
