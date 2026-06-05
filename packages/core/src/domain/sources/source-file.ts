import { AllowedDependencies } from "../restrictions/allowed-dependencies";
import { ArchitectureViolation } from "../restrictions/architecture-violation";
import { ExtractedDependency } from "./dependencies/extracted-dependency";
import { DependencyStatement } from "./dependencies/dependency-statement";
import { LayerAlias } from "./layer/layer-alias";
import { LayerPath } from "./layer/layer-path";
import { LayeredComponent } from "./layer/layered-component";

export class SourceFile extends LayeredComponent {

    private dependencies: DependencyStatement[] = [];

    constructor(
        sourcePath: string | { uri: { path: string } },
        extractedDependencies: ExtractedDependency[],
        private readonly allowedDependencies: AllowedDependencies,
        aliases: LayerAlias
    ) {
        super(SourceFile.toSourcePath(sourcePath), aliases);
        this.dependencies = extractedDependencies.map(dependency =>
            new DependencyStatement(new LayerPath(dependency.path, this.aliases), this.path, dependency.position, this.allowedDependencies, this.aliases)
        );
    }

    private static toSourcePath(sourcePath: string | { uri: { path: string } }): string {
        return typeof sourcePath === 'string' ? sourcePath : sourcePath.uri.path;
    }

    public get violations(): ArchitectureViolation[] {
        return this.dependencies
            .filter(dependency => dependency.isViolation())
            .map(dependency => new ArchitectureViolation(dependency.violation!, dependency.position));
    }

}
