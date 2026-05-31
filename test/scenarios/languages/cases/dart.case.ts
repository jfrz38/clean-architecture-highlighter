import { LanguageScenarioCase } from "../language-suite-builder";

export const dartLanguageCase: LanguageScenarioCase = {
    language: "dart",
    displayName: "Dart",
    enabledLanguages: ["dart"],
    disabledLanguages: ["javascript", "typescript"],
    files: {
        domainDependsOnApplicationAndInfrastructure: "languages/dart/src/domain/user/user.dart",
        applicationDependsOnInfrastructure: "languages/dart/src/application/use_cases/create_user.dart",
        infrastructureAllowed: "languages/dart/src/infrastructure/persistence/sql_user_repository.dart",
        nestedLayer: "languages/dart/src/application/use_cases/create_user.dart",
        outsideSourceFolder: "languages/dart/notSrc/domain/user/user.dart"
    },
    diagnostics: {
        domainInfrastructureLine: 0,
        domainApplicationLine: 1,
        applicationInfrastructureLine: 0,
        nestedLayerLine: 0
    }
};
