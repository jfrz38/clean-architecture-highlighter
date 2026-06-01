import { Aliases, Layer, Layers } from "../../types.configuration";
import { AllowedLayerDependencies } from "./allowed-dependencies/allowed-layer-dependencies";

export class LayerComponent {

    private _config: Layer;

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

    constructor(
        readonly aliases: Aliases,
        private readonly allowedDependencies: AllowedLayerDependencies
    ) {
        this._config = {
            aliases: this.aliases,
            allowedDependencies: this.allowedDependencies.value
        };
    }

    get config(): Layer {
        return this._config;
    }
}
