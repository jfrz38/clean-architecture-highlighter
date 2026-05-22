import { CliViolation } from '../check/cli-violation';
import { JsonOutput } from './json-output';
import { OutputFormat } from './output-format';
import { TextOutput } from './text-output';

export class ViolationFormatter {

    constructor(
        private readonly violations: CliViolation[],
        private readonly format: OutputFormat
    ) { }

    public get output(): string {
        if (this.format === 'json') {
            return new JsonOutput(this.violations).value;
        }

        return new TextOutput(this.violations).value;
    }
}

export { OutputFormat } from './output-format';
