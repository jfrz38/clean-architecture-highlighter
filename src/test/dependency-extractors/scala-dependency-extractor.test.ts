import * as assert from 'assert';
import * as vscode from 'vscode';
import { ScalaDependencyExtractor } from '../../extension/clean-architecture/sources/dependencies/extractors/scala-dependency-extractor';

suite('ScalaDependencyExtractor', () => {
    const extractor = new ScalaDependencyExtractor();

    test('extracts import statements as normalized paths', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'scala',
            content: `import com.example.infrastructure.persistence.SqlUserRepository`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/com/example/infrastructure/persistence/SqlUserRepository/');
        assert.strictEqual(dependencies[0].position.lineStart, 0);
        assert.strictEqual(dependencies[0].position.lineEnd, 0);
    });

    test('extracts wildcard import statements as normalized paths', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'scala',
            content: `import com.example.domain.user._`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/com/example/domain/user/*/');
    });

    test('extracts Scala 3 wildcard import statements as normalized paths', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'scala',
            content: `import com.example.domain.user.*`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/com/example/domain/user/*/');
    });

    test('extracts grouped import statements as normalized paths', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'scala',
            content: `import com.example.domain.user.{User, UserId}`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 2);
        assert.strictEqual(dependencies[0].path, '/com/example/domain/user/User/');
        assert.strictEqual(dependencies[1].path, '/com/example/domain/user/UserId/');
    });

    test('extracts aliased grouped import statements without the alias', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'scala',
            content: `import com.example.domain.user.{User => DomainUser}`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/com/example/domain/user/User/');
    });

    test('ignores excluded grouped import selectors', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'scala',
            content: `import com.example.domain.user.{LegacyUser => _}`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 0);
    });

    test('extracts static member import statements as normalized paths', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'scala',
            content: `import com.example.domain.user.UserStatus.ACTIVE`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/com/example/domain/user/UserStatus/ACTIVE/');
    });

    test('extracts import statements with underscore-prefixed identifiers', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'scala',
            content: `import com.example.domain.user._InternalUser`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/com/example/domain/user/_InternalUser/');
    });

    test('ignores package declarations', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'scala',
            content: `package com.example.domain.user`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 0);
    });

    test('extracts import ranges from the import statement only', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'scala',
            content: `package com.example.domain.user

import com.example.application.usecases.CreateUser

class User`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/com/example/application/usecases/CreateUser/');
        assert.strictEqual(dependencies[0].position.lineStart, 2);
        assert.strictEqual(dependencies[0].position.lineEnd, 2);
    });
});
