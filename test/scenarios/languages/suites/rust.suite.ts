import { languageCases } from "../language-cases";
import { buildLanguageSuites } from "../language-suite-builder";

export const rustLanguageSuites = buildLanguageSuites(languageCases.find(languageCase => languageCase.language === "rust")!);
