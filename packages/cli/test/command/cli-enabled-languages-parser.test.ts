import * as assert from 'node:assert';
import { suite, test } from 'mocha';
import { InvalidArgumentError } from 'commander';
import { CliEnabledLanguagesParser } from '../../src/command/cli-enabled-languages-parser';

suite('CliEnabledLanguagesParser', () => {
    test('parses comma-separated language identifiers', () => {
        assert.deepStrictEqual(CliEnabledLanguagesParser.parse('csharp,typescript'), ['csharp', 'typescript']);
    });

    test('trims language identifiers', () => {
        assert.deepStrictEqual(CliEnabledLanguagesParser.parse(' csharp, typescript '), ['csharp', 'typescript']);
    });

    test('ignores empty language entries', () => {
        assert.deepStrictEqual(CliEnabledLanguagesParser.parse('csharp,,typescript'), ['csharp', 'typescript']);
    });

    test('rejects empty language list', () => {
        assert.throws(() => CliEnabledLanguagesParser.parse(' , '), InvalidArgumentError);
    });
});
