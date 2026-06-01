# Clean Architecture Highlighter Core

Shared analysis engine for Clean Architecture Highlighter.

This package contains the logic used by both user-facing adapters:

- [`packages/cli`](../cli), for terminal and CI checks.
- [`packages/vscode-extension`](../vscode-extension), for VS Code diagnostics.

## Responsibilities

`packages/core` owns the adapter-independent behavior:

- Default layer configuration for `domain`, `application`, and `infrastructure`.
- Layer alias matching.
- Dependency rule validation.
- Language-aware static dependency extraction.
- Architecture violation data structures.

Adapters are responsible for reading their own configuration format, selecting files, invoking the core analyzer, and presenting results.

## Boundaries

Core code should stay independent from adapter concerns:

- No VS Code APIs.
- No terminal formatting, process exit behavior, or command-line parsing.
- No package registry or marketplace-specific behavior.
- No adapter-specific configuration names such as `clean-architecture-highlighter.*`.

Changes to architecture rules, default layer behavior, language dependency extraction, or violation semantics belong here. Changes to diagnostics, CLI output, exit codes, editor activation, or package publishing belong in the relevant adapter.

## Known Limitations

The analyzer only checks supported static dependency syntax. Runtime dependency injection, reflection, generated code, package manager metadata, and framework-level autoloading are not resolved unless they appear in supported import statements.

| Language | Limitation |
| -------- | ---------- |
| JavaScript/TypeScript | CommonJS `require()` and dynamic imports are not supported. |
| C# | Project-level MSBuild references and runtime dependency injection are not resolved. |
| Dart | `pubspec.yaml`, generated part files, and runtime dependency loading are not resolved. |
| Elixir | Macro expansion, behaviours, and runtime application configuration are not resolved. |
| Go | Runtime dependency injection and non-import-based dependencies are not supported. |
| Groovy | Default imports, runtime metaprogramming, and non-import-based dependencies are not supported. |
| Java | Runtime dependency injection and non-import-based dependencies are not supported. |
| Kotlin | Runtime dependency injection and non-import-based dependencies are not supported. |
| Lua | Custom `package.path` loaders and runtime dependency loading are not resolved. |
| PHP | Composer PSR-4 autoload metadata and runtime dependency loading are not resolved. |
| Python | Dynamic imports and runtime dependency loading are not supported. |
| Ruby | Rails-style autoloaded constants and runtime dependency loading are not supported. |
| Rust | Cargo crate metadata and file-system module resolution are not resolved. |
| Scala | Runtime dependency injection and non-import-based dependencies are not supported. |

Layer detection is based on configured aliases and import paths. Projects with unusual naming or path conventions should configure aliases explicitly.

Language support is implemented through import extractors. Adding a language requires extractor coverage in core and adapter configuration support where needed.

## Package Status

The package is currently private and consumed through the workspace only. It is not published as a public API.

## Development

Compile the package:

```bash
pnpm --filter @jfrz38/clean-architecture-highlighter-core run compile
```

Run tests:

```bash
pnpm --filter @jfrz38/clean-architecture-highlighter-core run test
```

From the repository root, `pnpm run compile`, `pnpm run test`, and `pnpm run lint` also include this package.
