import * as assert from 'assert';
import { suite, test } from 'mocha';
import { SupportedLanguageRegistry } from '../../../src';

suite('SupportedLanguageRegistry', () => {
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
