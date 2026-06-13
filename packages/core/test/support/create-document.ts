import { Document, DocumentPosition } from '../../src/domain/document';
import { SourceUri } from '../../src/domain/sources/source-uri';

export function createDocument(options: { content: string; language?: string }): Document {
    return {
        uri: new SourceUri(''),
        getText: () => options.content,
        positionAt: (offset: number) => positionAt(options.content, offset)
    };
}

function positionAt(text: string, offset: number): DocumentPosition {
    const beforeOffset = text.slice(0, offset);
    const lines = beforeOffset.split(/\r\n|\r|\n/);

    return {
        line: lines.length - 1,
        character: lines[lines.length - 1].length
    };
}
