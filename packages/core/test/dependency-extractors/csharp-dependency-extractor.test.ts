import * as assert from 'assert';
import { createDocument } from '../support/create-document';
import { CsharpDependencyExtractor } from '../../src/clean-architecture/sources/dependencies/extractors/csharp-dependency-extractor';

suite('CsharpDependencyExtractor', () => {
    const extractor = new CsharpDependencyExtractor();

    test('extracts using directives as normalized lower-case paths', async () => {
        const document = createDocument({
            language: 'csharp',
            content: `using Example.Infrastructure.Persistence;`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/example/infrastructure/persistence/');
        assert.strictEqual(dependencies[0].position.lineStart, 0);
        assert.strictEqual(dependencies[0].position.lineEnd, 0);
    });

    test('extracts alias using directives without the alias', async () => {
        const document = createDocument({
            language: 'csharp',
            content: `using DomainUser = Example.Domain.User.User;`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/example/domain/user/user/');
    });

    test('extracts static using directives', async () => {
        const document = createDocument({
            language: 'csharp',
            content: `using static Example.Domain.User.UserStatus;`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/example/domain/user/userstatus/');
    });

    test('extracts global using directives', async () => {
        const document = createDocument({
            language: 'csharp',
            content: `global using Example.Application.Ports;`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/example/application/ports/');
    });

    test('ignores namespace declarations', async () => {
        const document = createDocument({
            language: 'csharp',
            content: `namespace Example.Domain.User;`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 0);
    });

    test('extracts using ranges from the using directive only', async () => {
        const document = createDocument({
            language: 'csharp',
            content: `namespace Example.Domain.User;

using Example.Application.UseCases;

public sealed class User {}`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/example/application/usecases/');
        assert.strictEqual(dependencies[0].position.lineStart, 2);
        assert.strictEqual(dependencies[0].position.lineEnd, 2);
    });
});
