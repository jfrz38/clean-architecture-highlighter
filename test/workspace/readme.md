# Test Workspace

Predefined workspace containing representative scenarios to validate the extension behavior:

- Imports that violate Clean Architecture dependency rules.
- Valid imports that must **not** raise diagnostics.
- Layer imports resolved via configured aliases.
- Imports from unknown layers (should be ignored).
- Default layer detection (`domain`, `application`, `infrastructure`).
- Custom source folder names to test layer resolution.
