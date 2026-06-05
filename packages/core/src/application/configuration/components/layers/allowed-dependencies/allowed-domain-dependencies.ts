import { DomainLayerConfiguration } from "../domain-layer.configuration";
import { AllowedLayerDependencies } from "./allowed-layer-dependencies";

export class AllowedDomainDependencies extends AllowedLayerDependencies {
    
    constructor(readonly overrides: string[]) {
        super(DomainLayerConfiguration.DEFAULT_DOMAIN_LAYER.allowedDependencies, overrides);
    }
}
