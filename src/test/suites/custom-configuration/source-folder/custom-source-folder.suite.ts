import { Suite } from "../../types";

export const customSourceFolderSuite: Suite = {
    name: 'Source folder custom config',
    configuration: {
        sourceFolder: 'newSrc'
    },
    scenarios: [
        {
            name: 'Other source folder should fail for application layer',
            file: 'architecture/typescript/newSrc/application/application.ts',
            diagnostics: [
                {
                    message: 'application layer should not depend on infrastructure layer.',
                    severity: 'Warning',
                    startLine: 0,
                    endLine: 0
                }
            ]

        },
        {
            name: "Other source folder should fail for domain layer",
            file: "architecture/typescript/newSrc/domain/domain.ts",
            diagnostics: [
                {
                    message: "domain layer should not depend on infrastructure layer.",
                    severity: "Warning",
                    startLine: 0,
                    endLine: 0
                },
                {
                    message: "domain layer should not depend on application layer.",
                    severity: "Warning",
                    startLine: 1,
                    endLine: 1
                }
            ]
        },
        {
            name: "Other source folder should not fail for domain layer",
            file: "architecture/typescript/newSrc/infrastructure/infrastructure.ts",
            diagnostics: []
        },
        {
            name: 'Default source folder should not fail for application layer',
            file: 'architecture/typescript/src/application/application.ts',
            diagnostics: []
        },
        {
            name: "Default source folder should not fail for domain layer",
            file: "architecture/typescript/src/domain/domain.ts",
            diagnostics: []
        },
        {
            name: "Default source folder should not fail for infrastructure layer",
            file: "architecture/typescript/src/infrastructure/infrastructure.ts",
            diagnostics: []
        }
    ]
}; 
