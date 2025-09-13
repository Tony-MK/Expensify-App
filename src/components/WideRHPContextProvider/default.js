"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// We use Animated for all functionality related to wide RHP to make it easier
// to interact with react-navigation components (e.g., CardContainer, interpolator), which also use Animated.
// eslint-disable-next-line no-restricted-imports
const react_native_1 = require("react-native");
const defaultWideRHPContextValue = {
    wideRHPRouteKeys: [],
    expandedRHPProgress: new react_native_1.Animated.Value(0),
    secondOverlayProgress: new react_native_1.Animated.Value(0),
    shouldRenderSecondaryOverlay: false,
    showWideRHPVersion: () => { },
    cleanWideRHPRouteKey: () => { },
    markReportIDAsExpense: () => { },
    isReportIDMarkedAsExpense: () => false,
    dismissToWideReport: () => { },
};
exports.default = defaultWideRHPContextValue;
