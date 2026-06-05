import { CoreDocument } from "../../../../application/ports/core-document";
import { ExtractedDependency } from "../extracted-dependency";

export interface DependencyExtractor {
    extract(document: CoreDocument): ExtractedDependency[];
}
