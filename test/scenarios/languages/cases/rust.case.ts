import { LanguageScenarioCase } from "../language-suite-builder";

export const rustLanguageCase: LanguageScenarioCase = {
    language: "rust",
    displayName: "Rust",
    enabledLanguages: ["rust"],
    disabledLanguages: ["javascript", "typescript"],
    files: {
        domainDependsOnApplicationAndInfrastructure: "languages/rust/src/domain/user.rs",
        applicationDependsOnInfrastructure: "languages/rust/src/application/use_cases/create_user.rs",
        infrastructureAllowed: "languages/rust/src/infrastructure/persistence/sql_user_repository.rs",
        nestedLayer: "languages/rust/src/application/use_cases/create_user.rs",
        outsideSourceFolder: "languages/rust/notSrc/domain/user.rs"
    },
    diagnostics: {
        domainInfrastructureLine: 0,
        domainApplicationLine: 1,
        applicationInfrastructureLine: 0,
        nestedLayerLine: 0
    }
};
