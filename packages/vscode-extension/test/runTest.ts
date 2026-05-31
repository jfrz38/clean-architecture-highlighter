import { runTests } from '@vscode/test-electron';
import * as path from 'path';

async function main() {
    try {
        delete process.env.ELECTRON_RUN_AS_NODE;

        const extensionDevelopmentPath = path.resolve(__dirname, '../..');
        const extensionTestsPath = path.resolve(__dirname);
        const testWorkspace = path.resolve(extensionDevelopmentPath, '../../test/fixtures');

        await runTests({
            extensionDevelopmentPath,
            extensionTestsPath,
            launchArgs: [testWorkspace],
        });
    } catch (err) {
        console.error('Failed to run tests');
        process.exit(1);
    }
}

main();
