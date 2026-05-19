import { Suite } from "../types";

export const csharpLanguageSuites: Suite[] = [
    {
        name: 'C# enabled language',
        configuration: {
            enabledLanguages: ['csharp']
        },
        scenarios: [
            {
                name: 'C# violations should be analyzed when enabled',
                file: 'languages/csharp/src/Example.Domain/User/User.cs',
                diagnostics: [
                    {
                        message: 'domain layer should not depend on infrastructure layer.',
                        severity: 'Warning' as const,
                        startLine: 2,
                        endLine: 2
                    },
                    {
                        message: 'domain layer should not depend on application layer.',
                        severity: 'Warning' as const,
                        startLine: 3,
                        endLine: 3
                    }
                ]
            }
        ]
    },
    {
        name: 'C# disabled language',
        configuration: {
            enabledLanguages: ['javascript', 'typescript']
        },
        scenarios: [
            {
                name: 'C# violations should be ignored when disabled',
                file: 'languages/csharp/src/Example.Domain/User/User.cs',
                diagnostics: []
            }
        ]
    }
];
