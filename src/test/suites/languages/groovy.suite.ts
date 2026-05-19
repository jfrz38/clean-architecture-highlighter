import { Suite } from "../types";

export const groovyLanguageSuites: Suite[] = [
    {
        name: 'Groovy enabled language',
        configuration: {
            enabledLanguages: ['groovy']
        },
        scenarios: [
            {
                name: 'Groovy violations should be analyzed when enabled',
                file: 'languages/groovy/src/main/groovy/com/example/domain/user/User.groovy',
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
        name: 'Groovy disabled language',
        configuration: {
            enabledLanguages: ['javascript', 'typescript']
        },
        scenarios: [
            {
                name: 'Groovy violations should be ignored when disabled',
                file: 'languages/groovy/src/main/groovy/com/example/domain/user/User.groovy',
                diagnostics: []
            }
        ]
    }
];
