import { languageCases } from "../language-cases";
import { buildLanguageSuites } from "../language-suite-builder";

export const rubyLanguageSuites = buildLanguageSuites(languageCases.find(languageCase => languageCase.language === "ruby")!);
