import { DependencyExtractor, DependencyExtractorRegistry, Document } from '@jfrz38/clean-architecture-highlighter-core';
import { ImportResolution } from './configuration';
import { TypeScriptResolvedDependencyExtractor } from './native/type-script-resolved-dependency-extractor';

const ecmaScriptLanguages = new Set(['javascript', 'typescript']);

export type DependencyExtractorSelection = {
    readonly languageId: string;
    readonly importResolution: ImportResolution;
};

export type LanguageDocument = Document & {
    readonly languageId: string;
};

export class DependencyExtractorSelector {
    constructor(
        private readonly dependencyExtractors: DependencyExtractorRegistry,
        private readonly typeScriptResolvedExtractor: TypeScriptResolvedDependencyExtractor
    ) { }

    public select(document: LanguageDocument, selection: DependencyExtractorSelection): DependencyExtractor | undefined {
        if (selection.importResolution === ImportResolution.NATIVE && ecmaScriptLanguages.has(document.languageId)) {
            return this.typeScriptResolvedExtractor;
        }

        return this.dependencyExtractors.get(selection.languageId);
    }
}
