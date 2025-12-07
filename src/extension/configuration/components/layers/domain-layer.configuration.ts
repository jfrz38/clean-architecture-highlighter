import { Layer } from "../../types.configuration";
import { LayerComponent } from "../layer-component";

export class DomainLayerConfiguration extends LayerComponent {

    public static DEFAULT_DOMAIN_LAYER = LayerComponent.DEFAULT_LAYERS.domain;

    constructor(layer?: Partial<Layer>) {
        super(
            layer?.aliases ?? DomainLayerConfiguration.DEFAULT_DOMAIN_LAYER.aliases,
            layer?.allowedDependencies ?? DomainLayerConfiguration.DEFAULT_DOMAIN_LAYER.allowedDependencies
        );
    }

}
