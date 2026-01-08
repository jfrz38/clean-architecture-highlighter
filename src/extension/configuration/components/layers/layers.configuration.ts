import { Layer, Layers } from "../../types.configuration";
import { ApplicationLayerConfiguration } from "./application-layer.configuration";
import { DomainLayerConfiguration } from "./domain-layer.configuration";
import { InfrastructureLayerConfiguration } from "./infrastructure-layer.configuration";

export class LayersConfiguration {

    private readonly domain: Layer;
    private readonly application: Layer;
    private readonly infrastructure: Layer;

    constructor(layers: Partial<Layers>) {
        this.domain = new DomainLayerConfiguration(layers.domain).config;
        this.application = new ApplicationLayerConfiguration(layers.application).config;
        this.infrastructure = new InfrastructureLayerConfiguration(layers.infrastructure).config;
    }

    public get config(): Layers {
        return {
            domain: this.domain,
            application: this.application,
            infrastructure: this.infrastructure
        };
    }
}
