import { languageCases } from "../language-cases";
import { buildLanguageSuites } from "../language-suite-builder";

export const javaLanguageSuites = buildLanguageSuites(languageCases.find(languageCase => languageCase.language === "java")!);
