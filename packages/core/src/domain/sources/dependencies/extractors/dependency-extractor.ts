import { Document } from "../../../document";
import { ExtractedDependency } from "../extracted-dependency";

export interface DependencyExtractor {
    extract(document: Document): ExtractedDependency[];
}
