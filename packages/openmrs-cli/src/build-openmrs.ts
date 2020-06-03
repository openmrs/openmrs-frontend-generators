#!/usr/bin/env node

process.env.NODE_ENV = 'production';

import * as webpack from 'webpack';
import config from './configs/webpack.config';

webpack(config, (err, stats) => {
  if (err || stats.hasErrors()) {
    if (err) {
      console.error(err);
    }

    if (stats.hasErrors()) {
      console.log(
        stats.toString({
          chunks: false,
          colors: true,
        }),
      );
    }

    process.exit(1);
  } else {
    console.log(
      stats.toString({
        chunks: false,
        colors: true,
        usedExports: true,
      }),
    );
  }
});
