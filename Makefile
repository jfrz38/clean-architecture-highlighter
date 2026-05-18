.PHONY: help
help: ## show make targets
	@node -e "const fs = require('fs'); const lines = fs.readFileSync('$(firstword $(MAKEFILE_LIST))', 'utf8').split(/\r?\n/); for (const line of lines) { const match = line.match(/^([a-zA-Z_-]+):.*?## (.*)$$/); if (match) console.log(' ' + match[1].padEnd(20) + '  ' + match[2]); }"

.PHONY: install ci-install build compile test clean-test package

install: ## install project dependencies from the lockfile
	pnpm install

ci-install: ## install project dependencies without modifying the lockfile
	pnpm install --frozen-lockfile

build: ## remove previous build output and compile the extension
	pnpm run clean:compile

compile: ## compile the extension without cleaning generated output first
	pnpm run compile

test: ## run the full test suite
	pnpm test

clean-test: ## clean generated output and run the full test suite
	pnpm run clean:tests

package: ## package the VS Code extension without installing dependencies
	npx @vscode/vsce package --no-dependencies
