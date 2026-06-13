import * as assert from 'node:assert';
import { suite, test } from 'mocha';
import type { DependencyPolicy, LayerClassifier } from '../../../src/application/architecture-boundaries';
import { NoLayerViolationChecker } from '../../../src/application/no-layer-violation-checker';
import { DependencyPathResolver } from '../../../src/domain/dependency-path-resolver';
import { DependencySpecifier } from '../../../src/domain/dependency-specifier';
import type { LayerName } from '../../../src/domain/layer-name';

suite('NoLayerViolationChecker', () => {
    test('ignores type-only dependencies when configured', () => {
        const checker = createChecker({ ignoreTypeImports: true });

        assert.strictEqual(checker.check(specifier('../infrastructure/repository', true)), undefined);
    });

    test('ignores external dependencies when configured', () => {
        const checker = createChecker({ ignoreExternalDependencies: true });

        assert.strictEqual(checker.check(specifier('react', false)), undefined);
    });

    test('ignores dependencies outside known layers', () => {
        const checker = createChecker({ targetLayer: undefined });

        assert.strictEqual(checker.check(specifier('../shared/logger', false)), undefined);
    });

    test('ignores allowed layer dependencies', () => {
        const checker = createChecker({ isAllowed: true, targetLayer: 'domain' });

        assert.strictEqual(checker.check(specifier('../domain/user', false)), undefined);
    });

    test('returns a layer violation when dependency is forbidden', () => {
        const checker = createChecker({ isAllowed: false, targetLayer: 'infrastructure' });

        assert.deepStrictEqual(checker.check(specifier('../infrastructure/repository', false)), {
            fromLayer: 'domain',
            toLayer: 'infrastructure'
        });
    });

    test('checks external-looking dependencies when configured', () => {
        const checker = createChecker({ ignoreExternalDependencies: false, targetLayer: 'infrastructure' });

        assert.deepStrictEqual(checker.check(specifier('@company/infrastructure/repository', false)), {
            fromLayer: 'domain',
            toLayer: 'infrastructure'
        });
    });
});

function createChecker(options: {
    targetLayer?: LayerName;
    isAllowed?: boolean;
    ignoreTypeImports?: boolean;
    ignoreExternalDependencies?: boolean;
} = {}): NoLayerViolationChecker {
    const layerClassifier: LayerClassifier = {
        getLayer: () => Object.hasOwn(options, 'targetLayer') ? options.targetLayer : 'infrastructure'
    };
    const dependencyPolicy: DependencyPolicy = {
        isAllowed: () => options.isAllowed ?? false
    };

    return new NoLayerViolationChecker(
        'domain',
        layerClassifier,
        dependencyPolicy,
        new DependencyPathResolver('/project/src/domain/user.ts'),
        options.ignoreTypeImports ?? false,
        options.ignoreExternalDependencies ?? true
    );
}

function specifier(value: string, isTypeOnly: boolean): DependencySpecifier {
    const dependencySpecifier = DependencySpecifier.from(value, isTypeOnly);

    assert.ok(dependencySpecifier);

    return dependencySpecifier;
}
