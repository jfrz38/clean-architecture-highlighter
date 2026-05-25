import { LanguageScenarioCase } from "../language-suite-builder";

export const luaLanguageCase: LanguageScenarioCase = {
    language: "lua",
    displayName: "Lua",
    enabledLanguages: ["lua"],
    disabledLanguages: ["javascript", "typescript"],
    files: {
        domainDependsOnApplicationAndInfrastructure: "languages/lua/src/domain/user.lua",
        applicationDependsOnInfrastructure: "languages/lua/src/application/use_cases/create_user.lua",
        infrastructureAllowed: "languages/lua/src/infrastructure/persistence/sql_user_repository.lua",
        nestedLayer: "languages/lua/src/application/use_cases/create_user.lua",
        outsideSourceFolder: "languages/lua/notSrc/domain/user.lua"
    },
    diagnostics: {
        domainInfrastructureLine: 0,
        domainApplicationLine: 1,
        applicationInfrastructureLine: 0,
        nestedLayerLine: 0
    }
};
