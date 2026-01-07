import { Suite } from "../../../../types";

export const customApplicationLayerAliasesSuite: Suite = {
    name: 'Application custom config',
    configuration: {
        layers: {
            application: {
                aliases: ['my-application-alias']
            }
        }
    },
    scenarios: [
        {
            name: 'Application layer with alias should depend only from domain and application itself',
            file: 'src/aliases/my-application-alias/application.ts',
            diagnostics: [
                {
                    message: 'application layer should not depend on infrastructure layer.',
                    severity: 'Warning',
                    startLine: 0,
                    endLine: 0
                }
            ]
        },
        {
            name: 'Original application should not fail',
            file: 'src/application/application.ts',
            diagnostics: []
        }
    ]
}; 
