import * as assert from 'node:assert';
import { suite, test } from 'mocha';
import { parseActionInputs } from '../src/action-inputs';

suite('Action inputs', () => {
    test('maps GitHub Action inputs to check input', () => {
        const inputs = parseActionInputs(name => ({
            path: 'project',
            config: 'clean-architecture.json',
            'source-folder': 'src',
            'enabled-languages': 'typescript,csharp',
            format: 'json'
        }[name] ?? ''));

        assert.deepStrictEqual(inputs, {
            path: 'project',
            config: 'clean-architecture.json',
            sourceFolder: 'src',
            enabledLanguages: ['typescript', 'csharp'],
            format: 'json'
        });
    });

    test('uses defaults for optional inputs', () => {
        const inputs = parseActionInputs(() => '');

        assert.deepStrictEqual(inputs, {
            path: '.',
            config: undefined,
            sourceFolder: undefined,
            enabledLanguages: undefined,
            format: 'text'
        });
    });

    test('rejects unsupported enabled languages', () => {
        assert.throws(
            () => parseActionInputs(name => name === 'enabled-languages' ? 'typescript,unknown' : ''),
            /Unsupported language identifier/
        );
    });

    test('rejects unsupported output formats', () => {
        assert.throws(() => parseActionInputs(name => name === 'format' ? 'xml' : ''), /text or json/);
    });
});
