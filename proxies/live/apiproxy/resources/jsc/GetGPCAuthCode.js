var respContent=context.getVariable('GPCPFSAuthResponse.content');
const respObject=json.parse(respContent);
context.setVariable("request.header.Authorization", respObject["access_token"]);
