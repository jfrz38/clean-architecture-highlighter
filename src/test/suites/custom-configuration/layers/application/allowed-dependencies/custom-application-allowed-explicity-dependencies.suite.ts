import { Suite } from "../../../../types";

export const customApplicationLayerAllowedExplicityDependenciesSuite: Suite = {
    name: 'Application custom config with allowed dependencies explicity configured',
    configuration: {
        layers: {
            application: {
                allowedDependencies: ['infrastructure', 'domain']
            }
        }
    },
    scenarios: [
        {
            name: 'Application layer overrides default dependencies: can depend on infrastructure and domain when explicitly configured',
            file: 'src/application/application.ts',
            diagnostics: []
        }
    ]
}; 
