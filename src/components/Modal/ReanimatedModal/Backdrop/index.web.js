"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const utils_1 = require("@components/Modal/ReanimatedModal/utils");
const Pressable_1 = require("@components/Pressable");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
function Backdrop({ style, customBackdrop, onBackdropPress, animationInTiming = CONST_1.default.MODAL.ANIMATION_TIMING.DEFAULT_IN, animationOutTiming = CONST_1.default.MODAL.ANIMATION_TIMING.DEFAULT_OUT, isBackdropVisible, backdropOpacity = variables_1.default.overlayOpacity, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const Entering = (0, react_1.useMemo)(() => {
        if (!backdropOpacity) {
            return;
        }
        const FadeIn = new react_native_reanimated_1.Keyframe((0, utils_1.getModalInAnimation)('fadeIn'));
        return FadeIn.duration(animationInTiming).reduceMotion(react_native_reanimated_1.ReduceMotion.Never);
    }, [animationInTiming, backdropOpacity]);
    const Exiting = (0, react_1.useMemo)(() => {
        if (!backdropOpacity) {
            return;
        }
        const FadeOut = new react_native_reanimated_1.Keyframe((0, utils_1.getModalOutAnimation)('fadeOut'));
        return FadeOut.duration(animationOutTiming).reduceMotion(react_native_reanimated_1.ReduceMotion.Never);
    }, [animationOutTiming, backdropOpacity]);
    const backdropStyle = (0, react_1.useMemo)(() => ({
        opacity: backdropOpacity,
    }), [backdropOpacity]);
    if (!customBackdrop) {
        return (<Pressable_1.PressableWithoutFeedback accessible accessibilityLabel={translate('modal.backdropLabel')} onPress={onBackdropPress} style={[styles.userSelectNone, styles.cursorAuto]} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true }}>
                {isBackdropVisible && (<react_native_reanimated_1.default.View style={[styles.modalBackdrop, backdropStyle, style]} entering={Entering} exiting={Exiting}/>)}
            </Pressable_1.PressableWithoutFeedback>);
    }
    return (isBackdropVisible && (<react_native_1.View style={[styles.userSelectNone]} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true }}>
                <react_native_reanimated_1.default.View entering={Entering} exiting={Exiting} style={[styles.modalBackdrop, backdropStyle, style]}>
                    {!!customBackdrop && customBackdrop}
                </react_native_reanimated_1.default.View>
            </react_native_1.View>));
}
Backdrop.displayName = 'Backdrop';
exports.default = Backdrop;
