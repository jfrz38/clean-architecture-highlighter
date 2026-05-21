#!/usr/bin/env node
import { Command, InvalidArgumentError } from 'commander';
import { EnabledLanguages } from '@jfrz38/clean-architecture-highlighter-core';
import { Check } from './check/check';
import { CheckInput } from './check/check-input';
import { CheckInputOptions } from './check/check-input-options';
import { OutputFormat, ViolationFormatter } from './output/violation-formatter';

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
    .option('--enabled-languages <languages>', 'Comma-separated language identifiers to analyze.', parseEnabledLanguages)
    .option('--config <path>', 'Path to a JSON configuration file.')
    .option('--format <format>', 'Output format: text or json.', parseFormat, 'text')
    .action((path: string, options: {
        sourceFolder?: string;
        enabledLanguages?: EnabledLanguages;
        config?: string;
        format: OutputFormat;
    }) => {
        try {
            const violations = new Check(new CheckInput(CheckInputOptions.fromCli(
                path,
                options.config,
                options.sourceFolder,
                options.enabledLanguages
            ))).violations;
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

function parseEnabledLanguages(value: string): EnabledLanguages {
    const languages = value.split(',')
        .map(language => language.trim())
        .filter(language => language.length > 0);

    if (languages.length === 0) {
        throw new InvalidArgumentError('Expected at least one language identifier.');
    }

    return languages;
}
