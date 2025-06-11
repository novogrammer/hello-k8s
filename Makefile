
build:
	@eval $$(minikube docker-env) ;\
	docker build -t hello-k8s-next-app:latest next-app -f next-app/prod.Dockerfile;\
	docker build -t hello-k8s-next-app-dev:latest next-app -f next-app/dev.Dockerfile;\
	docker build -t hello-k8s-backend:latest backend -f backend/Dockerfile

# Select overlay directory via OVERLAY (default: dev)
OVERLAY ?= prod
OVERLAY_DIR = k8s/overlays/$(OVERLAY)

deploy:
	kubectl apply -k $(OVERLAY_DIR)

clean:
	kubectl delete -k $(OVERLAY_DIR)
