import { Suite } from "../../../types";
import { customDomainLayerAliasesSuite } from "./aliases/custom-domain-aliases.suite";
import { customDomainAndApplicationLayerAliasesSuite } from "./aliases/custom-domain-and-application-aliases";
import { customDomainLayerAllowedDependenciesSuite } from "./allowed-dependencies/custom-domain-allowed-dependencies.suite";

export const domainLayerSuite: Suite[] = [
    customDomainLayerAliasesSuite,
    customDomainAndApplicationLayerAliasesSuite,
    customDomainLayerAllowedDependenciesSuite
];
