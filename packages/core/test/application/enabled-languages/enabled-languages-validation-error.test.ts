import * as assert from 'assert';
import { suite, test } from 'mocha';
import { UnsupportedLanguageError } from '../../../src';

suite('UnsupportedLanguageError', () => {
    test('formats singular message', () => {
        const error = new UnsupportedLanguageError(['javacsript']);

        assert.strictEqual(error.message, 'Unsupported language identifier: javacsript.');
    });

    test('formats plural message', () => {
        const error = new UnsupportedLanguageError(['javacsript', 'typesscript']);

        assert.strictEqual(error.message, 'Unsupported language identifiers: javacsript, typesscript.');
    });
});
