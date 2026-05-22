import { Suite } from "../types";

export const goLanguageSuites: Suite[] = [
    {
        name: 'Go enabled language',
        configuration: {
            enabledLanguages: ['go']
        },
        scenarios: [
            {
                name: 'Go violations should be analyzed when enabled',
                file: 'languages/go/src/domain/user/user.go',
                diagnostics: [
                    {
                        message: 'domain layer should not depend on infrastructure layer.',
                        severity: 'Warning' as const,
                        startLine: 3,
                        endLine: 3
                    },
                    {
                        message: 'domain layer should not depend on application layer.',
                        severity: 'Warning' as const,
                        startLine: 4,
                        endLine: 4
                    }
                ]
            }
        ]
    },
    {
        name: 'Go disabled language',
        configuration: {
            enabledLanguages: ['javascript', 'typescript']
        },
        scenarios: [
            {
                name: 'Go violations should be ignored when disabled',
                file: 'languages/go/src/domain/user/user.go',
                diagnostics: []
            }
        ]
    }
];
