"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiptPaneRHPWidth = exports.WideRHPContext = exports.secondOverlayProgress = exports.expandedRHPProgress = void 0;
exports.useShowWideRHPVersion = useShowWideRHPVersion;
const react_1 = require("react");
// We use Animated for all functionality related to wide RHP to make it easier
// to interact with react-navigation components (e.g., CardContainer, interpolator), which also use Animated.
// eslint-disable-next-line no-restricted-imports
const react_native_1 = require("react-native");
const default_1 = require("./default");
const expandedRHPProgress = new react_native_1.Animated.Value(0);
exports.expandedRHPProgress = expandedRHPProgress;
const secondOverlayProgress = new react_native_1.Animated.Value(0);
exports.secondOverlayProgress = secondOverlayProgress;
const receiptPaneRHPWidth = new react_native_1.Animated.Value(0);
exports.receiptPaneRHPWidth = receiptPaneRHPWidth;
const WideRHPContext = (0, react_1.createContext)(default_1.default);
exports.WideRHPContext = WideRHPContext;
function WideRHPContextProvider({ children }) {
    return <WideRHPContext.Provider value={default_1.default}>{children}</WideRHPContext.Provider>;
}
// Wide RHP is not displayed on native platforms
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function useShowWideRHPVersion(condition) { }
WideRHPContextProvider.displayName = 'WideRHPContextProvider';
exports.default = WideRHPContextProvider;
