import { Suite } from "../types";

export const rubyLanguageSuites: Suite[] = [
    {
        name: 'Ruby enabled language',
        configuration: {
            enabledLanguages: ['ruby']
        },
        scenarios: [
            {
                name: 'Ruby violations should be analyzed when enabled',
                file: 'languages/ruby/src/domain/user.rb',
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
        name: 'Ruby disabled language',
        configuration: {
            enabledLanguages: ['javascript', 'typescript']
        },
        scenarios: [
            {
                name: 'Ruby violations should be ignored when disabled',
                file: 'languages/ruby/src/domain/user.rb',
                diagnostics: []
            }
        ]
    }
];
