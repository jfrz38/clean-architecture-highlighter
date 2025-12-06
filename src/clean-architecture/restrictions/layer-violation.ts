import { Layer } from "../sources/layer/layers";
import { AllowedDependencies } from "./allowed-dependencies";

export class LayerViolation {

    private readonly allowedDependencies = new AllowedDependencies();

    constructor(
        private readonly fromLayer: Layer,
        private readonly toLayer: Layer
    ) { }

    public isViolation(): boolean {
        return !this.allowedDependencies.isAllowed(this.fromLayer, this.toLayer);
    }

    public get message() {
        return `${this.fromLayer} layer should not depend on ${this.toLayer} layer.`;
    }
}
