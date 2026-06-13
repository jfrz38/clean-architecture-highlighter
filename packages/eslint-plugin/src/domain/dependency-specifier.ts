import * as path from 'node:path';

export class DependencySpecifier {
    private constructor(
        public readonly value: string,
        public readonly isTypeOnly: boolean
    ) { }

    public static from(value: unknown, isTypeOnly: boolean): DependencySpecifier | undefined {
        if (typeof value !== 'string') {
            return undefined;
        }

        return new DependencySpecifier(value, isTypeOnly);
    }

    public isExternal(): boolean {
        return !this.value.startsWith('.') && !path.isAbsolute(this.value);
    }
}
