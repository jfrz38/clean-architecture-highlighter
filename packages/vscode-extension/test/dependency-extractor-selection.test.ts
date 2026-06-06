import { DependencyExtractorRegistry } from '@jfrz38/clean-architecture-highlighter-core';
import * as assert from 'assert';
import { ImportResolution } from '../src/configuration';
import { DependencyExtractorSelector, LanguageDocument } from '../src/dependency-extractor-selection';
import { NativeDependencyExtractorFactory } from '../src/native/native-dependency-extractor-factory';

suite('DependencyExtractorSelector', () => {
    const nativeExtractor = NativeDependencyExtractorFactory.create();
    const selector = new DependencyExtractorSelector(new DependencyExtractorRegistry(), nativeExtractor);

    test('uses text extractor for JavaScript when importResolution is text', () => {
        const extractor = selector.select(document('javascript'), {
            languageId: 'javascript',
            importResolution: ImportResolution.TEXT
        });

        assert.ok(extractor);
        assert.notStrictEqual(extractor, nativeExtractor);
    });

    test('uses native extractor for TypeScript when importResolution is native', () => {
        const extractor = selector.select(document('typescript'), {
            languageId: 'typescript',
            importResolution: ImportResolution.NATIVE
        });

        assert.strictEqual(extractor, nativeExtractor);
    });

    test('falls back to text extractor for non EcmaScript language when importResolution is native', () => {
        const extractor = selector.select(document('python'), {
            languageId: 'python',
            importResolution: ImportResolution.NATIVE
        });

        assert.ok(extractor);
        assert.notStrictEqual(extractor, nativeExtractor);
    });
});

function document(languageId: string): LanguageDocument {
    return {
        languageId,
        uri: { path: '' },
        getText: () => '',
        positionAt: () => ({ line: 0, character: 0 })
    };
}
