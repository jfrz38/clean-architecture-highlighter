import { languageCases } from "../language-cases";
import { buildLanguageSuites } from "../language-suite-builder";

export const dartLanguageSuites = buildLanguageSuites(languageCases.find(languageCase => languageCase.language === "dart")!);
