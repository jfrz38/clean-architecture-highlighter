import { Layer } from "./layers";

export abstract class LayeredComponent {

    private readonly LAYERS: Record<Layer, () => boolean> = {
        domain: () => this.isDomain(),
        application: () => this.isApplication(),
        infrastructure: () => this.isInfrastructure()
    };

    constructor(protected readonly path: string) { }

    protected isDomain(): boolean {
        return this.path.includes('/domain');
    }

    protected isInfrastructure(): boolean {
        return this.path.includes('/infrastructure');
    }

    protected isApplication(): boolean {
        return this.path.includes('/application');
    }

    public get layer(): Layer | null {
        for (const [layer, check] of Object.entries(this.LAYERS) as [Layer, (ctx: any) => boolean][]) {
            if (check(this)) {
                return layer;
            }
        }
        return null;
    }





}
