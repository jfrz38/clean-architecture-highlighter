import { languageCases } from "../language-cases";
import { buildLanguageSuites } from "../language-suite-builder";

export const pythonLanguageSuites = buildLanguageSuites(languageCases.find(languageCase => languageCase.language === "python")!);
