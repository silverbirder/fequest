import "@repo/ui/globals.css";
import { setProjectAnnotations } from "@storybook/nextjs-vite";

import preview from "../storybook/.storybook/preview-test";

setProjectAnnotations(preview);
