"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// We use Animated for all functionality related to wide RHP to make it easier
// to interact with react-navigation components (e.g., CardContainer, interpolator), which also use Animated.
// eslint-disable-next-line no-restricted-imports
var react_native_1 = require("react-native");
var defaultWideRHPContextValue = {
    wideRHPRouteKeys: [],
    expandedRHPProgress: new react_native_1.Animated.Value(0),
    secondOverlayProgress: new react_native_1.Animated.Value(0),
    shouldRenderSecondaryOverlay: false,
    showWideRHPVersion: function () { },
    cleanWideRHPRouteKey: function () { },
    markReportIDAsExpense: function () { },
    isReportIDMarkedAsExpense: function () { return false; },
    dismissToWideReport: function () { },
};
exports.default = defaultWideRHPContextValue;
