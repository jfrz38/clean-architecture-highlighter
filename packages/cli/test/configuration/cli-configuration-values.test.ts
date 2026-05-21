import * as assert from 'node:assert';
import { suite, test } from 'mocha';
import { CliConfigurationValues } from '../../src/configuration/cli-configuration-values';

suite('CliConfigurationValues', () => {
    test('creates empty configuration values', () => {
        const configuration = CliConfigurationValues.empty();

        assert.deepStrictEqual(configuration.layers, {});
        assert.strictEqual(configuration.severityLevel, undefined);
        assert.strictEqual(configuration.sourceFolder, undefined);
        assert.strictEqual(configuration.enabledLanguages, undefined);
    });

    test('reads configuration values from an in-memory object', () => {
        const configuration = CliConfigurationValues.fromJson({
            severityLevel: 'error',
            sourceFolder: 'code',
            enabledLanguages: ['typescript'],
            layers: {
                domain: {
                    aliases: ['model']
                }
            }
        });

        assert.strictEqual(configuration.severityLevel, 'error');
        assert.strictEqual(configuration.sourceFolder, 'code');
        assert.deepStrictEqual(configuration.enabledLanguages, ['typescript']);
        assert.deepStrictEqual(configuration.layers.domain?.aliases, ['model']);
    });
});
