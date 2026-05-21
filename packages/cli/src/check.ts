import { readFileSync } from 'node:fs';
import { extname, relative, resolve, sep } from 'node:path';
import {
    DependencyExtractorRegistry,
    LayerAlias,
    SourceFile,
    SupportedLanguageRegistry
} from '@jfrz38/clean-architecture-highlighter-core';
import { CliConfiguration } from './configuration';
import { CliDocument } from './document';
import { FilesToCheck } from './files';
import { CliViolation } from './violation';

export type CheckOptions = {
    path: string;
    configPath?: string;
    sourceFolder?: string;
};

export class Check {

    private readonly configuration: CliConfiguration;
    private readonly files: FilesToCheck;
    private readonly aliases: LayerAlias;

    constructor(
        private readonly options: CheckOptions,
        private readonly dependencyExtractors = new DependencyExtractorRegistry(),
        private readonly supportedLanguages = new SupportedLanguageRegistry()
    ) {
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

    public get violations(): CliViolation[] {
        return this.files.paths.flatMap(filePath => this.checkFile(filePath));
    }

    private checkFile(filePath: string): CliViolation[] {
        const languageId = this.supportedLanguages.getLanguageIdFromExtension(extname(filePath));
        if (!languageId || !this.configuration.config.enabledLanguages.includes(languageId)) {
            return [];
        }

        const extractor = this.dependencyExtractors.get(languageId);
        if (!extractor) {
            return [];
        }

        const documentPath = this.toDocumentPath(relative(this.files.projectRoot, filePath));
        const document = new CliDocument(documentPath, readFileSync(filePath, 'utf8'));
        const sourceFile = new SourceFile(document, extractor.extract(document), this.configuration.allowedDependencies, this.aliases);

        return sourceFile.violations.map(violation =>
            new CliViolation(this.toOutputPath(relative(this.files.outputRoot, filePath)), violation)
        );
    }

    private resolveFromInitialCwd(path: string): string {
        return resolve(this.initialCwd, path);
    }

    private get initialCwd(): string {
        return process.env.INIT_CWD ?? process.cwd();
    }

    private toDocumentPath(path: string): string {
        return `/${path.split(sep).join('/')}`;
    }

    private toOutputPath(path: string): string {
        return path.split(sep).join('/');
    }
}
