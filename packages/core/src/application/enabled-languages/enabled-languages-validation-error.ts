export class UnsupportedLanguageError extends Error {
    public readonly unsupportedLanguages: string[];

    constructor(unsupportedLanguages: string[]) {
        const message = unsupportedLanguages.length === 1
            ? `Unsupported language identifier: ${unsupportedLanguages[0]}.`
            : `Unsupported language identifiers: ${unsupportedLanguages.join(', ')}.`;
        super(message);
        this.name = 'UnsupportedLanguageError';
        this.unsupportedLanguages = unsupportedLanguages;
    }
}
