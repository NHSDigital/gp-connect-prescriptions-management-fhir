const subNHS = context.getVariable("nhsd.subject.nhs_number");

if (subNHS) {
    const httpverb = String(context.getVariable("request.verb")).toLowerCase();
    const errorObject = { error: 'invalid_token', errorDescription: "NHS ID could not be validated", statusCode: 401, reasonPhrase: "Unauthorized" };
    var requestNHS = null;

    if (httpverb === 'get' || httpverb === 'patch') {
        const queryParams = context.getVariable("request.querystring");
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

        const queryNHSNumber = normalizedParams["patient"];
        if (queryNHSNumber) {
            requestNHS = String(queryNHSNumber).trim();
        } else {
            const pathSuffix = context.getVariable("proxy.pathsuffix");
            if (pathSuffix) {
                var parts = pathSuffix.split('/').filter(Boolean);
                requestNHS = parts.length ? parts[parts.length - 2] : null;
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
        }
        else {
            context.setVariable('trigger.raiseNHSNumberFault', true);
            context.setVariable('validation.errorMessage', errorObject.error);
            context.setVariable('validation.errorDescription', errorObject.errorDescription);
            context.setVariable('validation.statusCode', errorObject.statusCode);
            context.setVariable('validation.reasonPhrase', errorObject.reasonPhrase);
        }
    }
    if(requestNHS !== subNHS) {
        context.setVariable('trigger.raiseNHSNumberFault', true);
        context.setVariable('validation.errorMessage', errorObject.error);
        context.setVariable('validation.errorDescription', errorObject.errorDescription);
        context.setVariable('validation.statusCode', errorObject.statusCode);
        context.setVariable('validation.reasonPhrase', errorObject.reasonPhrase);
    }
}