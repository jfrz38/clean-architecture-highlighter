import { DelimitedDependencyExtractor, RegexDependencyPattern } from "./delimited-dependency-extractor";

export class CsharpDependencyExtractor extends DelimitedDependencyExtractor {

    private static readonly USING_REGEX = /^[ \t]*(?:global[ \t]+)?using[ \t]+(?:static[ \t]+)?(?:(?:[A-Za-z_]\w*)[ \t]*=[ \t]*)?([A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*)[ \t]*;[ \t]*(?:\/\/.*)?$/gm;

    constructor() {
        super([{
            regex: CsharpDependencyExtractor.USING_REGEX,
            dependencyPaths: match => [match[1].toLowerCase()]
        } satisfies RegexDependencyPattern], '.', true);
    }
}
