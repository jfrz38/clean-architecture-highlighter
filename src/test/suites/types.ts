import { ConfigurationOptions } from "../../extension/configuration/types.configuration";

export type Scenario = {
    name: string,
    file: string,
    diagnostics: Diagnostic[]
}

export type Diagnostic = {
    message: string,
    severity: 'Warning' | 'Error',
    startLine: number,
    endLine: number

}

export type Suite = {
    name: string,
    configuration: DeepPartial<ConfigurationOptions>,
    scenarios: Scenario[]
}

type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> | null : T[P] | null;
};
