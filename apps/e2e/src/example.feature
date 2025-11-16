# language: ja

機能: vitest で vitest-cucumber を利用する
  シナリオ: ユニットテストを実行する
    前提 vitest-cucumber をインストールしている
    かつ "example.feature" のようなフィーチャーファイルを用意している
    もし vitest-cucumber を実行したとき
    ならば フィーチャーファイルが正しく解析される
    かつ シナリオをテストできる
