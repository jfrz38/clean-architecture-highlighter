import { TextDocument } from "vscode";
import { ExtractedDependency } from "../extracted-dependency";
import { DependencyExtractor } from "./dependency-extractor";

export abstract class DelimitedDependencyExtractor implements DependencyExtractor {

    private readonly delimiterRegex: RegExp;

    protected constructor(delimiter = '/') {
        this.delimiterRegex = new RegExp(this.escapeRegExp(delimiter), 'g');
    }

    public abstract extract(document: TextDocument): ExtractedDependency[];

    protected normalizeDependencyPath(path: string): string {
        const normalized = path.replace(this.delimiterRegex, '/');
        return `/${normalized}/`;
    }

    private escapeRegExp(value: string): string {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
