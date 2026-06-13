export class SourceUri {
    public readonly path: string;

    constructor(path: string) {
        if (typeof path !== 'string') {
            throw new Error('SourceUri path must be a string.');
        }

        this.path = path;
    }
}
