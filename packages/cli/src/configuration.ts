import { readFileSync } from 'node:fs';
import {
    AllowedDependenciesConfiguration,
    AllowedDependencies,
    ConfigurationOptions,
    DefaultConfiguration,
    Layers,
    SeverityLevel
} from '@jfrz38/clean-architecture-highlighter-core';

export type CliConfigurationInput = {
    layers?: Partial<Layers>;
    severityLevel?: SeverityLevel;
    sourceFolder?: string;
    enabledLanguages?: string[];
};

export class CliConfiguration {

    private readonly fileConfiguration: CliConfigurationInput;

    constructor(private readonly options: { configPath?: string; sourceFolder?: string }) {
        this.fileConfiguration = this.options.configPath ? this.readConfigurationFile(this.options.configPath) : {};
    }

    public get config(): ConfigurationOptions {
        return new DefaultConfiguration(
            this.fileConfiguration.layers ?? {},
            this.fileConfiguration.severityLevel,
            this.options.sourceFolder ?? this.fileConfiguration.sourceFolder,
            this.fileConfiguration.enabledLanguages
        ).config;
    }

    public get allowedDependencies(): AllowedDependencies {
        return new AllowedDependenciesConfiguration(this.config).allowedDependencies;
    }

    private readConfigurationFile(path: string): CliConfigurationInput {
        return JSON.parse(readFileSync(path, 'utf8')) as CliConfigurationInput;
    }
}
