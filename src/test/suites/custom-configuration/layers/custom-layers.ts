import { Suite } from "../../types";
import { applicationLayerSuite } from "./application/application-layer";
import { domainLayerSuite } from "./domain/domain-layer";
import { infrastructureLayerSuite } from "./infrastructure/infrastructure-layer";

export const customLayersSuite: Suite[] = [
    ...applicationLayerSuite,
    ...domainLayerSuite,
    ...infrastructureLayerSuite
];
