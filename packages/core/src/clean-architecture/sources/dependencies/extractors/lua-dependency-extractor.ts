import { DelimitedDependencyExtractor, RegexDependencyPattern } from "./delimited-dependency-extractor";

export class LuaDependencyExtractor extends DelimitedDependencyExtractor {

    private static readonly REQUIRE_REGEX = /^[ \t]*(?:local[ \t]+[A-Za-z_]\w*[ \t]*=[ \t]*)?require[ \t]*(?:\([ \t]*)?["']([^"'\r\n]+)["'][ \t]*(?:\))?[ \t]*(?:--.*)?$/gm;

    constructor() {
        super([{
            regex: LuaDependencyExtractor.REQUIRE_REGEX,
            dependencyPaths: match => [match[1].replace(/\./g, '/')]
        } satisfies RegexDependencyPattern], '/', true);
    }
}
