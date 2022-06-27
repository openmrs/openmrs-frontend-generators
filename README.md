# Deprecated

These have been abandoned. The current recommended way to create a new frontend module
is by cloning [openmrs-esm-template-app](https://github.com/openmrs/openmrs-esm-template-app).

# Old Documentation

## OpenMRS Generators

Implementation plan, from Joel Denning:

I think npm init openmrs is the easiest api for people to use. This means there needs to be an npm project called create-openmrs that has a bin field.

A successful openmrs-specific generator would likely include creating somewhere around 5ish npm packages. I think that a lerna monorepo worked very well for create-single-spa, and could make local development and overall project management of all those create-openmrs packages easier. Monorepos are sort of the opposite of microfrontends smile, but I think they work very well for this case of managing many npm packages together.

I think the following npm packages would likely be need to be implemented:
    
- webpack-config-openmrs-single-spa (would extend webpack-config-single-spa with openmrs-specific stuff (such as translation stuff, openmrs-specific webpack externals, etc)
- webpack-config-openmrs-single-spa-react (would extend webpack-config-single-spa-react).
- generator-openmrs. This would would call this.composeWith(require.resolve('generator-single-spa/src/generator-single-spa.js'), passing in openmrs-specific options that are used instead of prompting the user for things. This part is where we'd have to dig in to find out exactly which parts can be composed and which can't
- openmrs-tsconfig. This would be an extendable typescript config file. The generator-openmrs project would have a tsconfig.json template in it that would extend the typescript config but still allow for project-specific customization
- openmrs-jest-config - this would be a shareable jest config. Used like so:

```
// jest.config.js
const config = require('openmrs-jest-config');

config.moduleNameMapper['custom-mocked-file'] = '<rootDir>/__mocks__/custom-mocked-file.ts'

module.exports = config
```

Using the lerna monorepo strategy would mean that there would be only one github repository, create-openmrs, with the following directory structure:

```
packages/
  create-openmrs/
  generator-openmrs/
  webpack-config-openmrs-single-spa/
  webpack-config-openmrs-single-spa-react/
  openmrs-ts-config/
  openmrs-jest-config/
```
