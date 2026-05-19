import { Suite } from "../types";

export const scalaLanguageSuites: Suite[] = [
    {
        name: 'Scala enabled language',
        configuration: {
            enabledLanguages: ['scala']
        },
        scenarios: [
            {
                name: 'Scala violations should be analyzed when enabled',
                file: 'languages/scala/src/main/scala/com/example/domain/user/User.scala',
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
        name: 'Scala disabled language',
        configuration: {
            enabledLanguages: ['javascript', 'typescript']
        },
        scenarios: [
            {
                name: 'Scala violations should be ignored when disabled',
                file: 'languages/scala/src/main/scala/com/example/domain/user/User.scala',
                diagnostics: []
            }
        ]
    }
];
