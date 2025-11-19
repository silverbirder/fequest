# Feature: プロダクト詳細ページを E2E で検証する

![product detail](./product-detail-screenshot.png)

## Scenario: シード済みのプロダクト詳細を表示する

- Given データベースにサンプルのプロダクトが存在する
- And user アプリケーションのコンテナを起動している
- When /[id] ページにアクセスしたとき
- Then シードされたフィーチャーを確認できる
- And Playwright で /[id] ページにアクセスしてスクリーンショットを保存できる
