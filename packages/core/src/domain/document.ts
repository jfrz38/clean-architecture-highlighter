import { SourceUri } from "./sources/source-uri";

export type DocumentPosition = {
    line: number;
    character: number;
};

export type Document = {
    uri: SourceUri;
    getText(): string;
    positionAt(offset: number): DocumentPosition;
};
