import { normalizePath } from './path-normalization';

export class SourceFilePath {
    public readonly normalized: string;

    constructor(public readonly value: string) {
        this.normalized = normalizePath(value);
    }

    public isVirtual(): boolean {
        return this.value.startsWith('<') && this.value.endsWith('>');
    }

    public isInsideSourceFolder(sourceFolder: string | undefined): boolean {
        if (!sourceFolder) {
            return true;
        }

        const normalizedSourceFolder = normalizePath(sourceFolder).replace(/^\/+|\/+$/g, '');

        return this.normalized === normalizedSourceFolder
            || this.normalized.startsWith(`${normalizedSourceFolder}/`)
            || this.normalized.includes(`/${normalizedSourceFolder}/`);
    }
}
