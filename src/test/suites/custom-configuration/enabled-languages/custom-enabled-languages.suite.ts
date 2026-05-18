import { Suite } from "../../types";

export const customEnabledLanguagesSuite: Suite = {
    name: 'Custom enabled languages',
    configuration: {
        enabledLanguages: ['javascript']
    },
    scenarios: [
        {
            name: 'Disabled TypeScript language should not be analyzed',
            file: 'src/domain/domain.ts',
            diagnostics: []
        },
        {
            name: 'Enabled JavaScript language should still be analyzed',
            file: 'src/domain/domain.js',
            diagnostics: [
                {
                    message: 'domain layer should not depend on infrastructure layer.',
                    severity: 'Warning',
                    startLine: 0,
                    endLine: 0
                },
                {
                    message: 'domain layer should not depend on application layer.',
                    severity: 'Warning',
                    startLine: 1,
                    endLine: 1
                }
            ]
        }
    ]
};
