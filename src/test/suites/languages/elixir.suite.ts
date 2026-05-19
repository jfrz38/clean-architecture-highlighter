import { Suite } from "../types";

export const elixirLanguageSuites: Suite[] = [
    {
        name: 'Elixir enabled language',
        configuration: {
            enabledLanguages: ['elixir']
        },
        scenarios: [
            {
                name: 'Elixir violations should be analyzed when enabled',
                file: 'languages/elixir/src/domain/user.ex',
                diagnostics: [
                    {
                        message: 'domain layer should not depend on infrastructure layer.',
                        severity: 'Warning' as const,
                        startLine: 1,
                        endLine: 1
                    },
                    {
                        message: 'domain layer should not depend on application layer.',
                        severity: 'Warning' as const,
                        startLine: 2,
                        endLine: 2
                    }
                ]
            }
        ]
    },
    {
        name: 'Elixir disabled language',
        configuration: {
            enabledLanguages: ['javascript', 'typescript']
        },
        scenarios: [
            {
                name: 'Elixir violations should be ignored when disabled',
                file: 'languages/elixir/src/domain/user.ex',
                diagnostics: []
            }
        ]
    }
];
