"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_reanimated_1 = require("react-native-reanimated");
const utils_1 = require("@components/Modal/ReanimatedModal/utils");
const Pressable_1 = require("@components/Pressable");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function Backdrop({ style, customBackdrop, onBackdropPress, animationInTiming = CONST_1.default.MODAL.ANIMATION_TIMING.DEFAULT_IN, animationOutTiming = CONST_1.default.MODAL.ANIMATION_TIMING.DEFAULT_OUT, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const Entering = (0, react_1.useMemo)(() => {
        const FadeIn = new react_native_reanimated_1.Keyframe((0, utils_1.getModalInAnimation)('fadeIn'));
        return FadeIn.duration(animationInTiming);
    }, [animationInTiming]);
    const Exiting = (0, react_1.useMemo)(() => {
        const FadeOut = new react_native_reanimated_1.Keyframe((0, utils_1.getModalOutAnimation)('fadeOut'));
        return FadeOut.duration(animationOutTiming);
    }, [animationOutTiming]);
    const BackdropOverlay = (0, react_1.useMemo)(() => (<react_native_reanimated_1.default.View entering={Entering} exiting={Exiting} style={[styles.modalBackdrop, style]}>
                {!!customBackdrop && customBackdrop}
            </react_native_reanimated_1.default.View>), [Entering, Exiting, customBackdrop, style, styles.modalBackdrop]);
    if (!customBackdrop) {
        return (<Pressable_1.PressableWithoutFeedback accessible accessibilityLabel={translate('modal.backdropLabel')} onPressIn={onBackdropPress}>
                {BackdropOverlay}
            </Pressable_1.PressableWithoutFeedback>);
    }
    return BackdropOverlay;
}
Backdrop.displayName = 'Backdrop';
exports.default = Backdrop;
