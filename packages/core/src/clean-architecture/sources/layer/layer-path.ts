import { LayerAlias } from "./layer-alias";
import { LayeredComponent } from "./layered-component";

export class LayerPath extends LayeredComponent {

    constructor(protected readonly path: string, aliases: LayerAlias) {
        super(path, aliases);
    }
}
