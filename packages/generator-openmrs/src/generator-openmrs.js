var Generator = require("yeoman-generator");

module.exports = class OpenmrsGenerator extends Generator {
  constructor(args, options) {
    super(args, options);

    this.composeWith(
      require.resolve("generator-single-spa/src/generator-single-spa"),
      {}
    );
  }
  default() {
    console.log("OpenMRS stuff");
  }
};
