import { readFileSync } from 'node:fs';
import { extname, relative, sep } from 'node:path';
import {
    DependencyExtractorRegistry,
    SourceFile,
    SupportedLanguageRegistry
} from '@jfrz38/clean-architecture-highlighter-core';
import { CliDocument } from '../adapter/cli-document';
import { CheckInput } from './check-input';
import { CliViolation } from './cli-violation';

export class Check {

    constructor(
        private readonly input: CheckInput,
        private readonly dependencyExtractors = new DependencyExtractorRegistry(),
        private readonly supportedLanguages = new SupportedLanguageRegistry()
    ) { }

    public get violations(): CliViolation[] {
        return this.input.files.paths.flatMap(filePath => this.checkFile(filePath));
    }

    private checkFile(filePath: string): CliViolation[] {
        const languageId = this.supportedLanguages.getLanguageIdFromExtension(extname(filePath));
        if (!languageId || !this.input.configuration.config.enabledLanguages.includes(languageId)) {
            return [];
        }

        const extractor = this.dependencyExtractors.get(languageId);
        if (!extractor) {
            return [];
        }

        const documentPath = this.toDocumentPath(relative(this.input.files.projectRoot, filePath));
        const document = new CliDocument(documentPath, readFileSync(filePath, 'utf8'));
        const sourceFile = new SourceFile(
            document,
            extractor.extract(document),
            this.input.configuration.allowedDependencies,
            this.input.aliases
        );

        return sourceFile.violations.map(violation =>
            new CliViolation(this.toOutputPath(relative(this.input.files.outputRoot, filePath)), violation)
        );
    }

    private toDocumentPath(path: string): string {
        return `/${path.split(sep).join('/')}`;
    }

    private toOutputPath(path: string): string {
        return path.split(sep).join('/');
    }
}
