import * as assert from 'assert';
import { createDocument } from '../support/create-document';
import { PhpDependencyExtractor } from '../../src/clean-architecture/sources/dependencies/extractors/php-dependency-extractor';

suite('PhpDependencyExtractor', () => {
    const extractor = new PhpDependencyExtractor();

    test('extracts use statements as normalized lower-case paths', async () => {
        const document = createDocument({
            language: 'php',
            content: `use App\\Infrastructure\\Persistence\\SqlUserRepository;`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/app/infrastructure/persistence/sqluserrepository/');
        assert.strictEqual(dependencies[0].position.lineStart, 0);
        assert.strictEqual(dependencies[0].position.lineEnd, 0);
    });

    test('extracts aliased use statements without the alias', async () => {
        const document = createDocument({
            language: 'php',
            content: `use App\\Domain\\User\\UserStatus as DomainUserStatus;`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/app/domain/user/userstatus/');
    });

    test('extracts function and const use statements', async () => {
        const document = createDocument({
            language: 'php',
            content: `use function App\\Domain\\User\\normalize_user_name;
use const App\\Domain\\User\\DEFAULT_STATUS;`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 2);
        assert.strictEqual(dependencies[0].path, '/app/domain/user/normalize_user_name/');
        assert.strictEqual(dependencies[1].path, '/app/domain/user/default_status/');
    });

    test('extracts grouped use statements as normalized paths', async () => {
        const document = createDocument({
            language: 'php',
            content: `use App\\Domain\\User\\{UserEmail, UserName};`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 2);
        assert.strictEqual(dependencies[0].path, '/app/domain/user/useremail/');
        assert.strictEqual(dependencies[1].path, '/app/domain/user/username/');
    });

    test('extracts grouped aliased use statements without aliases', async () => {
        const document = createDocument({
            language: 'php',
            content: `use App\\Domain\\User\\{UserEmail as Email, UserName};`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 2);
        assert.strictEqual(dependencies[0].path, '/app/domain/user/useremail/');
        assert.strictEqual(dependencies[1].path, '/app/domain/user/username/');
    });

    test('ignores namespace declarations', async () => {
        const document = createDocument({
            language: 'php',
            content: `namespace App\\Domain\\User;`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 0);
    });

    test('extracts use ranges from the use statement only', async () => {
        const document = createDocument({
            language: 'php',
            content: `<?php

namespace App\\Domain\\User;

use App\\Application\\UseCases\\CreateUser;

final class User {}`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/app/application/usecases/createuser/');
        assert.strictEqual(dependencies[0].position.lineStart, 4);
        assert.strictEqual(dependencies[0].position.lineEnd, 4);
    });
});
