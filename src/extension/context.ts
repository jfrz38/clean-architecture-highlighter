import * as vscode from 'vscode';
import { State } from './state';

export function createExtensionContext() {
  const state = new State();
  state.load();

  const diagnostics = vscode.languages.createDiagnosticCollection('cleanArchitectureHighLighterDiagnostics');

  return { state, diagnostics };
}
