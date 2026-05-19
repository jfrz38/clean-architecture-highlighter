import { customConfigSuite } from "./custom-configuration/custom-configuration";
import { defaultConfigSuite } from "./default-configuration/default-config.suite";
import { goLanguageSuites } from "./languages/go.suite";
import { javaLanguageSuites } from "./languages/java.suite";
import { javascriptLanguageSuites } from "./languages/javascript.suite";
import { kotlinLanguageSuites } from "./languages/kotlin.suite";
import { pythonLanguageSuites } from "./languages/python.suite";
import { scalaLanguageSuites } from "./languages/scala.suite";
import { typescriptLanguageSuites } from "./languages/typescript.suite";
import { Suite } from "./types";

export const suites: Suite[] = [
    defaultConfigSuite,
    ...customConfigSuite,
    ...goLanguageSuites,
    ...javaLanguageSuites,
    ...javascriptLanguageSuites,
    ...kotlinLanguageSuites,
    ...pythonLanguageSuites,
    ...scalaLanguageSuites,
    ...typescriptLanguageSuites
];
