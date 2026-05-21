import { Suite } from "../types";

export const phpLanguageSuites: Suite[] = [
    {
        name: 'PHP enabled language',
        configuration: {
            enabledLanguages: ['php']
        },
        scenarios: [
            {
                name: 'PHP violations should be analyzed when enabled',
                file: 'languages/php/src/domain/User/User.php',
                diagnostics: [
                    {
                        message: 'domain layer should not depend on infrastructure layer.',
                        severity: 'Warning' as const,
                        startLine: 4,
                        endLine: 4
                    },
                    {
                        message: 'domain layer should not depend on application layer.',
                        severity: 'Warning' as const,
                        startLine: 5,
                        endLine: 5
                    }
                ]
            }
        ]
    },
    {
        name: 'PHP disabled language',
        configuration: {
            enabledLanguages: ['javascript', 'typescript']
        },
        scenarios: [
            {
                name: 'PHP violations should be ignored when disabled',
                file: 'languages/php/src/domain/User/User.php',
                diagnostics: []
            }
        ]
    }
];
