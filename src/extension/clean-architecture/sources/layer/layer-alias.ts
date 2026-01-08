import { Aliases, Layer } from "../../types";

export class LayerAlias {

    private readonly LAYERS: Record<Layer, (path: string) => boolean> = {
        domain: (path) => this.isDomain(path),
        application: (path) => this.isApplication(path),
        infrastructure: (path) => this.isInfrastructure(path)
    };

    public readonly aliases: Aliases;

    constructor(
        private readonly domainAliases: string[],
        private readonly applicationAliases: string[],
        private readonly infrastructureAliases: string[]
    ) {
        this.aliases = {
            domain: this.domainAliases.map(this.setAliasAsPath),
            application: this.applicationAliases.map(this.setAliasAsPath),
            infrastructure: this.infrastructureAliases.map(this.setAliasAsPath)
        };
    }

    private setAliasAsPath(alias: string): string {
        return `/${alias}/`;
    }

    public isDomain(path: string): boolean {
        return this.isAliasInLayer(path, this.aliases.domain);
    }

    public isApplication(path: string): boolean {
        return this.isAliasInLayer(path, this.aliases.application);
    }

    public isInfrastructure(path: string): boolean {
        return this.isAliasInLayer(path, this.aliases.infrastructure);
    }

    private isAliasInLayer(path: string, aliases: string[]) {
        return aliases.some(alias => path.includes(alias));
    }

    public getLayer(path: string): Layer | undefined {
        return (Object.keys(this.LAYERS) as Layer[]).find(layer => this.LAYERS[layer](path));
    }
}
