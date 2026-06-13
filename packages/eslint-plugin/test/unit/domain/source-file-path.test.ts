import * as assert from 'node:assert';
import { suite, test } from 'mocha';
import { SourceFilePath } from '../../../src/domain/source-file-path';

suite('SourceFilePath', () => {
    test('normalizes path separators', () => {
        const sourceFilePath = new SourceFilePath('C:\\project\\src\\domain\\user.ts');

        assert.strictEqual(sourceFilePath.normalized, 'C:/project/src/domain/user.ts');
    });

    test('detects virtual filenames', () => {
        assert.strictEqual(new SourceFilePath('<input>').isVirtual(), true);
        assert.strictEqual(new SourceFilePath('/project/src/domain/user.ts').isVirtual(), false);
    });

    test('accepts every file when source folder is not configured', () => {
        assert.strictEqual(new SourceFilePath('/project/test/user.test.ts').isInsideSourceFolder(undefined), true);
    });

    test('detects files inside the configured source folder', () => {
        assert.strictEqual(new SourceFilePath('/project/src/domain/user.ts').isInsideSourceFolder('src'), true);
        assert.strictEqual(new SourceFilePath('src/domain/user.ts').isInsideSourceFolder('/src/'), true);
    });

    test('rejects files outside the configured source folder', () => {
        assert.strictEqual(new SourceFilePath('/project/test/domain/user.test.ts').isInsideSourceFolder('src'), false);
    });
});
