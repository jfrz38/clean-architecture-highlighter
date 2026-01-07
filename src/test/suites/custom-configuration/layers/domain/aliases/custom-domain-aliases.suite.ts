import { Suite } from "../../../../types";

export const customDomainLayerAliasesSuite: Suite = {
    name: 'Domain custom config with aliases',
    configuration: {
        layers: {
            domain: {
                aliases: ['my-domain-alias']
            }
        }
    },
    scenarios: [
        {
            name: 'Domain layer with alias should depend only from domain itself',
            file: 'src/aliases/my-domain-alias/domain.ts',
            diagnostics: [
                {
                    message: 'domain layer should not depend on infrastructure layer.',
                    severity: 'Warning',
                    startLine: 0,
                    endLine: 0
                },
                {
                    message: 'domain layer should not depend on application layer.',
                    severity: 'Warning',
                    startLine: 1,
                    endLine: 1
                }
            ]
        },
        {
            name: 'Original domain should not fail',
            file: 'src/domain/domain.ts',
            diagnostics: []
        }
    ]
}; 
