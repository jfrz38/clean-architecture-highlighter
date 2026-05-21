import { ArchitectureViolation } from '@jfrz38/clean-architecture-highlighter-core';

export class CliViolation {

    public readonly line: number;
    public readonly character: number;
    public readonly message: string;

    constructor(
        public readonly filePath: string,
        violation: ArchitectureViolation
    ) {
        this.line = violation.startLine + 1;
        this.character = violation.startCharacter + 1;
        this.message = violation.message;
    }
}
