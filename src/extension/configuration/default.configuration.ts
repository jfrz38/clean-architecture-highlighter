import { LayersConfiguration } from "./components/layers/layers.configuration";
import { SeverityLevelConfiguration } from "./components/severity-level/severity-level.configuration";
import { SourceFolderConfiguration } from "./components/source-folder/source-folder.configuration";
import { ConfigurationOptions, Layers, SeverityLevel, SourceFolder } from "./types.configuration";

export class DefaultConfiguration {

    public readonly config: ConfigurationOptions;

    constructor(
        private readonly layers: Partial<Layers>,
        private readonly severityLevel: SeverityLevel | undefined,
        private readonly sourceFolder: SourceFolder | undefined
    ) {
        const built: ConfigurationOptions = {
            layers: new LayersConfiguration(this.layers).config,
            severityLevel: new SeverityLevelConfiguration(this.severityLevel).config,
            sourceFolder: new SourceFolderConfiguration(this.sourceFolder).config
        };

        this.config = Object.freeze(built) as ConfigurationOptions;
    }
}

