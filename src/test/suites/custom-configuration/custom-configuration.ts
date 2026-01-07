import { Suite } from "../types";
import { customLayersSuite } from "./layers/custom-layers";
import { customSeverityErrorSuite } from "./severity-level/custom-severity-error.suite";
import { customSourceFolderSuite } from "./source-folder/custom-source-folder.suite";

export const customConfigSuite: Suite[] = [
    customSeverityErrorSuite,
    customSourceFolderSuite,
    ...customLayersSuite
];
