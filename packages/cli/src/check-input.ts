import { resolve } from 'node:path';
import { LayerAlias } from '@jfrz38/clean-architecture-highlighter-core';
import { CliConfiguration } from './configuration';
import { FilesToCheck } from './files';

type CheckInputOptions = {
    path: string;
    configPath?: string;
    sourceFolder?: string;
};

export class CheckInput {

    public readonly configuration: CliConfiguration;
    public readonly files: FilesToCheck;
    public readonly aliases: LayerAlias;

    constructor(private readonly options: CheckInputOptions) {
        this.configuration = new CliConfiguration({
            configPath: this.options.configPath ? this.resolveFromInitialCwd(this.options.configPath) : undefined,
            sourceFolder: this.options.sourceFolder
        });
        this.files = new FilesToCheck(
            this.resolveFromInitialCwd(this.options.path),
            this.configuration.config.sourceFolder
        );
        this.aliases = new LayerAlias(
            this.configuration.config.layers.domain.aliases,
            this.configuration.config.layers.application.aliases,
            this.configuration.config.layers.infrastructure.aliases
        );
    }

    private resolveFromInitialCwd(path: string): string {
        return resolve(this.initialCwd, path);
    }

    private get initialCwd(): string {
        return process.env.INIT_CWD ?? process.cwd();
    }
}
