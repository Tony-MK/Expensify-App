"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
// eslint-disable-next-line no-restricted-imports
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const useTheme_1 = require("@hooks/useTheme");
function TabIcon({ icon, activeOpacity = 0, inactiveOpacity = 1 }) {
    const theme = (0, useTheme_1.default)();
    return (<react_native_1.View>
            {!!icon && (<>
                    <react_native_1.Animated.View style={{ opacity: inactiveOpacity }}>
                        <Icon_1.default src={icon} fill={theme.icon} small/>
                    </react_native_1.Animated.View>
                    <react_native_1.Animated.View style={[react_native_1.StyleSheet.absoluteFill, { opacity: activeOpacity }]}>
                        <Icon_1.default src={icon} fill={theme.iconMenu} small/>
                    </react_native_1.Animated.View>
                </>)}
        </react_native_1.View>);
}
TabIcon.displayName = 'TabIcon';
exports.default = TabIcon;
