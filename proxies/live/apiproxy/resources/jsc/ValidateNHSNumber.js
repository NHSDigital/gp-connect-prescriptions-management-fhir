//print("nhsd.actor.nhs_number   : " + context.getVariable("nhsd.actor.nhs_number"));
//print("nhsd.subject.nhs_number : " + context.getVariable("nhsd.subject.nhs_number"));

var subNHS = context.getVariable("nhsd.subject.nhs_number");

if (subNHS) {
    var httpverb = String(context.getVariable("request.verb")).toLowerCase();
    var requestNHS = null;

    if (httpverb === 'get' || httpverb === 'patch') {
        var queryParams = context.getVariable("request.querystring");
        //print(queryParams);
        var normalizedParams = {};

        if (queryParams) {
            var pairs = queryParams.split("&");
            pairs.forEach(function(pair) {
                var parts = pair.split("=");
                if (parts.length === 2) {
                    normalizedParams[parts[0].toLowerCase()] = decodeURIComponent(parts[1]);
                }
            });
        }

        var queryNHSNumber = normalizedParams["patient"];
        if (queryNHSNumber) {
            requestNHS = String(queryNHSNumber).trim();
            //print("NHS from query: " + requestNHS);
        } else {
            var pathSuffix = context.getVariable("proxy.pathsuffix");
            if (pathSuffix) {
                var parts = pathSuffix.split('/').filter(Boolean);
                requestNHS = parts.length ? parts[parts.length - 2] : null;
                //print("NHS from route: " + requestNHS);
            }
        }
    } else if (httpverb === 'post') {
        var reqContent;
        try {
            reqContent = JSON.parse(context.getVariable('request.content') || "{}");
        } catch (e) {
            reqContent = null;
        }
        if(reqContent){
            var requestNHS = (reqContent && reqContent["for"] && reqContent["for"].identifier && reqContent["for"].identifier.value)
                            ? reqContent["for"].identifier.value
                            : (reqContent && reqContent.requester && reqContent.requester.identifier && reqContent.requester.identifier.value)
                            ? reqContent.requester.identifier.value
                            : null;
            //print("POST RequestNHS: " + requestNHS);    
        }
        else {
            context.setVariable('trigger.raiseNHSNumberFault', true);
            var errorObject = { error: 'invalid_token', errorDescription: "NHS ID could not be validated", statusCode: 401, reasonPhrase: "Unauthorized" };
            context.setVariable('validation.errorMessage', errorObject.error);
            context.setVariable('validation.errorDescription', errorObject.errorDescription);
            context.setVariable('validation.statusCode', errorObject.statusCode);
            context.setVariable('validation.reasonPhrase', errorObject.reasonPhrase);
        }
    }
    if(requestNHS !== subNHS) {
        context.setVariable('trigger.raiseNHSNumberFault', true);
        var errorObject = { error: 'invalid_token', errorDescription: "NHS ID could not be validated", statusCode: 401, reasonPhrase: "Unauthorized" };
        context.setVariable('validation.errorMessage', errorObject.error);
        context.setVariable('validation.errorDescription', errorObject.errorDescription);
        context.setVariable('validation.statusCode', errorObject.statusCode);
        context.setVariable('validation.reasonPhrase', errorObject.reasonPhrase);
    }
}