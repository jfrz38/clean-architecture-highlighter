import * as vscode from 'vscode';
import { AllowedDependencies } from "./clean-architecture/restrictions/allowed-dependencies";
import { Configuration } from "./configuration/configuration";
import { ConfigurationOptions } from "./configuration/types.configuration";

export class State {
  config: ConfigurationOptions;
  allowedDependencies!: AllowedDependencies;
  severityLevel!: vscode.DiagnosticSeverity;

  constructor() {
    this.config = Configuration.configuration;
  }

  load() {
    this.config = Configuration.configuration;

    this.allowedDependencies = new AllowedDependencies(
      this.config.layers.domain.allowedDependencies,
      this.config.layers.application.allowedDependencies,
      this.config.layers.infrastructure.allowedDependencies
    );

    this.severityLevel = this.getSeverityLevel(this.config.severityLevel);
  }

  private getSeverityLevel(level: 'warning' | 'error' | 'info'): vscode.DiagnosticSeverity {
    if (level === 'error') {
      return vscode.DiagnosticSeverity.Error;
    }
    if (level === 'info') {
      return vscode.DiagnosticSeverity.Information;
    }

    return vscode.DiagnosticSeverity.Warning;
  }
}
