import * as assert from 'node:assert';
import { suite, test } from 'mocha';
import type { RunCheckInput, RunCheckResult } from '@jfrz38/clean-architecture-highlighter-cli';
import { ActionCore, runGithubAction } from '../src/run-action.js';

suite('GitHub Action runner', () => {
    test('succeeds when no violations are found', () => {
        const actionCore = new FakeActionCore({ path: 'project', format: 'text' });

        runGithubAction(actionCore, () => result(0, 0));

        assert.deepStrictEqual(actionCore.failures, []);
        assert.ok(actionCore.messages.includes('Violations found: 0'));
    });

    test('fails when violations are found', () => {
        const actionCore = new FakeActionCore({ path: 'project', format: 'text' });

        runGithubAction(actionCore, () => result(1, 2));

        assert.deepStrictEqual(actionCore.failures, ['Clean Architecture violations found: 2']);
    });

    test('passes mapped inputs to the check runner', () => {
        const actionCore = new FakeActionCore({
            path: 'project',
            config: 'config.json',
            'source-folder': 'src',
            'enabled-languages': 'typescript,csharp',
            format: 'json'
        });
        let runnerInput: RunCheckInput | undefined;

        runGithubAction(actionCore, input => {
            runnerInput = input;
            return result(0, 0);
        });

        assert.deepStrictEqual(runnerInput, {
            path: 'project',
            config: 'config.json',
            sourceFolder: 'src',
            enabledLanguages: ['typescript', 'csharp'],
            format: 'json',
            failOnViolations: true
        });
    });
});

class FakeActionCore implements ActionCore {
    public readonly messages: string[] = [];
    public readonly failures: string[] = [];

    constructor(private readonly inputs: Record<string, string>) { }

    public getInput(name: string): string {
        return this.inputs[name] ?? '';
    }

    public info(message: string): void {
        this.messages.push(message);
    }

    public setFailed(message: string): void {
        this.failures.push(message);
    }
}

function result(exitCode: number, violationsCount: number): RunCheckResult {
    return {
        exitCode,
        checkedFilesCount: 1,
        violations: Array.from({ length: violationsCount }, () => ({})) as RunCheckResult['violations'],
        output: ''
    };
}
