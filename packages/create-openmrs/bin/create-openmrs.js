#!/usr/bin/env node

const yeoman = require('yeoman-environment')
const argv = require('yargs').argv

const env = yeoman.createEnv()
env.registerStub(require('generator-openmrs'), 'openmrs')
env.run('openmrs', argv)
