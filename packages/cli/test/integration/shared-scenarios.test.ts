import * as assert from 'node:assert';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { suite, test } from 'mocha';
import { Check } from '../../src/check/check';
import { CheckInput } from '../../src/check/check-input';
import { CheckInputOptions } from '../../src/check/check-input-options';

import type { Scenario, Suite } from '../../../../test/scenarios/out/types';

const { suites } = require('../../../../../test/scenarios/out/scenarios') as { suites: Suite[] };

suite('Shared integration scenarios', () => {
    suites.forEach(sharedSuite => {
        suite(sharedSuite.name, () => {
            sharedSuite.scenarios.forEach(sharedScenario => {
                test(sharedScenario.name, () => {
                    const result = runScenario(sharedSuite, sharedScenario);

                    assert.deepStrictEqual(result, sharedScenario.diagnostics.map(diagnostic => ({
                        line: diagnostic.startLine + 1,
                        message: diagnostic.message
                    })));
                });
            });
        });
    });
});

function runScenario(sharedSuite: Suite, sharedScenario: Scenario) {
    const project = projectFrom(sharedScenario.file);
    const configPath = writeConfigFile(sharedSuite.configuration);

    try {
        const violations = new Check(new CheckInput(CheckInputOptions.fromCli(
            project.rootPath,
            configPath
        ))).violations;

        return violations
            .filter(violation => violation.filePath === project.relativeFilePath)
            .map(violation => ({
                line: violation.line,
                message: violation.message
            }));
    } finally {
        rmSync(configPath, { force: true });
    }
}

function projectFrom(scenarioFile: string) {
    const [fixtureGroup, fixtureName, ...relativeFileParts] = scenarioFile.split('/');

    return {
        rootPath: resolve(process.cwd(), '../../test/fixtures', fixtureGroup, fixtureName),
        relativeFilePath: relativeFileParts.join('/')
    };
}

function writeConfigFile(configuration: Record<string, unknown>): string {
    const directory = mkdtempSync(join(tmpdir(), 'clean-arch-cli-scenario-'));
    const configPath = join(directory, 'config.json');

    writeFileSync(configPath, JSON.stringify(configuration), 'utf8');

    return configPath;
}
