import * as vscode from 'vscode';
import { AllowedApplicationDependencies, AllowedDependencies, AllowedDomainDependencies, AllowedInfrastructureDependencies, ConfigurationOptions, EnabledLanguagesValidator, UnsupportedLanguageError } from "@jfrz38/clean-architecture-highlighter-core";
import { Configuration } from "./configuration";

export class State {
  config: ConfigurationOptions;
  allowedDependencies!: AllowedDependencies;
  severityLevel!: vscode.DiagnosticSeverity;

  constructor() {
    this.config = Configuration.configuration;
  }

  load() {
    this.config = Configuration.configuration;
    this.config = this.withValidatedLanguages(this.config);

    this.allowedDependencies = new AllowedDependencies(
      new AllowedDomainDependencies(this.config.layers.domain.allowedDependencies).value,
      new AllowedApplicationDependencies(this.config.layers.application.allowedDependencies).value,
      new AllowedInfrastructureDependencies(this.config.layers.infrastructure.allowedDependencies).value,
    );

    this.severityLevel = this.getSeverityLevel(this.config.severityLevel);
  }

  private withValidatedLanguages(config: ConfigurationOptions): ConfigurationOptions {
    const validator = new EnabledLanguagesValidator();
    try {
      validator.validate(config.enabledLanguages);
    } catch (error) {
      if (error instanceof UnsupportedLanguageError) {
        const validLanguages = config.enabledLanguages.filter(
          language => !error.unsupportedLanguages.includes(language)
        );
        vscode.window.showWarningMessage(
          `Clean Architecture Highlighter: ${error.message} Proceeding with supported languages only.`
        );
        return { ...config, enabledLanguages: validLanguages };
      }
    }

    return config;
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
