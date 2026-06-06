import { InfrastructureLayerConfiguration } from "../infrastructure-layer.configuration";
import { AllowedLayerDependencies } from "./allowed-layer-dependencies";

export class AllowedInfrastructureDependencies extends AllowedLayerDependencies {
    
    constructor(readonly overrides: string[]) {
        super(InfrastructureLayerConfiguration.DEFAULT_INFRASTRUCTURE_LAYER.allowedDependencies, overrides);
    }
}
