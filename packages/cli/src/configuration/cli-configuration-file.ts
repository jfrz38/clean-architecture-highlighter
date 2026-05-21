import { readFileSync } from 'node:fs';
import { CliConfigurationValues } from './cli-configuration-values';

export class CliConfigurationFile {

    public static empty(): CliConfigurationFile {
        return new CliConfigurationFile(CliConfigurationValues.empty());
    }

    public static fromPath(path: string): CliConfigurationFile {
        return new CliConfigurationFile(CliConfigurationValues.fromJson(JSON.parse(readFileSync(path, 'utf8'))));
    }

    constructor(private readonly values: CliConfigurationValues) { }

    public get layers() {
        return this.values.layers;
    }

    public get severityLevel() {
        return this.values.severityLevel;
    }

    public get sourceFolder() {
        return this.values.sourceFolder;
    }

    public get enabledLanguages() {
        return this.values.enabledLanguages;
    }
}
