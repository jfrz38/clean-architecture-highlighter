#!/usr/bin/env node
import { Command } from 'commander';
import type { EnabledLanguages } from '@jfrz38/clean-architecture-highlighter-core';
import { CliEnabledLanguagesParser } from './command/cli-enabled-languages-parser';
import { CliOutputFormatParser } from './command/cli-output-format-parser';
import { runCheck } from './check/run-check';
import { OutputFormat } from './output/violation-formatter';

export { runCheck } from './check/run-check';
export type { RunCheckInput, RunCheckResult } from './check/run-check';
export type { OutputFormat } from './output/violation-formatter';

declare global {
    var CLI_VERSION: string | undefined;
}

export function runCli(argv = process.argv): void {
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
        .option('--strict', 'Fail with exit code 1 when architecture violations are found. This is the default behavior.')
        .option('--no-fail', 'Report architecture violations without returning exit code 1.')
        .option('--verbose', 'Print analysis details to stderr.')
        .addHelpText('after', `

Examples:
  $ clean-arch check .
  $ clean-arch check ./src --enabled-languages typescript,csharp
  $ clean-arch check . --format json
  $ clean-arch check . --no-fail`)
        .action((path: string, options: {
            sourceFolder?: string;
            enabledLanguages?: EnabledLanguages;
            config?: string;
            format: OutputFormat;
            strict?: boolean;
            fail?: boolean;
            verbose?: boolean;
        }) => {
            try {
                if (options.strict && options.fail === false) {
                    throw new Error('Options --strict and --no-fail cannot be used together.');
                }

                const result = runCheck({
                    path,
                    config: options.config,
                    sourceFolder: options.sourceFolder,
                    enabledLanguages: options.enabledLanguages,
                    format: options.format,
                    verbose: options.verbose,
                    failOnViolations: options.fail
                });
                if (result.output) {
                    console.log(result.output);
                }
                process.exitCode = result.exitCode;
            } catch (error) {
                console.error(error instanceof Error ? `Error: ${error.message}` : error);
                process.exitCode = 2;
            }
        });

    program.parse(argv);
}

if (require.main === module) {
    runCli();
}
