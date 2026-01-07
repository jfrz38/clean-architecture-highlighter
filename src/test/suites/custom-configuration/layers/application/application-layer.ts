import { Suite } from "../../../types";
import { customApplicationLayerAliasesSuite } from "./aliases/custom-application-aliases.suite";
import { customApplicationLayerAllowedDependenciesSuite } from "./allowed-dependencies/custom-application-allowed-dependencies.suite";
import { customApplicationLayerAllowedExplicityDependenciesSuite } from "./allowed-dependencies/custom-application-allowed-explicity-dependencies.suite";

export const applicationLayerSuite: Suite[] = [
    customApplicationLayerAliasesSuite,
    customApplicationLayerAllowedDependenciesSuite,
    customApplicationLayerAllowedExplicityDependenciesSuite
];
