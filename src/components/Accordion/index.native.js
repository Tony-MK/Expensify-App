"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function Accordion({ isExpanded, children, duration = 300, isToggleTriggered, style }) {
    const height = (0, react_native_reanimated_1.useSharedValue)(0);
    const styles = (0, useThemeStyles_1.default)();
    const derivedHeight = (0, react_native_reanimated_1.useDerivedValue)(() => {
        if (!isToggleTriggered.get()) {
            return isExpanded.get() ? height.get() : 0;
        }
        return (0, react_native_reanimated_1.withTiming)(height.get() * Number(isExpanded.get()), {
            duration,
            easing: react_native_reanimated_1.Easing.inOut(react_native_reanimated_1.Easing.quad),
        });
    });
    const derivedOpacity = (0, react_native_reanimated_1.useDerivedValue)(() => {
        if (!isToggleTriggered.get()) {
            return isExpanded.get() ? 1 : 0;
        }
        return (0, react_native_reanimated_1.withTiming)(isExpanded.get() ? 1 : 0, {
            duration,
            easing: react_native_reanimated_1.Easing.inOut(react_native_reanimated_1.Easing.quad),
        });
    });
    const animatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        if (!isToggleTriggered.get() && !isExpanded.get()) {
            return {
                height: 0,
                opacity: 0,
            };
        }
        return {
            height: !isToggleTriggered.get() ? height.get() : derivedHeight.get(),
            opacity: derivedOpacity.get(),
        };
    });
    return (<react_native_reanimated_1.default.View style={[animatedStyle, style]}>
            <react_native_1.View onLayout={(e) => {
            height.set(e.nativeEvent.layout.height);
        }} style={[styles.pAbsolute, styles.l0, styles.r0, styles.t0]}>
                {children}
            </react_native_1.View>
        </react_native_reanimated_1.default.View>);
}
Accordion.displayName = 'Accordion';
exports.default = Accordion;
