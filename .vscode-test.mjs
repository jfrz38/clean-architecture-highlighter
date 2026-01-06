import { defineConfig } from '@vscode/test-cli';

export default defineConfig([
	{
		label: 'all',
		files: 'out/test/**/*.test.js',
		launchArgs:[ '--disable-extensions' ]
	},
	{
		label: 'unit-tests',
		files: 'out/test/unit-testing/**/*.test.js',
		launchArgs:[ '--disable-extensions' ]
	},
	{
		label: 'integration',
		files: 'out/test/integration/runTest.js',
		launchArgs:[ '--disable-extensions' ]
	}
]);
