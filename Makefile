
build:
	@eval $$(minikube docker-env) ;\
	docker build -t hello-k8s-next-app:latest next-app -f next-app/prod.Dockerfile;\
	docker build -t hello-k8s-backend:latest backend -f backend/Dockerfile

deploy:
	kubectl apply -k k8s/base

clean:
	kubectl delete -k k8s/base
