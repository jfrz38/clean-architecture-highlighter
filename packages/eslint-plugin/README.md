# Clean Architecture Highlighter ESLint Plugin

[![npm](https://img.shields.io/npm/v/@jfrz38/eslint-plugin-clean-architecture-highlighter)](https://www.npmjs.com/package/@jfrz38/eslint-plugin-clean-architecture-highlighter)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/jfrz38/clean-architecture-highlighter/build-eslint-plugin.yml)](https://github.com/jfrz38/clean-architecture-highlighter/actions/workflows/build-eslint-plugin.yml)
[![types](https://img.shields.io/npm/types/@jfrz38/eslint-plugin-clean-architecture-highlighter)](https://www.npmjs.com/package/@jfrz38/eslint-plugin-clean-architecture-highlighter)
[![license](https://img.shields.io/npm/l/@jfrz38/eslint-plugin-clean-architecture-highlighter)](https://github.com/jfrz38/clean-architecture-highlighter/blob/main/LICENSE)
[![NPM Downloads](https://img.shields.io/npm/dm/@jfrz38/eslint-plugin-clean-architecture-highlighter)](https://www.npmjs.com/package/@jfrz38/eslint-plugin-clean-architecture-highlighter)

ESLint adapter for [Clean Architecture Highlighter](https://github.com/jfrz38/clean-architecture-highlighter).

It reports forbidden dependencies between Clean Architecture layers through normal ESLint diagnostics, so violations can appear in editors, local lint runs, and CI pipelines that already run ESLint.

## Installation

Using `npm`:

```bash
npm install --save-dev @jfrz38/eslint-plugin-clean-architecture-highlighter
```

Using `pnpm`:

```bash
pnpm add -D @jfrz38/eslint-plugin-clean-architecture-highlighter
```

## Flat Config Usage

```js
import cleanArchitecture from '@jfrz38/eslint-plugin-clean-architecture-highlighter';

export default [
  {
    plugins: {
      'clean-architecture-highlighter': cleanArchitecture,
    },
    rules: {
      'clean-architecture-highlighter/no-layer-violation': ['warn', {
        sourceFolder: 'src',
        layers: {
          domain: {
            aliases: ['domain'],
            allowedDependencies: ['domain'],
          },
          application: {
            aliases: ['application'],
            allowedDependencies: ['domain', 'application'],
          },
          infrastructure: {
            aliases: ['infrastructure'],
            allowedDependencies: ['domain', 'application', 'infrastructure'],
          },
        },
        ignoreTypeImports: false,
        ignoreExternalDependencies: true,
      }],
    },
  },
];
```

When no options are provided, the rule uses the default layer configuration from `@jfrz38/clean-architecture-highlighter-core`.

## Rule Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `sourceFolder` | `string` | unset | Only checks files inside this folder. Files outside it are ignored. |
| `layers.domain.aliases` | `string[]` | `['domain']` | Path fragments that identify the domain layer. |
| `layers.application.aliases` | `string[]` | `['application']` | Path fragments that identify the application layer. |
| `layers.infrastructure.aliases` | `string[]` | `['infrastructure']` | Path fragments that identify the infrastructure layer. |
| `layers.*.allowedDependencies` | `string[]` | core defaults | Layers that the source layer may depend on. |
| `ignoreTypeImports` | `boolean` | `false` | Ignores TypeScript `import type` and type-only re-exports when enabled. |
| `ignoreExternalDependencies` | `boolean` | `true` | Ignores package imports such as `react`, `express`, and `@scope/package`. |

## Supported Syntax

The rule reads ESLint AST nodes directly and does not use the regex-based JavaScript/TypeScript extractor from the core package.

Supported dependency declarations:

- `import ... from '...'`
- `import type ... from '...'`
- `export ... from '...'`
- `export * from '...'`
- `import('...')` when the specifier is a string literal
- `require('...')` when the specifier is a string literal

## Limitations

The first version uses path-based checks only. It resolves relative imports against the linted file path, but it does not perform TypeScript-aware module resolution.

Not supported yet:

- `tsconfig.json` `baseUrl`
- `tsconfig.json` `paths`
- aliases such as `@domain/*`
- directory index resolution
- extension probing beyond the path fragment present in the import

Use relative imports for MVP enforcement, or keep path alias support tracked as a separate enhancement.
