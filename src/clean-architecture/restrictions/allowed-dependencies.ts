import { Layer } from "../sources/layer/layers";

export class AllowedDependencies {

    private readonly allowedDependencies: Record<Layer, Layer[]> = {
        domain: ['domain'],
        application: ['domain', 'application'],
        infrastructure: ['application', 'domain']
    };

    public isAllowed(fromLayer: Layer, toLayer: Layer): boolean {
        return this.allowedDependencies[fromLayer]?.includes(toLayer);
    }
}
