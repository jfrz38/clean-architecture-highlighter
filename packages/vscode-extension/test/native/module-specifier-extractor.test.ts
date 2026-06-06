import * as assert from 'assert';
import * as ts from 'typescript';
import { ModuleSpecifierExtractor } from '../../src/native/module-specifier-extractor';

suite('ModuleSpecifierExtractor', () => {
    test('extracts import, export, require, and dynamic import module specifiers', () => {
        const sourceFile = ts.createSourceFile(
            'example.ts',
            [
                "import { Service } from 'application/service';",
                "export * from 'application/public-api';",
                "const repository = require('infrastructure/repository');",
                "import('infrastructure/dynamic-repository');"
            ].join('\n'),
            ts.ScriptTarget.Latest,
            true,
            ts.ScriptKind.TS
        );

        const moduleSpecifiers = new ModuleSpecifierExtractor().extract(sourceFile);

        assert.deepStrictEqual(moduleSpecifiers.map(moduleSpecifier => moduleSpecifier.text), [
            'application/service',
            'application/public-api',
            'infrastructure/repository',
            'infrastructure/dynamic-repository'
        ]);
    });
});
