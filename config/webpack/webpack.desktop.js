"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const webpack_1 = require("webpack");
// eslint-disable-next-line @dword-design/import-alias/prefer-alias, import/no-relative-packages -- alias imports don't work for webpack
const package_json_1 = require("../../desktop/package.json");
const webpack_common_1 = require("./webpack.common");
/**
 * Desktop creates 2 configurations in parallel
 * 1. electron-main - the core that serves the app content
 * 2. web - the app content that would be rendered in electron
 * Everything is placed in desktop/dist and ready for packaging
 */
const getConfiguration = (environment) => {
    const rendererConfig = (0, webpack_common_1.default)({ ...environment, platform: 'desktop' });
    const outputPath = path_1.default.resolve(__dirname, '../../desktop/dist');
    rendererConfig.name = 'renderer';
    (rendererConfig.output ?? (rendererConfig.output = {})).path = path_1.default.join(outputPath, 'www');
    // Expose react-native-config to desktop-main
    const definePlugin = rendererConfig.plugins?.find((plugin) => plugin?.constructor === webpack_1.default.DefinePlugin);
    const mainProcessConfig = {
        mode: 'production',
        name: 'desktop-main',
        target: 'electron-main',
        entry: {
            main: './desktop/main.ts',
            contextBridge: './desktop/contextBridge.ts',
        },
        output: {
            filename: '[name].js',
            path: outputPath,
            libraryTarget: 'commonjs2',
        },
        resolve: rendererConfig.resolve,
        plugins: [definePlugin],
        externals: [...Object.keys(package_json_1.dependencies), 'fsevents'],
        node: {
            /**
             * Disables webpack processing of __dirname and __filename, so it works like in node
             * https://github.com/webpack/webpack/issues/2010
             */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            __dirname: false,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            __filename: false,
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                },
            ],
        },
    };
    return [mainProcessConfig, rendererConfig];
};
exports.default = getConfiguration;
