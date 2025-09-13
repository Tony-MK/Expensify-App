"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const react_refresh_webpack_plugin_1 = require("@pmmmwh/react-refresh-webpack-plugin");
const path_1 = require("path");
const portfinder_1 = require("portfinder");
const time_analytics_webpack_plugin_1 = require("time-analytics-webpack-plugin");
const webpack_1 = require("webpack");
const webpack_merge_1 = require("webpack-merge");
const ForceGarbageCollectionPlugin_1 = require("./ForceGarbageCollectionPlugin");
const webpack_common_1 = require("./webpack.common");
const BASE_PORT = 8082;
/**
 * Configuration for the local dev server
 */
const getConfiguration = (environment) => portfinder_1.default.getPortPromise({ port: BASE_PORT }).then((port) => {
    // Check if the USE_WEB_PROXY variable has been provided
    // and rewrite any requests to the local proxy server
    const proxySettings = process.env.USE_WEB_PROXY === 'false'
        ? {}
        : {
            proxy: [
                {
                    context: ['/api', '/staging', '/chat-attachments', '/receipts'],
                    target: 'http://[::1]:9000',
                },
            ],
        };
    const baseConfig = (0, webpack_common_1.default)(environment);
    const config = (0, webpack_merge_1.merge)(baseConfig, {
        mode: 'development',
        devtool: 'eval-source-map',
        devServer: {
            static: {
                directory: path_1.default.join(__dirname, '../../dist'),
            },
            client: {
                overlay: false,
            },
            hot: true,
            ...proxySettings,
            historyApiFallback: true,
            port,
            host: 'dev.new.expensify.com',
            server: {
                type: 'https',
                options: {
                    key: path_1.default.join(__dirname, 'key.pem'),
                    cert: path_1.default.join(__dirname, 'certificate.pem'),
                },
            },
            headers: {
                'Document-Policy': 'js-profiling',
            },
        },
        plugins: [
            new webpack_1.DefinePlugin({
                'process.env.PORT': port,
                'process.env.NODE_ENV': JSON.stringify('development'),
            }),
            new react_refresh_webpack_plugin_1.default({ overlay: { sockProtocol: 'wss' } }),
            new ForceGarbageCollectionPlugin_1.default(),
        ],
        // This prevents import error coming from react-native-tab-view/lib/module/TabView.js
        // where Pager is imported without extension due to having platform-specific implementations
        module: {
            rules: [
                {
                    test: /\.js$/,
                    resolve: {
                        fullySpecified: false,
                    },
                    include: [path_1.default.resolve(__dirname, '../../node_modules/react-native-tab-view/lib/module/TabView.js')],
                },
            ],
        },
        cache: {
            type: 'filesystem',
            name: environment.platform ?? 'default',
            buildDependencies: {
                // By default, webpack and loaders are build dependencies
                // This (also) makes all dependencies of this config file - build dependencies
                config: [__filename],
            },
        },
        snapshot: {
            // A list of paths webpack trusts would not be modified while webpack is running
            managedPaths: [
                // Onyx and react-native-live-markdown can be modified on the fly, changes to other node_modules would not be reflected live
                /([\\/]node_modules[\\/](?!react-native-onyx|@expensify\/react-native-live-markdown))/,
            ],
        },
    });
    return time_analytics_webpack_plugin_1.TimeAnalyticsPlugin.wrap(config, { plugin: { exclude: ['ReactRefreshPlugin'] } });
});
exports.default = getConfiguration;
