import { statSync } from 'node:fs';
import { dirname, join } from 'node:path';

export class FilesToCheckTarget {

    public static fromPath(targetPath: string, sourceFolder: string): FilesToCheckTarget {
        const targetStat = statSync(targetPath);
        if (targetStat.isFile()) {
            return new FilesToCheckTarget(dirname(dirname(targetPath)), dirname(targetPath), targetPath, targetPath);
        }

        const sourceFolderPath = join(targetPath, sourceFolder);
        try {
            if (statSync(sourceFolderPath).isDirectory()) {
                return new FilesToCheckTarget(targetPath, targetPath, sourceFolderPath);
            }
        } catch {
            // The input path can already be the source folder.
        }

        return new FilesToCheckTarget(dirname(targetPath), targetPath, targetPath);
    }

    private constructor(
        public readonly projectRoot: string,
        public readonly outputRoot: string,
        public readonly sourcePath: string,
        public readonly filePath?: string
    ) { }
}
