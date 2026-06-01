---
name: add-language-support
description: Add opt-in support for a new language by updating core language registration, dependency extractors, adapters, integration fixtures, documentation, and verification.
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
- Keep architecture rules language-agnostic in `packages/core`; language additions should only change supported-language registration, dependency extraction, adapter registration/integration, and documentation.
- Add VS Code integration coverage beyond enabled/disabled smoke tests when practical.
  - Use the existing TypeScript scenarios as the reference shape.
  - Prefer idiomatic fixtures for the target language over mechanically copying TypeScript syntax.
- Put language syntax edge cases in extractor unit tests.
- Keep import/dependency extraction separate from architecture validation.
- Use VS Code `languageId`, not file extension, as the runtime language key.

## Implementation workflow

### 0. Register the supported language in core

Update:

```text
packages/core/src/clean-architecture/sources/dependencies/languages.ts
```

Add the language's file extensions to `SupportedLanguageRegistry.languagesByExtension` using the runtime language identifier as the value:

```ts
['.<ext>', '<languageId>']
```

This registry is the source of truth for supported language identifiers outside VS Code, including CLI file-extension resolution and `enabledLanguages` validation.

Also update:

```text
packages/core/test/languages.test.ts
```

Cover at least:

- one representative extension resolving to the language id;
- the language id being accepted by `isSupportedLanguageId` or `EnabledLanguagesValidator`.

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

The extractor registry and `SupportedLanguageRegistry` are separate on purpose:

- `SupportedLanguageRegistry` defines which language identifiers/extensions are supported.
- `DependencyExtractorRegistry` maps supported language identifiers to extraction behavior.
- A new language normally needs both.

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
- Do not rely on the VS Code manifest alone as the supported-language source of truth; core must also know the language in `languages.ts`.

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

The current core test command already discovers nested tests through:

```text
mocha "out/test/**/*.test.js" --ui tdd --timeout 10000
```

### 5. Add minimal language integration fixtures

Create fixtures under:

```text
test/fixtures/languages/<languageId>/
```

Use the minimal structure needed for the language and its tooling.

Preferred shape when the existing path-based layer matcher can be used:

```text
test/fixtures/languages/<languageId>/src/
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

Create a language case:

```text
test/scenarios/languages/cases/<language>.case.ts
```

Use the existing language cases as the reference shape. The case should include:

- `language`;
- `displayName`;
- `enabledLanguages`;
- `disabledLanguages`;
- the fixture file paths used by the shared suite builder;
- diagnostic line numbers for expected violations.

Register the case in:

```text
test/scenarios/languages/language-cases.ts
```

Import the new case and add it to `languageCases`.

The shared builder in `test/scenarios/languages/language-suite-builder.ts` generates the standard enabled/disabled and architecture scenarios from the case. Do not add manual registration to `test/scenarios/scenarios.ts`; it delegates to `getSelectedSuites()` in `test/scenarios/scenario-selection.ts`.

Add enabled/disabled scenarios through the case and, when practical, fuller architecture scenarios equivalent to the TypeScript reference coverage.

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

Only create a dedicated suite file under `test/scenarios/languages/suites/` if the current project still uses those files for the target workflow. In the current scenario-selection flow, the generated suites come from `languageCases`.

The old manual registration target:

```text
test/scenarios/scenarios.ts
```

should normally not be edited for new languages.

### 7. Update documentation

Update:

```text
README.md
packages/cli/README.md
packages/vscode-extension/README.md
```

At minimum, update `README.md`:

- mention the new supported language;
- explain that JavaScript and TypeScript are enabled by default and new languages are opt-in, unless explicitly changed;
- update the Supported Languages table;
- list the supported static import/dependency syntax at a high level;
- keep default configuration examples unchanged unless defaults actually changed.

Update `packages/cli/README.md` when the language is available through the CLI. Add the language id to the opt-in supported-language example.

Update `packages/vscode-extension/README.md` if the extension-facing language support text or requirements need to mention the new language explicitly.

For local manual testing, ensure `test/fixtures/.vscode/settings.json` includes the opt-in language if such a workspace settings file is present. Do not create it only for this unless local manual testing needs it:

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
test/fixtures/README.md
```

Keep the convention:

- `architecture/` = language-agnostic architecture rule coverage;
- `languages/` = language-specific integration fixtures and scenarios.

## Verification

Run these commands before finishing:

```bash
make compile
make lint
make test-core
```

Run CLI and VS Code integration tests as well:

```bash
make test-cli
make test-vscode-extension
```

For full language-matrix integration coverage, run:

```bash
make test-integration-full
```

In CI or Linux environments where VS Code tests need a display, use:

```bash
xvfb-run -a make test-vscode-extension
```

If `make test-vscode-extension` fails before executing tests because the VS Code harness cannot launch or cannot resolve the test workspace, report that separately from compile/lint/core-test results and include the exact error.

## Completion checklist

- [ ] New extractor added.
- [ ] Extractor registered by VS Code `languageId`.
- [ ] Core `SupportedLanguageRegistry` updated with language id and extensions.
- [ ] `package.json` `contributes.languages` includes the language id, aliases, and extensions.
- [ ] Default `enabledLanguages` unchanged unless explicitly requested.
- [ ] Extractor unit tests added for language syntax.
- [ ] Core supported-language tests updated.
- [ ] Minimal `test/fixtures/languages/<languageId>/` fixtures added.
- [ ] `test/scenarios/languages/cases/<language>.case.ts` added.
- [ ] New language case imported and added to `test/scenarios/languages/language-cases.ts`.
- [ ] Enabled/disabled integration coverage generated through the shared language suite builder.
- [ ] Full architecture-style integration coverage added or intentionally deferred with an issue/note.
- [ ] README updated.
- [ ] CLI README updated when CLI support applies.
- [ ] VS Code extension README updated when extension-facing docs change.
- [ ] `make compile` passes.
- [ ] `make lint` passes.
- [ ] `make test-core` passes.
- [ ] `make test-cli` passes.
- [ ] `make test-vscode-extension` or `xvfb-run -a make test-vscode-extension` executed and result reported.
- [ ] `make test-integration-full` executed when full language-matrix coverage is required.
