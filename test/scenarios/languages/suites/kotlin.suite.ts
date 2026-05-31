import { languageCases } from "../language-cases";
import { buildLanguageSuites } from "../language-suite-builder";

export const kotlinLanguageSuites = buildLanguageSuites(languageCases.find(languageCase => languageCase.language === "kotlin")!);
