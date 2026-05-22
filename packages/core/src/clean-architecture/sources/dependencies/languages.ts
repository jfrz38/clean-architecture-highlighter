export class SupportedLanguageRegistry {

    private readonly languagesByExtension = new Map<string, string>([
        ['.js', 'javascript'],
        ['.mjs', 'javascript'],
        ['.cjs', 'javascript'],
        ['.ts', 'typescript'],
        ['.mts', 'typescript'],
        ['.cts', 'typescript'],
        ['.cs', 'csharp'],
        ['.csx', 'csharp'],
        ['.dart', 'dart'],
        ['.ex', 'elixir'],
        ['.exs', 'elixir'],
        ['.go', 'go'],
        ['.groovy', 'groovy'],
        ['.gvy', 'groovy'],
        ['.gy', 'groovy'],
        ['.gsh', 'groovy'],
        ['.java', 'java'],
        ['.kt', 'kotlin'],
        ['.kts', 'kotlin'],
        ['.lua', 'lua'],
        ['.php', 'php'],
        ['.php3', 'php'],
        ['.php4', 'php'],
        ['.php5', 'php'],
        ['.phtml', 'php'],
        ['.py', 'python'],
        ['.rb', 'ruby'],
        ['.rs', 'rust'],
        ['.scala', 'scala'],
        ['.sc', 'scala']
    ]);

    public getLanguageIdFromExtension(extension: string): string | undefined {
        return this.languagesByExtension.get(extension.toLowerCase());
    }
}
