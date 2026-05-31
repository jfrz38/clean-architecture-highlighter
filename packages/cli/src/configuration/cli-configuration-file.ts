import { readFileSync } from 'node:fs';
import { EnabledLanguagesValidator, UnsupportedLanguageError } from '@jfrz38/clean-architecture-highlighter-core';
import { CliLogger } from '../output/cli-logger';
import { CliConfigurationValues } from './cli-configuration-values';

export class CliConfigurationFile {

    public static empty(): CliConfigurationFile {
        return new CliConfigurationFile(CliConfigurationValues.empty());
    }

    public static fromPath(path: string, logger = CliLogger.silent): CliConfigurationFile {
        const values = CliConfigurationValues.fromJson(JSON.parse(readFileSync(path, 'utf8')));

        if (values.enabledLanguages) {
            CliConfigurationFile.warnUnsupportedLanguages(values.enabledLanguages, logger);
        }

        return new CliConfigurationFile(values);
    }

    constructor(private readonly values: CliConfigurationValues) { }

    public get layers() {
        return this.values.layers;
    }

    public get sourceFolder() {
        return this.values.sourceFolder;
    }

    public get enabledLanguages() {
        return this.values.enabledLanguages;
    }

    private static warnUnsupportedLanguages(languages: string[], logger: CliLogger): void {
        try {
            new EnabledLanguagesValidator().validate(languages);
        } catch (error) {
            if (error instanceof UnsupportedLanguageError) {
                logger.warn(error.message);
            }
        }
    }
}
