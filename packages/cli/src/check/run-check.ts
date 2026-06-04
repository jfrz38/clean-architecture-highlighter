import type { EnabledLanguages } from '@jfrz38/clean-architecture-highlighter-core';
import { Check } from './check';
import { CheckInput } from './check-input';
import { CheckInputOptions } from './check-input-options';
import { CliViolation } from './cli-violation';
import { OutputFormat, ViolationFormatter } from '../output/violation-formatter';

export interface RunCheckInput {
    path: string;
    config?: string;
    sourceFolder?: string;
    enabledLanguages?: EnabledLanguages;
    format: OutputFormat;
    verbose?: boolean;
    failOnViolations?: boolean;
}

export interface RunCheckResult {
    exitCode: number;
    checkedFilesCount: number;
    violations: CliViolation[];
    output: string;
}

export function runCheck(input: RunCheckInput): RunCheckResult {
    const checkInput = new CheckInput(CheckInputOptions.fromCli(
        input.path,
        input.config,
        input.sourceFolder,
        input.enabledLanguages,
        input.verbose ?? false
    ));
    checkInput.logSummary();

    const violations = new Check(checkInput).violations;
    checkInput.options.logger.info(`Checked files: ${checkInput.checkedFilesCount}`);
    checkInput.options.logger.info(`Violations found: ${violations.length}`);

    return {
        exitCode: violations.length > 0 && input.failOnViolations !== false ? 1 : 0,
        checkedFilesCount: checkInput.checkedFilesCount,
        violations,
        output: new ViolationFormatter(violations, input.format).output
    };
}
