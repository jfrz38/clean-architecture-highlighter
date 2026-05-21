export class InitialCwd {

    public static with<T>(initialCwd: string, callback: (initialCwd: string) => T): T {
        const previousInitialCwd = process.env.INIT_CWD;

        try {
            process.env.INIT_CWD = initialCwd;
            return callback(initialCwd);
        } finally {
            if (previousInitialCwd === undefined) {
                delete process.env.INIT_CWD;
            } else {
                process.env.INIT_CWD = previousInitialCwd;
            }
        }
    }
}
