import { DelimitedDependencyExtractor } from "./delimited-dependency-extractor";

export class RubyDependencyExtractor extends DelimitedDependencyExtractor {

    private static readonly REQUIRE_REGEX = /^[ \t]*require(?:_relative)?[ \t]*(?:\([ \t]*)?["']([^"'\r\n]+)["'][ \t]*(?:\))?[ \t]*(?:#.*)?$/gm;

    constructor() {
        super([{ regex: RubyDependencyExtractor.REQUIRE_REGEX }], '/', true);
    }
}
