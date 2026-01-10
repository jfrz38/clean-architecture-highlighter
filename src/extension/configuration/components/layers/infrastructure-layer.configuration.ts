import { Layer } from "../../types.configuration";
import { AllowedLayerDependencies } from "./allowed-dependencies/allowed-layer-dependencies";
import { LayerComponent } from "./layer-component";

export class InfrastructureLayerConfiguration extends LayerComponent {

    public static DEFAULT_INFRASTRUCTURE_LAYER = LayerComponent.DEFAULT_LAYERS.infrastructure;

    constructor(layer?: Partial<Layer>) {
        super(
            layer?.aliases ?? InfrastructureLayerConfiguration.DEFAULT_INFRASTRUCTURE_LAYER.aliases,
            new AllowedLayerDependencies(
                InfrastructureLayerConfiguration.DEFAULT_INFRASTRUCTURE_LAYER.allowedDependencies,
                layer?.aliases
            )
        );
    }
}
