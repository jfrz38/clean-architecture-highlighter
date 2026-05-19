import { customConfigSuite } from "./custom-configuration/custom-configuration";
import { defaultConfigSuite } from "./default-configuration/default-config.suite";
import { goLanguageSuites } from "./languages/go.suite";
import { groovyLanguageSuites } from "./languages/groovy.suite";
import { javaLanguageSuites } from "./languages/java.suite";
import { javascriptLanguageSuites } from "./languages/javascript.suite";
import { kotlinLanguageSuites } from "./languages/kotlin.suite";
import { phpLanguageSuites } from "./languages/php.suite";
import { pythonLanguageSuites } from "./languages/python.suite";
import { rubyLanguageSuites } from "./languages/ruby.suite";
import { scalaLanguageSuites } from "./languages/scala.suite";
import { typescriptLanguageSuites } from "./languages/typescript.suite";
import { Suite } from "./types";

export const suites: Suite[] = [
    defaultConfigSuite,
    ...customConfigSuite,
    ...goLanguageSuites,
    ...groovyLanguageSuites,
    ...javaLanguageSuites,
    ...javascriptLanguageSuites,
    ...kotlinLanguageSuites,
    ...phpLanguageSuites,
    ...pythonLanguageSuites,
    ...rubyLanguageSuites,
    ...scalaLanguageSuites,
    ...typescriptLanguageSuites
];
