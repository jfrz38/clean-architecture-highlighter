const esbuild = require('esbuild');
const { version } = require('../package.json');

esbuild.buildSync({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  outfile: 'dist/index.js',
  format: 'cjs',
  platform: 'node',
  target: 'node20',
  define: {
    'globalThis.CLI_VERSION': JSON.stringify(version)
  }
});
