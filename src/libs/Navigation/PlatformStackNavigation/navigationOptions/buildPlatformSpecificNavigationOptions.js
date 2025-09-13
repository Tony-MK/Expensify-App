"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const withAnimation_1 = require("./animation/withAnimation");
const getCommonNavigationOptions = (screenOptions) => screenOptions === undefined ? {} : (({ animation, keyboardHandlingEnabled, web, native, ...rest }) => rest)(screenOptions);
const buildPlatformSpecificNavigationOptions = (screenOptions) => ({
    keyboardHandlingEnabled: screenOptions.keyboardHandlingEnabled,
    ...(0, withAnimation_1.default)(screenOptions),
    ...getCommonNavigationOptions(screenOptions),
});
exports.default = buildPlatformSpecificNavigationOptions;
