# Clean Architecture Highlighter CLI

[![npm](https://img.shields.io/npm/v/@jfrz38/clean-architecture-highlighter-cli)](https://www.npmjs.com/package/@jfrz38/clean-architecture-highlighter-cli)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/jfrz38/clean-architecture-highlighter/build-cli.yml)](https://github.com/jfrz38/clean-architecture-highlighter/actions/workflows/build-cli.yml)
[![types](https://img.shields.io/npm/types/@jfrz38/clean-architecture-highlighter-cli)](https://www.npmjs.com/package/@jfrz38/clean-architecture-highlighter-cli)
[![license](https://img.shields.io/npm/l/@jfrz38/clean-architecture-highlighter-cli)](https://github.com/jfrz38/clean-architecture-highlighter/blob/main/LICENSE)
[![NPM Downloads](https://img.shields.io/npm/dm/@jfrz38/clean-architecture-highlighter-cli)](https://www.npmjs.com/package/@jfrz38/clean-architecture-highlighter-cli)

Command-line checker for [Clean Architecture Highlighter](https://github.com/jfrz38/clean-architecture-highlighter).

It statically analyzes source imports and reports dependency violations between Clean Architecture layers. It uses the same core rules as the VS Code extension, but is designed for terminal usage, scripts, and CI pipelines.

## Core idea

The CLI checks that dependencies between layers follow the configured architecture.

By default, the expected dependency direction is:

```text
infrastructure -> application -> domain
```

That means:

- `domain` can only depend on `domain`.
- `application` can depend on `application` and `domain`.
- `infrastructure` can depend on `infrastructure`, `application`, and `domain`.

If a source file imports something from a forbidden layer, the CLI prints the violation and exits with a failing status code.

## Installation

Using `npm`:

```bash
npm install -g @jfrz38/clean-architecture-highlighter-cli
```

Using `pnpm`:

```bash
pnpm add -g @jfrz38/clean-architecture-highlighter-cli
```

## Usage

Check the current project:

```bash
clean-arch check .
```

Check a source folder:

```bash
clean-arch check ./src
```

Check a source folder with explicit languages:

```bash
clean-arch check ./src --enabled-languages csharp,typescript
```

Check another project:

```bash
clean-arch check ../my-project
```

Use the long binary name if preferred:

```bash
clean-architecture-highlighter check .
```

## Output

Default output is text:

```text
src/domain/user.ts:1:1 domain layer should not depend on infrastructure layer.
```

JSON output is also available:

```bash
clean-arch check . --format json
```

## Parameters

| Parameter                  | Usage                                      | Mandatory | Default |
| -------------------------- | ------------------------------------------ | --------- | ------- |
| `<path>`                   | Project, source folder, or file to analyze | Yes       | -       |
| `--config <path>`          | Path to a JSON configuration file          | No        | -       |
| `--source-folder <folder>` | Source folder relative to the project root | No        | `src`   |
| `--enabled-languages <languages>` | Comma-separated language identifiers to analyze | No | `javascript,typescript` |
| `--format <format>`        | Output format: `text` or `json`            | No        | `text`  |

## Exit codes

| Code | Meaning |
| ---- | ------- |
| `0`  | No violations found |
| `1`  | Violations found |
| `2`  | Usage, configuration, or runtime error |

## Configuration

The CLI can be configured with a JSON file:

```bash
clean-arch check . --config clean-architecture.json
```

Example configuration:

```json
{
  "sourceFolder": "src",
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

`--source-folder` can be used to override the configured `sourceFolder` from the command line:

```bash
clean-arch check . --source-folder code
```

`--enabled-languages` can be used to override the configured `enabledLanguages` from the command line:

```bash
clean-arch check . --enabled-languages csharp,typescript
```

## Supported languages

JavaScript and TypeScript are enabled by default.

Additional supported languages can be enabled through `enabledLanguages`:

```json
{
  "enabledLanguages": [
    "javascript",
    "typescript",
    "csharp",
    "dart",
    "elixir",
    "go",
    "groovy",
    "java",
    "kotlin",
    "lua",
    "php",
    "python",
    "ruby",
    "rust",
    "scala"
  ]
}
```

They can also be enabled directly from the command line:

```bash
clean-arch check . --enabled-languages csharp,dart,go
```

## CI usage

The CLI is designed to fail the pipeline when architecture violations are found:

```bash
clean-arch check .
```

For GitHub Actions, a dedicated action wrapper is planned. Until then, the CLI can be installed and executed directly in a workflow.

## Relationship with the VS Code extension

The VS Code extension provides real-time diagnostics while editing.

This CLI provides the same kind of architecture validation from the terminal, making it suitable for CI checks, local scripts, and repositories where editor integration is not enough.
