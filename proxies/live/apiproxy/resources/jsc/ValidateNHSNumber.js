// ---- Debug (trace only) ----
print("nhsd.actor.nhs_number   : " + context.getVariable("nhsd.actor.nhs_number"));
print("nhsd.subject.nhs_number : " + context.getVariable("nhsd.subject.nhs_number"));

    // ---- Subject NHS number (from composite ID shared flow) ----
var subNHS = context.getVariable("nhsd.subject.nhs_number");

if (subNHS) {
    // ---- HTTP Verb ----
    var httpverb = context.getVariable("request.verb");
    var requestNHS = null;

    if (httpverb === 'GET') {
        var queryNHSNumber = context.getVariable("request.queryparam.patientNHSNumber");
        if (queryNHSNumber) {
            requestNHS = String(queryNHSNumber).trim();
            print("NHS from query: " + requestNHS);
        }
        else {
            var pathSuffix = context.getVariable("proxy.pathsuffix");
            if (pathSuffix) {
                var parts = pathSuffix.split('/').filter(Boolean);
                requestNHS = parts.length ? parts[parts.length - 1] : null;
                print("NHS from route: " + requestNHS);
            }
        }
    }
    else if (httpverb === 'POST') {
        var reqContent = JSON.parse(context.getVariable('request.content'));
        var requestNHS = (reqContent && reqContent["for"] && reqContent["for"].identifier && reqContent["for"].identifier.value)
                            ? reqContent["for"].identifier.value
                            : (reqContent && reqContent.requester && reqContent.requester.identifier && reqContent.requester.identifier.value)
                            ? reqContent.requester.identifier.value
                            : null;
        print("POST RequestNHS  :" + requestNHS);
    }
    if (requestNHS && requestNHS !== subNHS) {
        context.setVariable('trigger.raiseNHSNumberFault', true);
        var errorObject = { error: 'invalid_token', errorDescription: "NHS ID could not be validated", statusCode: 401, reasonPhrase: "Unauthorized" };
        context.setVariable('validation.errorMessage', errorObject.error);
        context.setVariable('validation.errorDescription', errorObject.errorDescription);
        context.setVariable('validation.statusCode', errorObject.statusCode);
        context.setVariable('validation.reasonPhrase', errorObject.reasonPhrase);
    }
}