import { Suite } from "../types";

export type LanguageScenarioCase = {
    language: string;
    displayName: string;
    enabledLanguages: string[];
    disabledLanguages: string[];
    files: {
        domainDependsOnApplicationAndInfrastructure: string;
        applicationDependsOnInfrastructure: string;
        infrastructureAllowed: string;
        nestedLayer: string;
        outsideSourceFolder: string;
    };
    diagnostics: {
        domainInfrastructureLine: number;
        domainApplicationLine: number;
        domainApplicationEndLine?: number;
        applicationInfrastructureLine: number;
        nestedLayerLine: number;
    };
};

export function buildLanguageSuites(languageCase: LanguageScenarioCase): Suite[] {
    const { displayName, enabledLanguages, disabledLanguages, files, diagnostics } = languageCase;

    return [
        {
            name: `${displayName} architecture matrix`,
            configuration: {
                enabledLanguages
            },
            scenarios: [
                {
                    name: `${displayName} domain layer should not depend on infrastructure or application`,
                    file: files.domainDependsOnApplicationAndInfrastructure,
                    diagnostics: [
                        warning(
                            "domain layer should not depend on infrastructure layer.",
                            diagnostics.domainInfrastructureLine
                        ),
                        warning(
                            "domain layer should not depend on application layer.",
                            diagnostics.domainApplicationLine,
                            diagnostics.domainApplicationEndLine
                        )
                    ]
                },
                {
                    name: `${displayName} application layer should not depend on infrastructure`,
                    file: files.applicationDependsOnInfrastructure,
                    diagnostics: [
                        warning(
                            "application layer should not depend on infrastructure layer.",
                            diagnostics.applicationInfrastructureLine
                        )
                    ]
                },
                {
                    name: `${displayName} infrastructure layer can depend on any layer`,
                    file: files.infrastructureAllowed,
                    diagnostics: []
                },
                {
                    name: `${displayName} nested layer folders should be detected`,
                    file: files.nestedLayer,
                    diagnostics: [
                        warning(
                            "application layer should not depend on infrastructure layer.",
                            diagnostics.nestedLayerLine
                        )
                    ]
                }
            ]
        },
        {
            name: `${displayName} source folder filtering`,
            configuration: {
                enabledLanguages,
                sourceFolder: "src"
            },
            scenarios: [
                {
                    name: `${displayName} files outside sourceFolder should be ignored`,
                    file: files.outsideSourceFolder,
                    diagnostics: []
                }
            ]
        },
        {
            name: `${displayName} disabled language`,
            configuration: {
                enabledLanguages: disabledLanguages
            },
            scenarios: [
                {
                    name: `${displayName} violations should be ignored when disabled`,
                    file: files.domainDependsOnApplicationAndInfrastructure,
                    diagnostics: []
                }
            ]
        }
    ];
}

function warning(message: string, line: number, endLine = line) {
    return {
        message,
        severity: "Warning" as const,
        startLine: line,
        endLine
    };
}
