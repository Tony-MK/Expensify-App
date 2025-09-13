"use strict";
/* eslint-disable no-underscore-dangle */
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const path_1 = require("path");
const webpack_1 = require("webpack");
const webpackMockPaths_1 = require("./webpackMockPaths");
let envFile;
switch (process.env.ENV) {
    case 'production':
        envFile = '.env.production';
        break;
    case 'staging':
        envFile = '.env.staging';
        break;
    default:
        envFile = '.env';
}
const env = dotenv_1.default.config({ path: path_1.default.resolve(__dirname, `../${envFile}`) });
const customFunction = require('../config/webpack/webpack.common').default;
const custom = customFunction({ file: envFile });
const webpackConfig = ({ config }) => {
    if (!config.resolve) {
        config.resolve = {};
    }
    if (!config.plugins) {
        config.plugins = [];
    }
    if (!config.module) {
        config.module = {};
    }
    config.resolve.alias = {
        ...webpackMockPaths_1.default,
        ...custom.resolve.alias,
    };
    // We can ignore the "module not installed" warning from lottie-react-native
    // because we are not using the library for JSON format of Lottie animations.
    config.ignoreWarnings = [{ module: new RegExp('node_modules/lottie-react-native/lib/module/LottieView/index.web.js') }];
    // Necessary to overwrite the values in the existing DefinePlugin hardcoded to the Config staging values
    const definePluginIndex = config.plugins.findIndex((plugin) => plugin instanceof webpack_1.DefinePlugin);
    if (definePluginIndex !== -1 && config.plugins.at(definePluginIndex) instanceof webpack_1.DefinePlugin) {
        const definePlugin = config.plugins.at(definePluginIndex);
        if (definePlugin.definitions) {
            definePlugin.definitions.__REACT_WEB_CONFIG__ = JSON.stringify(env);
        }
    }
    config.resolve.extensions = custom.resolve.extensions;
    const babelRulesIndex = custom.module.rules.findIndex((rule) => rule.loader === 'babel-loader');
    const babelRule = custom.module.rules.at(babelRulesIndex);
    if (babelRulesIndex !== -1 && babelRule) {
        config.module.rules?.push(babelRule);
    }
    const fileLoaderRule = config.module.rules?.find((rule) => typeof rule !== 'boolean' && typeof rule !== 'string' && typeof rule !== 'number' && !!rule?.test && rule.test instanceof RegExp && rule.test.test('.svg'));
    if (fileLoaderRule) {
        fileLoaderRule.exclude = /\.svg$/;
    }
    config.module.rules?.push({
        test: /\.svg$/,
        enforce: 'pre',
        loader: require.resolve('@svgr/webpack'),
    });
    config.module.rules?.push({
        test: /pdf\.worker\.min\.mjs$/,
        type: 'asset/source',
    });
    config.plugins.push(new webpack_1.DefinePlugin({
        __DEV__: process.env.NODE_ENV === 'development',
    }));
    config.module.rules?.push({
        test: /\.lottie$/,
        type: 'asset/resource',
    });
    return config;
};
exports.default = webpackConfig;
