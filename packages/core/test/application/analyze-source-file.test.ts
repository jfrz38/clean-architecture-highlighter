import * as assert from 'assert';
import { suite, test } from 'mocha';
import { AnalyzeSourceFile } from '../../src/application/analyze-source-file';
import { Document } from '../../src/domain/document';
import { AllowedDependencies } from '../../src/domain/restrictions/allowed-dependencies';
import { DependencyPosition } from '../../src/domain/sources/dependencies/dependency-position';
import { ExtractedDependency } from '../../src/domain/sources/dependencies/extracted-dependency';
import { DependencyExtractor } from '../../src/domain/sources/dependencies/extractors/dependency-extractor';
import { LayerAlias } from '../../src/domain/sources/layer/layer-alias';
import { SourceUri } from '../../src/domain/sources/source-uri';

class FakeDependencyExtractor implements DependencyExtractor {
    public extracted = false;

    public extract(_document: Document): ExtractedDependency[] {
        this.extracted = true;
        return [
            new ExtractedDependency('/workspace/src/infrastructure/persistence/user-repository', new DependencyPosition(0, 0, 0, 65))
        ];
    }
}

suite('AnalyzeSourceFile', () => {
    test('uses the injected dependency extractor to analyze source file violations', () => {
        const extractor = new FakeDependencyExtractor();
        const document = {
            uri: new SourceUri('/workspace/src/domain/user/user.ts'),
            getText: () => '',
            positionAt: () => ({ line: 0, character: 0 })
        };
        const analyzer = new AnalyzeSourceFile(
            extractor,
            new AllowedDependencies(['domain'], ['domain', 'application'], ['domain', 'application', 'infrastructure']),
            new LayerAlias(['domain'], ['application'], ['infrastructure'])
        );

        const violations = analyzer.violationsFor(document);

        assert.strictEqual(extractor.extracted, true);
        assert.strictEqual(violations.length, 1);
        assert.strictEqual(violations[0].message, 'domain layer should not depend on infrastructure layer.');
    });
});
