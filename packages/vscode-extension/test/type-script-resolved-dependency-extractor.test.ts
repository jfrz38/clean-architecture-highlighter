import * as assert from 'assert';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Document, DocumentPosition } from '@jfrz38/clean-architecture-highlighter-core';
import { TypeScriptResolvedDependencyExtractor } from '../src/type-script-resolved-dependency-extractor';

suite('TypeScriptResolvedDependencyExtractor', () => {
    test('resolves imports and exports using tsconfig baseUrl and paths', () => {
        const projectPath = createProject({
            'tsconfig.json': JSON.stringify({
                compilerOptions: {
                    baseUrl: './src',
                    paths: {
                        '@domain/*': ['domain/*']
                    }
                }
            }),
            'src/domain/user.ts': 'export class User {}',
            'src/application/service.ts': 'export class Service {}',
            'src/application/public-api.ts': 'export class PublicApi {}',
            'src/application/application.ts': 'export class Application {}',
            'src/domain/domain.ts': [
                "import { Service } from 'application/service';",
                "import type { User } from '@domain/user';",
                "export * from 'application/public-api';",
                "export { Application } from 'application/application';"
            ].join('\n')
        });
        const documentPath = path.join(projectPath, 'src/domain/domain.ts');
        const document = createDocument(documentPath, fs.readFileSync(documentPath, 'utf8'));

        const dependencies = new TypeScriptResolvedDependencyExtractor().extract(document);
        const dependencyPaths = dependencies.map(dependency => dependency.path.replace(/\\/g, '/'));

        assert.strictEqual(dependencies.length, 4);
        assert.ok(dependencyPaths.some(dependencyPath => dependencyPath.endsWith('/src/application/service.ts')));
        assert.ok(dependencyPaths.some(dependencyPath => dependencyPath.endsWith('/src/domain/user.ts')));
        assert.ok(dependencyPaths.some(dependencyPath => dependencyPath.endsWith('/src/application/public-api.ts')));
        assert.ok(dependencyPaths.some(dependencyPath => dependencyPath.endsWith('/src/application/application.ts')));
        assert.strictEqual(dependencies[0].position.lineStart, 0);
        assert.strictEqual(dependencies[2].position.lineStart, 2);
    });

    test('resolves JavaScript require and dynamic import with allowJs', () => {
        const projectPath = createProject({
            'tsconfig.json': JSON.stringify({
                compilerOptions: {
                    allowJs: true,
                    baseUrl: './src'
                }
            }),
            'src/infrastructure/repository.js': 'module.exports = {};',
            'src/domain/domain.js': [
                "const repository = require('infrastructure/repository');",
                "import('infrastructure/repository');"
            ].join('\n')
        });
        const documentPath = path.join(projectPath, 'src/domain/domain.js');
        const document = createDocument(documentPath, fs.readFileSync(documentPath, 'utf8'));

        const dependencies = new TypeScriptResolvedDependencyExtractor().extract(document);
        const dependencyPaths = dependencies.map(dependency => dependency.path.replace(/\\/g, '/'));

        assert.strictEqual(dependencies.length, 2);
        assert.ok(dependencyPaths.every(dependencyPath => dependencyPath.endsWith('/src/infrastructure/repository.js')));
    });
});

function createProject(files: Record<string, string>): string {
    const projectPath = fs.mkdtempSync(path.join(os.tmpdir(), 'cah-native-resolution-'));

    for (const [relativePath, content] of Object.entries(files)) {
        const filePath = path.join(projectPath, relativePath);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, content);
    }

    return projectPath;
}

function createDocument(filePath: string, content: string): Document {
    return {
        uri: { path: filePath, fsPath: filePath } as never,
        getText: () => content,
        positionAt: (offset: number) => positionAt(content, offset)
    };
}

function positionAt(text: string, offset: number): DocumentPosition {
    const beforeOffset = text.slice(0, offset);
    const lines = beforeOffset.split(/\r\n|\r|\n/);

    return {
        line: lines.length - 1,
        character: lines[lines.length - 1].length
    };
}
