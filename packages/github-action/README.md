# Clean Architecture Highlighter GitHub Action

GitHub Action wrapper for [Clean Architecture Highlighter](https://github.com/jfrz38/clean-architecture-highlighter).

It runs the same dependency boundary checks as the CLI and fails the workflow when architecture violations are found.

## Usage

Check a repository on pull requests:

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

      - name: Check Clean Architecture boundaries
        uses: jfrz38/clean-architecture-highlighter/packages/github-action@github-action-v0
        with:
          path: .
          source-folder: src
          format: text
```

Use a configuration file:

```yaml
- name: Check Clean Architecture boundaries
  uses: jfrz38/clean-architecture-highlighter/packages/github-action@github-action-v0
  with:
    path: .
    config: clean-architecture.json
    format: json
```

Pin an exact action version if you prefer reproducible workflow behavior:

```yaml
uses: jfrz38/clean-architecture-highlighter/packages/github-action@github-action-v0.1.0
```

## Inputs

| Input | Description | Required | Default |
| ----- | ----------- | -------- | ------- |
| `path` | Project path or source folder to check. | No | `.` |
| `config` | Path to a JSON configuration file. | No | - |
| `source-folder` | Source folder relative to the project root. | No | - |
| `format` | Output format: `text` or `json`. | No | `text` |

## Behavior

The action exits successfully when no violations are found.

It fails the workflow when architecture violations are found or when configuration/runtime errors prevent the check from running.

## Configuration

The action delegates to the CLI check flow, so it uses the same JSON configuration format as the CLI.

See the [CLI configuration documentation](../cli/README.md#configuration) for examples.

## Version Tags

Recommended tag for most workflows:

```yaml
uses: jfrz38/clean-architecture-highlighter/packages/github-action@github-action-v0
```

Exact release tags are also available:

```yaml
uses: jfrz38/clean-architecture-highlighter/packages/github-action@github-action-v0.1.0
```
