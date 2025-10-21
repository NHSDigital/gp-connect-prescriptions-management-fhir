var rawContent = context.getVariable("response.content");

try {
  var response = JSON.parse(rawContent);
  var diagnostics = null;

  // Safely access response.issue[0].diagnostics
  if (response && response.issue && response.issue.length > 0) {
    diagnostics = response.issue[0].diagnostics;

    // Try to parse diagnostics as JSON
    var innerJson = JSON.parse(diagnostics);

    // If successful, replace the response with the inner JSON
    context.setVariable("response.content", JSON.stringify(innerJson));
    context.setVariable("unwrapDiagnostics.applied", true);
  }
} catch (e) {
  // If diagnostics is not valid JSON, leave the response as-is
  context.setVariable("unwrapDiagnostics.skipped", "Unable to parse diagnostics as JSON — CatchAll logic preserved.");
}
