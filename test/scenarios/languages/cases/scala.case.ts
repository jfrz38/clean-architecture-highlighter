import { LanguageScenarioCase } from "../language-suite-builder";

export const scalaLanguageCase: LanguageScenarioCase = {
    language: "scala",
    displayName: "Scala",
    enabledLanguages: ["scala"],
    disabledLanguages: ["javascript", "typescript"],
    files: {
        domainDependsOnApplicationAndInfrastructure: "languages/scala/src/main/scala/com/example/domain/user/User.scala",
        applicationDependsOnInfrastructure: "languages/scala/src/main/scala/com/example/application/usecases/CreateUser.scala",
        infrastructureAllowed: "languages/scala/src/main/scala/com/example/infrastructure/persistence/SqlUserRepository.scala",
        nestedLayer: "languages/scala/src/main/scala/com/example/application/usecases/CreateUser.scala",
        outsideSourceFolder: "languages/scala/notSrc/main/scala/com/example/domain/user/User.scala"
    },
    diagnostics: {
        domainInfrastructureLine: 2,
        domainApplicationLine: 3,
        applicationInfrastructureLine: 2,
        nestedLayerLine: 2
    }
};
