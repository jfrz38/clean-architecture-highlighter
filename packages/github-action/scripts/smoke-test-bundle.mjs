import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('../../..', import.meta.url));

const result = spawnSync(process.execPath, ['packages/github-action/dist/index.js'], {
  cwd: repositoryRoot,
  env: {
    ...process.env,
    INPUT_PATH: 'packages/core',
    'INPUT_SOURCE-FOLDER': 'src',
    'INPUT_ENABLED-LANGUAGES': 'typescript',
    INPUT_FORMAT: 'text'
  },
  stdio: 'inherit'
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
