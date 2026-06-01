import { Suite } from "../../../types";
import { customInfrastructureLayerAliasesSuite } from "./aliases/custom-infrastructure-aliases.suite";
import { customInfrastructureLayerAllowedDependenciesSuite } from "./allowed-dependencies/custom-infrastructure-allowed-dependencies.suite";

export const infrastructureLayerSuite: Suite[] = [
    customInfrastructureLayerAliasesSuite,
    customInfrastructureLayerAllowedDependenciesSuite
];
