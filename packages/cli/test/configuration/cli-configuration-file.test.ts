import * as assert from 'node:assert';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { suite, test } from 'mocha';
import { CliConfigurationFile } from '../../src/configuration/cli-configuration-file';
import { CliLogger } from '../../src/output/cli-logger';

class TestLogger extends CliLogger {
    public readonly warnings: string[] = [];

    constructor() {
        super(false);
    }

    public override warn(message: string): void {
        this.warnings.push(`Warning: ${message}`);
    }
}

suite('CliConfigurationFile', () => {
    test('warns unsupported languages from configuration file', () => {
        const directory = mkdtempSync(join(tmpdir(), 'clean-arch-cli-config-'));
        const configPath = join(directory, 'config.json');
        const logger = new TestLogger();

        writeFileSync(configPath, JSON.stringify({
            enabledLanguages: ['typescript', 'javacsript']
        }), 'utf8');

        try {
            const configuration = CliConfigurationFile.fromPath(configPath, logger);

            assert.deepStrictEqual(configuration.enabledLanguages, ['typescript', 'javacsript']);
            assert.deepStrictEqual(logger.warnings, [
                'Warning: Unsupported language identifier: javacsript.'
            ]);
        } finally {
            rmSync(directory, { recursive: true, force: true });
        }
    });
});
