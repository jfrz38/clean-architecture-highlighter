import { customConfigSuite } from "./custom-configuration/custom-configuration";
import { defaultConfigSuite } from "./default-configuration/default-config.suite";
import { javascriptLanguageSuites } from "./languages/javascript.suite";
import { pythonLanguageSuites } from "./languages/python.suite";
import { typescriptLanguageSuites } from "./languages/typescript.suite";
import { Suite } from "./types";

export const suites: Suite[] = [
    defaultConfigSuite,
    ...customConfigSuite,
    ...javascriptLanguageSuites,
    ...pythonLanguageSuites,
    ...typescriptLanguageSuites
];
