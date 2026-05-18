import { Suite } from "../types";

export const javascriptLanguageSuites: Suite[] = [
    {
        name: 'JavaScript enabled language',
        configuration: {},
        scenarios: [
            {
                name: 'JavaScript violations should be analyzed when enabled',
                file: 'languages/javascript/src/domain/domain.js',
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
        name: 'JavaScript disabled language',
        configuration: {
            enabledLanguages: ['typescript']
        },
        scenarios: [
            {
                name: 'JavaScript violations should be ignored when disabled',
                file: 'languages/javascript/src/domain/domain.js',
                diagnostics: []
            }
        ]
    }
];
