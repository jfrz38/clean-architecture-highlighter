import * as assert from 'node:assert';
import { suite, test } from 'mocha';
import { join, resolve } from 'node:path';
import { CheckInputOptions } from '../../src/check/check-input-options';
import { InitialCwd } from '../resources/initial-cwd';

suite('CheckInputOptions', () => {
    const initialCwd = resolve(process.cwd(), 'project');

    test('resolves target path from the initial cwd', () => {
        InitialCwd.with(initialCwd, initialCwd => {
            const options = CheckInputOptions.fromCli('src');

            assert.strictEqual(options.targetPath, join(initialCwd, 'src'));
        });
    });

    test('creates configuration source from cli overrides without reading configuration files', () => {
        InitialCwd.with(initialCwd, () => {
            const options = CheckInputOptions.fromCli('src', undefined, 'code', ['csharp']);

            assert.strictEqual(options.configurationSource.sourceFolder, 'code');
            assert.deepStrictEqual(options.configurationSource.enabledLanguages, ['csharp']);
            assert.strictEqual(options.configurationSource.fileConfiguration.sourceFolder, undefined);
        });
    });
});
