import { languageCases } from "../language-cases";
import { buildLanguageSuites } from "../language-suite-builder";

export const luaLanguageSuites = buildLanguageSuites(languageCases.find(languageCase => languageCase.language === "lua")!);
