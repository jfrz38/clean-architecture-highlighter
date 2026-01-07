import { Suite } from "../../../types";
import { customDomainLayerAliasesSuite } from "./aliases/custom-domain-aliases.suite";
import { customDomainAndApplicationLayerAliasesSuite } from "./aliases/custom-domain-and-application-aliases";

export const domainLayerSuite: Suite[] = [
    customDomainLayerAliasesSuite,
    customDomainAndApplicationLayerAliasesSuite
];
