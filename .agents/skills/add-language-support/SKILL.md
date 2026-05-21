---
name: add-language-support
description: Add opt-in support for a new language by updating the core dependency extractor package, the VS Code extension adapter, integration fixtures, documentation, and verification.
---

# Add Language Support

Use this skill to add a new supported language to the extension.

The goal is to add a language-specific dependency extractor without changing the language-agnostic architecture rules.

## Core rules

- Do **not** change the default `enabledLanguages` unless the user explicitly asks for it.
  - Default languages should remain JavaScript and TypeScript.
  - New languages are opt-in through `clean-architecture-highlighter.enabledLanguages`.
- Do **not** add `onLanguage:<languageId>` for an opt-in language by default.
  - Keep `onLanguage` for default languages.
  - `onStartupFinished` lets opt-in languages work after the extension starts.
- Keep architecture rules language-agnostic in `packages/core`; language additions should only change dependency extraction and VS Code registration/integration.
- Add VS Code integration coverage beyond enabled/disabled smoke tests when practical.
  - Use the existing TypeScript scenarios as the reference shape.
  - Prefer idiomatic fixtures for the target language over mechanically copying TypeScript syntax.
- Put language syntax edge cases in extractor unit tests.
- Keep import/dependency extraction separate from architecture validation.
- Use VS Code `languageId`, not file extension, as the runtime language key.

## Implementation workflow

### 1. Add the extractor

Create a new extractor under:

```text
packages/core/src/clean-architecture/sources/dependencies/extractors/
```

Use the existing contract:

```ts
DependencyExtractor.extract(document: CoreDocument): ExtractedDependency[]
```

Each extracted dependency must include:

- normalized dependency path;
- `DependencyPosition` covering the import/dependency statement.

Normalize the extracted dependency into the path style expected by the existing layer matcher.

Examples:

- JavaScript/TypeScript path import: `../domain/user`
- Dotted/module import: `application.use_cases.create_user` -> `/application/use_cases/create_user/`

### 2. Register the extractor

Update:

```text
packages/core/src/clean-architecture/sources/dependencies/extractors/dependency-extractor-registry.ts
```

Add the new VS Code `languageId` to the registry:

```ts
['<languageId>', new <Language>DependencyExtractor()]
```

### 3. Activation and configuration

Update the VS Code extension package manifest only where appropriate:

```text
packages/vscode-extension/package.json
```

- Add or update `contributes.languages` for the supported language, including its VS Code `languageId`, aliases, and file extensions. This lets VS Code assign the correct `document.languageId` even when users do not have a separate language extension installed.
- Add `onLanguage:<languageId>` **only if** the language should activate the extension directly.
- For opt-in languages, prefer relying on `onStartupFinished` unless the user explicitly wants early activation.
- Do **not** add the language to the default `enabledLanguages` unless explicitly requested.
- Keep the `enabledLanguages` default in `package.json` and `EnabledLanguagesConfiguration` aligned.

If the language is opt-in, document that users must configure:

```json
"clean-architecture-highlighter.enabledLanguages": [
  "javascript",
  "typescript",
  "<languageId>"
]
```

### 4. Add extractor unit tests

Add or update the extractor-specific test file under:

```text
packages/core/test/dependency-extractors/<language>-dependency-extractor.test.ts
```

Keep one test file per extractor/language so language syntax coverage does not grow a shared monolithic test file.

Cover representative cases such as:

- basic import/dependency statement;
- alternative import form, if the language has one;
- aliases, multiple imports, multiline syntax, or comments when relevant;
- correct normalized path;
- correct diagnostic range.

Do not rely only on integration tests for parser behavior. If the test runner does not already discover nested test files, update it to load `*.test` files recursively.

### 5. Add minimal language integration fixtures

Create fixtures under:

```text
packages/vscode-extension/test/workspace/languages/<languageId>/
```

Use the minimal structure needed for the language and its tooling.

Preferred shape when the existing path-based layer matcher can be used:

```text
packages/vscode-extension/test/workspace/languages/<languageId>/src/
  domain/
    domain.<ext>
    other-domain-or-equivalent.<ext>
  application/
    application-or-use-case.<ext>
  infrastructure/
    infrastructure-or-repository.<ext>
```

The main domain fixture should import:

- one infrastructure dependency, expected violation;
- one application dependency, expected violation;
- one domain dependency, expected allowed dependency.

Only create additional files when required by the language tooling or to keep fixtures understandable.

For languages with package/module notation rather than path notation, normalize dependency strings in the extractor so they still contain layer aliases as path segments, for example:

```text
application.use_cases.create_user -> /application/use_cases/create_user/
```

This keeps the architecture rule engine unchanged.

### 6. Add language integration suites

Create:

```text
packages/vscode-extension/test/suites/languages/<language>.suite.ts
```

Add enabled/disabled scenarios and, when practical, fuller architecture scenarios equivalent to the TypeScript reference suite.

At minimum include:

1. Language enabled:
   - configure `enabledLanguages` to include the new language if it is not default;
   - open the language fixture;
   - expect architecture violations.
2. Language disabled:
   - configure `enabledLanguages` without the new language;
   - open the same fixture;
   - expect no diagnostics.

Prefer also covering:

- application layer cannot depend on infrastructure;
- domain layer cannot depend on application or infrastructure;
- infrastructure layer can depend on any layer;
- nested layer folders are detected correctly;
- files outside the configured `sourceFolder` are ignored.

Register the suite in:

```text
packages/vscode-extension/test/suites/scenarios.ts
```

### 7. Update documentation

Update `README.md`:

- mention the new supported language;
- explain that JavaScript and TypeScript are enabled by default and new languages are opt-in, unless explicitly changed;
- update the Supported Languages table;
- list the supported static import/dependency syntax at a high level;
- keep default configuration examples unchanged unless defaults actually changed.

For local manual testing, ensure `packages/vscode-extension/test/workspace/.vscode/settings.json` includes the opt-in language if such a workspace settings file is present:

```json
{
  "clean-architecture-highlighter.enabledLanguages": [
    "javascript",
    "typescript",
    "<languageId>"
  ]
}
```

If useful, update:

```text
packages/vscode-extension/test/workspace/readme.md
```

Keep the convention:

- `architecture/` = language-agnostic architecture rule coverage;
- `languages/` = language-specific VS Code integration fixtures and scenarios.

## Verification

Run these commands before finishing:

```bash
make compile
pnpm run lint
make test-core
```

Run the integration suite command as well:

```bash
make test-vscode-extension
```

In CI or Linux environments where VS Code tests need a display, use:

```bash
xvfb-run -a make test-vscode-extension
```

If `make test-vscode-extension` fails before executing tests because the VS Code harness cannot launch or cannot resolve the test workspace, report that separately from compile/lint/core-test results and include the exact error.

## Completion checklist

- [ ] New extractor added.
- [ ] Extractor registered by VS Code `languageId`.
- [ ] `package.json` `contributes.languages` includes the language id, aliases, and extensions.
- [ ] Default `enabledLanguages` unchanged unless explicitly requested.
- [ ] Extractor unit tests added for language syntax.
- [ ] Minimal `packages/vscode-extension/test/workspace/languages/<languageId>/` fixtures added.
- [ ] Enabled/disabled integration scenarios added.
- [ ] Full architecture-style integration scenarios added or intentionally deferred with an issue/note.
- [ ] README updated.
- [ ] `make compile` passes.
- [ ] `pnpm run lint` passes.
- [ ] `make test-core` passes.
- [ ] `make test-vscode-extension` or `xvfb-run -a make test-vscode-extension` executed and result reported.
