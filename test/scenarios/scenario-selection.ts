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
    const selectedLanguages = selectedEnvironmentValue("TEST_LANGUAGE", DEFAULT_LANGUAGE)
        .split(",")
        .map(language => language.trim())
        .filter(Boolean);

    if (selectedLanguages.includes(ALL_LANGUAGES)) {
        return languageCases;
    }

    const unknownLanguages = selectedLanguages.filter(language =>
        !languageCases.some(candidate => candidate.language === language)
    );

    if (unknownLanguages.length > 0) {
        throw new Error(`Unsupported TEST_LANGUAGE value "${unknownLanguages.join(", ")}". Use "all", one language, or a comma-separated list of: ${supportedLanguages.join(", ")}.`);
    }

    return languageCases.filter(languageCase => selectedLanguages.includes(languageCase.language));
}

function selectedScenarioSet(): string {
    return selectedEnvironmentValue("TEST_SCENARIO_SET", FAST_SCENARIO_SET);
}

function selectedEnvironmentValue(name: string, defaultValue: string): string {
    const value = process.env[name]?.trim();

    return (value || defaultValue).toLowerCase();
}
