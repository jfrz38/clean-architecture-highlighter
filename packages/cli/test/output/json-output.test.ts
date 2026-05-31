import * as assert from 'node:assert';
import { suite, test } from 'mocha';
import { JsonOutput } from '../../src/output/json-output';

suite('JsonOutput', () => {
    test('formats violations as pretty json', () => {
        const output = new JsonOutput([{
            filePath: 'src/domain/user.ts',
            line: 3,
            character: 5,
            message: 'domain layer should not depend on infrastructure layer.'
        }]).value;

        assert.deepStrictEqual(JSON.parse(output), [{
            filePath: 'src/domain/user.ts',
            line: 3,
            character: 5,
            message: 'domain layer should not depend on infrastructure layer.'
        }]);
        assert.match(output, /\n  \{/);
    });

    test('returns an empty json array without violations', () => {
        assert.strictEqual(new JsonOutput([]).value, '[]');
    });
});
