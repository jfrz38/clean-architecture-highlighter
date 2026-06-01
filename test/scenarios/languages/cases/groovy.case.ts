import { LanguageScenarioCase } from "../language-suite-builder";

export const groovyLanguageCase: LanguageScenarioCase = {
    language: "groovy",
    displayName: "Groovy",
    enabledLanguages: ["groovy"],
    disabledLanguages: ["javascript", "typescript"],
    files: {
        domainDependsOnApplicationAndInfrastructure: "languages/groovy/src/main/groovy/com/example/domain/user/User.groovy",
        applicationDependsOnInfrastructure: "languages/groovy/src/main/groovy/com/example/application/usecases/CreateUser.groovy",
        infrastructureAllowed: "languages/groovy/src/main/groovy/com/example/infrastructure/persistence/SqlUserRepository.groovy",
        nestedLayer: "languages/groovy/src/main/groovy/com/example/application/usecases/CreateUser.groovy",
        outsideSourceFolder: "languages/groovy/notSrc/main/groovy/com/example/domain/user/User.groovy"
    },
    diagnostics: {
        domainInfrastructureLine: 2,
        domainApplicationLine: 3,
        applicationInfrastructureLine: 2,
        nestedLayerLine: 2
    }
};
