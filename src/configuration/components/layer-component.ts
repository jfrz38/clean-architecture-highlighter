import { Aliases, AllowedDependencies, Layer, Layers } from "../types.configuration";

export class LayerComponent {

    public static readonly DEFAULT_LAYERS: Layers = {
        domain: {
            aliases: ['domain'],
            allowedDependencies: ['domain']
        },
        application: {
            aliases: ['application'],
            allowedDependencies: ['domain', 'application']
        },
        infrastructure: {
            aliases: ['infrastructure'],
            allowedDependencies: ['domain', 'application', 'infrastructure']
        }
    } as const;

    private _config: Layer;

    constructor(
        readonly aliases: Aliases,
        readonly allowedDependencies: AllowedDependencies
    ) {
        this._config = {
            aliases: this.aliases,
            allowedDependencies: this.allowedDependencies
        };
    }

    get config(): Layer {
        return this._config;
    }
}
