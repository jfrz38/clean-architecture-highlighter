#!/usr/bin/env node
import { Command } from 'commander';
import type { EnabledLanguages } from '@jfrz38/clean-architecture-highlighter-core';
import { Check } from './check/check';
import { CheckInput } from './check/check-input';
import { CheckInputOptions } from './check/check-input-options';
import { CliEnabledLanguagesParser } from './command/cli-enabled-languages-parser';
import { CliOutputFormatParser } from './command/cli-output-format-parser';
import { OutputFormat, ViolationFormatter } from './output/violation-formatter';

declare global {
    var CLI_VERSION: string | undefined;
}

const cliVersion = globalThis.CLI_VERSION ?? '0.0.0';

const program = new Command();

program
    .name('clean-arch')
    .description('Check Clean Architecture dependency boundaries from the terminal.')
    .version(cliVersion)
    .showHelpAfterError()
    .showSuggestionAfterError();

program
    .command('check')
    .description('Check a project or source folder.')
    .argument('<path>', 'Project path or source folder path to analyze.')
    .option('--source-folder <folder>', 'Source folder relative to the project root.')
    .option('--enabled-languages <languages>', 'Comma-separated language identifiers to analyze.', CliEnabledLanguagesParser.parse)
    .option('--config <path>', 'Path to a JSON configuration file.')
    .option('--format <format>', 'Output format: text or json.', CliOutputFormatParser.parse, 'text')
    .addHelpText('after', `

Examples:
  $ clean-arch check .
  $ clean-arch check ./src --enabled-languages typescript,csharp
  $ clean-architecture-highlighter check . --format json`)
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
