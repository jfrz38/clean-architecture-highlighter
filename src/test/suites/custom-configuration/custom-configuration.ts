import { Suite } from "../types";
import { customSeverityErrorSuite } from "./severity-level/custom-severity-error.suite";
import { customSourceFolderErrorSuite } from "./source-folder/custom-source-folder-error.suite";

export const customConfigSuite: Suite[] = [
    customSeverityErrorSuite,
    customSourceFolderErrorSuite
];
