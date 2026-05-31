export class CliLogger {
    public static readonly silent = new CliLogger(false);

    constructor(private readonly verbose: boolean) { }

    public info(message: string): void {
        if (this.verbose) {
            console.error(message);
        }
    }

    public warn(message: string): void {
        console.warn(`Warning: ${message}`);
    }
}
