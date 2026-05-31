import { InvalidArgumentError } from 'commander';
import { EnabledLanguages, EnabledLanguagesValidator, UnsupportedLanguageError } from '@jfrz38/clean-architecture-highlighter-core';

export class CliEnabledLanguagesParser {

    private static readonly validator = new EnabledLanguagesValidator();

    public static parse(value: string): EnabledLanguages {
        const languages = value.split(',')
            .map(language => language.trim())
            .filter(language => language.length > 0);

        if (languages.length === 0) {
            throw new InvalidArgumentError('Expected at least one language identifier.');
        }

        try {
            CliEnabledLanguagesParser.validator.validate(languages);
        } catch (error) {
            if (error instanceof UnsupportedLanguageError) {
                throw new InvalidArgumentError(error.message);
            }
            throw error;
        }

        return languages;
    }
}
