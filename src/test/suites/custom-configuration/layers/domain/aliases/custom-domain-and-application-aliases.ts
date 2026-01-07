import { Suite } from "../../../../types";

export const customDomainAndApplicationLayerAliasesSuite: Suite = {
    name: 'Domain custom config',
    configuration: {
        layers: {
            domain: {
                aliases: ['my-domain-alias']
            },
            application: {
                aliases: ['my-application-alias']
            }
        }
    },
    scenarios: [
        {
            name: 'Domain layer with alias import other invalid layer with alias should fail',
            file: 'src/aliases/my-domain-alias/domain-import-application-alias.ts',
            diagnostics: [
                {
                    message: 'domain layer should not depend on application layer.',
                    severity: 'Warning',
                    startLine: 1,
                    endLine: 1
                },
                {
                    message: 'domain layer should not depend on infrastructure layer.',
                    severity: 'Warning',
                    startLine: 3,
                    endLine: 3
                }
            ]
        }
    ]
}; 
