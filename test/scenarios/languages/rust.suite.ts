import { Suite } from "../types";

export const rustLanguageSuites: Suite[] = [
    {
        name: 'Rust enabled language',
        configuration: {
            enabledLanguages: ['rust']
        },
        scenarios: [
            {
                name: 'Rust violations should be analyzed when enabled',
                file: 'languages/rust/src/domain/user.rs',
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
        name: 'Rust disabled language',
        configuration: {
            enabledLanguages: ['javascript', 'typescript']
        },
        scenarios: [
            {
                name: 'Rust violations should be ignored when disabled',
                file: 'languages/rust/src/domain/user.rs',
                diagnostics: []
            }
        ]
    }
];
