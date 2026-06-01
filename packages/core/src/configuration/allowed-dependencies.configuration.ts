import { AllowedDependencies } from '../clean-architecture/restrictions/allowed-dependencies';
import { ConfigurationOptions } from './types.configuration';
import { AllowedApplicationDependencies } from './components/layers/allowed-dependencies/allowed-application-dependencies';
import { AllowedDomainDependencies } from './components/layers/allowed-dependencies/allowed-domain-dependencies';
import { AllowedInfrastructureDependencies } from './components/layers/allowed-dependencies/allowed-infrastructure-dependencies';

export class AllowedDependenciesConfiguration {

    public readonly allowedDependencies: AllowedDependencies;

    constructor(config: ConfigurationOptions) {
        this.allowedDependencies = new AllowedDependencies(
            new AllowedDomainDependencies(config.layers.domain.allowedDependencies).value,
            new AllowedApplicationDependencies(config.layers.application.allowedDependencies).value,
            new AllowedInfrastructureDependencies(config.layers.infrastructure.allowedDependencies).value
        );
    }
}
