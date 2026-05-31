import { CoreDocument, DocumentPosition } from '../../src/document';

export function createDocument(options: { content: string; language?: string }): CoreDocument {
    return {
        uri: {
            path: ''
        },
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
