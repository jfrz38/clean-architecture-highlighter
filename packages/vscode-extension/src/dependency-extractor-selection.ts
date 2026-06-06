import { DependencyExtractor, DependencyExtractorRegistry, Document } from '@jfrz38/clean-architecture-highlighter-core';
import { ImportResolution } from './configuration';
import { TypeScriptResolvedDependencyExtractor } from './type-script-resolved-dependency-extractor';

const ecmaScriptLanguages = new Set(['javascript', 'typescript']);

export type DependencyExtractorSelection = {
    readonly languageId: string;
    readonly importResolution: ImportResolution;
};

export class DependencyExtractorSelector {
    constructor(
        private readonly dependencyExtractors: DependencyExtractorRegistry,
        private readonly typeScriptResolvedExtractor: TypeScriptResolvedDependencyExtractor
    ) { }

    public select(document: Document & { languageId: string }, selection: DependencyExtractorSelection): DependencyExtractor | undefined {
        if (selection.importResolution === 'native' && ecmaScriptLanguages.has(document.languageId)) {
            return this.typeScriptResolvedExtractor;
        }

        return this.dependencyExtractors.get(selection.languageId);
    }
}
