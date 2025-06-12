# Hello Kubernetes Example

このリポジトリは Next.js 製のフロントエンドと Node.js 製のバックエンドからなるサンプルアプリです。Redis と MinIO を利用しており、ローカル開発用の Docker Compose 設定と minikube 用の Kubernetes マニフェストが含まれています。

## ファイル構成

```
.
├── backend/          # Express API と worker
├── caddy/            # Caddy の設定
├── compose.dev.yaml  # 開発用 Docker Compose
├── compose.prod.yaml # 本番用 Docker Compose
├── k8s/              # Kubernetes マニフェスト
├── minio/            # MinIO のデータ保存先
├── next-app/         # Next.js アプリケーション
├── redis/            # Redis のデータ保存先
└── Makefile          # minikube 用のユーティリティ
```

## Docker Compose での利用

### 開発環境 (dev)
1. `.env.example` をコピーして `.env` を作成します。
   ```bash
   cp .env.example .env
   ```
2. 開発モードでコンテナを起動します。
   ```bash
   docker compose -f compose.dev.yaml up --build
   ```
3. 各サービスにアクセスします。
   - フロントエンド: <http://localhost:3000>
   - バックエンド API: <http://localhost:4000>
   - MinIO コンソール: <http://localhost:9001>

`CTRL+C` で停止し、終了時は `docker compose down` を実行してください。

### 本番環境 (prod)
1. 同様に `.env` を用意します。
2. 本番用設定でコンテナを起動します。
   ```bash
   docker compose -f compose.prod.yaml up --build -d
   ```
   バックグラウンドで実行するため `-d` オプションを付けています。
3. 停止する場合は次を実行します。
   ```bash
   docker compose -f compose.prod.yaml down
   ```

## minikube での利用

Makefile のタスクを利用してイメージのビルドとデプロイを行います。kustomize は kubectl に統合されているので、`minikube` と `kubectl` がインストールされている必要があります。

### 開発環境 (dev overlay)
1. minikube の Docker デーモン上でイメージをビルドします。
   ```bash
   make build
   ```
2. 開発用オーバーレイをデプロイします。
   ```bash
   make deploy OVERLAY=dev
   ```
3. 後片付けをする場合:
   ```bash
   make clean OVERLAY=dev
   ```

### 本番環境 (prod overlay)
1. イメージのビルドは dev と同様です。
2. 本番用オーバーレイをデプロイします。
   ```bash
   make deploy
   ```
   `OVERLAY` を指定しなければデフォルトの `prod` オーバーレイが使用されます。
3. リソースを削除する場合:
   ```bash
   make clean
   ```
