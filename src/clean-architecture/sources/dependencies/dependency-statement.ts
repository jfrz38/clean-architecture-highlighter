import { LayerViolation } from "../../restrictions/layer-violation";
import { LayerPath } from "../layer/layer-path";
import { LayeredComponent } from "../layer/layered-component";
import { DependencyPosition } from "./dependency-position";

export class DependencyStatement extends LayeredComponent {

    private readonly _violation: LayerViolation | null;

    constructor(
        private readonly text: LayerPath,
        protected readonly path: string,
        public readonly position: DependencyPosition
    ) {
        super(path);

        const layer = this.layer;
        const toLayer = text.layer;

        if (!layer || !toLayer) {
            this._violation = null;
            return;
        }

        this._violation = new LayerViolation(this.layer, toLayer), position;
    }

    public isViolation(): boolean {
        return this._violation?.isViolation() ?? false;
    }

    public get violation(): LayerViolation | null {
        return this._violation;
    }
}
