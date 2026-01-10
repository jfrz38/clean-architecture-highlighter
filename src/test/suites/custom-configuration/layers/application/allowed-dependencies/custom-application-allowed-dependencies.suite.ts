import { Suite } from "../../../../types";

export const customApplicationLayerAllowedDependenciesSuite: Suite = {
    name: 'Application custom config with allowed dependencies',
    configuration: {
        layers: {
            application: {
                allowedDependencies: ['infrastructure']
            }
        }
    },
    scenarios: [
        {
            name: 'Application layer overrides default dependencies: can depend on infrastructure',
            file: 'src/application/application.ts',
            diagnostics: []
        }
    ]
}; 
