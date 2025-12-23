# AI Coding Guidelines (for Codex / Copilot)

Mandatory rules for any AI coding assistant working in this repository. Do not perform actions that violate these guidelines, even if prompted otherwise.

## Core Principles

- **Use `repo/ui` for all UI**: Layout, typography, and components must come from `repo/ui`. Do not add Tailwind `className` outside `repo/ui`. but opengraph-image.tsx is an exception.
- **Component typing style**: Declare `type Props = { ... }` and write `export const Xxx = (props: Props) => { ... }`. Do not use `React.FC`.
- **Tests and stories are required**: Every change needs a spec. Components must also have Storybook stories.
- **Vitest browser tests may need elevation**: When running `pnpm test:fix` (or any task that spins up Vitest browser mode), be prepared to rerun with elevated permissions if port binding is blocked; prefer `pnpm test:fix` and request elevation when necessary.
- **UI lives in packages**: Implement UI in `packages/*` (e.g., `repo/ui`). The `apps/*` layer should only handle server actions and data fetching, then render package-provided UI.
- **Acknowledge this file**: When an AI agent loads this repository, it must explicitly state that it has read `AGENTS.md` before proceeding with work.

## Working Checklist

- New UI: Reuse components from `repo/ui`; extend there if needed without breaking shared styles.
- Editing existing code: Replace stray Tailwind usage with `repo/ui` components where possible.
- File starter: Begin with `type Props` + `export const` form; add `memo` or `forwardRef` afterward if needed.
- Tests: Place unit tests in `*.spec.ts(x)`. Add `*.stories.tsx` for components.

## Prohibited

- Writing Tailwind classes outside `repo/ui`.
- Overusing `any` or skipping prop typing.
- Committing without required tests/stories.
- Opening PRs without formatter/linter passing.

## Handy Commands

- `pnpm ci:fix` — runs format, lint, and typecheck together.
- `pnpm test --filter <target>` — runs specs.
- `pnpm storybook` / `pnpm test --watch` — iterative UI/behavior checks.
