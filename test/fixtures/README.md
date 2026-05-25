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
- `languages/<language>/`: representative language matrix fixtures that verify the main architecture rules, source folder filtering, nested layer detection, and disabled-language behavior for each supported language.

Language syntax variations belong in extractor tests under the relevant package test suite, not in duplicated architecture scenarios for every language.

Reusable scenario definitions live in `test/scenarios`. Adapter-specific test runners load those scenarios and translate their expectations into adapter assertions.

Scenario selection is controlled by environment variables:

- `TEST_LANGUAGE` defaults to `typescript`.
- `TEST_LANGUAGE=all` runs every supported language matrix.
- `TEST_LANGUAGE=<language>` runs one language matrix.
- `TEST_SCENARIO_SET` defaults to `fast`.
- `TEST_SCENARIO_SET=full` includes the optional full matrix suites.

Integration test jobs should check out the full repository. If a CI workflow uses sparse checkout, include `test/fixtures` along with the adapter package and its workspace dependencies.
