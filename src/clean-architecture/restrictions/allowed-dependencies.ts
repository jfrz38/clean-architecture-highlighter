import { Layer } from "../types";

export class AllowedDependencies {

    private readonly allowedDependencies: Record<Layer, string[]>;

    constructor(
        domainDependencies: string[],
        applicationDependencies: string[],
        infrastructureDependencies: string[]
    ) {
        this.allowedDependencies = {
            domain: domainDependencies,
            application: applicationDependencies,
            infrastructure: infrastructureDependencies
        };
    }

    public isAllowed(fromLayer: Layer, toLayer: Layer): boolean {
        return this.allowedDependencies[fromLayer]?.includes(toLayer);
    }
}
