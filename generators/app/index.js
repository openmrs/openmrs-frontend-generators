var Generator = require("yeoman-generator");
const chalk = require("chalk");
const R = require("ramda");

const extend = R.unapply(R.merge)

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    this.composeWith(require.resolve("generator-node/generators/app"), {
      boilerplate: false,
      projectRoot: "src",
      license: true
    });
  }

  initializing() {
    this.log("Welcome to the " + chalk.yellow("OpenMRS ESM") + " generator!");
  }

  prompting() {}

  configuring() {}

  default() {}

  conflicts() {  // to go after generator-node.writing
    this.log(this.repositoryName);
    const currentPkg = this.fs.readJSON(
      this.destinationPath("package.json"),
      {}
    );
    const openmrsPkg = this.fs.readJSON(this.templatePath("_package.json"));
    const pkg = extend(openmrsPkg, currentPkg);
    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
  }
};
