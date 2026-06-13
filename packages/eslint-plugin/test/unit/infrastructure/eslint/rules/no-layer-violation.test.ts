import * as path from 'node:path';
import { RuleTester } from 'eslint';
import { suite, test } from 'mocha';
import typescriptEslint from 'typescript-eslint';
import { noLayerViolationRule } from '../../../../../src/infrastructure/eslint/rules/no-layer-violation';

RuleTester.describe = suite;
RuleTester.it = test;

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        parser: typescriptEslint.parser
    }
});

const projectRoot = path.resolve('/project');

ruleTester.run('no-layer-violation', noLayerViolationRule, {
    valid: [
        {
            name: 'allows configured dependencies',
            filename: filePath('src/application/use-case.ts'),
            code: "import { User } from '../domain/user';",
            options: [ruleOptions()]
        },
        {
            name: 'ignores unknown source layer',
            filename: filePath('src/shared/logger.ts'),
            code: "import { Repository } from '../infrastructure/repository';",
            options: [ruleOptions()]
        },
        {
            name: 'ignores unknown target layer',
            filename: filePath('src/domain/user.ts'),
            code: "import { Logger } from '../shared/logger';",
            options: [ruleOptions()]
        },
        {
            name: 'ignores external dependencies by default',
            filename: filePath('src/domain/user.ts'),
            code: "import React from 'react';",
            options: [ruleOptions()]
        },
        {
            name: 'ignores type imports when configured',
            filename: filePath('src/domain/user.ts'),
            code: "import type { Repository } from '../infrastructure/repository';",
            options: [ruleOptions({ ignoreTypeImports: true })]
        },
        {
            name: 'ignores files outside sourceFolder',
            filename: filePath('test/domain/user.test.ts'),
            code: "import { Repository } from '../../src/infrastructure/repository';",
            options: [ruleOptions()]
        }
    ],
    invalid: [
        {
            name: 'reports forbidden dependencies',
            filename: filePath('src/domain/user.ts'),
            code: "import { Repository } from '../infrastructure/repository';",
            options: [ruleOptions()],
            errors: [{
                message: 'domain layer should not depend on infrastructure layer.',
                line: 1,
                column: 28,
                endColumn: 58
            }]
        },
        {
            name: 'uses default configuration when options are omitted',
            filename: filePath('src/domain/user.ts'),
            code: "import { Repository } from '../infrastructure/repository';",
            errors: [{ message: 'domain layer should not depend on infrastructure layer.' }]
        },
        {
            name: 'checks external-looking dependencies when configured',
            filename: filePath('src/domain/user.ts'),
            code: "import { Repository } from '@company/infrastructure/repository';",
            options: [ruleOptions({ ignoreExternalDependencies: false })],
            errors: [{ message: 'domain layer should not depend on infrastructure layer.' }]
        },
        {
            name: 'reports type imports when not ignored',
            filename: filePath('src/domain/user.ts'),
            code: "import type { Repository } from '../infrastructure/repository';",
            options: [ruleOptions({ ignoreTypeImports: false })],
            errors: [{ message: 'domain layer should not depend on infrastructure layer.' }]
        },
        {
            name: 'reports export named declarations',
            filename: filePath('src/domain/user.ts'),
            code: "export { Repository } from '../infrastructure/repository';",
            options: [ruleOptions()],
            errors: [{ message: 'domain layer should not depend on infrastructure layer.' }]
        },
        {
            name: 'reports export all declarations',
            filename: filePath('src/domain/user.ts'),
            code: "export * from '../infrastructure/repository';",
            options: [ruleOptions()],
            errors: [{ message: 'domain layer should not depend on infrastructure layer.' }]
        },
        {
            name: 'reports dynamic imports with static specifiers',
            filename: filePath('src/domain/user.ts'),
            code: "async function load() { await import('../infrastructure/repository'); }",
            options: [ruleOptions()],
            errors: [{ message: 'domain layer should not depend on infrastructure layer.' }]
        },
        {
            name: 'reports static commonjs require calls',
            filename: filePath('src/domain/user.ts'),
            code: "const repository = require('../infrastructure/repository');",
            options: [ruleOptions()],
            languageOptions: {
                sourceType: 'commonjs'
            },
            errors: [{ message: 'domain layer should not depend on infrastructure layer.' }]
        }
    ]
});

function ruleOptions(overrides: Record<string, unknown> = {}): Record<string, unknown> {
    return {
        sourceFolder: 'src',
        layers: {
            domain: {
                aliases: ['domain'],
                allowedDependencies: ['domain']
            },
            application: {
                aliases: ['application'],
                allowedDependencies: ['domain', 'application']
            },
            infrastructure: {
                aliases: ['infrastructure'],
                allowedDependencies: ['domain', 'application', 'infrastructure']
            }
        },
        ...overrides
    };
}

function filePath(relativePath: string): string {
    return path.join(projectRoot, relativePath);
}
