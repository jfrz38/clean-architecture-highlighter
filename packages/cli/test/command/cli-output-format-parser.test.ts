import * as assert from 'node:assert';
import { suite, test } from 'mocha';
import { InvalidArgumentError } from 'commander';
import { CliOutputFormatParser } from '../../src/command/cli-output-format-parser';

suite('CliOutputFormatParser', () => {
    test('parses text output format', () => {
        assert.strictEqual(CliOutputFormatParser.parse('text'), 'text');
    });

    test('parses json output format', () => {
        assert.strictEqual(CliOutputFormatParser.parse('json'), 'json');
    });

    test('rejects unsupported output format', () => {
        assert.throws(() => CliOutputFormatParser.parse('xml'), InvalidArgumentError);
    });
});
