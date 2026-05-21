import { Dirent, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { FilesToCheckTarget } from './files-to-check-target';

export class FilesToCheck {

    public readonly projectRoot: string;
    public readonly outputRoot: string;
    public readonly paths: string[];

    constructor(target: FilesToCheckTarget) {
        this.projectRoot = target.projectRoot;
        this.outputRoot = target.outputRoot;
        this.paths = this.collectFilesFrom(target);
    }

    private collectFilesFrom(target: FilesToCheckTarget): string[] {
        return target.filePath ? [target.filePath] : this.collectFiles(target.sourcePath);
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
