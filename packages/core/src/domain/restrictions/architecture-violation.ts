import { DependencyPosition } from "../sources/dependencies/dependency-position";
import { LayerViolation } from "./layer-violation";

export class ArchitectureViolation {

    constructor(
        private readonly violation: LayerViolation,
        private readonly position: DependencyPosition
    ) { }

    isViolation(): boolean {
        return this.violation.isViolation();
    }

    get message(): string {
        return this.violation.message;
    }

    get startLine(): number {
        return this.position.lineStart;
    }

    get startCharacter(): number {
        return this.position.start;
    }

    get endLine(): number {
        return this.position.lineEnd;
    }

    get endCharacter(): number {
        return this.position.end;
    }

}
