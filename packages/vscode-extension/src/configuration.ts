import * as vscode from 'vscode';
import { ConfigurationOptions, DefaultConfiguration, EnabledLanguages, Layers, SourceFolderPath } from '@jfrz38/clean-architecture-highlighter-core';

export type SeverityLevel = 'warning' | 'error' | 'info';

export class Configuration {

    public static get configuration(): ConfigurationOptions {
        const config = vscode.workspace.getConfiguration('clean-architecture-highlighter');
        
        return new DefaultConfiguration(
            config.get<Partial<Layers>>('layers', {}),
            config.get<SourceFolderPath>('sourceFolder'),
            config.get<EnabledLanguages>('enabledLanguages')
        ).config;
    }

    public static get severityLevel(): SeverityLevel {
        return vscode.workspace
            .getConfiguration('clean-architecture-highlighter')
            .get<SeverityLevel>('severityLevel', 'warning');
    }
}


