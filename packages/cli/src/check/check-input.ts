import { LayerAlias } from '@jfrz38/clean-architecture-highlighter-core';
import { CliConfiguration } from '../configuration/cli-configuration';
import { FilesToCheck } from '../files/files-to-check';
import { FilesToCheckTarget } from '../files/files-to-check-target';
import { CheckInputOptions } from './check-input-options';

export class CheckInput {

    public readonly configuration: CliConfiguration;
    public readonly files: FilesToCheck;
    public readonly aliases: LayerAlias;

    constructor(public readonly options: CheckInputOptions) {
        this.configuration = new CliConfiguration(this.options.configurationSource);
        this.files = new FilesToCheck(FilesToCheckTarget.fromPath(
            this.options.targetPath,
            this.configuration.config.sourceFolder
        ));
        this.aliases = new LayerAlias(
            this.configuration.config.layers.domain.aliases,
            this.configuration.config.layers.application.aliases,
            this.configuration.config.layers.infrastructure.aliases
        );
    }

    public logSummary(): void {
        const config = this.configuration.config;
        this.options.logger.info(`Analyzing path: ${this.options.targetPath}`);
        this.options.logger.info(`Source folder: ${config.sourceFolder ?? 'not set'}`);
        this.options.logger.info(`Enabled languages: ${config.enabledLanguages.join(', ')}`);
        this.options.logger.info(`Project root: ${this.files.projectRoot}`);
        this.options.logger.info(`Source path: ${this.files.sourcePath}`);
    }

    public get checkedFilesCount(): number {
        return this.files.paths.length;
    }
}
