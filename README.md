# Clean Architecture Highlighter

[![Marketplace Version](https://vsmarketplacebadges.dev/version-short/jfrz38.clean-architecture-highlighter.svg)](https://marketplace.visualstudio.com/items?itemName=jfrz38.clean-architecture-highlighter)
[![Installs](https://vsmarketplacebadges.dev/installs-short/jfrz38.clean-architecture-highlighter.svg)](https://marketplace.visualstudio.com/items?itemName=jfrz38.clean-architecture-highlighter)
[![Downloads](https://vsmarketplacebadges.dev/downloads-short/jfrz38.clean-architecture-highlighter.svg)](https://marketplace.visualstudio.com/items?itemName=jfrz38.clean-architecture-highlighter)
[![Rating](https://vsmarketplacebadges.dev/rating-short/jfrz38.clean-architecture-highlighter.svg)](https://marketplace.visualstudio.com/items?itemName=jfrz38.clean-architecture-highlighter&ssr=false#review-details)
[![Build](https://github.com/jfrz38/clean-architecture-highlighter/actions/workflows/build_and_tests.yml/badge.svg)](https://github.com/jfrz38/clean-architecture-highlighter/actions/workflows/build_and_tests.yml)
[![License](https://img.shields.io/github/license/jfrz38/clean-architecture-highlighter)](LICENSE)

VS Code extension to **enforce Clean Architecture rules** in Node.js projects by **statically analyzing imports**.

![Demo](https://raw.githubusercontent.com/jfrz38/clean-architecture-highlighter/main/images/demo.gif)

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

If a file imports something from a forbidden layer, the extension shows a **VS Code warning/error**.

## Extension Settings

The extension can be customized via workspace or user settings.
Below is the default configuration, which enforces a standard Clean Architecture layout.

```json
// settings.json
{
    "clean-architecture-highlighter.severityLevel": "warning",
    "clean-architecture-highlighter.sourceFolder": "src",
    "clean-architecture-highlighter.enabledLanguages": ["javascript", "typescript"],
    
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
| `sourceFolder`                       | string   | `src`     | any folder name                           | Root folder where the source code is analyzed. Only files below this folder (and subfolders) will be analyzed. |
| `enabledLanguages`                   | string[] | `["javascript", "typescript"]` | VS Code language identifiers | Languages that the extension should analyze. Unsupported languages are ignored even when opened under `sourceFolder`. |
| `layers.<layer>.aliases`             | string[] | —         | any string[]                              | Folder or import aliases identifying the layer                                                                 |
| `layers.<layer>.allowedDependencies` | string[] | —         | `domain`, `application`, `infrastructure` | Layers this layer is allowed to depend on                                                                      |

JavaScript and TypeScript are analyzed by default. `enabledLanguages` replaces the full analyzed-language list, so include every language you want to analyze:

```json
"clean-architecture-highlighter.enabledLanguages": ["<language-id>", "<another-language-id>"]
```

### Supported Languages

| Language   | VS Code language id | Enabled by default | Supported dependency syntax |
| ---------- | ------------------- | ------------------ | --------------------------- |
| JavaScript | `javascript`        | Yes                | Static ES Module `import ... from ...` |
| TypeScript | `typescript`        | Yes                | Static ES Module `import ... from ...` |
| Go         | `go`                | No                 | Single-line imports, import blocks, aliased imports, dot imports, and blank imports |
| Java       | `java`              | No                 | Static `import ...`, `import static ...`, and wildcard imports |
| Kotlin     | `kotlin`            | No                 | Static `import ...`, aliased `import ... as ...`, and wildcard imports |
| Python     | `python`            | No                 | Static `import ...` and `from ... import ...` |
| Ruby       | `ruby`              | No                 | `require ...` and `require_relative ...` |
| Scala      | `scala`             | No                 | Static `import ...`, grouped imports, aliases, exclusions, and wildcard imports |

Note that the default `aliases` and `allowedDependencies` **do not need to be set**; they are applied automatically.  
`aliases` are used when your layer folder has a different name. For example, if your `application` folder is called `business`, you can add it here using:

```json
"clean-architecture-highlighter.layers.application.aliases": ["business"]
```

## Requirements

This extension analyzes JavaScript and TypeScript by default. Go, Java, Kotlin, Python, Ruby, and Scala are supported as opt-in languages through `enabledLanguages`.

- **Folder Structure**: It assumes a layered architecture (by default under a `src` folder but configurable via `sourceFolder`).
- **Language-aware design**: import extraction is handled per language internally, so additional languages can be added in future versions without changing the architecture rules.

## Known Limitations

- **Import Syntax Only**: The extension analyzes the static dependency forms listed in the Supported Languages table. Unsupported forms are ignored:
  - JavaScript/TypeScript: CommonJS `require()` and dynamic imports are not supported.
  - Go: runtime dependency injection and non-import-based dependencies are not supported.
  - Java: runtime dependency injection and non-import-based dependencies are not supported.
  - Kotlin: runtime dependency injection and non-import-based dependencies are not supported.
  - Python: dynamic imports and runtime dependency loading are not supported.
  - Ruby: Rails-style autoloaded constants and runtime dependency loading are not supported.
  - Scala: runtime dependency injection and non-import-based dependencies are not supported.
- **Static Analysis**: The extension checks path strings. It does not resolve complex runtime dependency injection containers if they are not reflected in the file's import statements.

## The Dependency Rule

The arrows in the diagram below represent the only allowed direction for dependencies.  
Inner layers **must not know anything** about outer layers.

![Dependency rule](https://raw.githubusercontent.com/jfrz38/clean-architecture-highlighter/main/images/dependency_rule.png)
