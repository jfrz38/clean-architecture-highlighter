import { CliViolation } from '../check/cli-violation';

export class TextOutput {

    constructor(private readonly violations: CliViolation[]) { }

    public get value(): string {
        return this.violations.map(violation =>
            `${violation.filePath}:${violation.line}:${violation.character} ${violation.message}`
        ).join('\n');
    }
}
