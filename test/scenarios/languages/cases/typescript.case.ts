import { LanguageScenarioCase } from "../language-suite-builder";

export const typescriptLanguageCase: LanguageScenarioCase = {
    language: "typescript",
    displayName: "TypeScript",
    enabledLanguages: ["typescript"],
    disabledLanguages: ["javascript"],
    files: {
        domainDependsOnApplicationAndInfrastructure: "languages/typescript/src/domain/domain.ts",
        applicationDependsOnInfrastructure: "languages/typescript/src/application/application.ts",
        infrastructureAllowed: "languages/typescript/src/infrastructure/infrastructure.ts",
        nestedLayer: "languages/typescript/src/application/use-case/my-business.use-case.ts",
        outsideSourceFolder: "languages/typescript/notSrc/domain/domain.ts"
    },
    diagnostics: {
        domainInfrastructureLine: 0,
        domainApplicationLine: 1,
        applicationInfrastructureLine: 0,
        nestedLayerLine: 0
    }
};
