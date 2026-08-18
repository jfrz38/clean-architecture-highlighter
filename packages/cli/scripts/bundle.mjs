import esbuild from 'esbuild';
import packageJson from '../package.json' with { type: 'json' };

await esbuild.build({
  entryPoints: {
    index: './src/index.ts',
    bin: './src/bin.ts'
  },
  bundle: true,
  outdir: 'dist',
  format: 'esm',
  platform: 'node',
  target: 'node22.12',
  define: {
    'globalThis.CLI_VERSION': JSON.stringify(packageJson.version)
  }
});
