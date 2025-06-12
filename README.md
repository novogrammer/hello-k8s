# Hello Kubernetes Example

This repository contains a sample application consisting of a Next.js front end and a Node.js backend with Redis and MinIO.  It includes configuration for running locally using Docker Compose or deploying to Kubernetes with **minikube**.

## File structure

```
.
├── backend/          # Express API and worker written in TypeScript
├── caddy/            # Caddy web server configuration
├── compose.dev.yaml  # Docker Compose configuration for local development
├── compose.prod.yaml # Docker Compose configuration for production
├── k8s/              # Kubernetes manifests (base and overlays)
├── minio/            # Persistent data directory for MinIO
├── next-app/         # Next.js application
├── redis/            # Persistent data directory for Redis
└── Makefile          # Utilities for building and deploying to minikube
```

## Usage with Docker Compose

1. Copy `.env.example` to `.env` and adjust the values if required.

```bash
cp .env.example .env
```

2. Start the stack in development mode:

```bash
docker compose -f compose.dev.yaml up --build
```

3. Access the services:

- Frontend: <http://localhost:3000>
- Backend API: <http://localhost:4000>
- MinIO console: <http://localhost:9001>

Stop the stack with `CTRL+C` and run `docker compose down` when finished.

For a production‑like setup you can use `compose.prod.yaml` instead of `compose.dev.yaml`.

## Usage with minikube

The `Makefile` provides simple helpers for working with Kubernetes via minikube.

1. Build the container images inside the minikube Docker daemon:

```bash
make build
```

2. Deploy the manifests (use `OVERLAY=dev` for the development overlay or omit for production):

```bash
make deploy OVERLAY=dev
```

3. To clean up the deployed resources:

```bash
make clean OVERLAY=dev
```

These commands rely on `kubectl` and `kustomize` being available in your environment and require minikube to be running.

