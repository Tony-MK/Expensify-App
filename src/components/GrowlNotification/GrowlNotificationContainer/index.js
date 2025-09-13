"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_reanimated_1 = require("react-native-reanimated");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function GrowlNotificationContainer({ children, translateY }) {
    const styles = (0, useThemeStyles_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const animatedStyles = (0, react_native_reanimated_1.useAnimatedStyle)(() => styles.growlNotificationTranslateY(translateY));
    return (<react_native_reanimated_1.default.View style={[styles.growlNotificationContainer, styles.growlNotificationDesktopContainer, animatedStyles, shouldUseNarrowLayout && styles.mwn]}>{children}</react_native_reanimated_1.default.View>);
}
GrowlNotificationContainer.displayName = 'GrowlNotificationContainer';
exports.default = GrowlNotificationContainer;
