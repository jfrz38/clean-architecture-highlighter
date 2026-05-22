import { resolve } from 'node:path';
import { EnabledLanguages } from '@jfrz38/clean-architecture-highlighter-core';
import { CliConfigurationSource } from '../configuration/cli-configuration-source';

export class CheckInputOptions {

    public static fromCli(
        path: string,
        configPath?: string,
        sourceFolder?: string,
        enabledLanguages?: EnabledLanguages
    ): CheckInputOptions {
        return new CheckInputOptions(path, configPath, sourceFolder, enabledLanguages);
    }

    private constructor(
        private readonly path: string,
        private readonly configPath?: string,
        private readonly sourceFolder?: string,
        private readonly enabledLanguages?: EnabledLanguages
    ) { }

    public get targetPath(): string {
        return this.resolveFromInitialCwd(this.path);
    }

    public get configurationSource(): CliConfigurationSource {
        return CliConfigurationSource.fromOptions(
            this.configPath ? this.resolveFromInitialCwd(this.configPath) : undefined,
            this.sourceFolder,
            this.enabledLanguages
        );
    }

    private resolveFromInitialCwd(path: string): string {
        return resolve(this.initialCwd, path);
    }

    private get initialCwd(): string {
        return process.env.INIT_CWD ?? process.cwd();
    }
}
