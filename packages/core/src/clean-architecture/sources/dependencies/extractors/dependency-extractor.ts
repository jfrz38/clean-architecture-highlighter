import { CoreDocument } from "../../../../document";
import { ExtractedDependency } from "../extracted-dependency";

export interface DependencyExtractor {
    extract(document: CoreDocument): ExtractedDependency[];
}
