import { SupportedLanguageRegistry } from '../../infrastructure/languages/supported-language-registry';
import { SupportedLanguages } from '../ports/supported-languages';
import { UnsupportedLanguageError } from './enabled-languages-validation-error';

export class EnabledLanguagesValidator {
    constructor(
        private readonly supportedLanguages: SupportedLanguages = new SupportedLanguageRegistry()
    ) { }

    public validate(languages: string[]): void {
        const unsupported = languages.filter(language => !this.supportedLanguages.isSupportedLanguageId(language));

        if (unsupported.length > 0) {
            throw new UnsupportedLanguageError(unsupported);
        }
    }
}
