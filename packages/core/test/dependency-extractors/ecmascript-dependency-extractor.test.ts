import * as assert from 'assert';
import { createDocument } from '../support/create-document';
import { EcmaScriptDependencyExtractor } from '../../src/clean-architecture/sources/dependencies/extractors/ecmascript-dependency-extractor';

suite('EcmaScriptDependencyExtractor', () => {
    const extractor = new EcmaScriptDependencyExtractor();

    test('extracts a single-line import path and range', async () => {
        const document = createDocument({
            language: 'typescript',
            content: `import { User } from '../domain/user';`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/../domain/user');
        assert.strictEqual(dependencies[0].position.lineStart, 0);
        assert.strictEqual(dependencies[0].position.lineEnd, 0);
    });

    test('extracts a multiline import path and range', async () => {
        const document = createDocument({
            language: 'typescript',
            content: `import {
    User,
    UserId
} from '../domain/user';`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/../domain/user');
        assert.strictEqual(dependencies[0].position.lineStart, 0);
        assert.strictEqual(dependencies[0].position.lineEnd, 3);
    });

    test('normalizes path aliases as slash-delimited paths', async () => {
        const document = createDocument({
            language: 'typescript',
            content: `import { User } from 'domain/user';`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/domain/user');
    });
});
