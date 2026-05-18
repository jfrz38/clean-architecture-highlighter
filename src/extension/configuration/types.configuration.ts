export type ConfigurationOptions = {
    layers: Layers;
    severityLevel: SeverityLevel;
    sourceFolder: SourceFolder;
    enabledLanguages: EnabledLanguages;
}

export type Layers = {
    domain: Layer;
    application: Layer;
    infrastructure: Layer;
};

export type Layer = {
    aliases: Aliases;
    allowedDependencies: AllowedDependencies;
};

export type Aliases = string[];
export type AllowedDependencies = string[];

export type SeverityLevel = 'warning' | 'error';
export type SourceFolder = string;
export type EnabledLanguages = string[];

export type ConfigValue = SeverityLevel | SourceFolder | EnabledLanguages | Layers | Layer;
