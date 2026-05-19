import { Suite } from "../../../../types";

export const customInfrastructureLayerAllowedDependenciesSuite: Suite = {
    name: 'Infrastructure custom config with allowed dependencies',
    configuration: {
        layers: {
            infrastructure: {
                allowedDependencies: ['']
            }
        }
    },
    scenarios: [
        {
            name: 'Infrastructure layer with allowed application dependency can depend on application but not on infrastructure',
            file: 'architecture/typescript/src/infrastructure/infrastructure.ts',
            diagnostics: [ ]
        }
    ]
}; 
