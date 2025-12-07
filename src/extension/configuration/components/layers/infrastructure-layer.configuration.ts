import { Layer } from "../../types.configuration";
import { LayerComponent } from "../layer-component";

export class InfrastructureLayerConfiguration extends LayerComponent {

    public static DEFAULT_INFRASTRUCTURE_LAYER = LayerComponent.DEFAULT_LAYERS.infrastructure;

    constructor(layer?: Partial<Layer>) {
        super(
            layer?.aliases ?? InfrastructureLayerConfiguration.DEFAULT_INFRASTRUCTURE_LAYER.aliases,
            layer?.allowedDependencies ?? InfrastructureLayerConfiguration.DEFAULT_INFRASTRUCTURE_LAYER.allowedDependencies
        );
    }
}
