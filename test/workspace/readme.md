# Test Workspace

Predefined workspace containing representative scenarios to validate the extension behavior:

- Imports that violate Clean Architecture dependency rules.
- Valid imports that must **not** raise diagnostics.
- Layer imports resolved via configured aliases.
- Imports from unknown layers (should be ignored).
- Default layer detection (`domain`, `application`, `infrastructure`).
- Custom source folder names to test layer resolution.

Fixtures are grouped by test intent:

- `architecture/typescript/`: full integration coverage for the language-agnostic architecture rules.
- `languages/<language>/`: minimal end-to-end fixtures that verify a supported language is analyzed when enabled and ignored when disabled.

Language syntax variations belong in extractor tests under `src/test`, not in duplicated architecture scenarios for every language.
