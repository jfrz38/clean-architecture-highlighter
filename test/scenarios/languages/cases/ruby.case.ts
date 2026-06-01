import { LanguageScenarioCase } from "../language-suite-builder";

export const rubyLanguageCase: LanguageScenarioCase = {
    language: "ruby",
    displayName: "Ruby",
    enabledLanguages: ["ruby"],
    disabledLanguages: ["javascript", "typescript"],
    files: {
        domainDependsOnApplicationAndInfrastructure: "languages/ruby/src/domain/user.rb",
        applicationDependsOnInfrastructure: "languages/ruby/src/application/use_cases/create_user.rb",
        infrastructureAllowed: "languages/ruby/src/infrastructure/persistence/sql_user_repository.rb",
        nestedLayer: "languages/ruby/src/application/use_cases/create_user.rb",
        outsideSourceFolder: "languages/ruby/notSrc/domain/user.rb"
    },
    diagnostics: {
        domainInfrastructureLine: 0,
        domainApplicationLine: 1,
        applicationInfrastructureLine: 0,
        nestedLayerLine: 0
    }
};
