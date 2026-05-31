import { LanguageScenarioCase } from "../language-suite-builder";

export const goLanguageCase: LanguageScenarioCase = {
    language: "go",
    displayName: "Go",
    enabledLanguages: ["go"],
    disabledLanguages: ["javascript", "typescript"],
    files: {
        domainDependsOnApplicationAndInfrastructure: "languages/go/src/domain/user/user.go",
        applicationDependsOnInfrastructure: "languages/go/src/application/usecases/create_user.go",
        infrastructureAllowed: "languages/go/src/infrastructure/persistence/sql_user_repository.go",
        nestedLayer: "languages/go/src/application/usecases/create_user.go",
        outsideSourceFolder: "languages/go/notSrc/domain/user/user.go"
    },
    diagnostics: {
        domainInfrastructureLine: 3,
        domainApplicationLine: 4,
        applicationInfrastructureLine: 2,
        nestedLayerLine: 2
    }
};
