import typescriptEslint from "typescript-eslint";
import cleanArchitecture from "./packages/eslint-plugin/out/src/index.js";

export default [
    {
        files: ["packages/core/src/**/*.ts"],
        ignores: ["**/out/**", "**/node_modules/**"],
        plugins: {
            "clean-architecture-highlighter": cleanArchitecture,
        },
        languageOptions: {
            parser: typescriptEslint.parser,
            ecmaVersion: 2022,
            sourceType: "module",
        },
        rules: {
            "clean-architecture-highlighter/no-layer-violation": ["error", {
                sourceFolder: "packages/core/src",
            }],
        },
    },
];
