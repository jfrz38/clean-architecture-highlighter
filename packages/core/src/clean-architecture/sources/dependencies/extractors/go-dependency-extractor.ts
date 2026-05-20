import { CoreDocument } from "../../../../document";
import { DependencyPosition } from "../dependency-position";
import { ExtractedDependency } from "../extracted-dependency";
import { DependencyExtractor } from "./dependency-extractor";

export class GoDependencyExtractor implements DependencyExtractor {

    private static readonly SINGLE_IMPORT_REGEX = /^[ \t]*import[ \t]+(?:[._]|[A-Za-z_]\w*)?[ \t]*"([^"\r\n]+)"[ \t]*(?:\/\/.*)?$/gm;
    private static readonly IMPORT_BLOCK_REGEX = /^[ \t]*import[ \t]*\([ \t]*(?:\/\/.*)?\r?\n([\s\S]*?)^[ \t]*\)[ \t]*(?:\/\/.*)?$/gm;
    private static readonly IMPORT_BLOCK_ENTRY_REGEX = /^[ \t]*(?:[._]|[A-Za-z_]\w*)?[ \t]*"([^"\r\n]+)"[ \t]*(?:\/\/.*)?$/gm;

    public extract(document: CoreDocument): ExtractedDependency[] {
        return [
            ...this.extractSingleImports(document),
            ...this.extractBlockImports(document)
        ];
    }

    private extractSingleImports(document: CoreDocument): ExtractedDependency[] {
        const dependencies: ExtractedDependency[] = [];
        const text = document.getText();
        let match: RegExpExecArray | null;

        GoDependencyExtractor.SINGLE_IMPORT_REGEX.lastIndex = 0;
        while ((match = GoDependencyExtractor.SINGLE_IMPORT_REGEX.exec(text))) {
            dependencies.push(this.toExtractedDependency(document, match[1], match.index, match[0].length));
        }

        return dependencies;
    }

    private extractBlockImports(document: CoreDocument): ExtractedDependency[] {
        const dependencies: ExtractedDependency[] = [];
        const text = document.getText();
        let blockMatch: RegExpExecArray | null;

        GoDependencyExtractor.IMPORT_BLOCK_REGEX.lastIndex = 0;
        while ((blockMatch = GoDependencyExtractor.IMPORT_BLOCK_REGEX.exec(text))) {
            const blockContent = blockMatch[1];
            const blockContentStart = blockMatch.index + blockMatch[0].indexOf(blockContent);
            let entryMatch: RegExpExecArray | null;

            GoDependencyExtractor.IMPORT_BLOCK_ENTRY_REGEX.lastIndex = 0;
            while ((entryMatch = GoDependencyExtractor.IMPORT_BLOCK_ENTRY_REGEX.exec(blockContent))) {
                dependencies.push(this.toExtractedDependency(
                    document,
                    entryMatch[1],
                    blockContentStart + entryMatch.index,
                    entryMatch[0].length
                ));
            }
        }

        return dependencies;
    }

    private toExtractedDependency(document: CoreDocument, dependencyPath: string, matchIndex: number, matchLength: number): ExtractedDependency {
        const startPos = document.positionAt(matchIndex);
        const endPos = document.positionAt(matchIndex + matchLength);
        const position = new DependencyPosition(startPos.line, startPos.character, endPos.line, endPos.character);

        return new ExtractedDependency(this.normalizeDependencyPath(dependencyPath), position);
    }

    private normalizeDependencyPath(path: string): string {
        return `/${path.replace(/\\/g, '/')}/`;
    }
}
