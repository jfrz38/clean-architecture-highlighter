import * as vscode from 'vscode';
import { ConfigurationOptions, DefaultConfiguration } from './default.configuration';
import { Layers, SeverityLevel, SourceFolder } from './types.configuration';

export class Configuration {
    
    private readonly config: ConfigurationOptions;

    constructor() {
        const config = vscode.workspace.getConfiguration('clean-architecture-highlighter');
        
        const finalConfig = new DefaultConfiguration(
            config.get<Partial<Layers>>('layers', {}),
            config.get<Partial<SeverityLevel>>('severityLevel'),
            config.get<Partial<SourceFolder>>('sourceFolder')
        ).config;

        console.log('Loaded configuration:', finalConfig);

        this.config = finalConfig;
    }

    public get configuration(): ConfigurationOptions {
        return this.config;
    }
}


