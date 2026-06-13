import * as assert from 'node:assert';
import * as path from 'node:path';
import { suite, test } from 'mocha';
import { DependencyPathResolver } from '../../../src/domain/dependency-path-resolver';

suite('DependencyPathResolver', () => {
    test('resolves relative dependencies from the source filename', () => {
        const sourceFilename = path.resolve('/project/src/domain/user.ts');
        const resolver = new DependencyPathResolver(sourceFilename);

        assert.strictEqual(
            resolver.resolve('../infrastructure/repository'),
            normalize(path.resolve('/project/src/infrastructure/repository'))
        );
    });

    test('normalizes absolute dependency paths', () => {
        const resolver = new DependencyPathResolver(path.resolve('/project/src/domain/user.ts'));

        assert.strictEqual(
            resolver.resolve(path.resolve('/project/src/application/use-case')),
            normalize(path.resolve('/project/src/application/use-case'))
        );
    });

    test('keeps external dependency specifiers unchanged', () => {
        const resolver = new DependencyPathResolver(path.resolve('/project/src/domain/user.ts'));

        assert.strictEqual(resolver.resolve('@company/infrastructure/repository'), '@company/infrastructure/repository');
    });
});

function normalize(value: string): string {
    return value.replace(/\\/g, '/');
}
