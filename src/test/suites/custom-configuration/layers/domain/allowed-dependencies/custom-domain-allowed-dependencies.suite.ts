import { Suite } from "../../../../types";

export const customDomainLayerAllowedDependenciesSuite: Suite = {
    name: 'Domain custom config with allowed dependencies',
    configuration: {
        layers: {
            domain: {
                allowedDependencies: ['application']
            }
        }
    },
    scenarios: [
        {
            name: 'Domain layer with allowed application dependency can depend on application but not on infrastructure',
            file: 'src/domain/domain.ts',
            diagnostics: [
                {
                    message: 'domain layer should not depend on infrastructure layer.',
                    severity: 'Warning',
                    startLine: 0,
                    endLine: 0
                }
            ]
        },
        {
            name: 'Domain layer with allowed application dependency when multiple import lines can depend on application but not on infrastructure',
            file: "src/domain/other-domain.ts",
            diagnostics: [
                {
                    message: "domain layer should not depend on infrastructure layer.",
                    severity: "Warning",
                    startLine: 0,
                    endLine: 2
                },
                {
                    message: "domain layer should not depend on infrastructure layer.",
                    severity: "Warning",
                    startLine: 4,
                    endLine: 10
                }
            ]
        }
    ]
}; 
