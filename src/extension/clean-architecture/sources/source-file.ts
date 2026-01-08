import { TextDocument } from "vscode";
import { ArchitectureViolation } from "../restrictions/architecture-violation";
import { DependencyPosition } from "./dependencies/dependency-position";
import { DependencyStatement } from "./dependencies/dependency-statement";
import { LayerPath } from "./layer/layer-path";
import { LayeredComponent } from "./layer/layered-component";
import { AllowedDependencies } from "../restrictions/allowed-dependencies";
import { LayerAlias } from "./layer/layer-alias";

export class SourceFile extends LayeredComponent {

    private dependencies: DependencyStatement[] = [];

    constructor(
        document: TextDocument,
        private readonly allowedDependencies: AllowedDependencies,
        aliases: LayerAlias
    ) {
        super(document.uri.path, aliases);

        this.parseImports(document);
    }

    private parseImports(document: TextDocument) {
        const text = document.getText();
        const importRegex = /import\s+([\s\S]*?)\s+from\s+['"](.*)['"]/g;

        let match: RegExpExecArray | null;
        while ((match = importRegex.exec(text))) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);
            const position = new DependencyPosition(startPos.line, startPos.character, endPos.line, endPos.character);
            this.dependencies.push(new DependencyStatement(new LayerPath(match[0], this.aliases), this.path, position, this.allowedDependencies, this.aliases));
        }

    }

    public get warnings(): ArchitectureViolation[] {
        return this.dependencies
            .filter(dependency => dependency.isViolation())
            .map(dependency => new ArchitectureViolation(dependency.violation!, dependency.position));
    }

}
