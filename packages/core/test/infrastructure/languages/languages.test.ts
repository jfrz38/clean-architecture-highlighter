import * as assert from 'assert';
import { suite, test } from 'mocha';
import { EnabledLanguagesValidator, SupportedLanguageRegistry, UnsupportedLanguageError } from '../../../src';

suite('Supported languages', () => {
    test('resolves language identifiers from file extensions', () => {
        const languages = new SupportedLanguageRegistry();

        assert.strictEqual(languages.getLanguageIdFromExtension('.ts'), 'typescript');
        assert.strictEqual(languages.getLanguageIdFromExtension('.py'), 'python');
        assert.strictEqual(languages.getLanguageIdFromExtension('.cs'), 'csharp');
    });

    test('returns undefined for unsupported extensions', () => {
        const languages = new SupportedLanguageRegistry();

        assert.strictEqual(languages.getLanguageIdFromExtension('.md'), undefined);
    });
});

suite('SupportedLanguageRegistry', () => {
    test('recognizes supported language identifiers', () => {
        const registry = new SupportedLanguageRegistry();

        assert.ok(registry.isSupportedLanguageId('typescript'));
        assert.ok(registry.isSupportedLanguageId('python'));
    });

    test('rejects unsupported language identifiers', () => {
        const registry = new SupportedLanguageRegistry();

        assert.ok(!registry.isSupportedLanguageId('javacsript'));
        assert.ok(!registry.isSupportedLanguageId('cobol'));
    });
});

suite('EnabledLanguagesValidator', () => {
    test('accepts supported language identifiers', () => {
        const validator = new EnabledLanguagesValidator();

        assert.doesNotThrow(() => validator.validate(['typescript', 'python']));
    });

    test('throws UnsupportedLanguageError for unsupported identifiers', () => {
        const validator = new EnabledLanguagesValidator();

        assert.throws(
            () => validator.validate(['javacsript']),
            UnsupportedLanguageError
        );
    });

    test('throws when any language is unsupported', () => {
        const validator = new EnabledLanguagesValidator();

        assert.throws(
            () => validator.validate(['typescript', 'javacsript']),
            UnsupportedLanguageError
        );
    });

    test('error contains unsupported languages', () => {
        const validator = new EnabledLanguagesValidator();

        try {
            validator.validate(['javacsript', 'typesscript']);
        } catch (error) {
            assert.ok(error instanceof UnsupportedLanguageError);
            assert.deepStrictEqual(error.unsupportedLanguages, ['javacsript', 'typesscript']);
        }
    });

    test('validates through the injected supported languages port', () => {
        const validator = new EnabledLanguagesValidator({
            isSupportedLanguageId: languageId => languageId === 'custom'
        });

        assert.doesNotThrow(() => validator.validate(['custom']));
        assert.throws(
            () => validator.validate(['typescript']),
            UnsupportedLanguageError
        );
    });
});

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
