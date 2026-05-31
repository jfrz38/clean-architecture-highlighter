export type ConfigurationOptions = {
    layers: Layers;
    sourceFolder?: SourceFolderPath;
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

export type SourceFolderPath = string;
export type EnabledLanguages = string[];

export type ConfigValue = SourceFolderPath | EnabledLanguages | Layers | Layer | undefined;
