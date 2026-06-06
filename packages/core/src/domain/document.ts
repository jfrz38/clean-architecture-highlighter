export type DocumentPosition = {
    line: number;
    character: number;
};

export type Document = {
    uri: {
        path: string;
    };
    getText(): string;
    positionAt(offset: number): DocumentPosition;
};
