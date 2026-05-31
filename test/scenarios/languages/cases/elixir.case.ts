import { LanguageScenarioCase } from "../language-suite-builder";

export const elixirLanguageCase: LanguageScenarioCase = {
    language: "elixir",
    displayName: "Elixir",
    enabledLanguages: ["elixir"],
    disabledLanguages: ["javascript", "typescript"],
    files: {
        domainDependsOnApplicationAndInfrastructure: "languages/elixir/src/domain/user.ex",
        applicationDependsOnInfrastructure: "languages/elixir/src/application/use_cases/create_user.ex",
        infrastructureAllowed: "languages/elixir/src/infrastructure/persistence/sql_user_repository.ex",
        nestedLayer: "languages/elixir/src/application/use_cases/create_user.ex",
        outsideSourceFolder: "languages/elixir/notSrc/domain/user.ex"
    },
    diagnostics: {
        domainInfrastructureLine: 1,
        domainApplicationLine: 2,
        applicationInfrastructureLine: 1,
        nestedLayerLine: 1
    }
};
