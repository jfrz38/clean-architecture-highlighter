import * as assert from 'assert';
import { suite, test } from 'mocha';
import { SupportedLanguageRegistry } from '../src';

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
