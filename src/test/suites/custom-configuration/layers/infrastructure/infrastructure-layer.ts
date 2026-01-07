import { Suite } from "../../../types";
import { customInfrastructureLayerAliasesSuite } from "./aliases/custom-infrastructure-aliases.suite";

export const infrastructureLayerSuite: Suite[] = [
    customInfrastructureLayerAliasesSuite,
    // customInfrastructureLayerAllowedDependenciesSuite
];
