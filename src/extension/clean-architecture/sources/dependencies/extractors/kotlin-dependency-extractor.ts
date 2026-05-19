import { TextDocument } from "vscode";
import { DependencyPosition } from "../dependency-position";
import { ExtractedDependency } from "../extracted-dependency";
import { DelimitedDependencyExtractor } from "./delimited-dependency-extractor";

export class KotlinDependencyExtractor extends DelimitedDependencyExtractor {

    private static readonly IMPORT_REGEX = /^[ \t]*import[ \t]+([A-Za-z_][\w]*(?:\.[A-Za-z_][\w]*)*(?:\.\*)?)(?:[ \t]+as[ \t]+[A-Za-z_][\w]*)?[ \t]*(?:\/\/.*)?$/gm;

    constructor() {
        super('.', true);
    }

    public extract(document: TextDocument): ExtractedDependency[] {
        const dependencies: ExtractedDependency[] = [];
        const text = document.getText();
        let match: RegExpExecArray | null;

        while ((match = KotlinDependencyExtractor.IMPORT_REGEX.exec(text))) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);
            const position = new DependencyPosition(startPos.line, startPos.character, endPos.line, endPos.character);
            dependencies.push(new ExtractedDependency(this.normalizeDependencyPath(match[1]), position));
        }

        return dependencies;
    }
}
