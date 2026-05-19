import * as assert from 'assert';
import * as vscode from 'vscode';
import { LuaDependencyExtractor } from '../../extension/clean-architecture/sources/dependencies/extractors/lua-dependency-extractor';

suite('LuaDependencyExtractor', () => {
    const extractor = new LuaDependencyExtractor();

    test('extracts require calls as normalized paths', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'lua',
            content: `require("infrastructure.persistence.sql_user_repository")`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/infrastructure/persistence/sql_user_repository/');
        assert.strictEqual(dependencies[0].position.lineStart, 0);
        assert.strictEqual(dependencies[0].position.lineEnd, 0);
    });

    test('extracts single-quoted require calls as normalized paths', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'lua',
            content: `require 'domain.user_status'`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/domain/user_status/');
    });

    test('extracts local assignment require calls as normalized paths', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'lua',
            content: `local CreateUser = require("application.use_cases.create_user")`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/application/use_cases/create_user/');
    });

    test('allows trailing line comments', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'lua',
            content: `local User = require("domain.user") -- domain entity`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/domain/user/');
    });

    test('extracts require ranges from the require statement only', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'lua',
            content: `local id = "UserId"
local CreateUser = require("application.use_cases.create_user")
return id`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/application/use_cases/create_user/');
        assert.strictEqual(dependencies[0].position.lineStart, 1);
        assert.strictEqual(dependencies[0].position.lineEnd, 1);
    });
});
