FROM alpine:latest

RUN apk add yq

#Copyign HeslthStatus OAS file in container
COPY "HealthStatusEndpoint.json" ./

COPY ./specification ./specification
#Adding Health status endpoint to main spec file
RUN yq ".paths |= ($(cat HealthStatusEndpoint.json) + .)" <specification/gp-connect-prescriptions-management-fhir.yaml> updated-spec.yaml

FROM stoplight/prism:latest
#Inheriting from previous image and copying updated OAS spec file to current container
COPY --from=0  /specification  /usr/src/prism/packages/cli/gp-connect-prescriptions-management-fhir/specification
COPY --from=0  /updated-spec.yaml  /usr/src/prism/packages/cli/gp-connect-prescriptions-management-fhir/specification/gp-connect-prescriptions-management-fhir.yaml

#Running command of mock with OAS file
CMD ["mock" , "-h", "0.0.0.0", "-p" ,"9000" ,"gp-connect-prescriptions-management-fhir/specification/gp-connect-prescriptions-management-fhir.yaml"]
