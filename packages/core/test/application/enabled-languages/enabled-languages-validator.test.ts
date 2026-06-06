import * as assert from 'assert';
import { suite, test } from 'mocha';
import { EnabledLanguagesValidator, SupportedLanguageRegistry, UnsupportedLanguageError } from '../../../src';

suite('EnabledLanguagesValidator', () => {
    test('accepts supported language identifiers', () => {
        const validator = new EnabledLanguagesValidator(new SupportedLanguageRegistry());

        assert.doesNotThrow(() => validator.validate(['typescript', 'python']));
    });

    test('throws UnsupportedLanguageError for unsupported identifiers', () => {
        const validator = new EnabledLanguagesValidator(new SupportedLanguageRegistry());

        assert.throws(
            () => validator.validate(['javacsript']),
            UnsupportedLanguageError
        );
    });

    test('throws when any language is unsupported', () => {
        const validator = new EnabledLanguagesValidator(new SupportedLanguageRegistry());

        assert.throws(
            () => validator.validate(['typescript', 'javacsript']),
            UnsupportedLanguageError
        );
    });

    test('error contains unsupported languages', () => {
        const validator = new EnabledLanguagesValidator(new SupportedLanguageRegistry());

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
