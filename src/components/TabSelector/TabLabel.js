"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
// eslint-disable-next-line no-restricted-imports
const react_native_1 = require("react-native");
const Text_1 = require("@components/Text");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function TabLabel({ title = '', activeOpacity = 0, inactiveOpacity = 1, hasIcon = false }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<react_native_1.View>
            <react_native_1.Animated.View style={[{ opacity: activeOpacity }]}>
                <Text_1.default style={styles.tabText(true, hasIcon)}>{title}</Text_1.default>
            </react_native_1.Animated.View>
            <react_native_1.Animated.View style={[react_native_1.StyleSheet.absoluteFill, { opacity: inactiveOpacity }]}>
                <Text_1.default style={styles.tabText(false, hasIcon)}>{title}</Text_1.default>
            </react_native_1.Animated.View>
        </react_native_1.View>);
}
TabLabel.displayName = 'TabLabel';
exports.default = TabLabel;
