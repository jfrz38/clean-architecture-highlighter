import * as assert from 'assert';
import { AllowedDependencies } from '../src/clean-architecture/restrictions/allowed-dependencies';
import { ExtractedDependency } from '../src/clean-architecture/sources/dependencies/extracted-dependency';
import { DependencyPosition } from '../src/clean-architecture/sources/dependencies/dependency-position';
import { LayerAlias } from '../src/clean-architecture/sources/layer/layer-alias';
import { SourceFile } from '../src/clean-architecture/sources/source-file';

suite('LayerAlias', () => {
    test('matches layer aliases without depending on path casing', () => {
        const aliases = new LayerAlias(['domain'], ['application'], ['infrastructure']);

        assert.strictEqual(aliases.getLayer('/workspace/src/Example.Domain/User/User.cs'), 'domain');
        assert.strictEqual(aliases.getLayer('/example/Infrastructure/Persistence/'), 'infrastructure');
    });

    test('allows C# dot-delimited project paths to produce layer violations', () => {
        const aliases = new LayerAlias(['domain'], ['application'], ['infrastructure']);
        const allowedDependencies = new AllowedDependencies(['domain'], ['domain', 'application'], ['domain', 'application', 'infrastructure']);
        const document = { uri: { path: '/workspace/languages/csharp/src/Example.Domain/User/User.cs' } } as any;
        const dependencies = [
            new ExtractedDependency('/example/infrastructure/persistence/', new DependencyPosition(2, 0, 2, 41)),
            new ExtractedDependency('/example/application/usecases/', new DependencyPosition(3, 0, 3, 35)),
            new ExtractedDependency('/example/domain/user/valueobjects/', new DependencyPosition(4, 0, 4, 40))
        ];

        const violations = new SourceFile(document, dependencies, allowedDependencies, aliases).violations;

        assert.strictEqual(violations.length, 2);
        assert.strictEqual(violations[0].message, 'domain layer should not depend on infrastructure layer.');
        assert.strictEqual(violations[1].message, 'domain layer should not depend on application layer.');
    });
});
