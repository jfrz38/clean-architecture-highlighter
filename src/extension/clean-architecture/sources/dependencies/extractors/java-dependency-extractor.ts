import { DelimitedDependencyExtractor, RegexDependencyPattern } from "./delimited-dependency-extractor";

export class JavaDependencyExtractor extends DelimitedDependencyExtractor {

    private static readonly IMPORT_REGEX = /^[ \t]*import[ \t]+(?:static[ \t]+)?([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*(?:\.\*)?)[ \t]*;/gm;

    constructor() {
        super([{ regex: JavaDependencyExtractor.IMPORT_REGEX }], '.', true);
    }
}
