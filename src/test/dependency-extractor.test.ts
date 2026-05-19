import * as assert from 'assert';
import * as vscode from 'vscode';
import { EcmaScriptDependencyExtractor } from '../extension/clean-architecture/sources/dependencies/extractors/ecmascript-dependency-extractor';
import { PythonDependencyExtractor } from '../extension/clean-architecture/sources/dependencies/extractors/python-dependency-extractor';

suite('EcmaScriptDependencyExtractor', () => {
    const extractor = new EcmaScriptDependencyExtractor();

    test('extracts a single-line import path and range', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'typescript',
            content: `import { User } from '../domain/user';`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '../domain/user');
        assert.strictEqual(dependencies[0].position.lineStart, 0);
        assert.strictEqual(dependencies[0].position.lineEnd, 0);
    });

    test('extracts a multiline import path and range', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'typescript',
            content: `import {
    User,
    UserId
} from '../domain/user';`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '../domain/user');
        assert.strictEqual(dependencies[0].position.lineStart, 0);
        assert.strictEqual(dependencies[0].position.lineEnd, 3);
    });
});

suite('PythonDependencyExtractor', () => {
    const extractor = new PythonDependencyExtractor();

    test('extracts import statements as normalized paths', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'python',
            content: `import infrastructure.persistence.user_repository`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/infrastructure/persistence/user_repository/');
        assert.strictEqual(dependencies[0].position.lineStart, 0);
        assert.strictEqual(dependencies[0].position.lineEnd, 0);
    });

    test('extracts from-import statements as normalized paths', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'python',
            content: `from application.use_cases.create_user import CreateUser`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/application/use_cases/create_user/');
        assert.strictEqual(dependencies[0].position.lineStart, 0);
        assert.strictEqual(dependencies[0].position.lineEnd, 0);
    });

    test('extracts multiple import modules from the same statement', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'python',
            content: `import domain.user, application.create_user as create_user`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 2);
        assert.strictEqual(dependencies[0].path, '/domain/user/');
        assert.strictEqual(dependencies[1].path, '/application/create_user/');
    });
});
