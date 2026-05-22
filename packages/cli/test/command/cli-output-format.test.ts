import * as assert from 'node:assert';
import { suite, test } from 'mocha';
import { InvalidArgumentError } from 'commander';
import { CliOutputFormat } from '../../src/command/cli-output-format';

suite('CliOutputFormat', () => {
    test('parses text output format', () => {
        assert.strictEqual(CliOutputFormat.parse('text'), 'text');
    });

    test('parses json output format', () => {
        assert.strictEqual(CliOutputFormat.parse('json'), 'json');
    });

    test('rejects unsupported output format', () => {
        assert.throws(() => CliOutputFormat.parse('xml'), InvalidArgumentError);
    });
});
