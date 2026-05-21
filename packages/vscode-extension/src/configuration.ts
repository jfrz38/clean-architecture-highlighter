import * as vscode from 'vscode';
import { ConfigurationOptions, DefaultConfiguration, EnabledLanguages, Layers, SeverityLevel, SourceFolder } from '@jfrz38/clean-architecture-highlighter-core';

export class Configuration {

    public static get configuration(): ConfigurationOptions {
        const config = vscode.workspace.getConfiguration('clean-architecture-highlighter');
        
        return new DefaultConfiguration(
            config.get<Partial<Layers>>('layers', {}),
            config.get<Partial<SeverityLevel>>('severityLevel'),
            config.get<Partial<SourceFolder>>('sourceFolder'),
            config.get<EnabledLanguages>('enabledLanguages')
        ).config;
    }
}


