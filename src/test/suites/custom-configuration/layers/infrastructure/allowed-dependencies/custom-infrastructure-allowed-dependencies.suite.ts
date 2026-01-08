import { Suite } from "../../../../types";

export const customInfrastructureLayerAllowedDependenciesSuite: Suite = {
    name: 'Infrastructure custom config with allowed dependencies',
    configuration: {
        layers: {
            domain: {
                allowedDependencies: ['']
            }
        }
    },
    scenarios: [
        {
            name: 'Infrastructure layer with allowed application dependency can depend on application but not on infrastructure',
            file: 'src/infrastructure/infrastructure.ts',
            diagnostics: [ ]
        }
    ]
}; 
