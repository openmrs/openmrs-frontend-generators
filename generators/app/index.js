var Generator = require("yeoman-generator");
const path = require('path');
const chalk = require("chalk");
const R = require("ramda");
const { capitalCase, paramCase, pascalCase } = require("change-case");

const extend = R.unapply(R.mergeAll);

function dashedName(name) {
  return name.replace("@", "").replace(/\//, "-");
}

function defaultFeatureName(fullName) {
  return capitalCase(fullName.replace(/@.*\//, "").replace(/^.*esm-/, ""));
}

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    this.composeWith(require.resolve("generator-node/generators/app"), {
      boilerplate: false,
      projectRoot: "src",
      license: false
    });
  }

  initializing() {
    this.log("Welcome to the " + chalk.yellow("OpenMRS ESM") + " generator!");
  }

  prompting() {
    const prompts = [
      {
        name: "featureName",
        message: "Friendly Name",
        default: defaultFeatureName(path.basename(process.cwd()))
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = extend(this.props, props);
    });
  }

  configuring() {
    this.props = extend(this.props, this._composedWith[0].props); // get props from generator-node
    this.props.dashedName = dashedName(this.props.name);
    this.log(this.props);
    this.fs.copyTpl(
      this.templatePath("_package.json"),
      this.destinationPath("package.json"),
      {
        dashedName: this.props.dashedName,
        account: this.props.account,
        localName: this.props.localName
      }
    );
  }

  _copyConfigFiles() {
    this.fs.copy(
      this.templatePath("_jest.config.json"),
      this.destinationPath("jest.config.json")
    );
    this.fs.copy(
      this.templatePath("_tsconfig.json"),
      this.destinationPath("tsconfig.json")
    );
    this.fs.copyTpl(
      this.templatePath("_webpack.config.js"),
      this.destinationPath("webpack.js"),
      {
        dashedName: this.props.dashedName,
        underscoredName: this.props.dashedName.replace(/-/, "_")
      }
    );
  }

  _copySrcFiles() {
    this.fs.copyTpl(this.templatePath("src"), this.destinationPath("src"), {
      name: this.props.name,
      dashedName: this.props.dashedName,
      featureName: this.props.featureName,
      componentName: pascalCase(this.props.featureName),
      dashedFeatureName: paramCase(this.props.featureName)
    });
  }

  default() {
    this._copyConfigFiles();

    this._copySrcFiles();

    this.fs.copy(
      this.templatePath("__mocks__"),
      this.destinationPath("__mocks__")
    );
  }
};
