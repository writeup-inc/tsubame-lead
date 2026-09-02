# つばめリード LP

株式会社ライトアップのGitHub Pagesで公開する、つばめリードの販促LPです。

## 公開URL

https://writeup-inc.github.io/tsubame-lead/

## 更新方法

1. `index.html`、`site-update.css`、`site.js`、画像を必要に応じて編集します。
2. `main`ブランチへコミット・プッシュします。
3. GitHub Pagesが自動で再公開します。通常は数分で反映されます。

主要ファイル：

- `index.html`：ページ本文とメタデータ
- `site.css`：基本スタイル
- `site-update.css`：現在の追加・調整スタイル
- `site.js`：料金シミュレーターとChatGPT相談導線
- `evidence-viewer.png`：送信証跡画面
- `team-developers-primary.jpg`、`team-developers-review.jpg`：チーム画像

## ローカル確認

```bash
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000/` を開きます。

## 更新時の確認

- 成功送信単価、初期費用、保存期間などの数値を勝手に変更しない
- 競合名はA社・B社・C社の匿名表記を維持する
- PC、タブレット、スマートフォンで横スクロールが発生しないことを確認する
- ChatGPT相談ボタンとTimeRexへの導入相談リンクを確認する
