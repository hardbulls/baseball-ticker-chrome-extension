'use strict';

const env = process.env.NODE_ENV;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserJSPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const path = require('path');
const webpack = require('webpack')
const PACKAGE_JSON = require("./package.json");
const CopyPlugin = require("copy-webpack-plugin");
const fs = require("node:fs");
const useContentHash = false;

let LOCAL_FIREBASE_CONFIG = "{}"

try {
    LOCAL_FIREBASE_CONFIG = fs.readFileSync('.firebase', { encoding: 'utf8'});
} catch (err) {
    console.log('No local .firebase file found.')
}

module.exports = {
    mode: env,
    entry: './src/web/index.ts',
    devtool: env === "production" ? "source-map" : "inline-source-map",
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ],
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
                type: 'asset/inline'
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                type: 'asset/inline'
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserJSPlugin({}),
            new CssMinimizerPlugin(),
        ],
    },
    resolve: {
        extensions: ['.ts'],
    },
    plugins:
        [
            new webpack.DefinePlugin({
                'PACKAGE_VERSION': JSON.stringify(PACKAGE_JSON.version),
                'FIREBASE_CONFIG': process.env.FIREBASE_CONFIG || LOCAL_FIREBASE_CONFIG,
            }),
            new MiniCssExtractPlugin({
                filename: env === 'production' ? '[name].[contenthash].css' : '[name].css'
            }),
            new HtmlWebpackPlugin({template: './public/web/index.html'}),
            new CopyPlugin({
                patterns: [
                    { from: "public/web/favicon.ico", to: "[name][ext]" }
                ]
            }),
        ],
    output: {
        filename: env === 'production' && useContentHash ? '[name].[contenthash].js' : '[name].js',
        path: path.resolve(__dirname, 'dist', 'web'),
        clean: true,
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    }
};
