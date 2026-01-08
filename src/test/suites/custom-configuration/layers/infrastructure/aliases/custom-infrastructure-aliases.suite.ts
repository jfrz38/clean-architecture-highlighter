import { Suite } from "../../../../types";

export const customInfrastructureLayerAliasesSuite: Suite = {
    name: 'Infrastructure custom config with aliases',
    configuration: {
        layers: {
            infrastructure: {
                aliases: ['my-infrastructure-alias']
            }
        }
    },
    scenarios: [
        {
            name: 'Infrastructure layer with alias can depend from any layer',
            file: 'src/aliases/my-infrastructure-alias/infrastructure.ts',
            diagnostics: []
        },
        {
            name: 'Original infrastructure should not fail',
            file: 'src/infrastructure/infrastructure.ts',
            diagnostics: []
        }
    ]
}; 
