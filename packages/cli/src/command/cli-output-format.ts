import { InvalidArgumentError } from 'commander';
import { OutputFormat } from '../output/output-format';

export class CliOutputFormat {

    public static parse(value: string): OutputFormat {
        if (value === 'text' || value === 'json') {
            return value;
        }

        throw new InvalidArgumentError('Expected text or json.');
    }
}
