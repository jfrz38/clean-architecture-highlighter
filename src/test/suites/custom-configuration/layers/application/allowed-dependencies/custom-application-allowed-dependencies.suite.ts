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
            name: 'Application layer overrides default dependencies: can depend on infrastructure but not on domain unless explicitly configured',
            file: 'src/application/application.ts',
            diagnostics: [{
                    message: 'application layer should not depend on domain layer.',
                    severity: 'Warning',
                    startLine: 2,
                    endLine: 2
                }]
        }
    ]
}; 
