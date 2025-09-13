"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const utils_1 = require("@components/Modal/ReanimatedModal/utils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const GestureHandler_1 = require("./GestureHandler");
function Container({ style, animationInTiming = CONST_1.default.MODAL.ANIMATION_TIMING.DEFAULT_IN, animationOutTiming = CONST_1.default.MODAL.ANIMATION_TIMING.DEFAULT_OUT, onCloseCallBack, onOpenCallBack, animationIn, animationOut, type, onSwipeComplete, swipeDirection, swipeThreshold = 100, ...props }) {
    const styles = (0, useThemeStyles_1.default)();
    const Entering = (0, react_1.useMemo)(() => {
        const AnimationIn = new react_native_reanimated_1.Keyframe((0, utils_1.getModalInAnimation)(animationIn));
        return AnimationIn.duration(animationInTiming).withCallback(() => {
            'worklet';
            (0, react_native_reanimated_1.runOnJS)(onOpenCallBack)();
        });
    }, [animationIn, animationInTiming, onOpenCallBack]);
    const Exiting = (0, react_1.useMemo)(() => {
        const AnimationOut = new react_native_reanimated_1.Keyframe((0, utils_1.getModalOutAnimation)(animationOut));
        return AnimationOut.duration(animationOutTiming).withCallback(() => {
            'worklet';
            (0, react_native_reanimated_1.runOnJS)(onCloseCallBack)();
        });
    }, [animationOutTiming, onCloseCallBack, animationOut]);
    return (<react_native_1.View style={style} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}>
            <GestureHandler_1.default swipeThreshold={swipeThreshold} swipeDirection={swipeDirection} onSwipeComplete={onSwipeComplete}>
                <react_native_reanimated_1.default.View style={[styles.modalAnimatedContainer, type !== CONST_1.default.MODAL.MODAL_TYPE.BOTTOM_DOCKED && styles.flex1]} entering={Entering} exiting={Exiting}>
                    {props.children}
                </react_native_reanimated_1.default.View>
            </GestureHandler_1.default>
        </react_native_1.View>);
}
Container.displayName = 'ModalContainer';
exports.default = Container;
