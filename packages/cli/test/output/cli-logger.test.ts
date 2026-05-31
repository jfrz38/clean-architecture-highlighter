import * as assert from 'node:assert';
import { suite, test } from 'mocha';
import { CliLogger } from '../../src/output/cli-logger';

suite('CliLogger', () => {
    test('does not print info when verbose is disabled', () => {
        const messages = withConsoleError(() => new CliLogger(false).info('hidden'));

        assert.deepStrictEqual(messages, []);
    });

    test('prints info to stderr when verbose is enabled', () => {
        const messages = withConsoleError(() => new CliLogger(true).info('visible'));

        assert.deepStrictEqual(messages, ['visible']);
    });
});

function withConsoleError(action: () => void): string[] {
    const originalError = console.error;
    const messages: string[] = [];

    try {
        console.error = (...data: unknown[]) => messages.push(data.join(' '));
        action();
        return messages;
    } finally {
        console.error = originalError;
    }
}
