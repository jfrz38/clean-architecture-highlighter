import { InvalidArgumentError } from 'commander';
import { EnabledLanguages } from '@jfrz38/clean-architecture-highlighter-core';

export class CliEnabledLanguages {

    public static parse(value: string): EnabledLanguages {
        const languages = value.split(',')
            .map(language => language.trim())
            .filter(language => language.length > 0);

        if (languages.length === 0) {
            throw new InvalidArgumentError('Expected at least one language identifier.');
        }

        return languages;
    }
}
