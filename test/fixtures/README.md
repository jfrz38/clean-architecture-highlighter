# Shared Integration Fixtures

Predefined workspace containing representative scenarios to validate adapter behavior across the VS Code extension, CLI, and future adapters:

- Imports that violate Clean Architecture dependency rules.
- Valid imports that must **not** raise diagnostics.
- Layer imports resolved via configured aliases.
- Imports from unknown layers (should be ignored).
- Default layer detection (`domain`, `application`, `infrastructure`).
- Custom source folder names to test layer resolution.

Fixtures are grouped by test intent:

- `architecture/typescript/`: full integration coverage for the language-agnostic architecture rules.
- `languages/<language>/`: minimal end-to-end fixtures that verify a supported language is analyzed when enabled and ignored when disabled.

Language syntax variations belong in extractor tests under the relevant package test suite, not in duplicated architecture scenarios for every language.

Reusable scenario definitions live in `test/scenarios`. Adapter-specific test runners load those scenarios and translate their expectations into adapter assertions.

Integration test jobs should check out the full repository. If a CI workflow uses sparse checkout, include `test/fixtures` along with the adapter package and its workspace dependencies.
