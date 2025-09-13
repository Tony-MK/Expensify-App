"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_reanimated_1 = require("react-native-reanimated");
var utils_1 = require("@components/Modal/ReanimatedModal/utils");
var Pressable_1 = require("@components/Pressable");
var useLocalize_1 = require("@hooks/useLocalize");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var CONST_1 = require("@src/CONST");
function HelpOverlay(_a) {
    var isRHPVisible = _a.isRHPVisible, onBackdropPress = _a.onBackdropPress;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var CustomFadeIn = (0, react_1.useMemo)(function () { return new react_native_reanimated_1.Keyframe((0, utils_1.getModalInAnimation)('fadeIn')).duration(CONST_1.default.MODAL.ANIMATION_TIMING.DEFAULT_IN); }, []);
    var CustomFadeOut = (0, react_1.useMemo)(function () { return new react_native_reanimated_1.Keyframe((0, utils_1.getModalOutAnimation)('fadeOut')).duration(CONST_1.default.MODAL.ANIMATION_TIMING.DEFAULT_OUT); }, []);
    return (<react_native_reanimated_1.default.View style={styles.sidePanelOverlay(isRHPVisible)} entering={isRHPVisible ? undefined : CustomFadeIn} exiting={isRHPVisible ? undefined : CustomFadeOut}>
            <Pressable_1.PressableWithoutFeedback accessible accessibilityLabel={translate('modal.backdropLabel')} onPress={onBackdropPress} style={styles.flex1}/>
        </react_native_reanimated_1.default.View>);
}
HelpOverlay.displayName = 'HelpOverlay';
exports.default = HelpOverlay;
