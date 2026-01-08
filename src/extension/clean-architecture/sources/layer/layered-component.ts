import { Layer } from "../../types";
import { LayerAlias } from "./layer-alias";

export class LayeredComponent {

    public readonly layer: Layer | undefined;

    constructor(
        protected readonly path: string,
        protected readonly aliases: LayerAlias
    ) {
        this.layer = aliases.getLayer(path);
    }

    protected isDomain(): boolean {
        return this.aliases.isDomain(this.path);
    }

    protected isApplication(): boolean {
        return this.aliases.isApplication(this.path);
    }

    protected isInfrastructure(): boolean {
        return this.aliases.isInfrastructure(this.path);
    }

}
