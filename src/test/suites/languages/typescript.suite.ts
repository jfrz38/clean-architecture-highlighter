import { Suite } from "../types";

export const typescriptLanguageSuites: Suite[] = [
    {
        name: 'TypeScript enabled language',
        configuration: {},
        scenarios: [
            {
                name: 'TypeScript violations should be analyzed when enabled',
                file: 'languages/typescript/src/domain/domain.ts',
                diagnostics: [
                    {
                        message: 'domain layer should not depend on infrastructure layer.',
                        severity: 'Warning' as const,
                        startLine: 0,
                        endLine: 0
                    },
                    {
                        message: 'domain layer should not depend on application layer.',
                        severity: 'Warning' as const,
                        startLine: 1,
                        endLine: 1
                    }
                ]
            }
        ]
    },
    {
        name: 'TypeScript disabled language',
        configuration: {
            enabledLanguages: ['javascript']
        },
        scenarios: [
            {
                name: 'TypeScript violations should be ignored when disabled',
                file: 'languages/typescript/src/domain/domain.ts',
                diagnostics: []
            }
        ]
    }
];
