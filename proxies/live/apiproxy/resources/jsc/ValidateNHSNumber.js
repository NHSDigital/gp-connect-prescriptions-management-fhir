const subNHS = context.getVariable("nhsd.subject.nhs_number");

if (subNHS) {
    const httpverb = String(context.getVariable("request.verb")).toLowerCase();
    var requestNHS = null;

    if (httpverb === 'get' || httpverb === 'patch') {
        let queryParams = context.getVariable("request.querystring");
        let normalizedParams = {};

        if (queryParams) {
            let pairs = queryParams.split("&");
            pairs.forEach(function(pair) {
                let parts = pair.split("=");
                if (parts.length === 2) {
                    normalizedParams[parts[0].toLowerCase()] = decodeURIComponent(parts[1]);
                }
            });
        }

        let queryNHSNumber = normalizedParams["patient"];
        if (queryNHSNumber) {
            requestNHS = String(queryNHSNumber).trim();
        } else {
            let pathSuffix = context.getVariable("proxy.pathsuffix");
            if (pathSuffix) {
                let parts = pathSuffix.split('/').filter(Boolean);
                requestNHS = parts.length ? parts[parts.length - 2] : null;
            }
        }
    } else if (httpverb === 'post') {
        let reqContent;
        try {
            reqContent = JSON.parse(context.getVariable('request.content') || "{}");
        } catch (e) {
            reqContent = null;
        }
        if(reqContent){
            let requestNHS = (reqContent && reqContent["for"] && reqContent["for"].identifier && reqContent["for"].identifier.value)
                            ? reqContent["for"].identifier.value
                            : (reqContent && reqContent.requester && reqContent.requester.identifier && reqContent.requester.identifier.value)
                            ? reqContent.requester.identifier.value
                            : null; 
        }
        else {
            context.setVariable('trigger.raiseNHSNumberFault', true);
            let errorObject = { error: 'invalid_token', errorDescription: "NHS ID could not be validated", statusCode: 401, reasonPhrase: "Unauthorized" };
            context.setVariable('validation.errorMessage', errorObject.error);
            context.setVariable('validation.errorDescription', errorObject.errorDescription);
            context.setVariable('validation.statusCode', errorObject.statusCode);
            context.setVariable('validation.reasonPhrase', errorObject.reasonPhrase);
        }
    }
    if(requestNHS !== subNHS) {
        context.setVariable('trigger.raiseNHSNumberFault', true);
        let errorObject = { error: 'invalid_token', errorDescription: "NHS ID could not be validated", statusCode: 401, reasonPhrase: "Unauthorized" };
        context.setVariable('validation.errorMessage', errorObject.error);
        context.setVariable('validation.errorDescription', errorObject.errorDescription);
        context.setVariable('validation.statusCode', errorObject.statusCode);
        context.setVariable('validation.reasonPhrase', errorObject.reasonPhrase);
    }
}