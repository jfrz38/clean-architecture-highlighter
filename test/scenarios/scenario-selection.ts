import { customConfigSuite } from "./custom-configuration/custom-configuration";
import { defaultConfigSuite } from "./default-configuration/default-config.suite";
import { fullLanguageMatrixSuites } from "./languages/full-language-matrix";
import { languageCases, supportedLanguages } from "./languages/language-cases";
import { buildLanguageSuites, LanguageScenarioCase } from "./languages/language-suite-builder";
import { Suite } from "./types";

const DEFAULT_LANGUAGE = "typescript";
const ALL_LANGUAGES = "all";
const FAST_SCENARIO_SET = "fast";
const FULL_SCENARIO_SET = "full";

export function getSelectedSuites(scenarioSet = selectedScenarioSet()): Suite[] {
    const suites = [
        ...referenceSuites(),
        ...selectedLanguageCases().flatMap(buildLanguageSuites)
    ];

    if (scenarioSet === FULL_SCENARIO_SET) {
        return [
            ...suites,
            ...fullLanguageMatrixSuites
        ];
    }

    if (scenarioSet === FAST_SCENARIO_SET) {
        return suites;
    }

    throw new Error(`Unsupported TEST_SCENARIO_SET "${scenarioSet}". Use "fast" or "full".`);
}

function referenceSuites(): Suite[] {
    return [
        defaultConfigSuite,
        ...customConfigSuite
    ];
}

function selectedLanguageCases(): LanguageScenarioCase[] {
    const selectedLanguage = selectedEnvironmentValue("TEST_LANGUAGE", DEFAULT_LANGUAGE);

    if (selectedLanguage === ALL_LANGUAGES) {
        return languageCases;
    }

    const languageCase = languageCases.find(candidate => candidate.language === selectedLanguage);

    if (languageCase) {
        return [languageCase];
    }

    throw new Error(`Unsupported TEST_LANGUAGE "${selectedLanguage}". Use one of: ${[ALL_LANGUAGES, ...supportedLanguages].join(", ")}.`);
}

function selectedScenarioSet(): string {
    return selectedEnvironmentValue("TEST_SCENARIO_SET", FAST_SCENARIO_SET);
}

function selectedEnvironmentValue(name: string, defaultValue: string): string {
    const value = process.env[name]?.trim();

    return (value || defaultValue).toLowerCase();
}
