import * as assert from 'assert';
import * as vscode from 'vscode';
import { GroovyDependencyExtractor } from '../../extension/clean-architecture/sources/dependencies/extractors/groovy-dependency-extractor';

suite('GroovyDependencyExtractor', () => {
    const extractor = new GroovyDependencyExtractor();

    test('extracts import statements as normalized paths', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'groovy',
            content: `import com.example.infrastructure.persistence.SqlUserRepository`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/com/example/infrastructure/persistence/SqlUserRepository/');
        assert.strictEqual(dependencies[0].position.lineStart, 0);
        assert.strictEqual(dependencies[0].position.lineEnd, 0);
    });

    test('extracts static import statements as normalized paths', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'groovy',
            content: `import static com.example.domain.user.UserStatus.ACTIVE`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/com/example/domain/user/UserStatus/ACTIVE/');
    });

    test('extracts wildcard import statements as normalized paths', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'groovy',
            content: `import com.example.domain.user.*`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/com/example/domain/user/*/');
    });

    test('extracts static wildcard import statements as normalized paths', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'groovy',
            content: `import static com.example.domain.user.UserStatus.*`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/com/example/domain/user/UserStatus/*/');
    });

    test('extracts aliased import statements without the alias', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'groovy',
            content: `import com.example.domain.user.User as DomainUser`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/com/example/domain/user/User/');
    });

    test('allows optional semicolons and trailing line comments', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'groovy',
            content: `import com.example.domain.user.UserId; // used by User`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/com/example/domain/user/UserId/');
    });

    test('ignores package declarations', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'groovy',
            content: `package com.example.domain.user`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 0);
    });

    test('extracts import ranges from the import statement only', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'groovy',
            content: `package com.example.domain.user

import com.example.application.usecases.CreateUser

class User {}`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/com/example/application/usecases/CreateUser/');
        assert.strictEqual(dependencies[0].position.lineStart, 2);
        assert.strictEqual(dependencies[0].position.lineEnd, 2);
    });
});
