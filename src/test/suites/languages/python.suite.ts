import { Suite } from "../types";

export const pythonLanguageSuites: Suite[] = [
    {
        name: 'Python enabled language',
        configuration: {
            enabledLanguages: ['python']
        },
        scenarios: [
            {
                name: 'Python violations should be analyzed when enabled',
                file: 'languages/python/src/domain/domain.py',
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
        name: 'Python disabled language',
        configuration: {
            enabledLanguages: ['javascript', 'typescript']
        },
        scenarios: [
            {
                name: 'Python violations should be ignored when disabled',
                file: 'languages/python/src/domain/domain.py',
                diagnostics: []
            }
        ]
    }
];
