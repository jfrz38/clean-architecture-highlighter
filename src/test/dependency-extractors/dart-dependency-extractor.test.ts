import * as assert from 'assert';
import * as vscode from 'vscode';
import { DartDependencyExtractor } from '../../extension/clean-architecture/sources/dependencies/extractors/dart-dependency-extractor';

suite('DartDependencyExtractor', () => {
    const extractor = new DartDependencyExtractor();

    test('extracts package import directives as normalized paths', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'dart',
            content: `import 'package:example/infrastructure/persistence/sql_user_repository.dart';`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/infrastructure/persistence/sql_user_repository.dart/');
        assert.strictEqual(dependencies[0].position.lineStart, 0);
        assert.strictEqual(dependencies[0].position.lineEnd, 0);
    });

    test('extracts relative import directives as normalized paths', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'dart',
            content: `import '../../domain/user/user.dart';`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/../../domain/user/user.dart/');
    });

    test('extracts aliased import directives without the alias', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'dart',
            content: `import 'package:example/domain/user/user.dart' as domain;`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/domain/user/user.dart/');
    });

    test('extracts show and hide combinator imports', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'dart',
            content: `import 'package:example/domain/user/user_status.dart' show UserStatus;
import 'package:example/domain/user/legacy_user.dart' hide LegacyUserMapper;`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 2);
        assert.strictEqual(dependencies[0].path, '/domain/user/user_status.dart/');
        assert.strictEqual(dependencies[1].path, '/domain/user/legacy_user.dart/');
    });

    test('extracts export and part directives', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'dart',
            content: `export 'package:example/domain/user/user.dart';
part 'user.g.dart';`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 2);
        assert.strictEqual(dependencies[0].path, '/domain/user/user.dart/');
        assert.strictEqual(dependencies[1].path, '/user.g.dart/');
    });

    test('extracts annotated directives', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'dart',
            content: `@Deprecated('use other import')
import 'package:example/application/use_cases/create_user.dart';`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/application/use_cases/create_user.dart/');
    });

    test('extracts directive ranges from the directive only', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'dart',
            content: `class UserId {}
import 'package:example/application/use_cases/create_user.dart';
class User {}`
        });

        const dependencies = extractor.extract(document);

        assert.strictEqual(dependencies.length, 1);
        assert.strictEqual(dependencies[0].path, '/application/use_cases/create_user.dart/');
        assert.strictEqual(dependencies[0].position.lineStart, 1);
        assert.strictEqual(dependencies[0].position.lineEnd, 1);
    });
});
