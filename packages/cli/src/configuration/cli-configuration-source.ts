import { EnabledLanguages, SourceFolder } from '@jfrz38/clean-architecture-highlighter-core';
import { CliConfigurationFile } from './cli-configuration-file';

export class CliConfigurationSource {

    public static fromOptions(
        configPath?: string,
        sourceFolder?: string,
        enabledLanguages?: EnabledLanguages
    ): CliConfigurationSource {
        return new CliConfigurationSource(
            configPath ? CliConfigurationFile.fromPath(configPath) : CliConfigurationFile.empty(),
            sourceFolder,
            enabledLanguages
        );
    }

    private constructor(
        public readonly fileConfiguration: CliConfigurationFile,
        public readonly sourceFolder?: SourceFolder,
        public readonly enabledLanguages?: EnabledLanguages
    ) { }
}
