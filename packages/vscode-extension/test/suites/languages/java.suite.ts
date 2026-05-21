import { Suite } from "../types";

export const javaLanguageSuites: Suite[] = [
    {
        name: 'Java enabled language',
        configuration: {
            enabledLanguages: ['java']
        },
        scenarios: [
            {
                name: 'Java violations should be analyzed when enabled',
                file: 'languages/java/src/main/java/com/example/domain/user/User.java',
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
        name: 'Java disabled language',
        configuration: {
            enabledLanguages: ['javascript', 'typescript']
        },
        scenarios: [
            {
                name: 'Java violations should be ignored when disabled',
                file: 'languages/java/src/main/java/com/example/domain/user/User.java',
                diagnostics: []
            }
        ]
    }
];
