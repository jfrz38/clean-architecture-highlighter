import { EnabledLanguages, SourceFolder } from '@jfrz38/clean-architecture-highlighter-core';
import { CliLogger } from '../output/cli-logger';
import { CliConfigurationFile } from './cli-configuration-file';

export class CliConfigurationSource {

    public static fromOptions(
        configPath?: string,
        sourceFolder?: string,
        enabledLanguages?: EnabledLanguages,
        logger = CliLogger.silent
    ): CliConfigurationSource {
        return new CliConfigurationSource(
            configPath ? CliConfigurationFile.fromPath(configPath, logger) : CliConfigurationFile.empty(),
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
