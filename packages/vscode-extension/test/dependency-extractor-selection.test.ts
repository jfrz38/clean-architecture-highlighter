import * as assert from 'assert';
import { DependencyExtractor, DependencyExtractorRegistry, Document } from '@jfrz38/clean-architecture-highlighter-core';
import { DependencyExtractorSelector } from '../src/dependency-extractor-selection';
import { TypeScriptResolvedDependencyExtractor } from '../src/type-script-resolved-dependency-extractor';

suite('DependencyExtractorSelector', () => {
    const nativeExtractor = new TypeScriptResolvedDependencyExtractor();
    const selector = new DependencyExtractorSelector(new DependencyExtractorRegistry(), nativeExtractor);

    test('uses text extractor for JavaScript when importResolution is text', () => {
        const extractor = selector.select(document('javascript'), {
            languageId: 'javascript',
            importResolution: 'text'
        });

        assert.ok(extractor);
        assert.notStrictEqual(extractor, nativeExtractor);
    });

    test('uses native extractor for TypeScript when importResolution is native', () => {
        const extractor = selector.select(document('typescript'), {
            languageId: 'typescript',
            importResolution: 'native'
        });

        assert.strictEqual(extractor, nativeExtractor);
    });

    test('falls back to text extractor for non EcmaScript language when importResolution is native', () => {
        const extractor = selector.select(document('python'), {
            languageId: 'python',
            importResolution: 'native'
        });

        assert.ok(extractor);
        assert.notStrictEqual(extractor, nativeExtractor);
    });
});

function document(languageId: string): Document & { languageId: string } {
    return {
        languageId,
        uri: { path: '' },
        getText: () => '',
        positionAt: () => ({ line: 0, character: 0 })
    };
}
