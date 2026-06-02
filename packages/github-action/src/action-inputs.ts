import { EnabledLanguagesValidator, UnsupportedLanguageError } from '@jfrz38/clean-architecture-highlighter-core';
import type { EnabledLanguages } from '@jfrz38/clean-architecture-highlighter-core';
import type { OutputFormat, RunCheckInput } from '@jfrz38/clean-architecture-highlighter-cli';

export type ActionInputs = Pick<RunCheckInput, 'path' | 'config' | 'sourceFolder' | 'enabledLanguages' | 'format'>;

const enabledLanguagesValidator = new EnabledLanguagesValidator();

export function parseActionInputs(getInput: (name: string) => string): ActionInputs {
    return {
        path: getInput('path') || '.',
        config: optionalInput(getInput('config')),
        sourceFolder: optionalInput(getInput('source-folder')),
        enabledLanguages: parseEnabledLanguages(optionalInput(getInput('enabled-languages'))),
        format: parseFormat(getInput('format') || 'text')
    };
}

function optionalInput(value: string): string | undefined {
    return value === '' ? undefined : value;
}

function parseFormat(value: string): OutputFormat {
    if (value === 'text' || value === 'json') {
        return value;
    }

    throw new Error('Input format must be text or json.');
}

function parseEnabledLanguages(value: string | undefined): EnabledLanguages | undefined {
    if (!value) {
        return undefined;
    }

    const languages = value.split(',')
        .map(language => language.trim())
        .filter(language => language.length > 0);

    if (languages.length === 0) {
        throw new Error('Input enabled-languages must contain at least one language identifier.');
    }

    try {
        enabledLanguagesValidator.validate(languages);
    } catch (error) {
        if (error instanceof UnsupportedLanguageError) {
            throw new Error(error.message);
        }
        throw error;
    }

    return languages;
}
