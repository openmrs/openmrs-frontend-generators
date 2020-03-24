var Generator = require("yeoman-generator");
const chalk = require("chalk");
const R = require("ramda");

const extend = R.unapply(R.mergeAll)

function dashedName(name) {
    return name.replace('@', '').replace(/\//, '-');
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

  prompting() {}

  configuring() {
      this.props = this._composedWith[0].props;
      this.props.dashedName = dashedName(this.props.name);
      this.log(this.props);
      this.fs.copyTpl(this.templatePath("_package.json"), this.destinationPath("package.json"), {
        dashedName: this.props.dashedName,
        account: this.props.account,
        localName: this.props.localName
    })
  }

  default() {
      this.fs.copy(this.templatePath('_jest.config.json'), this.destinationPath("jest.config.json"))
      this.fs.copy(this.templatePath('_tsconfig.json'), this.destinationPath("tsconfig.json"))
      this.fs.copyTpl(this.templatePath('_webpack.config.js'), this.destinationPath("webpack.js"), {
          dashedName: this.props.dashedName,
          underscoredName: this.props.dashedName.replace(/-/, "_")
      })
  }

};
