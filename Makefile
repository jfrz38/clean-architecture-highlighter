.PHONY: help
help: ## show make targets
	@node -e "const fs = require('fs'); const lines = fs.readFileSync('$(firstword $(MAKEFILE_LIST))', 'utf8').split(/\r?\n/); for (const line of lines) { const match = line.match(/^([a-zA-Z_-]+):.*?## (.*)$$/); if (match) console.log(' ' + match[1].padEnd(20) + '  ' + match[2]); }"

PNPM ?= pnpm

CORE_PACKAGE := @jfrz38/clean-architecture-highlighter-core
CLI_PACKAGE := @jfrz38/clean-architecture-highlighter-cli
VSCODE_EXTENSION_PACKAGE := clean-architecture-highlighter

.PHONY: install ci-install build compile test clean-test lint package package-vscode-extension dev

install: ## install project dependencies from the lockfile
	$(PNPM) install

ci-install: ## install project dependencies without modifying the lockfile
	$(PNPM) install --frozen-lockfile

build: ## remove previous build output and compile all workspace packages
	$(PNPM) run clean:compile

compile: ## compile all workspace packages without cleaning generated output first
	$(PNPM) run compile

test: ## run the full test suite
	$(PNPM) test

clean-test: ## clean generated output and run the full test suite
	$(PNPM) run clean:tests

lint: ## run all workspace linters
	$(PNPM) run lint

package: package-vscode-extension ## package the VS Code extension

package-vscode-extension: ## package the VS Code extension
	$(PNPM) --filter "$(VSCODE_EXTENSION_PACKAGE)" run package

.PHONY: build-core test-core validate-core
build-core: ## build the core package
	$(PNPM) --filter "$(CORE_PACKAGE)" run clean:compile

test-core: ## test the core package
	$(PNPM) --filter "$(CORE_PACKAGE)" test

validate-core: ci-install build-core test-core ## install, build, and test core

.PHONY: build-cli test-cli package-cli validate-cli
build-cli: ## build the CLI package and its dependencies
	$(PNPM) --filter "$(CLI_PACKAGE)..." run clean:compile

test-cli: ## test the CLI package
	$(PNPM) --filter "$(CLI_PACKAGE)" test

package-cli: ## bundle the CLI package for publishing
	$(PNPM) --filter "$(CLI_PACKAGE)" run package

validate-cli: ci-install build-cli test-cli ## install, build, and test CLI

.PHONY: build-vscode-extension test-vscode-extension validate-vscode-extension
build-vscode-extension: ## build the VS Code extension package and its dependencies
	$(PNPM) --filter "$(VSCODE_EXTENSION_PACKAGE)..." run clean:compile

test-vscode-extension: ## test the VS Code extension package
	$(PNPM) --filter "$(VSCODE_EXTENSION_PACKAGE)" test

validate-vscode-extension: ci-install build-vscode-extension test-vscode-extension ## install, build, and test the VS Code extension

dev: compile ## open test workspace with this extension loaded in development mode
	code --extensionDevelopmentPath=packages/vscode-extension test/fixtures
