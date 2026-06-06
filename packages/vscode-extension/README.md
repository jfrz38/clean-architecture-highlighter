# Clean Architecture Highlighter

[![Marketplace Version](https://vsmarketplacebadges.dev/version-short/jfrz38.clean-architecture-highlighter.svg)](https://marketplace.visualstudio.com/items?itemName=jfrz38.clean-architecture-highlighter)
[![Installs](https://vsmarketplacebadges.dev/installs-short/jfrz38.clean-architecture-highlighter.svg)](https://marketplace.visualstudio.com/items?itemName=jfrz38.clean-architecture-highlighter)
[![Downloads](https://vsmarketplacebadges.dev/downloads-short/jfrz38.clean-architecture-highlighter.svg)](https://marketplace.visualstudio.com/items?itemName=jfrz38.clean-architecture-highlighter)
[![Rating](https://vsmarketplacebadges.dev/rating-short/jfrz38.clean-architecture-highlighter.svg)](https://marketplace.visualstudio.com/items?itemName=jfrz38.clean-architecture-highlighter&ssr=false#review-details)
[![Build](https://github.com/jfrz38/clean-architecture-highlighter/actions/workflows/build-vscode-extension.yml/badge.svg)](https://github.com/jfrz38/clean-architecture-highlighter/actions/workflows/build-vscode-extension.yml)
[![License](https://img.shields.io/github/license/jfrz38/clean-architecture-highlighter)](https://github.com/jfrz38/clean-architecture-highlighter/blob/main/LICENSE)

VS Code extension to **enforce Clean Architecture rules** by **statically analyzing imports** and reporting dependency violations as editor diagnostics.

This package is the VS Code adapter for the shared analysis engine in [`packages/core`](https://github.com/jfrz38/clean-architecture-highlighter/tree/main/packages/core). The same rules are also available from the [CLI](https://github.com/jfrz38/clean-architecture-highlighter/tree/main/packages/cli).

![Demo](https://raw.githubusercontent.com/jfrz38/clean-architecture-highlighter/main/images/demo_extension.gif)

## Features

- ⚙️**Configurable layers and dependency rules**  
- ⚡**Real-time diagnostics** on file open / change  
- 🗺️ **Path alias support**  
- 🧅**Default Clean Architecture rules** out of the box  
- 🧩 **Non-intrusive** (no code changes required)

Checks that dependencies between layers follow the configured architecture, by default:

```bash
infrastructure → application → domain
```

If a file imports something from a forbidden layer, the extension shows a **VS Code diagnostic** using the configured severity.

## Extension Settings

The extension can be customized via workspace or user settings.
Below is the default configuration, which enforces a standard Clean Architecture layout.

```json
// settings.json
{
    "clean-architecture-highlighter.severityLevel": "warning",
    "clean-architecture-highlighter.enabledLanguages": ["javascript", "typescript"],
    "clean-architecture-highlighter.importResolution": "text",
    
    "clean-architecture-highlighter.layers.domain.aliases": ["domain"],
    "clean-architecture-highlighter.layers.domain.allowedDependencies": ["domain"],

    "clean-architecture-highlighter.layers.application.aliases": ["application"],
    "clean-architecture-highlighter.layers.application.allowedDependencies": ["application", "domain"],

    "clean-architecture-highlighter.layers.infrastructure.aliases": ["infrastructure"],
    "clean-architecture-highlighter.layers.infrastructure.allowedDependencies": ["infrastructure", "application", "domain"]
}
```

| Setting                              | Type     | Default   | Possible values                           | Description                                                                                                    |
| ------------------------------------ | -------- | --------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `severityLevel`                      | string   | `warning` | `error`, `warning`, `info`                | VS Code diagnostic severity used when a rule is broken                                                         |
| `sourceFolder`                       | string   | —         | any folder name                           | Optional root folder where the source code is analyzed. Only files under this folder (and subfolders) are analyzed. When unset, all supported files in the workspace are analyzed. |
| `enabledLanguages`                   | string[] | `["javascript", "typescript"]` | VS Code language identifiers | Languages that the extension should analyze. Unsupported languages are ignored even when opened under `sourceFolder`. |
| `importResolution`                   | string   | `text`    | `text`, `native`                          | Import resolution strategy. `text` keeps the portable text-based extractor. `native` uses TypeScript-aware resolution for JavaScript and TypeScript documents only. |
| `layers.<layer>.aliases`             | string[] | —         | any string[]                              | Folder or import aliases identifying the layer                                                                 |
| `layers.<layer>.allowedDependencies` | string[] | —         | `domain`, `application`, `infrastructure` | Layers this layer is allowed to depend on                                                                      |

JavaScript and TypeScript are analyzed by default. `enabledLanguages` replaces the full analyzed-language list, so include every language you want to analyze:

```json
"clean-architecture-highlighter.enabledLanguages": ["<language-id>", "<another-language-id>"]
```

### Import Resolution

By default, JavaScript and TypeScript imports are extracted as text. This keeps the extension aligned with the shared core extractor and preserves existing behavior:

```json
"clean-architecture-highlighter.importResolution": "text"
```

For JavaScript and TypeScript documents, you can opt in to TypeScript-aware module resolution:

```json
"clean-architecture-highlighter.importResolution": "native"
```

Native resolution uses the nearest `tsconfig.json` when available, including `baseUrl` and `paths`, and resolves static imports/exports, `import type`, `require(...)`, and dynamic `import(...)` with string literals to physical files before applying the existing architecture rules. If `native` is configured for non-JavaScript/TypeScript documents, the extension falls back to the existing language extractor.

Current limitations:

- Native resolution is only available in the VS Code extension, not in the CLI or GitHub Action.
- It is only selected for `javascript` and `typescript` documents. `javascriptreact` and `typescriptreact` documents are not enabled by this setting.
- Imports may resolve to `.jsx` or `.tsx` files when TypeScript resolves them naturally, but those file types are not analyzed as source documents in this issue.

### Supported Languages

| Language   | VS Code language id | Enabled by default | Supported dependency syntax |
| ---------- | ------------------- | ------------------ | --------------------------- |
| JavaScript | `javascript`        | Yes                | Static ES Module `import ... from ...`; with native resolution: exports, `import type`, `require(...)`, dynamic `import(...)`, `baseUrl`, and `paths` |
| TypeScript | `typescript`        | Yes                | Static ES Module `import ... from ...`; with native resolution: exports, `import type`, `require(...)`, dynamic `import(...)`, `baseUrl`, and `paths` |
| C#         | `csharp`            | No                 | `using ...`, alias directives, static imports, and global usings |
| Dart       | `dart`              | No                 | `import ...`, `export ...`, `part ...`, aliases, and `show`/`hide` combinators |
| Elixir     | `elixir`            | No                 | `alias ...`, grouped aliases, `import ...`, `require ...`, and `use ...` |
| Go         | `go`                | No                 | Single-line imports, import blocks, aliased imports, dot imports, and blank imports |
| Groovy     | `groovy`            | No                 | Static `import ...`, `import static ...`, alias imports, and wildcard imports |
| Java       | `java`              | No                 | Static `import ...`, `import static ...`, and wildcard imports |
| Kotlin     | `kotlin`            | No                 | Static `import ...`, aliased `import ... as ...`, and wildcard imports |
| Lua        | `lua`               | No                 | `require(...)`, `require '...'`, and local assignment requires |
| PHP        | `php`               | No                 | Namespace `use ...`, aliases, grouped imports, and function/constant imports |
| Python     | `python`            | No                 | Static `import ...` and `from ... import ...` |
| Ruby       | `ruby`              | No                 | `require ...` and `require_relative ...` |
| Rust       | `rust`              | No                 | `use ...`, grouped imports, aliases, glob imports, and `mod ...` declarations |
| Scala      | `scala`             | No                 | Static `import ...`, grouped imports, aliases, exclusions, and wildcard imports |

Note that the default `aliases` and `allowedDependencies` **do not need to be set**; they are applied automatically.  
`aliases` are used when your layer folder has a different name. For example, if your `application` folder is called `business`, you can add it here using:

```json
"clean-architecture-highlighter.layers.application.aliases": ["business"]
```

## Requirements

This extension analyzes JavaScript and TypeScript by default. Additional languages listed in the Supported Languages section can be enabled through `enabledLanguages`.

- **Folder Structure**: It assumes a layered architecture. Use `sourceFolder` to restrict analysis to a specific folder; when unset, all supported files in the workspace are analyzed.
- **Language-aware design**: import extraction is handled per language internally, so additional languages can be added in future versions without changing the architecture rules.

## Known Limitations

For the current analysis limitations, see the [core Known Limitations](https://github.com/jfrz38/clean-architecture-highlighter/tree/main/packages/core#known-limitations).

## The Dependency Rule

The arrows in the diagram below represent the only allowed direction for dependencies.  
Inner layers **must not know anything** about outer layers.

![Dependency rule](https://raw.githubusercontent.com/jfrz38/clean-architecture-highlighter/main/images/dependency_rule.png)
