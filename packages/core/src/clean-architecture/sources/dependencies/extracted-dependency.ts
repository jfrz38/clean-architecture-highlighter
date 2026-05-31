import { DependencyPosition } from "./dependency-position";

export class ExtractedDependency {
    constructor(
        public readonly path: string,
        public readonly position: DependencyPosition,
    ) { }
}
