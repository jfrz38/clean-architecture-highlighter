import { Layer } from "../../types.configuration";
import { AllowedLayerDependencies } from "./allowed-dependencies/allowed-layer-dependencies";
import { LayerComponent } from "./layer-component";

export class DomainLayerConfiguration extends LayerComponent {

    public static DEFAULT_DOMAIN_LAYER = LayerComponent.DEFAULT_LAYERS.domain;

    constructor(layer?: Partial<Layer>) {
        super(
            layer?.aliases ?? DomainLayerConfiguration.DEFAULT_DOMAIN_LAYER.aliases,
            new AllowedLayerDependencies(
                DomainLayerConfiguration.DEFAULT_DOMAIN_LAYER.allowedDependencies,
                layer?.allowedDependencies
            )
        );
    }

}
