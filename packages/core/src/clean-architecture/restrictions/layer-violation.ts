import { Layer } from "../types";
import { AllowedDependencies } from "./allowed-dependencies";

export class LayerViolation {

    constructor(
        private readonly fromLayer: Layer,
        private readonly toLayer: Layer,
        private readonly allowedDependencies: AllowedDependencies
    ) { }

    public isViolation(): boolean {
        return !this.allowedDependencies.isAllowed(this.fromLayer, this.toLayer);
    }

    public get message() {
        return `${this.fromLayer} layer should not depend on ${this.toLayer} layer.`;
    }
}
