import { Suite } from "../../../types";
import { customApplicationLayerAliasesSuite } from "./aliases/custom-application-aliases.suite";

export const applicationLayerSuite: Suite[] = [
    customApplicationLayerAliasesSuite,
    // customApplicationLayerAllowedDependenciesSuite
];
