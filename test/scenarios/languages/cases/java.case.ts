import { LanguageScenarioCase } from "../language-suite-builder";

export const javaLanguageCase: LanguageScenarioCase = {
    language: "java",
    displayName: "Java",
    enabledLanguages: ["java"],
    disabledLanguages: ["javascript", "typescript"],
    files: {
        domainDependsOnApplicationAndInfrastructure: "languages/java/src/main/java/com/example/domain/user/User.java",
        applicationDependsOnInfrastructure: "languages/java/src/main/java/com/example/application/usecases/CreateUser.java",
        infrastructureAllowed: "languages/java/src/main/java/com/example/infrastructure/persistence/SqlUserRepository.java",
        nestedLayer: "languages/java/src/main/java/com/example/application/usecases/CreateUser.java",
        outsideSourceFolder: "languages/java/notSrc/main/java/com/example/domain/user/User.java"
    },
    diagnostics: {
        domainInfrastructureLine: 2,
        domainApplicationLine: 3,
        applicationInfrastructureLine: 2,
        nestedLayerLine: 2
    }
};
