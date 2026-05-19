import * as assert from 'assert';
import * as vscode from 'vscode';
import { GoDependencyExtractor } from '../../extension/clean-architecture/sources/dependencies/extractors/go-dependency-extractor';

suite('GoDependencyExtractor', () => {
    const extractor = new GoDependencyExtractor();

    test('extracts single-line import statements as normalized paths', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'go',
            content: `import "github.com/example/project/domain/user"`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/github.com/example/project/domain/user/');
        assert.strictEqual(dependencies[0].position.lineStart, 0);
        assert.strictEqual(dependencies[0].position.lineEnd, 0);
    });

    test('extracts aliased import statements as normalized paths without the alias', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'go',
            content: `import ports "github.com/example/project/application/ports"`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/github.com/example/project/application/ports/');
    });

    test('extracts dot and blank import statements as normalized paths', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'go',
            content: `import . "github.com/example/project/domain/shared"
import _ "github.com/example/project/infrastructure/drivers/postgres"`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 2);
        assert.strictEqual(dependencies[0].path, '/github.com/example/project/domain/shared/');
        assert.strictEqual(dependencies[1].path, '/github.com/example/project/infrastructure/drivers/postgres/');
    });

    test('extracts import block entries as normalized paths', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'go',
            content: `import (
    "context"
    "github.com/example/project/domain/user"
    ports "github.com/example/project/application/ports"
    "github.com/example/project/infrastructure/persistence"
    . "github.com/example/project/domain/shared"
    _ "github.com/example/project/infrastructure/drivers/postgres"
)`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 6);
        assert.strictEqual(dependencies[0].path, '/context/');
        assert.strictEqual(dependencies[1].path, '/github.com/example/project/domain/user/');
        assert.strictEqual(dependencies[2].path, '/github.com/example/project/application/ports/');
        assert.strictEqual(dependencies[3].path, '/github.com/example/project/infrastructure/persistence/');
        assert.strictEqual(dependencies[4].path, '/github.com/example/project/domain/shared/');
        assert.strictEqual(dependencies[5].path, '/github.com/example/project/infrastructure/drivers/postgres/');
    });

    test('ignores package declarations', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'go',
            content: `package usecases`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 0);
    });

    test('extracts import ranges from the import statement only', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'go',
            content: `package user

import "github.com/example/project/application/usecases"

type User struct{}`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/github.com/example/project/application/usecases/');
        assert.strictEqual(dependencies[0].position.lineStart, 2);
        assert.strictEqual(dependencies[0].position.lineEnd, 2);
    });

    test('extracts import block ranges from each entry only', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'go',
            content: `package user

import (
    "github.com/example/project/domain/user"
    "github.com/example/project/application/usecases"
)

type User struct{}`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 2);
        assert.strictEqual(dependencies[0].position.lineStart, 3);
        assert.strictEqual(dependencies[0].position.lineEnd, 3);
        assert.strictEqual(dependencies[1].position.lineStart, 4);
        assert.strictEqual(dependencies[1].position.lineEnd, 4);
    });
});
