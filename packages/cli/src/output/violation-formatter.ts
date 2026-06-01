import { CliViolation } from '../check/cli-violation';
import { JsonOutput } from './json-output';
import { OutputFormat } from './output-format';
import { TextOutput } from './text-output';

export class ViolationFormatter {

    constructor(
        private readonly violations: CliViolation[],
        private readonly format: OutputFormat,
        private readonly useColor = ViolationFormatter.shouldUseColor(format)
    ) { }

    public get output(): string {
        if (this.format === 'json') {
            return new JsonOutput(this.violations).value;
        }

        return new TextOutput(this.violations, this.useColor).value;
    }

    private static shouldUseColor(format: OutputFormat): boolean {
        return format === 'text'
            && process.stdout.isTTY
            && process.env.NO_COLOR === undefined;
    }
}

export { OutputFormat } from './output-format';
