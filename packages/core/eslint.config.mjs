import cleanArchitecture from "@jfrz38/eslint-plugin-clean-architecture-highlighter";
import baseConfig from "../../eslint.config.mjs";

export default [
    ...baseConfig,
    {
        files: ["src/**/*.ts"],
        plugins: {
            "clean-architecture-highlighter": cleanArchitecture,
        },
        rules: {
            "clean-architecture-highlighter/no-layer-violation": ["error", {
                sourceFolder: "src",
            }],
        },
    },
];
