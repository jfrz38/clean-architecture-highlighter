import { Document } from '@jfrz38/clean-architecture-highlighter-core';

export class NativeDocumentPath {
    public static from(document: Document): string {
        const uri = document.uri as { fsPath?: string; path: string };
        return uri.fsPath ?? uri.path;
    }
}
