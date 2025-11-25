# Feature: プロダクト詳細ページを E2E で検証する

## Scenario: シード済みのプロダクト詳細を表示する

![product detail](./product-detail-screenshot.png)

- Given データベースにサンプルのプロダクトが存在する
- And user アプリケーションのコンテナを起動している
- When /[id] ページにアクセスしたとき
- Then シードされたフィーチャーを確認できる
- And Playwright で /[id] ページにアクセスしてスクリーンショットを保存できる

## Scenario: 認証したユーザーがフィーチャーリクエストを投稿する

![product detail auth](./product-detail-auth-screenshot.png)

- Given データベースにサンプルのプロダクトが存在する
- And user アプリケーションのコンテナを起動している
- And 認証済みのユーザーセッションが存在する
- When 認証ユーザーとして /[id] ページで "E2E 新規フィーチャー" を投稿する
- Then 投稿したフィーチャーリクエストが一覧に表示される
