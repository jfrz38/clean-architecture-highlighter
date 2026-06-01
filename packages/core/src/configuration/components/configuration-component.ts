import { ConfigValue } from "../types.configuration";

export abstract class ConfigurationComponent<T extends ConfigValue> {

    private readonly _config: T;

    constructor(config: T | null | undefined, defaultValue: T) {
        this._config = config ?? defaultValue;
    }

    public get config(): T {
        return this._config;
    }
}
