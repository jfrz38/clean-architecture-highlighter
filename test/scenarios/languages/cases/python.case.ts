import { LanguageScenarioCase } from "../language-suite-builder";

export const pythonLanguageCase: LanguageScenarioCase = {
    language: "python",
    displayName: "Python",
    enabledLanguages: ["python"],
    disabledLanguages: ["javascript", "typescript"],
    files: {
        domainDependsOnApplicationAndInfrastructure: "languages/python/src/domain/domain.py",
        applicationDependsOnInfrastructure: "languages/python/src/application/use_cases/create_user.py",
        infrastructureAllowed: "languages/python/src/infrastructure/persistence/user_repository.py",
        nestedLayer: "languages/python/src/application/use_cases/create_user.py",
        outsideSourceFolder: "languages/python/notSrc/domain/domain.py"
    },
    diagnostics: {
        domainInfrastructureLine: 0,
        domainApplicationLine: 0,
        applicationInfrastructureLine: 0,
        nestedLayerLine: 0
    }
};
