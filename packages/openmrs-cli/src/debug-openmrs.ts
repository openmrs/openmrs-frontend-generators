#!/usr/bin/env node

process.env.NODE_ENV = 'development';

import * as WebpackDevServer from 'webpack-dev-server';
import * as webpack from 'webpack';
import config from './configs/webpack.config';

const options = config.devServer;
const devServer = new WebpackDevServer(webpack(config), options);

devServer.listen(options.port, 'localhost', err => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Starting the development server on port ${options.port}...`);
  }
});
