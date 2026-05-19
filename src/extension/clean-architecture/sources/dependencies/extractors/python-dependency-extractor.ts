import { DelimitedDependencyExtractor, RegexDependencyPattern } from "./delimited-dependency-extractor";

export class PythonDependencyExtractor extends DelimitedDependencyExtractor {

    private static readonly IMPORT_REGEX = /^\s*import\s+(.+)$/gm;
    private static readonly FROM_IMPORT_REGEX = /^\s*from\s+([A-Za-z_][\w.]*)\s+import\s+.+$/gm;

    constructor() {
        super([
            {
                regex: PythonDependencyExtractor.IMPORT_REGEX,
                dependencyPaths: match => match[1]
                    .split(',')
                    .map(module => module.trim().split(/\s+as\s+/)[0].trim())
                    .filter(Boolean)
            },
            { regex: PythonDependencyExtractor.FROM_IMPORT_REGEX }
        ], '.', true);
    }
}
