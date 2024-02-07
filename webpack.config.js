"use strict";

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const env = process.env.NODE_ENV;
const useContentHash = false;


module.exports = {
  mode: env,
  entry: {
    content: "./src/content.ts",
    options: "./src/options.ts",
    teams: "./src/teams.ts",
    control: "./src/control.ts",
    popup: "./src/popup.ts",
    overlay: "./src/overlay.tsx",
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
        type: "asset/inline"
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        type: "asset/inline"
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserJSPlugin({}),
      new CssMinimizerPlugin()
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  plugins:
    [
      new MiniCssExtractPlugin({
        filename: env === "production" && useContentHash ? "[name].[contenthash].css" : "[name].css"
      }),
      new CopyPlugin({
        patterns: [
          {
            from: "public/manifest.json",
            transform: (content) => {
              const manifest = JSON.parse(content);

              manifest.version = process.env.npm_package_version

              return JSON.stringify(manifest, null, 2);
            }
          },
          env === "production" ? undefined : { from: "public/preview", to: "preview" },
          { from: "public/options.html", to: "options.html" },
          { from: "public/teams.html", to: "teams.html" },
          { from: "public/popup.html", to: "popup.html" },
          { from: "public/overlay.html", to: "overlay.html" },
          { from: "public/control.html", to: "control.html" }

        ].filter(Boolean)
      })
    ],
  output: {
    filename: env === "production" && useContentHash ? "[name].[contenthash].js" : "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};
