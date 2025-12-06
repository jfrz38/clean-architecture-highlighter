import { TextDocument } from "vscode";
import { ArchitectureViolation } from "../restrictions/architecture-violation";
import { DependencyPosition } from "./dependencies/dependency-position";
import { DependencyStatement } from "./dependencies/dependency-statement";
import { LayerPath } from "./layer/layer-path";
import { LayeredComponent } from "./layer/layered-component";

export class SourceFile extends LayeredComponent {

    protected readonly path: string;
    private dependencies: DependencyStatement[] = [];

    constructor(document: TextDocument) {
        super(document.uri.path);
        this.path = document.uri.path;

        this.parseImports(document);
    }

    private parseImports(document: TextDocument) {
        const text = document.getText();
        // TODO: Permitir saltos de línea entre import y from
        const importRegex = /import\s+.*\s+from\s+['"](.*)['"]/g;

        let match: RegExpExecArray | null;
        while ((match = importRegex.exec(text))) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);
            const position = new DependencyPosition(startPos.line, startPos.character, endPos.line, endPos.character);
            this.dependencies.push(new DependencyStatement(new LayerPath(match[0]), this.path, position));
        }

    }

    public get warnings(): ArchitectureViolation[] {
        return this.dependencies
            .filter(dependency => dependency.isViolation())
            .map(dependency => new ArchitectureViolation(dependency.violation!, dependency.position));
    }

}
