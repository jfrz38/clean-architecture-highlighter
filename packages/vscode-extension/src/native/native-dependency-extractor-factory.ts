import { ModuleSpecifierExtractor } from './module-specifier-extractor';
import { TypeScriptCompilerOptions } from './type-script-compiler-options';
import { TypeScriptModuleResolver } from './type-script-module-resolver';
import { TypeScriptResolvedDependencyExtractor } from './type-script-resolved-dependency-extractor';

export class NativeDependencyExtractorFactory {
    public static create(): TypeScriptResolvedDependencyExtractor {
        return new TypeScriptResolvedDependencyExtractor(
            new ModuleSpecifierExtractor(),
            new TypeScriptCompilerOptions(),
            new TypeScriptModuleResolver()
        );
    }
}
