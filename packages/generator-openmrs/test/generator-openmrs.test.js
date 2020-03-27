const path = require("path");
const generator = require("../src/generator-openmrs");
const helpers = require("yeoman-test");
const assert = require("yeoman-assert");

describe("generator-openmrs", () => {
  let runContext;

  afterEach(() => {
    runContext.cleanTestDirectory();
  });

  it("can run the generator", () => {
    runContext = helpers
      .run(generator)
      .withGenerators([
        [
          helpers.createDummyGenerator(),
          "generator-single-spa/src/generator-single-spa"
        ]
      ])
      .withPrompts({
        moduleType: "app-parcel",
        framework: "react",
        packageManager: "yarn"
      });

    return runContext.then(dir => {
      assert.file(path.join(dir, "package.json"));
    });
  });
});
