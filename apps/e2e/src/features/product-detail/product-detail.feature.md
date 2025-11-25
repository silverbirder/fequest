# Feature: プロダクト詳細ページを E2E で検証する

## Scenario: 管理画面で登録したプロダクト詳細をユーザーが閲覧できる

![product detail](./product-detail-screenshot.png)

- Given admin アプリケーションのコンテナを起動している
- And user アプリケーションのコンテナを起動している
- And 管理画面からサンプルのプロダクトが登録されている
- When /[id] ページにアクセスしたとき
- Then 登録したフィーチャーを確認できる
- And Playwright で /[id] ページにアクセスしてスクリーンショットを保存できる

## Scenario: 認証したユーザーがフィーチャーリクエストを投稿する

![product detail auth](./product-detail-auth-screenshot.png)

- Given admin アプリケーションのコンテナを起動している
- And user アプリケーションのコンテナを起動している
- And 管理画面からサンプルのプロダクトが登録されている
- And 認証済みのユーザーセッションが存在する
- When 認証ユーザーとして /[id] ページで "E2E 新規フィーチャー" を投稿する
- Then 投稿したフィーチャーリクエストが一覧に表示される
