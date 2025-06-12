# Hello Kubernetes Example

このリポジトリは Next.js 製のフロントエンドと Node.js 製のバックエンドからなるサンプルアプリです。Docker Compose をもとに Kubernetes 環境を構築する習作として作成されています。Redis と MinIO を利用しており、ローカル開発用の Docker Compose 設定と minikube 用の Kubernetes マニフェストが含まれています。

## ファイル構成

```
.
├── k8s/              # Kubernetes マニフェスト
├── next-app/         # Next.js アプリケーション
├── backend/          # Express API と worker
├── caddy/            # Docker Compose 用の Caddy 設定
├── minio/            # Docker Compose 用の MinIO データ保存先
├── redis/            # Docker Compose 用の Redis データ保存先
├── compose.dev.yaml  # 開発用 Docker Compose
├── compose.prod.yaml # 本番用 Docker Compose
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
   docker compose -f compose.dev.yaml up --build -d
   ```
   バックグラウンドで実行するため `-d` オプションを付けています。
3. 各サービスにアクセスします。
   - リバースプロキシ: <https://localhost/>
   - フロントエンド: <http://localhost:3000>
   - バックエンド API: <http://localhost:4000>
   - MinIO コンソール: <http://localhost:9001>

4. 停止する場合は次を実行します。
   ```bash
   docker compose -f compose.dev.yaml down
   ```

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

まず `k8s` ディレクトリ内の `.env.example` をコピーして `.env` を作成しておきます。
```bash
cp k8s/base/minio/.env.example k8s/base/minio/.env
cp k8s/overlays/prod/caddy/.env.example k8s/overlays/prod/caddy/.env
```

### 開発環境 (dev overlay)
1. ホットリロードを有効にするため、次を別ターミナルで実行します。
   ```bash
   minikube mount "$(pwd)":/workspace/hello-k8s
   ```
2. minikube の Docker デーモン上でイメージをビルドします。
   ```bash
   make build
   ```
3. 開発用オーバーレイをデプロイします。
   ```bash
   make deploy OVERLAY=dev
   ```
4. 後片付けをする場合:
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
