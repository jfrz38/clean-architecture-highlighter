.PHONY: help
help: ## show make targets
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {sub("\\\\n",sprintf("\n%22c"," "), $$2);printf " \033[36m%-20s\033[0m  %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: install build compile test

install: ## install project dependencies from the lockfile
	pnpm install

build: ## remove previous build output and compile the extension
	pnpm run clean:compile

compile: ## compile the extension without cleaning generated output first
	pnpm run compile

test: ## run the full test suite
	pnpm test
