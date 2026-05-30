export class SourceFolderNotFoundError extends Error {

    constructor(sourceFolder: string, targetPath: string) {
        super(`Source folder '${sourceFolder}' was not found under '${targetPath}'. Use --source-folder or pass the source folder path directly.`);
        this.name = 'SourceFolderNotFoundError';
    }
}
