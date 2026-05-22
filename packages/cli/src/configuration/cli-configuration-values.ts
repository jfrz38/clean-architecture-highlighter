import {
    ConfigurationOptions,
    EnabledLanguages,
    Layers,
    SourceFolder,
    SeverityLevel
} from '@jfrz38/clean-architecture-highlighter-core';

export class CliConfigurationValues {

    public static empty(): CliConfigurationValues {
        return new CliConfigurationValues({});
    }

    public static fromJson(json: unknown): CliConfigurationValues {
        return new CliConfigurationValues(json as Partial<ConfigurationOptions>);
    }

    private constructor(private readonly values: Partial<ConfigurationOptions>) { }

    public get layers(): Partial<Layers> {
        return this.values.layers ?? {};
    }

    public get severityLevel(): SeverityLevel | undefined {
        return this.values.severityLevel;
    }

    public get sourceFolder(): SourceFolder | undefined {
        return this.values.sourceFolder;
    }

    public get enabledLanguages(): EnabledLanguages | undefined {
        return this.values.enabledLanguages;
    }
}
