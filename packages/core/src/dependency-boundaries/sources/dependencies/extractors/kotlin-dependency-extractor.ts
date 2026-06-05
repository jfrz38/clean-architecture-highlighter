import { DelimitedDependencyExtractor, RegexDependencyPattern } from "./delimited-dependency-extractor";

export class KotlinDependencyExtractor extends DelimitedDependencyExtractor {

    private static readonly IMPORT_REGEX = /^[ \t]*import[ \t]+([A-Za-z_][\w]*(?:\.[A-Za-z_][\w]*)*(?:\.\*)?)(?:[ \t]+as[ \t]+[A-Za-z_][\w]*)?[ \t]*(?:\/\/.*)?$/gm;

    constructor() {
        super([{ regex: KotlinDependencyExtractor.IMPORT_REGEX }], '.', true);
    }
}
