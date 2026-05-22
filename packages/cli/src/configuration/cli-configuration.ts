import {
    AllowedDependenciesConfiguration,
    AllowedDependencies,
    ConfigurationOptions,
    DefaultConfiguration
} from '@jfrz38/clean-architecture-highlighter-core';
import { CliConfigurationFile } from './cli-configuration-file';
import { CliConfigurationSource } from './cli-configuration-source';

export class CliConfiguration {

    private readonly fileConfiguration: CliConfigurationFile;

    constructor(private readonly source: CliConfigurationSource) {
        this.fileConfiguration = this.source.fileConfiguration;
    }

    public get config(): ConfigurationOptions {
        return new DefaultConfiguration(
            this.fileConfiguration.layers ?? {},
            this.fileConfiguration.severityLevel,
            this.source.sourceFolder ?? this.fileConfiguration.sourceFolder,
            this.source.enabledLanguages ?? this.fileConfiguration.enabledLanguages
        ).config;
    }

    public get allowedDependencies(): AllowedDependencies {
        return new AllowedDependenciesConfiguration(this.config).allowedDependencies;
    }
}
