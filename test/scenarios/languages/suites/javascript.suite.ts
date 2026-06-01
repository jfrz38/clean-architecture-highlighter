import { languageCases } from "../language-cases";
import { buildLanguageSuites } from "../language-suite-builder";

export const javascriptLanguageSuites = buildLanguageSuites(languageCases.find(languageCase => languageCase.language === "javascript")!);
