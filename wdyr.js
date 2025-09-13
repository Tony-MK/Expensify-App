"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_config_1 = require("react-native-config");
const useWDYR = react_native_config_1.default?.USE_WDYR === 'true';
if (useWDYR) {
    const whyDidYouRender = require('@welldone-software/why-did-you-render');
    whyDidYouRender(react_1.default, {
        // Enable tracking in all pure components by default
        trackAllPureComponents: true,
        include: [
        // Uncomment to enable tracking in all components. Must also uncomment /^Screen/ in exclude.
        // /.*/,
        // Uncomment to enable tracking by displayName, e.g.:
        // /^Avatar/,
        // /^ReportActionItem/,
        // /^ReportActionItemSingle/,
        ],
        exclude: [
        // Uncomment to enable tracking in all components
        // /^Screen/
        ],
    });
}
