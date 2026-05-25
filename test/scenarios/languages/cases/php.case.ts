import { LanguageScenarioCase } from "../language-suite-builder";

export const phpLanguageCase: LanguageScenarioCase = {
    language: "php",
    displayName: "PHP",
    enabledLanguages: ["php"],
    disabledLanguages: ["javascript", "typescript"],
    files: {
        domainDependsOnApplicationAndInfrastructure: "languages/php/src/domain/User/User.php",
        applicationDependsOnInfrastructure: "languages/php/src/application/UseCases/CreateUser.php",
        infrastructureAllowed: "languages/php/src/infrastructure/Persistence/SqlUserRepository.php",
        nestedLayer: "languages/php/src/application/UseCases/CreateUser.php",
        outsideSourceFolder: "languages/php/notSrc/domain/User/User.php"
    },
    diagnostics: {
        domainInfrastructureLine: 4,
        domainApplicationLine: 5,
        applicationInfrastructureLine: 4,
        nestedLayerLine: 4
    }
};
