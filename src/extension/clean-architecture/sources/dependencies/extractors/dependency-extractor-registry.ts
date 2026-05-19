import { DependencyExtractor } from "./dependency-extractor";
import { EcmaScriptDependencyExtractor } from "./ecmascript-dependency-extractor";
import { GoDependencyExtractor } from "./go-dependency-extractor";
import { JavaDependencyExtractor } from "./java-dependency-extractor";
import { KotlinDependencyExtractor } from "./kotlin-dependency-extractor";
import { PhpDependencyExtractor } from "./php-dependency-extractor";
import { PythonDependencyExtractor } from "./python-dependency-extractor";
import { RubyDependencyExtractor } from "./ruby-dependency-extractor";
import { ScalaDependencyExtractor } from "./scala-dependency-extractor";

export class DependencyExtractorRegistry {

    private readonly extractors = new Map<string, DependencyExtractor>([
        ['javascript', new EcmaScriptDependencyExtractor()],
        ['typescript', new EcmaScriptDependencyExtractor()],
        ['go', new GoDependencyExtractor()],
        ['java', new JavaDependencyExtractor()],
        ['kotlin', new KotlinDependencyExtractor()],
        ['php', new PhpDependencyExtractor()],
        ['python', new PythonDependencyExtractor()],
        ['ruby', new RubyDependencyExtractor()],
        ['scala', new ScalaDependencyExtractor()],
    ]);

    public get(languageId: string): DependencyExtractor | undefined {
        return this.extractors.get(languageId);
    }
}
