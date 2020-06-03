import * as fs from 'fs';
import * as path from 'path';
import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
import * as ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import * as CircularDependencyPlugin from 'circular-dependency-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const directory = process.cwd();
const webpackConfig = path.resolve(directory, 'webpack.config.js');
const metaPath = path.resolve(directory, 'package.json');

const dist = path.join(directory, 'dist');
const src = path.join(directory, 'src');

const pkg = require(metaPath);
const name = pkg.name.replace('@openmrs/esm-', 'openmrs-esm-');
const prefix = name.replace('openmrs-', '');
const externals = require('./externals');

const mode = process.env.NODE_ENV || 'development';
const develop = mode === 'development';
const test = mode === 'test';
const production = mode === 'production';

function getPlugins(plugins: Array<any>) {
  if (production) {
    return plugins.concat([new webpack.optimize.OccurrenceOrderPlugin(false), new CleanWebpackPlugin()]);
  }

  return plugins;
}

function convertPaths(obj: Record<string, string>) {
  Object.keys(obj).forEach(key => {
    obj[key] = path.resolve(directory, obj[key]);
  });

  return obj;
}

function getAlias(aliases: Record<string, string>) {
  return convertPaths({ '~': './src', ...aliases });
}

const config = {
  entry: path.resolve(directory, 'src/index.ts'),
  output: {
    filename: `${name}.js`,
    libraryTarget: 'system',
    path: path.resolve(directory, 'dist'),
    jsonpFunction: `webpackJsonp_${name.replace(/\-/, '_')}`,
  },
  externals,
  mode,
  module: {
    rules: [
      {
        parser: {
          system: false,
        },
      },
      {
        test: /\.m?(js|ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: `${prefix}__[name]__[local]___[hash:base64:5]`,
              },
            },
          },
        ],
      },
    ],
  },
  devtool: 'sourcemap',
  devServer: {
    port: 8081,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    disableHostCheck: true,
  },
  plugins: getPlugins([
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: true,
      allowAsyncCycles: false,
      cwd: process.cwd(),
    }),
    new ForkTsCheckerWebpackPlugin(),
  ]),
  resolve: {
    alias: getAlias(pkg.alias || {}),
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
};

function buildConfig() {
  if (fs.existsSync(webpackConfig)) {
    const fn = require(webpackConfig);

    if (typeof fn === 'function') {
      const result = fn(config, {
        mode,
        production,
        develop,
        test,
        directory,
        dist,
        src,
      });

      if (typeof result === 'object' && fn) {
        return result;
      } else {
        console.error('Did not get a valid object back from calling "webpack.config.js" ...');
      }
    } else if (typeof fn === 'object' && fn) {
      return merge(config, fn);
    } else {
      console.error('Did not receive a suitable export (function or object) from "webpack.config.js" ...');
    }
  }

  return config;
}

export default buildConfig();
