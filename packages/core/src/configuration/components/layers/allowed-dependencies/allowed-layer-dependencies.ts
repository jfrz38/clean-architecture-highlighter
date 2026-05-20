export class AllowedLayerDependencies {
    public readonly value: string[];

    constructor(readonly defaults: string[], readonly overrides: string[] = []) {
        this.value = Array.from(new Set(
            [...defaults, ...overrides]
                .map(layer => layer.trim())
                .filter(layer => layer.length > 0)
        ));
    }
}
