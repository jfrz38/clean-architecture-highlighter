import { DependencyExtractor } from "./dependency-extractor";
import { EcmaScriptDependencyExtractor } from "./ecmascript-dependency-extractor";
import { JavaDependencyExtractor } from "./java-dependency-extractor";
import { KotlinDependencyExtractor } from "./kotlin-dependency-extractor";
import { PythonDependencyExtractor } from "./python-dependency-extractor";
import { ScalaDependencyExtractor } from "./scala-dependency-extractor";

export class DependencyExtractorRegistry {

    private readonly extractors = new Map<string, DependencyExtractor>([
        ['javascript', new EcmaScriptDependencyExtractor()],
        ['typescript', new EcmaScriptDependencyExtractor()],
        ['java', new JavaDependencyExtractor()],
        ['kotlin', new KotlinDependencyExtractor()],
        ['python', new PythonDependencyExtractor()],
        ['scala', new ScalaDependencyExtractor()],
    ]);

    public get(languageId: string): DependencyExtractor | undefined {
        return this.extractors.get(languageId);
    }
}
