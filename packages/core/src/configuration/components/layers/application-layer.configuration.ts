import { Layer } from "../../types.configuration";
import { AllowedLayerDependencies } from "./allowed-dependencies/allowed-layer-dependencies";
import { LayerComponent } from "./layer-component";

export class ApplicationLayerConfiguration extends LayerComponent {

    public static DEFAULT_APPLICATION_LAYER = LayerComponent.DEFAULT_LAYERS.application;

    constructor(layer?: Partial<Layer>) {
        super(
            layer?.aliases ?? ApplicationLayerConfiguration.DEFAULT_APPLICATION_LAYER.aliases,
            new AllowedLayerDependencies(
                ApplicationLayerConfiguration.DEFAULT_APPLICATION_LAYER.allowedDependencies,
                layer?.allowedDependencies
            )
        );
    }
}
