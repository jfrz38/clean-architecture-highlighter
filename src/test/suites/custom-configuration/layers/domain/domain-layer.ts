import { Suite } from "../../../types";
import { customDomainLayerAliasesSuite } from "./aliases/custom-domain-aliases.suite";

export const domainLayerSuite: Suite[] = [
    customDomainLayerAliasesSuite,
    // customDomainLayerAllowedDependenciesSuite
];
