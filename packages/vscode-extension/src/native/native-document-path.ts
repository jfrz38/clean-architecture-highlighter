import { Document } from '@jfrz38/clean-architecture-highlighter-core';

type NativeDocumentUri = {
    readonly path: string;
    readonly fsPath?: string;
};

export class NativeDocumentPath {
    public static from(document: Document): string {
        const uri = document.uri as NativeDocumentUri;
        return uri.fsPath ?? uri.path;
    }
}
