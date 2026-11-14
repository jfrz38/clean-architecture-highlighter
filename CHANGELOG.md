# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!-- git-cliff: end of header -->
## [Unreleased]


### Added
- Add compare-file-path to version check action
- Add clean architecture lint to core package (#128)
- Add lint core step to validation (#128)


### Fixed
- Bundle core into eslint plugin

## [scode-extension-v0.3.0] - 2026-06-13


### Added
- Improve action using new pre_commit_commands
- Add pnpm installation step in workflow


### Fixed
- Disable color on formatter to avoid local errors
- Add fixed packaged code
- Upgrade core version and adjust action to newer version
- Remove manual bundle mapping
- Create GHA smoke test
- Update GHA bundle


### Changed
- Change release to be marked as latest
- [iss-89] expose reusable CLI check flow
- [iss-89] add GitHub Action wrapper package
- [iss-89] add GitHub Action build targets
- [iss-89] add GitHub Action CI and release workflows
- [iss-89] add documentation
- [iss-89] add enabled-languages input
- Revert "[iss-89] Add a GitHub Action wrapper for clean architecture checks"
- Reapply "[iss-89] Add a GitHub Action wrapper for clean architecture checks"

This reverts commit 72ba1f4259437b1ef0fd4a4691c883a44b13090b.
- [iss-89] improve enabled-languages input removing core dependency
- [iss-89] improve enabled-languages input removing core dependency
- [iss-89] move action to root
- [iss-89] update docs
- [iss-89] upgrade node version
- Bump @jfrz38/clean-architecture-highlighter-cli to 0.2.0
- Refactor pre_commit_commands in bump-version.yml
- Update bump-version workflow for CLI and GitHub Action
- [iss-91] rename clean architecture folder
- [iss-91] rename clean architecture folder dependencies
- [iss-91] refactor core architecture
- [iss-91] refactor core tests architecture
- [iss-91] refactor domain and application layer
- [iss-91] align add language skill
- [iss-91] improve core usage
- [iss-91] dogfood CI
- [iss-91] add py cache to gitignore
- [iss-91] improve source uri handling
- [iss-120] Add TypeScript-native import resolution adapter
- [iss-120] Add importResolution setting and update docs
- [iss-120] Add unit and integration tests for native resolution
- [iss-120] Improve types
- [iss-120] Modularize native TypeScript resolution
- [iss-120] Extract native and workspace helpers
- Bump clean-architecture-highlighter to 0.3.0
- [iss-121] add ESLint plugin domain model
- [iss-121] add ESLint layer violation checker
- [iss-121] map ESLint plugin config to core rules
- [iss-121] expose ESLint no-layer-violation rule
- [iss-121] cover ESLint plugin rule behavior
- [iss-121] configure ESLint plugin package
- [iss-121] document ESLint plugin usage
- [iss-121] add ESLint plugin build and release workflows
- Update package command
- Update CodeQL workflow to ignore dist directory

Ignore specific paths during CodeQL analysis.

## [scode-extension-v0.2.0] - 2026-06-01


### Fixed
- Release workflow using author package name

## [cli-v0.1.0] - 2026-06-01


### Added
- Make sourceFolder optional
- Validate enabled language configuration
- Add verbose CLI logging
- Improve source folder config internal logic
- Format output and add flag for strict fail


### Fixed
- Adapt release workflows for monorepo packages
- Update workflows timeouts
- Update skill to align with current flow


### Changed
- [iss-82] create pnpm workspaces
- [iss-82] create core package
- [iss-82] create vs code package
- [iss-82] add package-specific workspace validation
- [iss-82] improve skill due to workspaces refactor
- [iss-82] rename vs code extension workflow
- [iss-82] run workflows on pr to migration branch
- [iss-82] improve build workflow avoiding vs code extension package
- [iss-85] bundle vscode extension for vsix packaging
- [iss-87] add supported languages to core
- [iss-87] create cli package
- [iss-87] improve check options and configurations
- [iss-87] improve cli architecture
- [iss-87] improve cli options
- [iss-88] move IT tests to a common package
- [iss-88] fix vs code IT tests
- [iss-88] improve skill
- [iss-88] create cli IT tests
- [iss-88] use common types
- [iss-88] compile shared tests
- [iss-88] fix vs code IT setting
- [iss-83] create scenarios for specific languages
- [iss-83] create fixtures for all supported languages
- [iss-83] add shared integration targets
- [iss-83] add all IT test to build workflow
- [iss-83] improve workflows and add IT specific one
- [iss-83] add complete language IT test for vs code extension
- [iss-83] add complete language IT test for vs code extension
- [iss-83] remove duplicated steps
- [iss-83] remove duplicated steps
- [iss-83] improve vs code extension IT tests time
- [iss-90] improve cli publish workflow
- [iss-90] improve cli bundle
- [iss-90] decrease workflow timeout
- [iss-90] create domain error
- [iss-90] improve documentation
- Move severity level config to VS Code extension
- Bump clean-architecture-highlighter to 0.2.0

## [0.1.0] - 2026-05-19


### Added
- Add bump version action
- Add cooldown to Dependabot configuration

Added cooldown configuration for npm and GitHub Actions dependencies.
- Add pull request types to build workflow


### Fixed
- Use correct infrastructure allowed dependencies


### Changed
- Update release title to use TAG instead of VERSION
- Update README with new badge links
- [iss-47] decouple import extractor
- [iss-47] create makefile
- [iss-47] add configurable language support
- [iss-47] use make in CI
- [iss-47] update icon
- [iss-47] add language support issue template
- [iss-49] add python support
- [iss-49] fix makefile PHONY
- [iss-49] add language support skill
- [iss-49] improve dependency diagram image
- [iss-49] improve dependency diagram image
- [iss-49] improve python test
- [iss-51] use rimraf
- [iss-51] reduce VSIX package weight
- [iss-51] add unit test modularization
- [iss-51] add java import checker
- [iss-51] improve delimiter extractor
- [iss-51] improve regex delimiter
- [iss-52] add kotlin import checker
- [iss-52] create common regex extractor
- [iss-52] add contributes languages
- [iss-53] add scala import checker
- [iss-53] fix scala regex
- [iss-54] add go import checker
- [iss-55] add ruby import checker
- [iss-56] add php import checker
- [iss-58] add csharp import checker
- [iss-57] add groovy import checker
- Merge remote-tracking branch 'origin/develop' into feature/iss-58

# Conflicts:
#	README.md
- [iss-58] normalize alias path
- [iss-59] add rust import checker
- [iss-61] add elixir import checker
- [iss-62] add lua import checker
- [iss-72] add dart import checker
- Bump version to 0.1.0
- Upgrade node version

## [0.0.3] - 2026-04-25


### Added
- Add initial readme
- Add initial files
- Add initial logic to underline invalid imports
- Add save-exact setting
- Add GitHub Actions to Dependabot configuration
- Add custom codeql action
- Add check version change step
- Add package extension to build action


### Fixed
- Fix logo


### Changed
- Initial commit
- Rename warning to highlighter
- [iss-2] Fix regex to allow multiline imports
- [iss-1] create default configs tree classes
- [iss-1] format code
- [iss-6] refactor project to allow dependency override configuration
- [iss-3] place all code under extension folder
- [iss-3] replace layer component class
- [iss-3] add workspaces scenarios
- [iss-3] Add test runner
- [iss-3] Refactor extension state and config handling
- [iss-3] Add test scenarios
- [iss-3] Add default values to package.json
- [iss-3] refactor default configs schema in package.json and allow to retrieve it
- [iss-3] refactor extension tests to set default configurations and enhance config updates
- [iss-3] improve testing workspace folders and examples
- [iss-3] enhance custom configuration suites and add domain alias scenarios
- [iss-3] rename workspace tests classes
- [iss-3] add scenario to test import layer under alias
- [iss-3] improve mock workspace readme
- [iss-3] add aliases tests
- [iss-3] update aliases suites names
- [iss-3] add custom allowed dependencies tests
- [iss-3] add tests using all configs
- [iss-3] remove unused tests
- [iss-3] remove comments
- [iss-3] remove unused test configuration
- [iss-10] add hierarchy classes to maintain default allowed dependencies values
- [iss-10] fix failing tests
- [iss-10] check previously opened files
- [iss-11] update package.json to use pnpm commands
- [iss-11] add CODEOWNERS
- [iss-11] add PR workflow to build and execute tests
- [iss-11] update pnpm-lock
- [iss-11] increase tests timeout
- [iss-11] rename build workflow
- [iss-18] add dependabot action
- [iss-18] group all dependencies requests
- [iss-5] update readme with usage information
- [iss-5] update ignored files
- [iss-5] update ignored files to avoid add test folders
- [iss-5] update package.json to match between engines and types dependency version
- [iss-5] rename builder GHA name
- [iss-5] add publisher name
- [iss-5] add first version icon
- [iss-5] add relevant information
- [iss-5] improve readme and set mocha as dev dependency
- [iss-5] fix vs types and engine versions
- [iss-5] fix vs types and engine versions
- [iss-5] fix node types version
- [iss-5] add vsix files
- [iss-5] remove .vscode folder for git
- [iss-5] add vsix files
- [iss-22] update build workflow
- [iss-22] format action
- [iss-22] add clean compile stage
- [iss-22] fix workflows
- [iss-22] improve workflow caching pnpm
- Ignore .github folder to upload
- Update changelog
- Update action tests badge
- [fix] update tsconfig
- Improve .npmrc
- Improve .npmrc
- Create release action and improve publish using release
- Bump version from 0.0.2 to 0.0.3

## Previously maintained history

All notable changes to the "cleanarchitecturehighlighter" extension will be documented in this file.

## [0.0.1]

- Initial release
