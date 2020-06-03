#!/usr/bin/env node

import yeoman from 'yeoman-environment';
import { argv } from 'yargs';
import * as openmrs from 'generator-openmrs';

const env = yeoman.createEnv();
env.registerStub(openmrs, 'openmrs');
env.run('openmrs', argv);
