-include .env

APIGEE_ACCESS_TOKEN ?= $(shell export SSO_LOGIN_URL=https://login.apigee.com && eval get_token -u $(APIGEE_USERNAME))

PYTEST_CMD = APIGEE_ACCESS_TOKEN=$(APIGEE_ACCESS_TOKEN) APIGEE_ENVIRONMENT=$(APIGEE_ENVIRONMENT) SERVICE_BASE_PATH=$(SERVICE_BASE_PATH) \
poetry run pytest -s -v --color=yes --api-name=gp-connect-prescriptions-management-fhir --proxy-name=$(PROXY_NAME)

PYTEST_CMD_INT = APIGEE_ENVIRONMENT=int APIGEE_ACCESS_TOKEN=$(APIGEE_ACCESS_TOKEN) DEFAULT_CLIENT_ID=$(DEFAULT_CLIENT_ID) DEFAULT_CLIENT_SECRET=$(DEFAULT_CLIENT_SECRET)\
	PROXY_NAME=gp-connect-prescriptions-management-fhir-int SERVICE_BASE_PATH=gp-connect/patient-facing/prescriptions-management-fhir/FHIR/R4\
	poetry run pytest -s -v --color=yes -m mock_provider_int --api-name=gp-connect-prescriptions-management-fhir-int --proxy-name=$PROXY_NAME --apigee-app-id=$(APIGEE_APP_ID) --apigee-organization=nhsd-prod

run:
	$(PYTEST_CMD)

run-int:
	$(PYTEST_CMD_INT)

#  run tests with certain marker e.g. make run-sandbox runs tests marked with sandbox
run-%:
	$(PYTEST_CMD) -m "$*"



