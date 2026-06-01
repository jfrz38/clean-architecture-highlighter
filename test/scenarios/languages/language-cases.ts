import { csharpLanguageCase } from "./cases/csharp.case";
import { dartLanguageCase } from "./cases/dart.case";
import { elixirLanguageCase } from "./cases/elixir.case";
import { goLanguageCase } from "./cases/go.case";
import { groovyLanguageCase } from "./cases/groovy.case";
import { javaLanguageCase } from "./cases/java.case";
import { javascriptLanguageCase } from "./cases/javascript.case";
import { kotlinLanguageCase } from "./cases/kotlin.case";
import { luaLanguageCase } from "./cases/lua.case";
import { phpLanguageCase } from "./cases/php.case";
import { pythonLanguageCase } from "./cases/python.case";
import { rubyLanguageCase } from "./cases/ruby.case";
import { rustLanguageCase } from "./cases/rust.case";
import { scalaLanguageCase } from "./cases/scala.case";
import { typescriptLanguageCase } from "./cases/typescript.case";

export const languageCases = [
    csharpLanguageCase,
    dartLanguageCase,
    elixirLanguageCase,
    goLanguageCase,
    groovyLanguageCase,
    javaLanguageCase,
    javascriptLanguageCase,
    kotlinLanguageCase,
    luaLanguageCase,
    phpLanguageCase,
    pythonLanguageCase,
    rubyLanguageCase,
    rustLanguageCase,
    scalaLanguageCase,
    typescriptLanguageCase
];

export const supportedLanguages = languageCases.map(languageCase => languageCase.language);
