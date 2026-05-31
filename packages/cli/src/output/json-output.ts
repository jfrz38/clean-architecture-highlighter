import { CliViolation } from '../check/cli-violation';

export class JsonOutput {

    constructor(private readonly violations: CliViolation[]) { }

    public get value(): string {
        return JSON.stringify(this.violations, null, 2);
    }
}
