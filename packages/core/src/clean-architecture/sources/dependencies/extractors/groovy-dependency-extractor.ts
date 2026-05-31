import { DelimitedDependencyExtractor } from "./delimited-dependency-extractor";

export class GroovyDependencyExtractor extends DelimitedDependencyExtractor {

    private static readonly IMPORT_REGEX = /^[ \t]*import[ \t]+(?:static[ \t]+)?([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*(?:\.\*)?)(?:[ \t]+as[ \t]+[A-Za-z_$][\w$]*)?[ \t]*(?:;[ \t]*)?(?:\/\/.*)?$/gm;

    constructor() {
        super([{ regex: GroovyDependencyExtractor.IMPORT_REGEX }], '.', true);
    }
}
