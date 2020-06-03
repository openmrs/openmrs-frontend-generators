import * as Generator from 'yeoman-generator';
import { resolve } from 'path';
import { gitignore } from './gitignore';

module.exports = class OpenmrsGenerator extends Generator {
  private answers: Generator.Answers;

  constructor(args: Array<string>, options: {}) {
    super(args, options);

    this.option('name', {
      description: 'The name of the openmrs-esm-...',
      type: String,
    });
  }

  paths() {
    this.sourceRoot(resolve(__dirname, '..', '..', 'templates'));
  }

  async prompting() {
    const questions = [];

    if (!this.options.name) {
      questions.push({
        type: 'input',
        name: 'name',
        message: "Your project name, e.g., 'patient-registration'",
        default: this.appname.split(' ').join('-').replace('openmrs-esm-', ''),
      });
    }

    this.answers = await this.prompt(questions);
  }

  writing() {
    const name = this.options.name || this.answers.name;
    const year = new Date().getFullYear();
    const { version } = require('../../package');

    this.fs.copyTpl(
      this.templatePath(),
      this.destinationPath(),
      {
        name,
        year,
      },
      undefined,
      { globOptions: { dot: true } },
    );

    this.fs.extendJSON(this.destinationPath('package.json'), {
      name: `@openmrs/esm-${name}`,
      main: `dist/openmrs-esm-${name}.js`,
      types: `src/openmrs-esm-${name}.tsx`,
      directories: {
        lib: 'dist',
      },
      browserslist: ['extends browserslist-config-openmrs'],
      husky: {
        hooks: {
          'pre-commit': 'pretty-quick --staged && npm run test',
        },
      },
      scripts: {
        start: 'debug-openmrs',
        build: 'build-openmrs',
        prettier: 'prettier',
        prepublishOnly: 'npm run build',
        test: 'test-openmrs',
      },
      bugs: {
        url: `https://github.com/openmrs/openmrs-esm-${name}/issues`,
      },
      homepage: `https://github.com/openmrs/openmrs-esm-${name}#readme`,
      devDependencies: {
        '@testing-library/react': '^9.1.3',
        '@types/jest': '^24.0.18',
        '@types/react': '^16.9.2',
        '@types/react-dom': '^16.9.0',
        '@types/react-router': '^5.0.3',
        '@types/react-router-dom': '^4.3.5',
        '@openmrs/cli': version,
        husky: '^3.0.4',
        typescript: '^3.5.3',
      },
      dependencies: {
        '@openmrs/esm-api': '^1.2.2',
        '@openmrs/esm-module-config': '^1.2.0',
        '@openmrs/esm-root-config': '^1.2.0',
        '@openmrs/react-root-decorator': '^2.0.0',
        kremling: '^2.0.1',
        react: '^16.9.0',
        'react-dom': '^16.9.0',
        'react-router': '^5.0.1',
        'react-router-dom': '^5.0.1',
        'single-spa-react': '^2.10.2',
        'systemjs-webpack-interop': '^1.1.0',
      },
    });

    this.fs.write(this.destinationPath('.gitignore'), gitignore);

    this.fs.move(this.destinationPath('src/openmrs-esm.tsx'), this.destinationPath(`src/openmrs-esm-${name}.tsx`));
  }
};
