"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_reanimated_1 = require("react-native-reanimated");
const useSafeAreaInsets_1 = require("@hooks/useSafeAreaInsets");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function GrowlNotificationContainer({ children, translateY }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const insets = (0, useSafeAreaInsets_1.default)();
    const animatedStyles = (0, react_native_reanimated_1.useAnimatedStyle)(() => styles.growlNotificationTranslateY(translateY));
    return <react_native_reanimated_1.default.View style={[StyleUtils.getPlatformSafeAreaPadding(insets), styles.growlNotificationContainer, animatedStyles]}>{children}</react_native_reanimated_1.default.View>;
}
GrowlNotificationContainer.displayName = 'GrowlNotificationContainer';
exports.default = GrowlNotificationContainer;
