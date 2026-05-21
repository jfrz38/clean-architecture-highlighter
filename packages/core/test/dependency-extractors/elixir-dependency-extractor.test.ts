import * as assert from 'assert';
import { createDocument } from '../support/create-document';
import { ElixirDependencyExtractor } from '../../src/clean-architecture/sources/dependencies/extractors/elixir-dependency-extractor';

suite('ElixirDependencyExtractor', () => {
    const extractor = new ElixirDependencyExtractor();

    test('extracts alias directives as normalized lower-case paths', async () => {
        const document = createDocument({
            language: 'elixir',
            content: `alias Example.Infrastructure.Persistence.SqlUserRepository`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/example/infrastructure/persistence/sqluserrepository/');
        assert.strictEqual(dependencies[0].position.lineStart, 0);
        assert.strictEqual(dependencies[0].position.lineEnd, 0);
    });

    test('extracts grouped alias directives as normalized paths', async () => {
        const document = createDocument({
            language: 'elixir',
            content: `alias Example.Domain.User.{UserId, UserStatus}`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 2);
        assert.strictEqual(dependencies[0].path, '/example/domain/user/userid/');
        assert.strictEqual(dependencies[1].path, '/example/domain/user/userstatus/');
    });

    test('extracts alias directives without the alias option', async () => {
        const document = createDocument({
            language: 'elixir',
            content: `alias Example.Domain.User, as: DomainUser`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/example/domain/user/');
    });

    test('extracts import, require, and use directives', async () => {
        const document = createDocument({
            language: 'elixir',
            content: `import Example.Domain.User.Guards
require Example.Application.Ports.UserRepository
use Example.Infrastructure.Persistence.SqlUserRepository`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 3);
        assert.strictEqual(dependencies[0].path, '/example/domain/user/guards/');
        assert.strictEqual(dependencies[1].path, '/example/application/ports/userrepository/');
        assert.strictEqual(dependencies[2].path, '/example/infrastructure/persistence/sqluserrepository/');
    });

    test('ignores defmodule declarations', async () => {
        const document = createDocument({
            language: 'elixir',
            content: `defmodule Example.Domain.User do`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 0);
    });

    test('extracts directive ranges from the directive only', async () => {
        const document = createDocument({
            language: 'elixir',
            content: `defmodule Example.Domain.User do
  alias Example.Application.UseCases.CreateUser
end`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/example/application/usecases/createuser/');
        assert.strictEqual(dependencies[0].position.lineStart, 1);
        assert.strictEqual(dependencies[0].position.lineEnd, 1);
    });
});
