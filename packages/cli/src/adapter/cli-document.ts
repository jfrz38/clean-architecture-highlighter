import { Document, DocumentPosition, SourceUri } from '@jfrz38/clean-architecture-highlighter-core';

export class CliDocument implements Document {

    public readonly uri: SourceUri;

    constructor(path: string, private readonly content: string) {
        this.uri = new SourceUri(path);
    }

    public getText(): string {
        return this.content;
    }

    public positionAt(offset: number): DocumentPosition {
        const beforeOffset = this.content.slice(0, offset);
        const lines = beforeOffset.split(/\r\n|\r|\n/);

        return {
            line: lines.length - 1,
            character: lines[lines.length - 1].length
        };
    }
}
