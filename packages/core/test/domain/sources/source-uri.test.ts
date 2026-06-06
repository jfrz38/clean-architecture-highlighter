import * as assert from 'assert';
import { suite, test } from 'mocha';
import { SourceUri } from '../../../src/domain/sources/source-uri';

suite('SourceUri', () => {
    test('keeps the source path', () => {
        const uri = new SourceUri('/workspace/src/domain/user/user.ts');

        assert.strictEqual(uri.path, '/workspace/src/domain/user/user.ts');
    });

    test('allows empty paths for compatibility', () => {
        const uri = new SourceUri('');

        assert.strictEqual(uri.path, '');
    });

    test('rejects non-string paths', () => {
        assert.throws(
            () => new SourceUri(undefined as unknown as string),
            /SourceUri path must be a string./
        );
    });
});
