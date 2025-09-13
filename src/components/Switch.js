"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_reanimated_1 = require("react-native-reanimated");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const PressableWithFeedback_1 = require("./Pressable/PressableWithFeedback");
const OFFSET_X = {
    OFF: 0,
    ON: 20,
};
function Switch({ isOn, onToggle, accessibilityLabel, disabled, showLockIcon, disabledAction }) {
    const styles = (0, useThemeStyles_1.default)();
    const offsetX = (0, react_native_reanimated_1.useSharedValue)(isOn ? OFFSET_X.ON : OFFSET_X.OFF);
    const theme = (0, useTheme_1.default)();
    (0, react_1.useEffect)(() => {
        offsetX.set((0, react_native_reanimated_1.withTiming)(isOn ? OFFSET_X.ON : OFFSET_X.OFF, { duration: 300 }));
    }, [isOn, offsetX]);
    const handleSwitchPress = () => {
        requestAnimationFrame(() => {
            if (disabled) {
                disabledAction?.();
                return;
            }
            onToggle(!isOn);
        });
    };
    const animatedThumbStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        transform: [{ translateX: offsetX.get() }],
    }));
    const animatedSwitchTrackStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        backgroundColor: (0, react_native_reanimated_1.interpolateColor)(offsetX.get(), [OFFSET_X.OFF, OFFSET_X.ON], [theme.icon, theme.success]),
    }));
    return (<PressableWithFeedback_1.default disabled={!disabledAction && disabled} onPress={handleSwitchPress} onLongPress={handleSwitchPress} role={CONST_1.default.ROLE.SWITCH} aria-checked={isOn} accessibilityLabel={accessibilityLabel} 
    // disable hover dim for switch
    hoverDimmingValue={1} pressDimmingValue={0.8}>
            <react_native_reanimated_1.default.View style={[styles.switchTrack, animatedSwitchTrackStyle]}>
                <react_native_reanimated_1.default.View style={[styles.switchThumb, animatedThumbStyle]}>
                    {(!!disabled || !!showLockIcon) && (<Icon_1.default src={Expensicons.Lock} fill={isOn ? theme.text : theme.icon} width={styles.toggleSwitchLockIcon.width} height={styles.toggleSwitchLockIcon.height}/>)}
                </react_native_reanimated_1.default.View>
            </react_native_reanimated_1.default.View>
        </PressableWithFeedback_1.default>);
}
Switch.displayName = 'Switch';
exports.default = Switch;
