import * as path from 'node:path';
import { normalizePath } from './path-normalization';

export class DependencyPathResolver {
    constructor(private readonly sourceFilename: string) { }

    public resolve(dependency: string): string {
        if (path.isAbsolute(dependency)) {
            return normalizePath(dependency);
        }

        if (dependency.startsWith('.')) {
            return normalizePath(path.resolve(path.dirname(this.sourceFilename), dependency));
        }

        return normalizePath(dependency);
    }
}
