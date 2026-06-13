---
name: add-language-support
description: Add opt-in support for a new language by updating core language registration, dependency extractors, adapters, integration fixtures, documentation, and verification.
---

# Add Language Support

Use this skill when adding a new supported language to Clean Architecture Highlighter.

The goal is to add a language-specific dependency extractor without changing the language-agnostic domain rules.

## Core rules

- Do **not** change the default `enabledLanguages` unless the user explicitly asks for it.
  - Default languages should remain JavaScript and TypeScript.
  - New languages are opt-in through `clean-architecture-highlighter.enabledLanguages`.
- Do **not** add `onLanguage:<languageId>` for an opt-in language by default.
  - Keep `onLanguage` for default languages.
  - `onStartupFinished` lets opt-in languages work after the extension starts.
- Keep architecture rules language-agnostic in `packages/core`; adding a language should not change domain rules.
- Keep import/dependency extraction separate from architecture validation.
- Use VS Code `languageId`, not file extension, as the runtime language key.
- Tests in `packages/core/test` should mirror the `packages/core/src` layer structure.

## Implementation workflow

### 0. Register the supported language in core

Update:

```text
packages/core/src/infrastructure/languages/supported-language-registry.ts
```

Add the language's file extensions to `SupportedLanguageRegistry.languagesByExtension` using the runtime language identifier as the value:

```ts
['.<ext>', '<languageId>']
```

This registry is the source of truth for supported language identifiers outside VS Code, including CLI file-extension resolution and `enabledLanguages` validation.

Also update:

```text
packages/core/test/infrastructure/languages/supported-language-registry.test.ts
```

Cover at least:

- one representative extension resolving to the language id;
- the language id being accepted by `isSupportedLanguageId`;
- an unsupported extension or language id still being rejected.

If validation behavior changes, update application tests under:

```text
packages/core/test/application/enabled-languages/
```

Do not make `EnabledLanguagesValidator` instantiate `SupportedLanguageRegistry`; callers or adapters should inject it.

### 1. Add the extractor

Create a new extractor under:

```text
packages/core/src/infrastructure/extractors/
```

Use the domain contract:

```ts
DependencyExtractor.extract(document: Document): ExtractedDependency[]
```

The extractor contract lives at:

```text
packages/core/src/domain/sources/dependencies/extractors/dependency-extractor.ts
```

Each extracted dependency must include:

- normalized dependency path;
- `DependencyPosition` covering the import/dependency statement.

Normalize extracted dependencies into the path style expected by the existing layer matcher.

Examples:

- JavaScript/TypeScript path import: `../domain/user`
- Dotted/module import: `application.use_cases.create_user` -> `/application/use_cases/create_user/`

Use existing extractors as reference. Prefer extending `DelimitedDependencyExtractor` when the language can be parsed with regular expression patterns.

### 2. Register the extractor

Update:

```text
packages/core/src/infrastructure/extractors/dependency-extractor-registry.ts
```

Add the new VS Code `languageId` to the registry:

```ts
['<languageId>', new <Language>DependencyExtractor()]
```

The extractor registry and `SupportedLanguageRegistry` are separate on purpose:

- `SupportedLanguageRegistry` defines which language identifiers/extensions are supported.
- `DependencyExtractorRegistry` maps supported language identifiers to extraction behavior.
- A new language normally needs both.

### 3. Preserve application wiring

The application service:

```text
packages/core/src/application/analyze-source-file.ts
```

should continue to receive a `DependencyExtractor` by constructor injection. Do not make it import concrete infrastructure extractors.

Adapters such as CLI and VS Code should keep choosing the concrete extractor through `DependencyExtractorRegistry`.

If language validation is touched, keep the registry injected from adapter/composition code:

```ts
new EnabledLanguagesValidator(new SupportedLanguageRegistry())
```

in adapter or composition code, not inside application/domain code.

### 4. Activation and configuration

Update the VS Code extension package manifest only where appropriate:

```text
packages/vscode-extension/package.json
```

- Add or update `contributes.languages` for the supported language, including its VS Code `languageId`, aliases, and file extensions. This lets VS Code assign the correct `document.languageId` even when users do not have a separate language extension installed.
- Add `onLanguage:<languageId>` **only if** the language should activate the extension directly.
- For opt-in languages, prefer relying on `onStartupFinished` unless the user explicitly wants early activation.
- Do **not** add the language to the default `enabledLanguages` unless explicitly requested.
- Keep the `enabledLanguages` default in `package.json` and `EnabledLanguagesConfiguration` aligned.
- Do not rely on the VS Code manifest alone as the supported-language source of truth; core must also know the language in `SupportedLanguageRegistry`.

If the language is opt-in, document that users must configure:

```json
"clean-architecture-highlighter.enabledLanguages": [
  "javascript",
  "typescript",
  "<languageId>"
]
```

### 5. Add extractor unit tests

Add or update the extractor-specific test file under:

```text
packages/core/test/infrastructure/extractors/<language>-dependency-extractor.test.ts
```

Keep one test file per extractor/language so language syntax coverage does not grow a shared monolithic test file.

Use test support from:

```text
packages/core/test/support/create-document.ts
```

Cover representative cases such as:

- basic import/dependency statement;
- alternative import form, if the language has one;
- aliases, multiple imports, multiline syntax, grouped syntax, or comments when relevant;
- correct normalized path;
- correct diagnostic range.

Do not rely only on integration tests for parser behavior.

The current core test command discovers nested tests through:

```text
mocha "out/test/**/*.test.js" --ui tdd --timeout 10000
```

### 6. Keep tests mirrored to source structure

When adding or changing core tests, place them under the matching layer:

- Domain tests:
  - `packages/core/test/domain/...`
- Application tests:
  - `packages/core/test/application/...`
- Infrastructure tests:
  - `packages/core/test/infrastructure/...`
- Shared test helpers:
  - `packages/core/test/support/...`

Examples:

- `packages/core/src/infrastructure/extractors/foo-dependency-extractor.ts`
  -> `packages/core/test/infrastructure/extractors/foo-dependency-extractor.test.ts`
- `packages/core/src/infrastructure/languages/supported-language-registry.ts`
  -> `packages/core/test/infrastructure/languages/supported-language-registry.test.ts`
- `packages/core/src/application/enabled-languages/enabled-languages-validator.ts`
  -> `packages/core/test/application/enabled-languages/enabled-languages-validator.test.ts`
- `packages/core/src/domain/sources/layer/layer-alias.ts`
  -> `packages/core/test/domain/sources/layer/layer-alias.test.ts`

Do not put application tests under infrastructure merely because they use an infrastructure implementation as a convenient fake; prefer a local fake where practical.

### 7. Add minimal language integration fixtures

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

### 8. Add language integration suites

Create a language case:

```text
test/scenarios/languages/cases/<language>.case.ts
```

Use existing language cases as the reference shape. The case should include:

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

Only create a dedicated suite file under `test/scenarios/languages/suites/` if the current project still uses those files for the target workflow. In the current scenario-selection flow, generated suites come from `languageCases`.

The old manual registration target:

```text
test/scenarios/scenarios.ts
```

should normally not be edited for new languages.

### 9. Update documentation

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

Update `packages/vscode-extension/README.md` if extension-facing language support text or requirements need to mention the new language explicitly.

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

- [ ] New extractor added under `packages/core/src/infrastructure/extractors/`.
- [ ] Extractor implements the domain `DependencyExtractor` contract.
- [ ] Extractor registered by VS Code `languageId`.
- [ ] Core `SupportedLanguageRegistry` updated with language id and extensions.
- [ ] `SupportedLanguageRegistry` still implements domain `SupportedLanguages`.
- [ ] Application/domain code does not import infrastructure.
- [ ] `package.json` `contributes.languages` includes the language id, aliases, and extensions when appropriate.
- [ ] Default `enabledLanguages` unchanged unless explicitly requested.
- [ ] Extractor unit tests added under `packages/core/test/infrastructure/extractors/`.
- [ ] Core supported-language tests updated under `packages/core/test/infrastructure/languages/`.
- [ ] Application validation tests updated under `packages/core/test/application/enabled-languages/` if needed.
- [ ] Core tests continue to mirror the `src` layer structure.
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
