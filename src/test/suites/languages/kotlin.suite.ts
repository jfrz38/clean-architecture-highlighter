import { Suite } from "../types";

export const kotlinLanguageSuites: Suite[] = [
    {
        name: 'Kotlin enabled language',
        configuration: {
            enabledLanguages: ['kotlin']
        },
        scenarios: [
            {
                name: 'Kotlin violations should be analyzed when enabled',
                file: 'languages/kotlin/src/main/kotlin/com/example/domain/user/User.kt',
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
        name: 'Kotlin disabled language',
        configuration: {
            enabledLanguages: ['javascript', 'typescript']
        },
        scenarios: [
            {
                name: 'Kotlin violations should be ignored when disabled',
                file: 'languages/kotlin/src/main/kotlin/com/example/domain/user/User.kt',
                diagnostics: []
            }
        ]
    }
];
