export class SourceFolder {
    constructor(private readonly sourceFolder: string | undefined) {}

    public contains(documentPath: string): boolean {
        if (!this.sourceFolder) {
            return true;
        }

        const normalizedDocumentPath = this.normalize(documentPath);
        const normalizedSourceFolder = this.normalize(this.sourceFolder);

        return normalizedDocumentPath === normalizedSourceFolder
            || normalizedDocumentPath.startsWith(normalizedSourceFolder + '/')
            || normalizedDocumentPath.includes('/' + normalizedSourceFolder + '/');
    }

    private normalize(value: string): string {
        return value.replace(/\\/g, '/');
    }
}
