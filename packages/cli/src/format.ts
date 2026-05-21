import { CliViolation } from './violation';

export type OutputFormat = 'text' | 'json';

export class ViolationFormatter {

    constructor(
        private readonly violations: CliViolation[],
        private readonly format: OutputFormat
    ) { }

    public get output(): string {
        if (this.format === 'json') {
            return JSON.stringify(this.violations, null, 2);
        }

        return this.violations.map(violation =>
            `${violation.filePath}:${violation.line}:${violation.character} ${violation.message}`
        ).join('\n');
    }
}
