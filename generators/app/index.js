var Generator = require("yeoman-generator");
const path = require("path");
const chalk = require("chalk");
const R = require("ramda");
const { capitalCase, paramCase, pascalCase, snakeCase } = require("change-case");

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
      boilerplate: false, // we use our own
      projectRoot: "src",
      license: false // we use our own
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

    // We're going to delete the author section anyway, so don't ask about it
    this._composedWith[0].props = extend(this._composedWith[0].props, {
      authorName: 'dummy',
      authorEmail: 'dummy',
      authorUrl: 'dummy'      
    })

    const openmrsPkg = this.fs.readJSON(this.templatePath("_package.json"), {});
    this._composedWith[0].props.homepage = openmrsPkg.homepage;

    return this.prompt(prompts).then(props => {
      this.props = extend(this.props, props);
    });

  }

  configuring() {
    this.props = extend(this.props, this._composedWith[0].props); // get props from generator-node
    this.props.dashedName = dashedName(this.props.name);
    this.debug(this.props);
    this.fs.copyTpl(
      this.templatePath("_package.json"),
      this.destinationPath("package.json"),
      { ...this.props }
    );
    const pkg = this.fs.readJSON(this.destinationPath("package.json"), {});
    this.props = extend(this.props, R.pick(['description', 'homepage'], pkg));
  }

  _copyConfigFiles() {
    this.fs.copy(
      this.templatePath("_.babelrc"),
      this.destinationPath(".babelrc")
    );
    this.fs.copy(
      this.templatePath("_.eslintrc"),
      this.destinationPath(".eslintrc")
    );
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
      this.destinationPath("webpack.config.js"),
      {
        ...this.props,
        underscoredName: snakeCase(this.props.dashedName)
      }
    );
    this.fs.copy(
      this.templatePath(".vscode/launch.json"),
      this.destinationPath(".vscode/launch.json")
    );
  }

  _copySrcFiles() {
    this.fs.copyTpl(this.templatePath("src"), this.destinationPath("src"), {
      ...this.props,
      componentName: pascalCase(this.props.featureName),
      dashedFeatureName: paramCase(this.props.featureName)
    });
    this.fs.copy(
      this.templatePath("translations"),
      this.destinationPath("translations")
    );
  }

  default() {
    this._copyConfigFiles();

    this._copySrcFiles();

    this.fs.copy(
      this.templatePath("__mocks__"),
      this.destinationPath("__mocks__")
    );

    this.fs.copy(this.templatePath("LICENSE"), this.destinationPath("LICENSE"));

    this.fs.copyTpl(
      this.templatePath("README.md"),
      this.destinationPath("README.md"),
      { ...this.props }
    );
  }

  conflicts() {
    /* generator-node messes with pkg in some ways we don't like.
        We want to prefer our husky config and remove lint-staged and the eslint config. */
    const pkg = this.fs.readJSON(this.destinationPath("package.json"), {});
    const openmrsPkg = this.fs.readJSON(this.templatePath("_package.json"), {});
    pkg["husky"] = openmrsPkg.husky;
    delete pkg["lint-staged"];
    delete pkg["eslintConfig"];
    delete pkg["jest"];
    delete pkg["author"];
    this.fs.writeJSON(this.destinationPath("package.json"), pkg);
  }
};
