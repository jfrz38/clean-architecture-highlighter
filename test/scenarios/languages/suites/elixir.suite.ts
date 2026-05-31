import { languageCases } from "../language-cases";
import { buildLanguageSuites } from "../language-suite-builder";

export const elixirLanguageSuites = buildLanguageSuites(languageCases.find(languageCase => languageCase.language === "elixir")!);
