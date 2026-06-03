import * as core from '@actions/core';
import type { RunCheckInput, RunCheckResult } from '@jfrz38/clean-architecture-highlighter-cli';
import { parseActionInputs } from './action-inputs';

export interface ActionCore {
    getInput(name: string): string;
    info(message: string): void;
    setFailed(message: string): void;
}

export type CheckRunner = (input: RunCheckInput) => RunCheckResult;

export function runGithubAction(actionCore: ActionCore = core, checkRunner: CheckRunner = defaultCheckRunner): void {
    try {
        const result = checkRunner({
            ...parseActionInputs(name => actionCore.getInput(name)),
            failOnViolations: true
        });

        actionCore.info(`Checked files: ${result.checkedFilesCount}`);
        actionCore.info(`Violations found: ${result.violations.length}`);
        if (result.output) {
            actionCore.info(result.output);
        }

        if (result.exitCode !== 0) {
            actionCore.setFailed(`Clean Architecture violations found: ${result.violations.length}`);
        }
    } catch (error) {
        actionCore.setFailed(error instanceof Error ? error.message : String(error));
    }
}

function defaultCheckRunner(input: RunCheckInput): RunCheckResult {
    const cli = require('@jfrz38/clean-architecture-highlighter-cli') as typeof import('@jfrz38/clean-architecture-highlighter-cli');

    return cli.runCheck(input);
}
