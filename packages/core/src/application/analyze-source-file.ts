import { AllowedDependencies } from "../domain/restrictions/allowed-dependencies";
import { ArchitectureViolation } from "../domain/restrictions/architecture-violation";
import { DependencyExtractor } from "../domain/sources/dependencies/extractors/dependency-extractor";
import { LayerAlias } from "../domain/sources/layer/layer-alias";
import { SourceFile } from "../domain/sources/source-file";
import { CoreDocument } from "./ports/core-document";

export class AnalyzeSourceFile {

    constructor(
        private readonly extractor: DependencyExtractor,
        private readonly allowedDependencies: AllowedDependencies,
        private readonly aliases: LayerAlias
    ) { }

    public violationsFor(document: CoreDocument): ArchitectureViolation[] {
        return new SourceFile(
            document.uri.path,
            this.extractor.extract(document),
            this.allowedDependencies,
            this.aliases
        ).violations;
    }
}
