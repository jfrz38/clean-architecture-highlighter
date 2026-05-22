import * as assert from 'node:assert';
import { suite, test } from 'mocha';
import { InvalidArgumentError } from 'commander';
import { CliEnabledLanguages } from '../../src/command/cli-enabled-languages';

suite('CliEnabledLanguages', () => {
    test('parses comma-separated language identifiers', () => {
        assert.deepStrictEqual(CliEnabledLanguages.parse('csharp,typescript'), ['csharp', 'typescript']);
    });

    test('trims language identifiers', () => {
        assert.deepStrictEqual(CliEnabledLanguages.parse(' csharp, typescript '), ['csharp', 'typescript']);
    });

    test('ignores empty language entries', () => {
        assert.deepStrictEqual(CliEnabledLanguages.parse('csharp,,typescript'), ['csharp', 'typescript']);
    });

    test('rejects empty language list', () => {
        assert.throws(() => CliEnabledLanguages.parse(' , '), InvalidArgumentError);
    });
});
