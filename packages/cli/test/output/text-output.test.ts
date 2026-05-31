import * as assert from 'node:assert';
import { suite, test } from 'mocha';
import { TextOutput } from '../../src/output/text-output';

suite('TextOutput', () => {
    test('formats violations as compiler-like text lines', () => {
        const output = new TextOutput([{
            filePath: 'src/domain/user.ts',
            line: 3,
            character: 5,
            message: 'domain layer should not depend on infrastructure layer.'
        }, {
            filePath: 'src/application/use-case.ts',
            line: 1,
            character: 1,
            message: 'application layer should not depend on infrastructure layer.'
        }]).value;

        assert.strictEqual(output, [
            'violation: src/domain/user.ts:3:5 domain layer should not depend on infrastructure layer.',
            'violation: src/application/use-case.ts:1:1 application layer should not depend on infrastructure layer.',
            '',
            'VIOLATION 2 architecture violations found.'
        ].join('\n'));
    });

    test('prints success summary without violations', () => {
        assert.strictEqual(new TextOutput([]).value, 'OK No architecture violations found.');
    });

    test('colors text output when enabled', () => {
        const output = new TextOutput([{
            filePath: 'src/domain/user.ts',
            line: 3,
            character: 5,
            message: 'domain layer should not depend on infrastructure layer.'
        }], true).value;

        assert.match(output, /\u001b\[31mviolation:\u001b\[0m/);
    });
});
