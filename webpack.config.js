/* eslint-disable @typescript-eslint/naming-convention */
//@ts-check

"use strict";

const path = require("path");
const fs = require("fs");
const CopyWebpackPlugin = require("copy-webpack-plugin");

/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
const baseConfig = {
  mode: "none", // This leaves the source code as close as possible to the original (when packaging we set this to 'production')
  resolve: {
    extensions: [".ts", ".js"],
  },
  devtool: "nosources-source-map",
  infrastructureLogging: {
    level: "log", // Enables logging required for problem matchers
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [{ loader: "ts-loader" }],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, "img/"), to: path.resolve(__dirname, "out") },
      ],
    }),
  ],
};

// Config for extension source code (to be run in a Node-based context)
/** @type WebpackConfig */
const extensionConfig = {
  ...baseConfig,
  target: "node",
  entry: "./src/extension.ts",
  externals: {
    vscode: "commonjs vscode", // The vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed
  },
  output: {
    path: path.resolve(__dirname, "out"),
    filename: "extension.js",
    libraryTarget: "commonjs2",
  },
};

// Function to generate entries dynamically for all .ts files in ./src/webview/
function getWebviewEntries() {
  const webviewDir = path.resolve(__dirname, "./src/webview");
  const files = fs.readdirSync(webviewDir);
  const entries = {};

  files.forEach((file) => {
    const fullPath = path.join(webviewDir, file);
    if (fs.statSync(fullPath).isFile() && path.extname(file) === ".ts") {
      const entryName = path.basename(file, ".ts");
      entries[entryName] = fullPath;
    }
  });

  return entries;
}

const webviewEntries = getWebviewEntries();

// Config for webview source code (to be run in a web-based context)
/** @type WebpackConfig */
const webviewConfig = {
  ...baseConfig,
  target: ["web", "es2020"],
  // @ts-ignore
  entry: webviewEntries,
  experiments: { outputModule: true },
  output: {
    path: path.resolve(__dirname, "out"),
    filename: "[name].js",
    libraryTarget: "module",
    chunkFormat: "module",
  },
};

module.exports = [extensionConfig, webviewConfig];
