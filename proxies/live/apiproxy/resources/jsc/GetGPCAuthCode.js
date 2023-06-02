var respContent=context.getVariable('GPCPFSAuthResponse.content');
const respObject=JSON.parse(respContent);
context.setVariable("request.header.Authorization", respObject["access_token"]);
