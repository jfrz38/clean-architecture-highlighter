import * as assert from 'assert';
import { createDocument } from '../support/create-document';
import { JavaDependencyExtractor } from '../../src/clean-architecture/sources/dependencies/extractors/java-dependency-extractor';

suite('JavaDependencyExtractor', () => {
    const extractor = new JavaDependencyExtractor();

    test('extracts import statements as normalized paths', async () => {
        const document = createDocument({
            language: 'java',
            content: `import com.example.infrastructure.persistence.SqlUserRepository;`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/com/example/infrastructure/persistence/SqlUserRepository/');
        assert.strictEqual(dependencies[0].position.lineStart, 0);
        assert.strictEqual(dependencies[0].position.lineEnd, 0);
    });

    test('extracts static import statements as normalized paths', async () => {
        const document = createDocument({
            language: 'java',
            content: `import static com.example.domain.user.UserStatus.ACTIVE;`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/com/example/domain/user/UserStatus/ACTIVE/');
    });

    test('extracts wildcard import statements as normalized paths', async () => {
        const document = createDocument({
            language: 'java',
            content: `import com.example.domain.user.*;`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/com/example/domain/user/*/');
    });

    test('ignores package declarations', async () => {
        const document = createDocument({
            language: 'java',
            content: `package com.example.domain.user;`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 0);
    });

    test('extracts import ranges from the import statement only', async () => {
        const document = createDocument({
            language: 'java',
            content: `package com.example.domain.user;

import com.example.application.usecases.CreateUser;

public class User {}`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/com/example/application/usecases/CreateUser/');
        assert.strictEqual(dependencies[0].position.lineStart, 2);
        assert.strictEqual(dependencies[0].position.lineEnd, 2);
    });
});
