import * as assert from 'assert';
import { LayersConfiguration } from '../extension/configuration/components/layers/layers.configuration';

suite('LayersConfiguration', () => {
    test('uses infrastructure allowedDependencies overrides instead of aliases', () => {
        const layers = new LayersConfiguration({
            domain: {
                aliases: ['domain'],
                allowedDependencies: ['domain']
            },
            application: {
                aliases: ['application'],
                allowedDependencies: ['domain', 'application']
            },
            infrastructure: {
                aliases: ['driven-adapters'],
                allowedDependencies: ['shared-kernel']
            }
        }).config;

        assert.deepStrictEqual(layers.infrastructure.aliases, ['driven-adapters']);
        assert.deepStrictEqual(layers.infrastructure.allowedDependencies, [
            'domain',
            'application',
            'infrastructure',
            'shared-kernel'
        ]);
    });
});
