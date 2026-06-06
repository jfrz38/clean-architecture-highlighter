import * as path from 'path';
import * as ts from 'typescript';

type CompilerConfiguration = {
    readonly options: ts.CompilerOptions;
};

export class TypeScriptCompilerOptions {
    private readonly configurationByDirectory = new Map<string, CompilerConfiguration>();

    public forDocument(documentPath: string): ts.CompilerOptions {
        const directory = path.dirname(documentPath);
        const configPath = ts.findConfigFile(directory, ts.sys.fileExists);
        if (!configPath) {
            return this.defaultOptions();
        }

        const configDirectory = path.dirname(configPath);
        const cachedConfiguration = this.configurationByDirectory.get(configDirectory);
        if (cachedConfiguration) {
            return cachedConfiguration.options;
        }

        const readConfig = ts.readConfigFile(configPath, ts.sys.readFile);
        if (readConfig.error) {
            return this.defaultOptions();
        }

        const parsedConfig = ts.parseJsonConfigFileContent(readConfig.config, ts.sys, configDirectory);
        const configuration = { options: { ...this.defaultOptions(), ...parsedConfig.options } };
        this.configurationByDirectory.set(configDirectory, configuration);

        return configuration.options;
    }

    private defaultOptions(): ts.CompilerOptions {
        return {
            allowJs: true,
            moduleResolution: ts.ModuleResolutionKind.Bundler
        };
    }
}
