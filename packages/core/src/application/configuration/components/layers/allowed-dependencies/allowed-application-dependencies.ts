import { ApplicationLayerConfiguration } from "../application-layer.configuration";
import { AllowedLayerDependencies } from "./allowed-layer-dependencies";

export class AllowedApplicationDependencies extends AllowedLayerDependencies {

    constructor(readonly overrides: string[]) {
        super(ApplicationLayerConfiguration.DEFAULT_APPLICATION_LAYER.allowedDependencies, overrides);
    }
}
