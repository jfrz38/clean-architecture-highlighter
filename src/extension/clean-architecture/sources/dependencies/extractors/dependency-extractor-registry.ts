import { DependencyExtractor } from "./dependency-extractor";
import { EcmaScriptDependencyExtractor } from "./ecmascript-dependency-extractor";

export class DependencyExtractorRegistry {

    private readonly extractors = new Map<string, DependencyExtractor>([
        ['javascript', new EcmaScriptDependencyExtractor()],
        ['typescript', new EcmaScriptDependencyExtractor()],
    ]);

    public get(languageId: string): DependencyExtractor | undefined {
        return this.extractors.get(languageId);
    }
}
