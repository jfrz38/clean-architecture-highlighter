import { customConfigSuite } from "./custom-configuration/custom-configuration";
import { defaultConfigSuite } from "./default-configuration/default-config.suite";
import { javaLanguageSuites } from "./languages/java.suite";
import { javascriptLanguageSuites } from "./languages/javascript.suite";
import { pythonLanguageSuites } from "./languages/python.suite";
import { typescriptLanguageSuites } from "./languages/typescript.suite";
import { Suite } from "./types";

export const suites: Suite[] = [
    defaultConfigSuite,
    ...customConfigSuite,
    ...javaLanguageSuites,
    ...javascriptLanguageSuites,
    ...pythonLanguageSuites,
    ...typescriptLanguageSuites
];
