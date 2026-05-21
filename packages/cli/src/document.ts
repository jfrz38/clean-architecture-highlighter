import { CoreDocument, DocumentPosition } from '@jfrz38/clean-architecture-highlighter-core';

export class CliDocument implements CoreDocument {

    public readonly uri: { path: string };

    constructor(path: string, private readonly content: string) {
        this.uri = { path };
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
