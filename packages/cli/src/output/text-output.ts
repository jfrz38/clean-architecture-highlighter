import { CliViolation } from '../check/cli-violation';

export class TextOutput {

    constructor(
        private readonly violations: CliViolation[],
        private readonly useColor = false
    ) { }

    public get value(): string {
        if (this.violations.length === 0) {
            return `${this.green('OK')} No architecture violations found.`;
        }

        const lines = this.violations.map(violation => {
            const label = this.red('violation:');
            return `${label} ${violation.filePath}:${violation.line}:${violation.character} ${violation.message}`;
        });

        lines.push('', `${this.red('VIOLATION')} ${this.violations.length} architecture ${this.violationWord()} found.`);

        return lines.join('\n');
    }

    private violationWord(): string {
        return this.violations.length === 1 ? 'violation' : 'violations';
    }

    private red(value: string): string {
        return this.color(value, '31');
    }

    private green(value: string): string {
        return this.color(value, '32');
    }

    private color(value: string, code: string): string {
        return this.useColor ? `\u001b[${code}m${value}\u001b[0m` : value;
    }
}
