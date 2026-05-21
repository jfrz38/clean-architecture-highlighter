#!/usr/bin/env node
import { Command, InvalidArgumentError } from 'commander';
import { Check } from './check';
import { OutputFormat, ViolationFormatter } from './format';

const program = new Command();

program
    .name('clean-architecture-highlighter')
    .description('Check Clean Architecture dependency boundaries from the terminal.')
    .version('0.1.0');

program
    .command('check')
    .description('Check a project or source folder.')
    .argument('<path>', 'Project path or source folder path to analyze.')
    .option('--source-folder <folder>', 'Source folder relative to the project root.')
    .option('--config <path>', 'Path to a JSON configuration file.')
    .option('--format <format>', 'Output format: text or json.', parseFormat, 'text')
    .action((path: string, options: { sourceFolder?: string; config?: string; format: OutputFormat }) => {
        try {
            const violations = new Check({
                path,
                sourceFolder: options.sourceFolder,
                configPath: options.config
            }).violations;
            const output = new ViolationFormatter(violations, options.format).output;
            if (output) {
                console.log(output);
            }
            process.exitCode = violations.length > 0 ? 1 : 0;
        } catch (error) {
            console.error(error instanceof Error ? error.message : error);
            process.exitCode = 2;
        }
    });

program.parse();

function parseFormat(value: string): OutputFormat {
    if (value === 'text' || value === 'json') {
        return value;
    }

    throw new InvalidArgumentError('Expected text or json.');
}
