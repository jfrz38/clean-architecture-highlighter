import * as assert from 'node:assert';
import * as path from 'node:path';
import { suite, test } from 'mocha';
import { DependencySpecifier } from '../../../src/domain/dependency-specifier';

suite('DependencySpecifier', () => {
    test('creates a dependency specifier from string values', () => {
        const specifier = DependencySpecifier.from('../domain/user', true);

        assert.ok(specifier);
        assert.strictEqual(specifier.value, '../domain/user');
        assert.strictEqual(specifier.isTypeOnly, true);
    });

    test('ignores non-string values', () => {
        assert.strictEqual(DependencySpecifier.from(undefined, false), undefined);
        assert.strictEqual(DependencySpecifier.from(42, false), undefined);
    });

    test('identifies package specifiers as external dependencies', () => {
        const specifier = DependencySpecifier.from('@company/package', false);

        assert.ok(specifier);
        assert.strictEqual(specifier.isExternal(), true);
    });

    test('identifies relative specifiers as internal dependencies', () => {
        const specifier = DependencySpecifier.from('../infrastructure/repository', false);

        assert.ok(specifier);
        assert.strictEqual(specifier.isExternal(), false);
    });

    test('identifies absolute specifiers as internal dependencies', () => {
        const specifier = DependencySpecifier.from(path.resolve('/project/src/infrastructure/repository'), false);

        assert.ok(specifier);
        assert.strictEqual(specifier.isExternal(), false);
    });
});
