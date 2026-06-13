import {
    ConfigurationOptions,
    DefaultConfiguration
} from '@jfrz38/clean-architecture-highlighter-core';
import { CoreArchitectureBoundaries } from './core-architecture-boundaries';

export type RuleOptions = {
    sourceFolder?: string;
    layers?: Partial<ConfigurationOptions['layers']>;
    ignoreTypeImports?: boolean;
    ignoreExternalDependencies?: boolean;
};

export type ResolvedRuleOptions = Required<Pick<RuleOptions, 'ignoreTypeImports' | 'ignoreExternalDependencies'>> & RuleOptions;

export type RuleConfiguration = {
    options: ResolvedRuleOptions;
    sourceFolder: string | undefined;
    boundaries: CoreArchitectureBoundaries;
};

const defaultPluginOptions = {
    ignoreTypeImports: false,
    ignoreExternalDependencies: true
};

export class CoreRuleConfigurationFactory {
    public create(options: RuleOptions | undefined): RuleConfiguration {
        const resolvedOptions = this.resolveOptions(options);
        const config = new DefaultConfiguration(resolvedOptions.layers ?? {}, resolvedOptions.sourceFolder, undefined).config;

        return {
            options: resolvedOptions,
            sourceFolder: config.sourceFolder,
            boundaries: new CoreArchitectureBoundaries(config)
        };
    }

    private resolveOptions(options: RuleOptions | undefined): ResolvedRuleOptions {
        return {
            ...defaultPluginOptions,
            ...options
        };
    }
}
