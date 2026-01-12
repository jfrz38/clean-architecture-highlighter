import * as vscode from 'vscode';
import { DefaultConfiguration } from './default.configuration';
import { ConfigurationOptions, Layers, SeverityLevel, SourceFolder } from './types.configuration';

export class Configuration {

    public static get configuration(): ConfigurationOptions {
        const config = vscode.workspace.getConfiguration('clean-architecture-highlighter');
        
        return new DefaultConfiguration(
            config.get<Partial<Layers>>('layers', {}),
            config.get<Partial<SeverityLevel>>('severityLevel'),
            config.get<Partial<SourceFolder>>('sourceFolder')
        ).config;
    }
}


