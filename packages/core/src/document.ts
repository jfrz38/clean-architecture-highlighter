export type DocumentPosition = {
    line: number;
    character: number;
};

export type CoreDocument = {
    uri: {
        path: string;
    };
    getText(): string;
    positionAt(offset: number): DocumentPosition;
};
