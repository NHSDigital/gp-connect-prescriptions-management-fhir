project_name = gp-connect-prescriptions-management-fhir

build: spec
	docker build -t $(project_name) -f Dockerfile .

run: build
	docker run --rm -it -p 9000:9000 --name $(project_name) $(project_name)

spec:
	cp -r ../specification .

.PHONY: build run spec