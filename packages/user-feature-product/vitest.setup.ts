import "@repo/ui/globals.css";
import { beforeAll, afterAll } from "vitest";

beforeAll(() => {
  document.body.classList.add("prose");
});

afterAll(() => {
  document.body.classList.remove("prose");
});
