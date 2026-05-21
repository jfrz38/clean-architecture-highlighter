import * as assert from 'assert';
import { suite, test } from 'mocha';
import { SupportedLanguageRegistry } from '../src';

suite('Supported languages', () => {
    test('resolves language identifiers from file paths', () => {
        const languages = new SupportedLanguageRegistry();

        assert.strictEqual(languages.getLanguageIdFromPath('/project/src/application/use-case.ts'), 'typescript');
        assert.strictEqual(languages.getLanguageIdFromPath('/project/src/domain/entity.py'), 'python');
        assert.strictEqual(languages.getLanguageIdFromPath('/project/src/infrastructure/repository.cs'), 'csharp');
    });

    test('returns undefined for unsupported extensions', () => {
        const languages = new SupportedLanguageRegistry();

        assert.strictEqual(languages.getLanguageIdFromPath('/project/readme.md'), undefined);
    });
});
