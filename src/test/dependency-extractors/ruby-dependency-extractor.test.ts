import * as assert from 'assert';
import * as vscode from 'vscode';
import { RubyDependencyExtractor } from '../../extension/clean-architecture/sources/dependencies/extractors/ruby-dependency-extractor';

suite('RubyDependencyExtractor', () => {
    const extractor = new RubyDependencyExtractor();

    test('extracts double-quoted require statements as normalized paths', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'ruby',
            content: `require "infrastructure/persistence/sql_user_repository"`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/infrastructure/persistence/sql_user_repository/');
        assert.strictEqual(dependencies[0].position.lineStart, 0);
        assert.strictEqual(dependencies[0].position.lineEnd, 0);
    });

    test('extracts single-quoted require statements as normalized paths', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'ruby',
            content: `require 'application/use_cases/create_user'`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/application/use_cases/create_user/');
    });

    test('extracts double-quoted require_relative statements as normalized paths', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'ruby',
            content: `require_relative "../../domain/user"`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/../../domain/user/');
    });

    test('extracts single-quoted require_relative statements as normalized paths', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'ruby',
            content: `require_relative '../ports/user_repository'`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/../ports/user_repository/');
    });

    test('extracts parenthesized require statements as normalized paths', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'ruby',
            content: `require("domain/user")`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/domain/user/');
    });

    test('extracts require ranges from the require statement only', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'ruby',
            content: `module Domain
  require "application/use_cases/create_user"
end`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/application/use_cases/create_user/');
        assert.strictEqual(dependencies[0].position.lineStart, 1);
        assert.strictEqual(dependencies[0].position.lineEnd, 1);
    });

    test('ignores Ruby constant references without require statements', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'ruby',
            content: `Infrastructure::Persistence::SqlUserRepository.new`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 0);
    });
});
