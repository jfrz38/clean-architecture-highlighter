# Clean Architecture Highlighter

[![Build VS Code Extension](https://github.com/jfrz38/clean-architecture-highlighter/actions/workflows/build-vscode-extension.yml/badge.svg)](https://github.com/jfrz38/clean-architecture-highlighter/actions/workflows/build-vscode-extension.yml)
[![Build CLI](https://github.com/jfrz38/clean-architecture-highlighter/actions/workflows/build-cli.yml/badge.svg)](https://github.com/jfrz38/clean-architecture-highlighter/actions/workflows/build-cli.yml)
[![License](https://img.shields.io/github/license/jfrz38/clean-architecture-highlighter)](LICENSE)

Clean Architecture Highlighter is a monorepo for checking Clean Architecture dependency boundaries by statically analyzing imports.

The project contains a shared analysis engine in [`packages/core`](packages/core) and user-facing adapters:

| Package | Purpose |
| ------- | ------- |
| 🔗 [`packages/core`](packages/core) | Shared layer configuration, import extraction, dependency analysis, and violation reporting logic. |
| 🔗 [`packages/cli`](packages/cli) | Command-line checker for local scripts and CI pipelines. |
| 🔗 [`packages/eslint-plugin`](packages/eslint-plugin) | ESLint plugin that reports layer violations through ESLint diagnostics. |
| 🔗 [`packages/vscode-extension`](packages/vscode-extension) | VS Code extension that reports architecture violations as editor diagnostics. |

Use the **CLI** when you want a repeatable terminal or CI check. Use the **ESLint plugin** when you want violations in your existing JavaScript or TypeScript lint pipeline and editor ESLint integration. Use the **VS Code extension** when you want immediate feedback while editing. All adapters use the same core rules.

## Core Idea

The analyzer checks that dependencies between layers follow the configured architecture.

By default, the expected dependency direction is:

```text
infrastructure -> application -> domain
```

That means:

- `domain` can only depend on `domain`.
- `application` can depend on `application` and `domain`.
- `infrastructure` can depend on `infrastructure`, `application`, and `domain`.

If a source file imports something from a forbidden layer, the adapter reports a violation. The CLI prints it and can fail the process; the VS Code extension shows a diagnostic in the editor.

## Quick Start

### CLI

Install the CLI globally:

```bash
pnpm add -g @jfrz38/clean-architecture-highlighter-cli
```

Check a project or source folder:

```bash
clean-arch check .
clean-arch check ./src
```

The package also exposes the long binary name:

```bash
clean-architecture-highlighter check .
```

See the 🔗 [CLI README](packages/cli/README.md) for options, JSON output, exit codes, and CI usage.

![CLI output example](./images/cli_example.png)

### CI

The CLI exits with a non-zero status when it finds violations, so it can run directly in any CI pipeline. For example, in GitHub Actions:

```yaml
name: Clean Architecture

on:
  pull_request:
    branches:
      - main

jobs:
  clean-architecture:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v6

      - name: Setup Node
        uses: actions/setup-node@v7
        with:
          node-version: 24

      - name: Install Clean Architecture Highlighter
        run: npm install --global @jfrz38/clean-architecture-highlighter-cli

      - name: Check Clean Architecture boundaries
        run: clean-arch check . --source-folder src --enabled-languages typescript,csharp
```

See the 🔗 [CLI README](packages/cli/README.md#ci-usage) for CI behavior and exit codes.

### VS Code Extension

Install the extension from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=jfrz38.clean-architecture-highlighter).

The extension analyzes supported files in the workspace and reports dependency violations as VS Code diagnostics on file open and change.

See the 🔗 [VS Code extension README](packages/vscode-extension/README.md) for marketplace details, settings, and editor behavior.

![VS Code extension demo](./images/demo_extension.gif)

## Configuration

All adapters use the same layer model from `packages/core`.

Default configuration:

```json
{
  "enabledLanguages": ["javascript", "typescript"],
  "layers": {
    "domain": {
      "aliases": ["domain"],
      "allowedDependencies": ["domain"]
    },
    "application": {
      "aliases": ["application"],
      "allowedDependencies": ["application", "domain"]
    },
    "infrastructure": {
      "aliases": ["infrastructure"],
      "allowedDependencies": ["infrastructure", "application", "domain"]
    }
  }
}
```

`aliases` identify the folder names or import path fragments that belong to each layer. For example, if your application layer is stored in `business`, configure `business` as an alias for `application`.

Adapter-specific configuration format differs slightly:

- The CLI reads JSON configuration files and command-line options. See [CLI configuration](packages/cli/README.md#configuration).
- The ESLint plugin reads rule options from flat config. See [ESLint plugin usage](packages/eslint-plugin/README.md#flat-config-usage).
- The VS Code extension reads workspace or user settings under the `clean-architecture-highlighter.*` namespace. It also supports the extension-only `clean-architecture-highlighter.importResolution` setting for optional native JavaScript/TypeScript module resolution. See [extension settings](packages/vscode-extension/README.md#extension-settings).

### ESLint Plugin

Install the plugin in a JavaScript or TypeScript project:

```bash
pnpm add -D @jfrz38/eslint-plugin-clean-architecture-highlighter
```

Use it from ESLint flat config:

```js
import cleanArchitecture from '@jfrz38/eslint-plugin-clean-architecture-highlighter';

export default [{
  plugins: {
    'clean-architecture-highlighter': cleanArchitecture,
  },
  rules: {
    'clean-architecture-highlighter/no-layer-violation': ['warn', {
      sourceFolder: 'src',
    }],
  },
}];
```

See the 🔗 [ESLint plugin README](packages/eslint-plugin/README.md) for rule options and limitations around unresolved TypeScript path aliases.

## Supported Languages

JavaScript and TypeScript are enabled by default. Other languages are supported as opt-in languages through `enabledLanguages`.

| Language | Identifier | Enabled by default | Supported dependency syntax |
| -------- | ---------- | ------------------ | --------------------------- |
| JavaScript | `javascript` | Yes | Static ES Module `import ... from ...`; VS Code can opt in to native TypeScript-aware resolution |
| TypeScript | `typescript` | Yes | Static ES Module `import ... from ...`; VS Code can opt in to native TypeScript-aware resolution |
| C# | `csharp` | No | `using ...`, alias directives, static imports, and global usings |
| Dart | `dart` | No | `import ...`, `export ...`, `part ...`, aliases, and `show`/`hide` combinators |
| Elixir | `elixir` | No | `alias ...`, grouped aliases, `import ...`, `require ...`, and `use ...` |
| Go | `go` | No | Single-line imports, import blocks, aliased imports, dot imports, and blank imports |
| Groovy | `groovy` | No | Static `import ...`, `import static ...`, alias imports, and wildcard imports |
| Java | `java` | No | Static `import ...`, `import static ...`, and wildcard imports |
| Kotlin | `kotlin` | No | Static `import ...`, aliased `import ... as ...`, and wildcard imports |
| Lua | `lua` | No | `require(...)`, `require '...'`, and local assignment requires |
| PHP | `php` | No | Namespace `use ...`, aliases, grouped imports, and function/constant imports |
| Python | `python` | No | Static `import ...` and `from ... import ...` |
| Ruby | `ruby` | No | `require ...` and `require_relative ...` |
| Rust | `rust` | No | `use ...`, grouped imports, aliases, glob imports, and `mod ...` declarations |
| Scala | `scala` | No | Static `import ...`, grouped imports, aliases, exclusions, and wildcard imports |

## Known Limitations

For the current analysis limitations, see the 🔗 [core Known Limitations](packages/core/README.md#known-limitations).

## Integration Fixtures

Shared integration fixtures live in [`test/fixtures`](test/fixtures). They validate the same architecture scenarios across adapters and supported languages.

See the 🔗 [fixtures README](test/fixtures/README.md) for scenario organization and test matrix controls.

## The Dependency Rule

The arrows in the diagram below represent the only allowed direction for dependencies. Inner layers must not know anything about outer layers.

![Dependency rule](https://raw.githubusercontent.com/jfrz38/clean-architecture-highlighter/main/images/dependency_rule.png)
