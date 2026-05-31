import { Suite } from "../types";
import { customLayersSuite } from "./layers/custom-layers";
import { multipleConfiguration } from "./multiple-configuration/multiple-configuration";
import { customSourceFolderSuite } from "./source-folder/custom-source-folder.suite";

export const customConfigSuite: Suite[] = [
    customSourceFolderSuite,
    ...customLayersSuite,
    ...multipleConfiguration
];
