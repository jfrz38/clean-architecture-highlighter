import { TextDocument } from "vscode";
import { ExtractedDependency } from "../extracted-dependency";

export interface DependencyExtractor {
    extract(document: TextDocument): ExtractedDependency[];
}
