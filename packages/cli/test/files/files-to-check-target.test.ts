import * as assert from 'node:assert';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { suite, test } from 'mocha';
import { FilesToCheckTarget } from '../../src/files/files-to-check-target';

suite('FilesToCheckTarget', () => {
    const rootPath = resolve(process.cwd(), 'out/test-files-to-check-target');

    test('uses source folder inside a project path', () => {
        const projectPath = join(rootPath, 'project');
        const sourcePath = join(projectPath, 'src');
        recreateDirectory(sourcePath);

        const target = FilesToCheckTarget.fromPath(projectPath, 'src');

        assert.strictEqual(target.projectRoot, projectPath);
        assert.strictEqual(target.outputRoot, projectPath);
        assert.strictEqual(target.sourcePath, sourcePath);
    });

    test('uses input path when it is the source folder', () => {
        const sourcePath = join(rootPath, 'source-folder', 'src');
        recreateDirectory(sourcePath);

        const target = FilesToCheckTarget.fromPath(sourcePath, 'src');

        assert.strictEqual(target.projectRoot, join(rootPath, 'source-folder'));
        assert.strictEqual(target.outputRoot, sourcePath);
        assert.strictEqual(target.sourcePath, sourcePath);
    });

    test('uses input path when it is a file', () => {
        const sourcePath = join(rootPath, 'single-file', 'src');
        recreateDirectory(sourcePath);
        const filePath = join(sourcePath, 'application.ts');
        writeFileSync(filePath, 'export class Application {}');

        const target = FilesToCheckTarget.fromPath(filePath, 'src');

        assert.strictEqual(target.projectRoot, join(rootPath, 'single-file'));
        assert.strictEqual(target.outputRoot, sourcePath);
        assert.strictEqual(target.sourcePath, filePath);
        assert.strictEqual(target.filePath, filePath);
    });

    test('rejects project path without configured source folder', () => {
        const projectPath = join(rootPath, 'project-without-src');
        recreateDirectory(projectPath);

        assert.throws(
            () => FilesToCheckTarget.fromPath(projectPath, 'src'),
            /Source folder 'src' was not found/
        );
    });
});

function recreateDirectory(path: string): void {
    rmSync(path, { recursive: true, force: true });
    mkdirSync(path, { recursive: true });
}
