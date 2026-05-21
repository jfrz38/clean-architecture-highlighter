import { Dirent, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';

export class FilesToCheck {

    public readonly projectRoot: string;
    public readonly outputRoot: string;
    public readonly paths: string[];

    constructor(targetPath: string, sourceFolder: string) {
        const targetStat = statSync(targetPath);
        if (targetStat.isFile()) {
            this.projectRoot = dirname(dirname(targetPath));
            this.outputRoot = dirname(targetPath);
            this.paths = [targetPath];
            return;
        }

        const sourceFolderPath = join(targetPath, sourceFolder);
        try {
            if (statSync(sourceFolderPath).isDirectory()) {
                this.projectRoot = targetPath;
                this.outputRoot = targetPath;
                this.paths = this.collectFiles(sourceFolderPath);
                return;
            }
        } catch {
            // The input path can already be the source folder.
        }

        this.projectRoot = dirname(targetPath);
        this.outputRoot = targetPath;
        this.paths = this.collectFiles(targetPath);
    }

    private collectFiles(path: string): string[] {
        return readdirSync(path, { withFileTypes: true }).flatMap(entry => this.collectEntry(path, entry));
    }

    private collectEntry(parentPath: string, entry: Dirent): string[] {
        const path = join(parentPath, entry.name);
        if (entry.isDirectory()) {
            return this.collectFiles(path);
        }

        return entry.isFile() ? [path] : [];
    }
}
