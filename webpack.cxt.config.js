"use strict";

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const PACKAGE_JSON = require("./package.json");

const env = process.env.NODE_ENV;

module.exports = {
  mode: env,
  entry: {
    content: "./src/content.ts",
    options: "./src/options.ts",
    control: "./src/control.ts",
    popup: "./src/popup.ts",
    overlay: "./src/overlay.ts",
    background: "./src/background.ts"
  },
  devtool: env === "production" ? "source-map" : "inline-source-map",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      },
      {
        test: /\.tsx?$/,
        use: [{
          loader: "ts-loader",
          options: {
            configFile: "tsconfig.json"
          }
        }],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|jpeg|svg|gif)$/i,
        type: "asset/resource"
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        type: "asset/resource"
      }
    ]
  },
  resolve: {
    extensions: [".ts"]
  },
  plugins:
    [
      new webpack.DefinePlugin({
        "PACKAGE_VERSION": JSON.stringify(PACKAGE_JSON.version)
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css"
      }),
      new CopyPlugin({
        patterns: [
          {
            from: "public/cxt/manifest.json",
            transform: (content) => {
              const manifest = JSON.parse(content);

              manifest.version = PACKAGE_JSON.version;
              manifest.description = PACKAGE_JSON.description;

              return JSON.stringify(manifest, null, 2);
            }
          },
          env === "production" ? undefined : { from: "public/cxt/preview", to: "preview" },
          { from: "public/cxt/*", to: "[name][ext]" }

        ].filter(Boolean)
      }),
    ],
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist", "cxt"),
    clean: true
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};
