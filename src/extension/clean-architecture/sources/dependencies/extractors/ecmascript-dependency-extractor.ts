import { TextDocument } from "vscode";
import { DependencyPosition } from "../dependency-position";
import { ExtractedDependency } from "../extracted-dependency";
import { DependencyExtractor } from "./dependency-extractor";

export class EcmaScriptDependencyExtractor implements DependencyExtractor {

    private static readonly IMPORT_REGEX = /import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g;

    public extract(document: TextDocument): ExtractedDependency[] {
        const dependencies: ExtractedDependency[] = [];
        const text = document.getText();
        let match: RegExpExecArray | null;

        while ((match = EcmaScriptDependencyExtractor.IMPORT_REGEX.exec(text))) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);
            const position = new DependencyPosition(startPos.line, startPos.character, endPos.line, endPos.character);
            dependencies.push(new ExtractedDependency(match[2], position));
        }

        return dependencies;
    }
}
