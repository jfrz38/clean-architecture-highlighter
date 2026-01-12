import { Suite } from "../../types";

export const allConfigs: Suite = {
    name: 'All configs created',
    configuration: {
        severityLevel: 'error',
        sourceFolder: 'newSrc',
        layers: {
            domain: {
                aliases: ['core'],
                allowedDependencies: ['application']
            },
            application: {
                aliases: ['app'],
                allowedDependencies: ['infrastructure']
            },
            infrastructure: {
                aliases: ['infra']
            }
        }
    },
    scenarios: [
        {
            name: 'Domain should fail when import infrastructure layer and not with application',
            file: 'newSrc/aliases/core/core.ts',
            diagnostics: [
                {
                    message: 'domain layer should not depend on infrastructure layer.',
                    severity: 'Error',
                    startLine: 2,
                    endLine: 2
                }
            ]
        },
        {
            name: 'Application should not fail when import infrastructure layer but domain is not override',
            file: 'newSrc/aliases/app/app.ts',
            diagnostics: []
        },
        {
            name: 'Infrastructure should fail when any dependency is allowed',
            file: 'newSrc/aliases/infra/infra.ts',
            diagnostics: []
        },
    ]
};
