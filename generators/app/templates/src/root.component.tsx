import React from "react";
import openmrsRootDecorator from "@openmrs/react-root-decorator";
import { defineConfigSchema, validators } from "@openmrs/esm-module-config";
import { BrowserRouter, Route } from "react-router-dom";
import <%= componentName %> from "./<%= dashedFeatureName %>/<%= dashedFeatureName %>.component";

defineConfigSchema("<%= name %>", {
  displayGreeting: {
    validators: [validators.isBoolean],
    default: true,
  },
  /* See the esm-module-config documentation:
      https://wiki.openmrs.org/display/projects/openmrs-esm-module-config */
});

function Root(props) {
  return (
    <BrowserRouter basename={window["getOpenmrsSpaBase"]()}>
      <Route path="/<%= dashedFeatureName %>" component={<%= componentName %>} />
    </BrowserRouter>
  );
}
export default openmrsRootDecorator({
  featureName: "<%= featureName %>",
  moduleName: "<%= name %>",
})(Root);
