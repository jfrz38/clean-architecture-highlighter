import { customConfigSuite } from "./custom-configuration/custom-configuration";
import { defaultConfigSuite } from "./default-configuration/default-config.suite";
import { Suite } from "./types";

export const suites: Suite[] = [defaultConfigSuite, ...customConfigSuite];
