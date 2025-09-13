"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useNetwork_1 = require("@hooks/useNetwork");
const useSafeAreaPaddings_1 = require("@hooks/useSafeAreaPaddings");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
/** NavigationBar renders a semi-translucent background behind the three-button navigation bar on Android. */
function NavigationBar() {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { insets, paddingBottom } = (0, useSafeAreaPaddings_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const navigationBarType = (0, react_1.useMemo)(() => StyleUtils.getNavigationBarType(insets), [StyleUtils, insets]);
    const isSoftKeyNavigation = navigationBarType === CONST_1.default.NAVIGATION_BAR_TYPE.SOFT_KEYS;
    return isSoftKeyNavigation ? <react_native_1.View style={[isOffline ? styles.appBG : styles.translucentNavigationBarBG, styles.stickToBottom, { height: paddingBottom }]}/> : null;
}
NavigationBar.displayName = 'NavigationBar';
exports.default = NavigationBar;
