import { Suite } from "../types";

export const luaLanguageSuites: Suite[] = [
    {
        name: 'Lua enabled language',
        configuration: {
            enabledLanguages: ['lua']
        },
        scenarios: [
            {
                name: 'Lua violations should be analyzed when enabled',
                file: 'languages/lua/src/domain/user.lua',
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
        name: 'Lua disabled language',
        configuration: {
            enabledLanguages: ['javascript', 'typescript']
        },
        scenarios: [
            {
                name: 'Lua violations should be ignored when disabled',
                file: 'languages/lua/src/domain/user.lua',
                diagnostics: []
            }
        ]
    }
];
