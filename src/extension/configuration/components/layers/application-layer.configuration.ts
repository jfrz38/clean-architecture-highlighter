import { Layer } from "../../types.configuration";
import { LayerComponent } from "./layer-component";

export class ApplicationLayerConfiguration extends LayerComponent {

    public static DEFAULT_APPLICATION_LAYER = LayerComponent.DEFAULT_LAYERS.application;

    constructor(layer?: Partial<Layer>) {
        super(
            layer?.aliases ?? ApplicationLayerConfiguration.DEFAULT_APPLICATION_LAYER.aliases,
            layer?.allowedDependencies ?? ApplicationLayerConfiguration.DEFAULT_APPLICATION_LAYER.allowedDependencies
        );
    }
}
