import * as assert from 'node:assert';
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { suite, test } from 'mocha';
import { Check } from '../src/check';

suite('CLI language smoke tests', () => {
    const languagesRoot = resolve(__dirname, '../../../vscode-extension/test/workspace/languages');

    for (const language of supportedLanguages()) {
        test(`${language} violations are analyzed when enabled`, () => {
            const violations = withConfig({ enabledLanguages: [language] }, configPath =>
                new Check({
                    path: join(languagesRoot, language),
                    configPath
                }).violations
            );

            assert.ok(violations.length > 0, `Expected ${language} fixture to report violations.`);
        });

        test(`${language} violations are ignored when disabled`, () => {
            const violations = withConfig({ enabledLanguages: [otherLanguageThan(language)] }, configPath =>
                new Check({
                    path: join(languagesRoot, language),
                    configPath
                }).violations
            );

            assert.deepStrictEqual(violations, []);
        });
    }
});

function supportedLanguages(): string[] {
    return readdirSync(languagesRoot(), { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
        .sort();
}

function languagesRoot(): string {
    return resolve(__dirname, '../../../vscode-extension/test/workspace/languages');
}

function withConfig<T>(config: { enabledLanguages: string[] }, callback: (configPath: string) => T): T {
    const directory = mkdtempSync(join(tmpdir(), 'clean-architecture-highlighter-cli-config-'));
    const path = join(directory, 'config.json');

    try {
        writeFileSync(path, JSON.stringify(config));
        return callback(path);
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
}

function otherLanguageThan(language: string): string {
    return language === 'typescript' ? 'javascript' : 'typescript';
}
