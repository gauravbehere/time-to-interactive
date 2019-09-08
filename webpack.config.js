const path = require('path');
const deployPath = path.resolve(__dirname, './dist');
const commonJSDeployPath = path.resolve(__dirname, '.');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const deployFile = 'time-to-interactive.min.js';
const FileManagerPlugin = require('filemanager-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: deployPath,
    filename: deployFile
  },
  devtool: false,
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ["@babel/preset-env"]
        }
      }
    ]
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  },
  plugins: [
    new FileManagerPlugin({
      onEnd: {
        copy: [
          { source: deployPath + '/' +  deployFile, destination: commonJSDeployPath + '/index.js' }
        ]
      }
    })
  ]
}
