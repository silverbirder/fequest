# Fequest

機能リクエスト（Feature Request）を投稿・共有し、管理画面からプロダクトやリクエストの状態を管理できるプラットフォームです。

## サービスURL

- user: https://fequest.vercel.app/
- admin: https://fequest-admin.vercel.app/

## 構成（Monorepo）

pnpm + Turborepo で `apps/*` と `packages/*` をまとめて管理しています。

- apps
  - `apps/user` — ユーザー向けアプリ（Next.js）
  - `apps/admin` — 管理者向けアプリ（Next.js）
  - `apps/e2e` — E2E テスト（Cucumber + Playwright + Testcontainers）
- packages
  - `packages/ui` — 共通UI（Storybook 対応）
  - `packages/db` — DB / Drizzle 関連（ローカルDB起動スクリプトあり）
  - `packages/storybook` — Storybook 実行・Storyのテスト（Vitest browser）
  - `packages/*-feature-*` — 画面/機能単位のUI・ロジック（Story + spec を含む）

## 必要要件

- Node.js: `>=20`
- pnpm: `pnpm@9`
- Docker（ローカルDBやE2Eで使用）

## セットアップ（Quick Start）

```bash
pnpm install
```

### 環境変数

各アプリ/パッケージに `.env.example` があるので、必要に応じて `.env` を作成します。

```bash
cp apps/user/.env.example apps/user/.env
cp apps/admin/.env.example apps/admin/.env
cp packages/db/.env.example packages/db/.env
```

主な変数（例）:

- `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`（認証）
- `DATABASE_URL`（DB接続）
- `ADMIN_DOMAIN_URL`, `USER_DOMAIN_URL`（相互リンクやE2Eで使用）

### ローカルDBを起動

`packages/db` に Docker で Postgres を起動するスクリプトがあります。

```bash
pnpm start-database
```

## 開発（Dev）

### 全体を起動

```bash
pnpm dev
```

デフォルトポート:

- user: http://localhost:3000
- admin: http://localhost:3001

### アプリ単体で起動

```bash
pnpm --filter user dev
pnpm --filter admin dev
```

## テスト

### Unit / Component

```bash
pnpm test
```

スナップショット/VRT（スクリーンショット）更新を含めて更新する場合:

```bash
pnpm test:fix
```

### E2E（Cucumber）

```bash
pnpm test:e2e
```

補足:

- 設定: `apps/e2e/cucumber.config.js`
- Feature: `apps/e2e/src/features/**/*.feature.md`（日本語で記述）
- Step: `apps/e2e/src/features/**/*.steps.ts`
- Playwright で検証用スクリーンショットを保存します（feature markdown から参照される `.png` を含む）。

例:

- `apps/e2e/src/features/feature-request/feature-request.feature.md` では、シナリオ説明に `![...](./feature-request-edit.png)` のようにスクリーンショットを参照し、実行時に Playwright で画像を保存します。

## Storybook

```bash
pnpm storybook
```

Storybook のビルド:

```bash
pnpm build-storybook
```

## VRT（Visual Regression Testing）について

このリポジトリでは、Vitest browser（Chromium）で UI をレンダリングし、スクリーンショット差分で回帰を検知します。

- 生成される画像の主な置き場所: `packages/**/__screenshots__/**`
- `expect(...).toMatchScreenshot()` でスクリーンショットを保存
- 更新が必要な場合は `pnpm test:fix`（= `turbo run test -- --update`）

## Docker（アプリ）

各アプリは Dockerfile を同梱しています。

```bash
docker build -t fequest-user apps/user
docker build -t fequest-admin apps/admin
```

## 便利コマンド

```bash
pnpm ci:fix
```

- `pnpm ci:fix`: lint/format/typecheck/test(update) をまとめて実行
- `pnpm generate:feature`: Turborepo generator で feature 雛形生成
- `pnpm generate:component`: Turborepo generator で component 雛形生成
