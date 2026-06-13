import type { DependencyPolicy, LayerClassifier } from './architecture-boundaries';
import { DependencyPathResolver } from '../domain/dependency-path-resolver';
import { DependencySpecifier } from '../domain/dependency-specifier';
import type { LayerName } from '../domain/layer-name';

export type LayerViolation = {
    fromLayer: LayerName;
    toLayer: LayerName;
};

export class NoLayerViolationChecker {
    constructor(
        private readonly sourceLayer: LayerName,
        private readonly layerClassifier: LayerClassifier,
        private readonly dependencyPolicy: DependencyPolicy,
        private readonly dependencyPathResolver: DependencyPathResolver,
        private readonly ignoreTypeImports: boolean,
        private readonly ignoreExternalDependencies: boolean
    ) { }

    public check(specifier: DependencySpecifier): LayerViolation | undefined {
        if (this.ignoreTypeImports && specifier.isTypeOnly) {
            return undefined;
        }

        if (this.ignoreExternalDependencies && specifier.isExternal()) {
            return undefined;
        }

        const resolvedDependency = this.dependencyPathResolver.resolve(specifier.value);
        const targetLayer = this.layerClassifier.getLayer(resolvedDependency);

        if (!targetLayer || this.dependencyPolicy.isAllowed(this.sourceLayer, targetLayer)) {
            return undefined;
        }

        return {
            fromLayer: this.sourceLayer,
            toLayer: targetLayer
        };
    }
}
