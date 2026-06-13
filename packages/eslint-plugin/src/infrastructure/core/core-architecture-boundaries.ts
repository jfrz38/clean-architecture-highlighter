import {
    AllowedDependenciesConfiguration,
    ConfigurationOptions,
    LayerAlias
} from '@jfrz38/clean-architecture-highlighter-core';
import type { DependencyPolicy, LayerClassifier } from '../../application/architecture-boundaries';
import type { LayerName } from '../../domain/layer-name';

export class CoreArchitectureBoundaries implements LayerClassifier, DependencyPolicy {
    private readonly aliases: LayerAlias;
    private readonly allowedDependencies: AllowedDependenciesConfiguration['allowedDependencies'];

    constructor(config: ConfigurationOptions) {
        this.aliases = new LayerAlias(
            config.layers.domain.aliases,
            config.layers.application.aliases,
            config.layers.infrastructure.aliases
        );
        this.allowedDependencies = new AllowedDependenciesConfiguration(config).allowedDependencies;
    }

    public getLayer(path: string): LayerName | undefined {
        return this.aliases.getLayer(path) as LayerName | undefined;
    }

    public isAllowed(fromLayer: LayerName, toLayer: LayerName): boolean {
        return this.allowedDependencies.isAllowed(fromLayer, toLayer);
    }
}
