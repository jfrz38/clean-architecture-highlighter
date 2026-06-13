export class NativeDependencyPath {
    public static normalize(dependencyPath: string): string {
        const normalizedPath = dependencyPath.replace(/\\/g, '/');
        return normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
    }
}
