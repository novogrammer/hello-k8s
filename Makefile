
build:
	@eval $$(minikube docker-env) ;\
	docker build -t hello-k8s-next-app:latest next-app

deploy:
	kubectl apply -k k8s/base

clean:
	kubectl delete -k k8s/base
