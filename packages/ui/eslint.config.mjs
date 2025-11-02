import { config } from "@repo/eslint-config/react-internal";

/** @type {import("eslint").Linter.Config[]} */
export default [
	...config,
	{
		files: ["turbo/generators/**/*.js"],
		languageOptions: {
			globals: {
				module: "readonly",
				require: "readonly",
				__dirname: "readonly",
				__filename: "readonly",
			},
		},
	},
];
