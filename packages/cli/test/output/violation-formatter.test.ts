import * as assert from 'node:assert';
import { suite, test } from 'mocha';
import { ViolationFormatter } from '../../src/output/violation-formatter';

suite('ViolationFormatter', () => {
    test('formats violations as text', () => {
        const output = new ViolationFormatter([{
            filePath: 'src/application/use-case.ts',
            line: 1,
            character: 1,
            message: 'application layer should not depend on infrastructure layer.'
        }], 'text').output;

        assert.strictEqual(output, 'src/application/use-case.ts:1:1 application layer should not depend on infrastructure layer.');
    });

    test('formats violations as json', () => {
        const output = new ViolationFormatter([{
            filePath: 'src/application/use-case.ts',
            line: 1,
            character: 1,
            message: 'application layer should not depend on infrastructure layer.'
        }], 'json').output;

        assert.match(output, /"filePath": "src\/application\/use-case\.ts"/);
    });
});
