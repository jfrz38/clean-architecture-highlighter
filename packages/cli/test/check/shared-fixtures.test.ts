import * as assert from 'node:assert';
import { suite, test } from 'mocha';
import { resolve } from 'node:path';
import { Check } from '../../src/check/check';
import { CheckInput } from '../../src/check/check-input';
import { CheckInputOptions } from '../../src/check/check-input-options';

suite('Shared fixtures', () => {
    const typescriptFixturePath = resolve(process.cwd(), '../../test/fixtures/languages/typescript');

    test('checks language fixtures from the shared test workspace', () => {
        const violations = new Check(new CheckInput(CheckInputOptions.fromCli(typescriptFixturePath))).violations;

        assert.deepStrictEqual(violations.map(violation => ({
            filePath: violation.filePath,
            line: violation.line,
            message: violation.message
        })), [
            {
                filePath: 'src/domain/domain.ts',
                line: 1,
                message: 'domain layer should not depend on infrastructure layer.'
            },
            {
                filePath: 'src/domain/domain.ts',
                line: 2,
                message: 'domain layer should not depend on application layer.'
            }
        ]);
    });

    test('ignores shared language fixtures when the language is disabled', () => {
        const violations = new Check(new CheckInput(CheckInputOptions.fromCli(
            typescriptFixturePath,
            undefined,
            undefined,
            ['csharp']
        ))).violations;

        assert.deepStrictEqual(violations, []);
    });
});
