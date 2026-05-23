import { LanguageScenarioCase } from "../language-suite-builder";

export const javascriptLanguageCase: LanguageScenarioCase = {
    language: "javascript",
    displayName: "JavaScript",
    enabledLanguages: ["javascript"],
    disabledLanguages: ["typescript"],
    files: {
        domainDependsOnApplicationAndInfrastructure: "languages/javascript/src/domain/domain.js",
        applicationDependsOnInfrastructure: "languages/javascript/src/application/application.js",
        infrastructureAllowed: "languages/javascript/src/infrastructure/infrastructure.js",
        nestedLayer: "languages/javascript/src/application/use-case/my-business.use-case.js",
        outsideSourceFolder: "languages/javascript/notSrc/domain/domain.js"
    },
    diagnostics: {
        domainInfrastructureLine: 0,
        domainApplicationLine: 1,
        applicationInfrastructureLine: 0,
        nestedLayerLine: 0
    }
};
