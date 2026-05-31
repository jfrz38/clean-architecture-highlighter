import { SupportedLanguageRegistry } from './languages';
import { UnsupportedLanguageError } from './enabled-languages-validation-error';

export class EnabledLanguagesValidator {
    private readonly supportedLanguages = new SupportedLanguageRegistry();

    public validate(languages: string[]): void {
        const unsupported = languages.filter(language => !this.supportedLanguages.isSupportedLanguageId(language));

        if (unsupported.length > 0) {
            throw new UnsupportedLanguageError(unsupported);
        }
    }
}
