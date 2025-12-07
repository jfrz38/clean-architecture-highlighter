import { AllowedDependencies } from "../../restrictions/allowed-dependencies";
import { LayerViolation } from "../../restrictions/layer-violation";
import { LayerAlias } from "../layer/layer-alias";
import { LayerPath } from "../layer/layer-path";
import { DependencyPosition } from "./dependency-position";

export class DependencyStatement {

    private readonly _violation: LayerViolation | null;

    constructor(
        readonly text: LayerPath,
        protected readonly path: string,
        public readonly position: DependencyPosition,
        readonly allowedDependencies: AllowedDependencies,
        aliases: LayerAlias
    ) {
        const layer = aliases.getLayer(path);
        const toLayer = text.layer;

        if (!layer || !toLayer) {
            this._violation = null;
            return;
        }

        this._violation = new LayerViolation(layer, toLayer, allowedDependencies), position;
    }

    public isViolation(): boolean {
        return this._violation?.isViolation() ?? false;
    }

    public get violation(): LayerViolation | null {
        return this._violation;
    }
}
