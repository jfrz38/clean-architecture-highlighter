import { LanguageScenarioCase } from "../language-suite-builder";

export const kotlinLanguageCase: LanguageScenarioCase = {
    language: "kotlin",
    displayName: "Kotlin",
    enabledLanguages: ["kotlin"],
    disabledLanguages: ["javascript", "typescript"],
    files: {
        domainDependsOnApplicationAndInfrastructure: "languages/kotlin/src/main/kotlin/com/example/domain/user/User.kt",
        applicationDependsOnInfrastructure: "languages/kotlin/src/main/kotlin/com/example/application/usecases/CreateUser.kt",
        infrastructureAllowed: "languages/kotlin/src/main/kotlin/com/example/infrastructure/persistence/SqlUserRepository.kt",
        nestedLayer: "languages/kotlin/src/main/kotlin/com/example/application/usecases/CreateUser.kt",
        outsideSourceFolder: "languages/kotlin/notSrc/main/kotlin/com/example/domain/user/User.kt"
    },
    diagnostics: {
        domainInfrastructureLine: 2,
        domainApplicationLine: 3,
        applicationInfrastructureLine: 2,
        nestedLayerLine: 2
    }
};
