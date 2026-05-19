import { Suite } from "../types";

export const dartLanguageSuites: Suite[] = [
    {
        name: 'Dart enabled language',
        configuration: {
            enabledLanguages: ['dart']
        },
        scenarios: [
            {
                name: 'Dart violations should be analyzed when enabled',
                file: 'languages/dart/src/domain/user/user.dart',
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
        name: 'Dart disabled language',
        configuration: {
            enabledLanguages: ['javascript', 'typescript']
        },
        scenarios: [
            {
                name: 'Dart violations should be ignored when disabled',
                file: 'languages/dart/src/domain/user/user.dart',
                diagnostics: []
            }
        ]
    }
];
