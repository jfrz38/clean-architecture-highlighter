import { languageCases } from "../language-cases";
import { buildLanguageSuites } from "../language-suite-builder";

export const groovyLanguageSuites = buildLanguageSuites(languageCases.find(languageCase => languageCase.language === "groovy")!);
