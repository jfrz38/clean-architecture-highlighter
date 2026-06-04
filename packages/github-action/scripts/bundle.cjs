const esbuild = require('esbuild');

esbuild.buildSync({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  outfile: 'dist/index.js',
  format: 'cjs',
  platform: 'node',
  target: 'node24'
});
