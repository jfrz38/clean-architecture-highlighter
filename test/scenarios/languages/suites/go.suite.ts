import { languageCases } from "../language-cases";
import { buildLanguageSuites } from "../language-suite-builder";

export const goLanguageSuites = buildLanguageSuites(languageCases.find(languageCase => languageCase.language === "go")!);
