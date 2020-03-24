import React from "react";
import { render } from "@testing-library/react";
import <%= componentName %> from "./<%= dashedFeatureName %>.component";

it("renders without failing", () => {
  render(<<%= componentName %> />);
});
