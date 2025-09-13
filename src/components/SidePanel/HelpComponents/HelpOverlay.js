"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_reanimated_1 = require("react-native-reanimated");
const utils_1 = require("@components/Modal/ReanimatedModal/utils");
const Pressable_1 = require("@components/Pressable");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function HelpOverlay({ isRHPVisible, onBackdropPress }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const CustomFadeIn = (0, react_1.useMemo)(() => new react_native_reanimated_1.Keyframe((0, utils_1.getModalInAnimation)('fadeIn')).duration(CONST_1.default.MODAL.ANIMATION_TIMING.DEFAULT_IN), []);
    const CustomFadeOut = (0, react_1.useMemo)(() => new react_native_reanimated_1.Keyframe((0, utils_1.getModalOutAnimation)('fadeOut')).duration(CONST_1.default.MODAL.ANIMATION_TIMING.DEFAULT_OUT), []);
    return (<react_native_reanimated_1.default.View style={styles.sidePanelOverlay(isRHPVisible)} entering={isRHPVisible ? undefined : CustomFadeIn} exiting={isRHPVisible ? undefined : CustomFadeOut}>
            <Pressable_1.PressableWithoutFeedback accessible accessibilityLabel={translate('modal.backdropLabel')} onPress={onBackdropPress} style={styles.flex1}/>
        </react_native_reanimated_1.default.View>);
}
HelpOverlay.displayName = 'HelpOverlay';
exports.default = HelpOverlay;
