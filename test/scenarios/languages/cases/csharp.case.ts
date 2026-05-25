import { LanguageScenarioCase } from "../language-suite-builder";

export const csharpLanguageCase: LanguageScenarioCase = {
    language: "csharp",
    displayName: "C#",
    enabledLanguages: ["csharp"],
    disabledLanguages: ["javascript", "typescript"],
    files: {
        domainDependsOnApplicationAndInfrastructure: "languages/csharp/src/Example.Domain/User/User.cs",
        applicationDependsOnInfrastructure: "languages/csharp/src/Example.Application/UseCases/CreateUser.cs",
        infrastructureAllowed: "languages/csharp/src/Example.Infrastructure/Persistence/SqlUserRepository.cs",
        nestedLayer: "languages/csharp/src/Example.Application/UseCases/CreateUser.cs",
        outsideSourceFolder: "languages/csharp/notSrc/Example.Domain/User/User.cs"
    },
    diagnostics: {
        domainInfrastructureLine: 2,
        domainApplicationLine: 3,
        applicationInfrastructureLine: 2,
        nestedLayerLine: 2
    }
};
