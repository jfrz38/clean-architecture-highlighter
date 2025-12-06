import { LayeredComponent } from "./layered-component";

export class LayerPath extends LayeredComponent {

    constructor(protected readonly path: string) {
        super(path);
    }
}
