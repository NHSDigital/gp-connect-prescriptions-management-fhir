
# Makefile

project_name ?= token-validator
ECR_REPO ?= 790083933819.dkr.ecr.eu-west-2.amazonaws.com/gp-connect-prescriptions-management-fhir-infra-dev-token-validator
IMAGE_TAG ?= lambda
IMAGE := $(project_name):$(IMAGE_TAG)
ECR_IMAGE := $(ECR_REPO):$(IMAGE_TAG)

# Default target
.PHONY: build push run spec
.DEFAULT_GOAL := push

build: spec
    # Force classic Docker builder and Docker schema v2 (no BuildKit/OCI)
    DOCKER_BUILDKIT=0 DOCKER_CLI_EXPERIMENTAL=disabled \
    docker build --platform linux/amd64 \
        --provenance=false \
        -t $(IMAGE) -f Dockerfile .

push: build
    # Tag & push via classic docker (produces single-image manifest in ECR)
    docker tag $(IMAGE) $(ECR_IMAGE)
    docker push $(ECR_IMAGE)

run: build
    docker run --rm -it -p 9000:9000 --name $(project_name) $(IMAGE)

spec:
    cp -r ../specification .