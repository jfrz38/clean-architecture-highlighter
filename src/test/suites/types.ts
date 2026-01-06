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
    configuration: object,
    scenarios: Scenario[]
}
