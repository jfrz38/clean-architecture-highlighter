import * as assert from 'node:assert';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { suite, test } from 'mocha';
import { Check } from '../src/check';
import { CheckInput } from '../src/check-input';
import { ViolationFormatter } from '../src/format';

suite('CLI check', () => {
    test('returns violations for invalid dependencies', () => {
        const projectPath = createProject({
            'src/application/use-case.ts': "import { Repository } from '../infrastructure/repository';\n",
            'src/infrastructure/repository.ts': 'export class Repository {}\n'
        });

        try {
            const violations = new Check(new CheckInput({ path: projectPath })).violations;

            assert.strictEqual(violations.length, 1);
            assert.strictEqual(violations[0].filePath, 'src/application/use-case.ts');
            assert.strictEqual(violations[0].line, 1);
            assert.strictEqual(violations[0].character, 1);
            assert.strictEqual(violations[0].message, 'application layer should not depend on infrastructure layer.');
        } finally {
            rmSync(projectPath, { recursive: true, force: true });
        }
    });

    test('returns no violations for valid dependencies', () => {
        const projectPath = createProject({
            'src/application/use-case.ts': "import { Entity } from '../domain/entity';\n",
            'src/domain/entity.ts': 'export class Entity {}\n'
        });

        try {
            const violations = new Check(new CheckInput({ path: projectPath })).violations;

            assert.deepStrictEqual(violations, []);
        } finally {
            rmSync(projectPath, { recursive: true, force: true });
        }
    });

    test('returns file paths relative to the checked source folder', () => {
        const projectPath = createProject({
            'src/application/use-case.ts': "import { Repository } from '../infrastructure/repository';\n",
            'src/infrastructure/repository.ts': 'export class Repository {}\n'
        });

        try {
            const violations = new Check(new CheckInput({ path: join(projectPath, 'src') })).violations;

            assert.strictEqual(violations.length, 1);
            assert.strictEqual(violations[0].filePath, 'application/use-case.ts');
        } finally {
            rmSync(projectPath, { recursive: true, force: true });
        }
    });

    test('formats violations as text', () => {
        const output = new ViolationFormatter([{
            filePath: 'src/application/use-case.ts',
            line: 1,
            character: 1,
            message: 'application layer should not depend on infrastructure layer.'
        }], 'text').output;

        assert.strictEqual(output, 'src/application/use-case.ts:1:1 application layer should not depend on infrastructure layer.');
    });

    test('formats violations as json', () => {
        const output = new ViolationFormatter([{
            filePath: 'src/application/use-case.ts',
            line: 1,
            character: 1,
            message: 'application layer should not depend on infrastructure layer.'
        }], 'json').output;

        assert.match(output, /"filePath": "src\/application\/use-case\.ts"/);
    });
});

function createProject(files: Record<string, string>): string {
    const projectPath = mkdtempSync(join(tmpdir(), 'clean-architecture-highlighter-cli-'));

    for (const [filePath, content] of Object.entries(files)) {
        const absoluteFilePath = join(projectPath, filePath);
        mkdirSync(dirname(absoluteFilePath), { recursive: true });
        writeFileSync(absoluteFilePath, content);
    }

    return projectPath;
}
