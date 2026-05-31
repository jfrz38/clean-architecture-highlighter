import { languageCases } from "../language-cases";
import { buildLanguageSuites } from "../language-suite-builder";

export const scalaLanguageSuites = buildLanguageSuites(languageCases.find(languageCase => languageCase.language === "scala")!);
