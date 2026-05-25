import { languageCases } from "../language-cases";
import { buildLanguageSuites } from "../language-suite-builder";

export const csharpLanguageSuites = buildLanguageSuites(languageCases.find(languageCase => languageCase.language === "csharp")!);
