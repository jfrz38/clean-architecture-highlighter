import * as assert from 'node:assert';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ESLint } from 'eslint';
import { suite, test } from 'mocha';
import typescriptEslint from 'typescript-eslint';
import cleanArchitecturePlugin from '../../src';

suite('ESLint plugin integration', () => {
    test('runs with flat config against a JavaScript project', async () => {
        const project = createProject();

        try {
            const eslint = new ESLint({
                cwd: project.root,
                overrideConfigFile: true,
                overrideConfig: [{
                    files: ['**/*.js'],
                    plugins: {
                        'clean-architecture-highlighter': cleanArchitecturePlugin
                    },
                    languageOptions: {
                        ecmaVersion: 2022,
                        sourceType: 'module'
                    },
                    rules: {
                        'clean-architecture-highlighter/no-layer-violation': ['warn', {
                            sourceFolder: 'src'
                        }]
                    }
                }]
            });

            const results = await eslint.lintFiles(['src/**/*.js']);
            const messages = results.flatMap(result => result.messages.map(message => message.message));

            assert.deepStrictEqual(messages, [
                'domain layer should not depend on infrastructure layer.'
            ]);
        } finally {
            rmSync(project.root, { recursive: true, force: true });
        }
    });

    test('runs with flat config against a TypeScript project', async () => {
        const project = createProject('ts');

        try {
            const eslint = new ESLint({
                cwd: project.root,
                overrideConfigFile: true,
                overrideConfig: [{
                    files: ['**/*.ts'],
                    plugins: {
                        'clean-architecture-highlighter': cleanArchitecturePlugin
                    },
                    languageOptions: {
                        parser: typescriptEslint.parser,
                        ecmaVersion: 2022,
                        sourceType: 'module'
                    },
                    rules: {
                        'clean-architecture-highlighter/no-layer-violation': ['warn', {
                            sourceFolder: 'src',
                            ignoreTypeImports: false
                        }]
                    }
                }]
            });

            const results = await eslint.lintFiles(['src/**/*.ts']);
            const messages = results.flatMap(result => result.messages.map(message => message.message));

            assert.deepStrictEqual(messages, [
                'domain layer should not depend on infrastructure layer.'
            ]);
        } finally {
            rmSync(project.root, { recursive: true, force: true });
        }
    });
});

function createProject(extension = 'js'): { root: string } {
    const root = mkdtempSync(join(tmpdir(), 'clean-arch-eslint-plugin-'));
    const domainDirectory = join(root, 'src', 'domain');
    const applicationDirectory = join(root, 'src', 'application');
    const infrastructureDirectory = join(root, 'src', 'infrastructure');

    mkdirSync(domainDirectory, { recursive: true });
    mkdirSync(applicationDirectory, { recursive: true });
    mkdirSync(infrastructureDirectory, { recursive: true });
    writeFileSync(join(root, 'src', 'domain', `user.${extension}`), "import { Repository } from '../infrastructure/repository';\n", 'utf8');
    writeFileSync(join(root, 'src', 'application', `use-case.${extension}`), "import { User } from '../domain/user';\n", 'utf8');
    writeFileSync(join(root, 'src', 'infrastructure', `repository.${extension}`), 'export class Repository {}\n', 'utf8');

    return { root };
}
