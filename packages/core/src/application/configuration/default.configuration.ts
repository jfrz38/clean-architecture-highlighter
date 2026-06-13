import { LayersConfiguration } from "./components/layers/layers.configuration";
import { SourceFolderConfiguration } from "./components/source-folder/source-folder.configuration";
import { EnabledLanguagesConfiguration } from "./components/enabled-languages/enabled-languages.configuration";
import { ConfigurationOptions, EnabledLanguages, Layers, SourceFolderPath } from "./types.configuration";

export class DefaultConfiguration {

    public readonly config: ConfigurationOptions;

    public static get default(): ConfigurationOptions {
        return new DefaultConfiguration({}, undefined, undefined).config;
    }

    constructor(
        private readonly layers: Partial<Layers>,
        private readonly sourceFolder: SourceFolderPath | undefined,
        private readonly enabledLanguages: EnabledLanguages | undefined
    ) {
        const built: ConfigurationOptions = {
            layers: new LayersConfiguration(this.layers).config,
            sourceFolder: new SourceFolderConfiguration(this.sourceFolder).config,
            enabledLanguages: new EnabledLanguagesConfiguration(this.enabledLanguages).config
        };

        this.config = Object.freeze(built) as ConfigurationOptions;
    }
}

