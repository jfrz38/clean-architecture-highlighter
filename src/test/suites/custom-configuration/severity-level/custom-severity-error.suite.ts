import { Suite } from "../../types";

export const customSeverityErrorSuite: Suite = {
    name: 'Severity error custom config',
    configuration: {
        severityLevel: 'error',
        sourceFolder: 'src'
    },
    scenarios: [
        {
            name: 'Application layer should depend only from domain and application itself',
            file: 'src/application/application.ts',
            diagnostics: [
                {
                    message: 'application layer should not depend on infrastructure layer.',
                    severity: 'Error',
                    startLine: 0,
                    endLine: 0
                }
            ]

        },
        {
            name: 'Application layer in inner folder should depend only from domain and application itself',
            file: 'src/application/use-case/my-business.use-case.ts',
            diagnostics: [
                {
                    message: 'application layer should not depend on infrastructure layer.',
                    severity: 'Error',
                    startLine: 0,
                    endLine: 0
                }
            ]
        },
        {
            name: 'Domain layer should depend only from domain itself',
            file: 'src/domain/domain.ts',
            diagnostics: [
                {
                    message: 'domain layer should not depend on infrastructure layer.',
                    severity: 'Error',
                    startLine: 0,
                    endLine: 0
                },
                {
                    message: 'domain layer should not depend on application layer.',
                    severity: 'Error',
                    startLine: 1,
                    endLine: 1
                }
            ]
        },
        {
            name: 'Domain layer when multiple import lines should depend only from domain itself',
            file: 'src/domain/other-domain.ts',
            diagnostics: [
                {
                    message: 'domain layer should not depend on infrastructure layer.',
                    severity: 'Error',
                    startLine: 0,
                    endLine: 2
                },
                {
                    message: 'domain layer should not depend on infrastructure layer.',
                    severity: 'Error',
                    startLine: 4,
                    endLine: 10
                },
                {
                    message: 'domain layer should not depend on application layer.',
                    severity: 'Error',
                    startLine: 11,
                    endLine: 11
                },
                {
                    message: 'domain layer should not depend on application layer.',
                    severity: 'Error',
                    startLine: 12,
                    endLine: 14
                }
            ]
        },
        {
            name: 'Infrastructure layer can depend any layer',
            file: 'src/infrastructure/infrastructure.ts',
            diagnostics: []
        },
        {
            name: 'Infrastructure layer when inner folder can depend any layer',
            file: 'src/infrastructure/controller/controller.ts',
            diagnostics: []
        },
        {
            name: 'Other source folder should not fail for application layer',
            file: 'newSrc/application/application.ts',
            diagnostics: []
        },
        {
            file: 'newSrc/domain/domain.ts',
            name: 'Other source folder should not fail for domain layer',
            diagnostics: []
        },
        {
            name: 'Other source folder should not fail for infrastructure layer',
            file: 'newSrc/infrastructure/infrastructure.ts',
            diagnostics: []
        }
    ]
}; 
