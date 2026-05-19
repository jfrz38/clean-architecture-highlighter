import { DelimitedDependencyExtractor, RegexDependencyPattern } from "./delimited-dependency-extractor";

export class EcmaScriptDependencyExtractor extends DelimitedDependencyExtractor {

    private static readonly IMPORT_REGEX = /import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g;

    constructor() {
        super([
            {
                regex: EcmaScriptDependencyExtractor.IMPORT_REGEX,
                dependencyPaths: match => [match[2]]
            }
        ]);
    }
}
