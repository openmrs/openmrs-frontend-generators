#!/usr/bin/env node

import * as concurrently from 'concurrently';

process.env.NODE_ENV = 'test';

concurrently(
  [
    {
      command: 'jest', //TODO missing args for config
      name: 'jest',
    },
    {
      command: 'eslint', //TODO missing args for config
      name: 'eslint',
    },
  ],
  {
    killOthers: [],
  },
);
