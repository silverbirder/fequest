import { config } from "@repo/eslint-config/react-internal";
// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

/** @type {import("eslint").Linter.Config} */
export default [...config, ...storybook.configs["flat/recommended"]];
