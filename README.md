# バーチャル試着デモアプリ

Google CloudのVertex AI Virtual Try-On APIを使用して、ユーザーが服を仮想的に試着できるWebアプリケーションです。Next.js、TypeScript、Tailwind CSSで構築されています。

## 機能

- 人物画像と商品画像のアップロード
- Google AIを使用したリアルな試着画像の生成
- 生成された結果のダウンロード
- ダークモード対応のレスポンシブデザイン
- Tailwind CSSによるモダンなUI

## 技術スタック

- **フレームワーク:** Next.js 15 (App Router)
- **言語:** TypeScript
- **スタイリング:** Tailwind CSS
- **リント/フォーマット:** Biome
- **パッケージマネージャー:** pnpm
- **AI API:** Google Cloud Vertex AI Virtual Try-On API

## 前提条件

始める前に、以下がインストールされていることを確認してください：

- Node.js 18.17 以降
- pnpm 8.0 以降
- 請求先が有効化されたGoogle Cloud Platformアカウント

## Google Cloudのセットアップ

### 1. Google Cloudプロジェクトの作成

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成するか、既存のプロジェクトを選択
3. プロジェクトIDをメモする

### 2. 必要なAPIの有効化

1. [Vertex AI APIページ](https://console.cloud.google.com/apis/library/aiplatform.googleapis.com)に移動
2. 「有効にする」をクリックしてVertex AI APIを有効化
3. プロジェクトで請求先が有効になっていることを確認

### 3. サービスアカウント認証情報の作成

1. [IAMと管理 > サービスアカウント](https://console.cloud.google.com/iam-admin/serviceaccounts)に移動
2. 「サービスアカウントを作成」をクリック
3. 名前と説明を入力
4. 以下のロールを付与：
   - Vertex AI User
   - Service Account Token Creator
5. 「完了」をクリック
6. 作成したサービスアカウントをクリック
7. 「キー」タブに移動
8. 「鍵を追加」>「新しい鍵を作成」をクリック
9. JSON形式を選択してキーファイルをダウンロード
10. JSONファイルを安全に保存（例：プロジェクトルートに`service-account-key.json`として保存）
11. **重要:** このファイルを`.gitignore`に追加してコミットを防ぐ

## インストール

1. リポジトリをクローンするか、プロジェクトディレクトリに移動：

\`\`\`bash
cd virtual-try-on-demo-app
\`\`\`

2. 依存関係をインストール：

\`\`\`bash
pnpm install
\`\`\`

3. 環境変数のテンプレートをコピー：

\`\`\`bash
cp .env.example .env
\`\`\`

4. `.env`を編集してGoogle Cloud認証情報を設定：

\`\`\`env
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
\`\`\`

`your-project-id`を実際のGoogle CloudプロジェクトIDに置き換えてください。

## アプリケーションの実行

### 開発モード

\`\`\`bash
pnpm dev
\`\`\`

ブラウザで[http://localhost:3000](http://localhost:3000)を開きます。

### 本番ビルド

\`\`\`bash
pnpm build
pnpm start
\`\`\`

## 使い方

1. **写真のアップロード:**
   - 「Your Photo」のアップロードエリアをクリック
   - 服を着ている人物の画像を選択
   - 上半身がはっきりと写っている画像が推奨

2. **服の画像のアップロード:**
   - 「Clothing Item」のアップロードエリアをクリック
   - 試着したい服の画像を選択
   - 無地の背景で撮影された商品写真が最適

3. **試着画像の生成:**
   - 「Try It On」ボタンをクリック
   - AIが結果を生成するまで待つ（通常10-30秒）
   - 生成された試着画像を確認

4. **結果のダウンロード:**
   - 生成された画像の下にある「Download」ボタンをクリック
   - 画像がダウンロードフォルダに保存されます

## コード品質

### リント

\`\`\`bash
pnpm lint
\`\`\`

### フォーマット

\`\`\`bash
pnpm format
\`\`\`

### チェックと修正

\`\`\`bash
pnpm check
\`\`\`

## プロジェクト構成

\`\`\`
virtual-try-on-demo-app/
├── app/
│   ├── api/
│   │   └── try-on/
│   │       └── route.ts          # 試着リクエスト用APIエンドポイント
│   ├── components/
│   │   ├── ImageUploader.tsx     # 画像アップロードコンポーネント
│   │   └── TryOnResult.tsx       # 結果表示コンポーネント
│   ├── globals.css               # グローバルスタイル
│   ├── layout.tsx                # ルートレイアウト
│   └── page.tsx                  # メインページ
├── lib/
│   └── google-cloud.ts           # Google Cloud API統合
├── types/
│   └── index.ts                  # TypeScript型定義
├── .env.example                  # 環境変数テンプレート
├── biome.json                    # Biome設定
├── next.config.ts                # Next.js設定
├── package.json                  # 依存関係
├── tailwind.config.ts            # Tailwind CSS設定
└── tsconfig.json                 # TypeScript設定
\`\`\`

## トラブルシューティング

### 認証エラー

認証エラーが表示される場合：

1. `.env`のサービスアカウントキーファイルのパスを確認
2. サービスアカウントに正しいロールが付与されているか確認
3. Vertex AI APIが有効になっているか確認
4. プロジェクトで請求先が有効になっているか確認

### APIエラー

APIがエラーを返す場合：

1. ブラウザのコンソールとサーバーログで詳細なエラーメッセージを確認
2. 画像がサポートされている形式（PNG、JPG、JPEG）であることを確認
3. 画像が大きすぎないことを確認（10MB以下を推奨）
4. Google Cloudプロジェクトに十分なクォータがあることを確認

### レート制限

Virtual Try-On APIには使用制限があります。レート制限に遭遇した場合：

1. 追加のリクエストを行う前に待つ
2. Google Cloud Consoleでクォータを確認
3. 必要に応じてクォータの増加をリクエスト

## API詳細

このアプリケーションはGoogle Cloud Vertex AI Virtual Try-On APIを使用しています：

- **モデル:** `virtual-try-on-preview-08-04`
- **エンドポイント:** `https://LOCATION-aiplatform.googleapis.com/v1/projects/PROJECT_ID/locations/LOCATION/publishers/google/models/virtual-try-on-preview-08-04:predict`
- **ドキュメント:** [Virtual Try-On APIリファレンス](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/virtual-try-on-api)

## セキュリティに関する考慮事項

- サービスアカウントキーファイルや`.env`ファイルをバージョン管理にコミットしない
- Google Cloud認証情報を安全に保管する
- 本番環境ではGoogle Cloud Secret Managerの使用を検討
- アプリケーションに適切な認証と認可を実装する

## ライセンス

これは教育目的のデモアプリケーションです。

## リソース

- [Google Cloud Vertex AIドキュメント](https://cloud.google.com/vertex-ai/docs)
- [Virtual Try-On APIガイド](https://cloud.google.com/vertex-ai/generative-ai/docs/image/generate-virtual-try-on-images)
- [Next.jsドキュメント](https://nextjs.org/docs)
- [Tailwind CSSドキュメント](https://tailwindcss.com/docs)
