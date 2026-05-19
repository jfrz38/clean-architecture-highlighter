import * as assert from 'assert';
import * as vscode from 'vscode';
import { KotlinDependencyExtractor } from '../../extension/clean-architecture/sources/dependencies/extractors/kotlin-dependency-extractor';

suite('KotlinDependencyExtractor', () => {
    const extractor = new KotlinDependencyExtractor();

    test('extracts import statements as normalized paths', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'kotlin',
            content: `import com.example.infrastructure.persistence.SqlUserRepository`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/com/example/infrastructure/persistence/SqlUserRepository/');
        assert.strictEqual(dependencies[0].position.lineStart, 0);
        assert.strictEqual(dependencies[0].position.lineEnd, 0);
    });

    test('extracts aliased import statements as normalized paths without the alias', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'kotlin',
            content: `import com.example.domain.user.UserId as DomainUserId`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/com/example/domain/user/UserId/');
    });

    test('extracts wildcard import statements as normalized paths', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'kotlin',
            content: `import com.example.domain.user.*`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/com/example/domain/user/*/');
    });

    test('ignores package declarations', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'kotlin',
            content: `package com.example.domain.user`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 0);
    });

    test('extracts import ranges from the import statement only', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'kotlin',
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

    test('allows trailing line comments after imports', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'kotlin',
            content: `import com.example.domain.user.UserId // used by User`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/com/example/domain/user/UserId/');
    });
});
