export class DependencyPosition {
    
    constructor(
        public readonly lineStart: number,
        public readonly start: number,
        public readonly lineEnd: number,
        public readonly end: number,
    ) {}
}
