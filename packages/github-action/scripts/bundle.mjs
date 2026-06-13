import esbuild from 'esbuild';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const workspacePackages = new Map([
  ['@jfrz38/clean-architecture-highlighter-cli', path.resolve(__dirname, '../../cli/src/check/run-check.ts')],
  ['@jfrz38/clean-architecture-highlighter-core', path.resolve(__dirname, '../../core/src/index.ts')]
]);

await esbuild.build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  outfile: 'dist/index.js',
  format: 'esm',
  platform: 'node',
  target: 'node24',
  plugins: [{
    name: 'workspace-packages',
    setup(build) {
      build.onResolve({ filter: /^@jfrz38\/clean-architecture-highlighter-(?:cli|core)$/ }, args => ({
        path: workspacePackages.get(args.path)
      }));
    }
  }]
});
