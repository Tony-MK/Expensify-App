"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_reanimated_1 = require("react-native-reanimated");
const utils_1 = require("@components/Modal/ReanimatedModal/utils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function Container({ style, animationIn, animationOut, animationInTiming = CONST_1.default.MODAL.ANIMATION_TIMING.DEFAULT_IN, animationOutTiming = CONST_1.default.MODAL.ANIMATION_TIMING.DEFAULT_OUT, onOpenCallBack, onCloseCallBack, type, ...props }) {
    const styles = (0, useThemeStyles_1.default)();
    const onCloseCallbackRef = (0, react_1.useRef)(onCloseCallBack);
    const initProgress = (0, react_native_reanimated_1.useSharedValue)(0);
    const isInitiated = (0, react_native_reanimated_1.useSharedValue)(false);
    (0, react_1.useEffect)(() => {
        onCloseCallbackRef.current = onCloseCallBack;
    }, [onCloseCallBack]);
    (0, react_1.useEffect)(() => {
        if (isInitiated.get()) {
            return;
        }
        isInitiated.set(true);
        initProgress.set((0, react_native_reanimated_1.withTiming)(1, {
            duration: animationInTiming,
            easing: utils_1.easing,
            // on web the callbacks are not called when animations are disabled with the reduced motion setting on
            // we enable the animations to make sure they are called
            reduceMotion: react_native_reanimated_1.ReduceMotion.Never,
        }, onOpenCallBack));
    }, [animationInTiming, onOpenCallBack, initProgress, isInitiated]);
    // instead of an entering transition since keyframe animations break keyboard on mWeb Chrome (#62799)
    const animatedStyles = (0, react_native_reanimated_1.useAnimatedStyle)(() => (0, utils_1.getModalInAnimationStyle)(animationIn)(initProgress.get()), [initProgress]);
    const Exiting = (0, react_1.useMemo)(() => new react_native_reanimated_1.Keyframe((0, utils_1.getModalOutAnimation)(animationOut))
        .duration(animationOutTiming)
        // eslint-disable-next-line react-compiler/react-compiler
        .withCallback(() => onCloseCallbackRef.current())
        // on web the callbacks are not called when animations are disabled with the reduced motion setting on
        // we enable the animations to make sure they are called
        .reduceMotion(react_native_reanimated_1.ReduceMotion.Never), [animationOutTiming, animationOut]);
    return (<react_native_reanimated_1.default.View style={[style, type !== CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED && type !== CONST_1.default.MODAL.MODAL_TYPE.POPOVER && styles.modalAnimatedContainer, animatedStyles, { zIndex: 1 }]} exiting={Exiting} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}>
            {props.children}
        </react_native_reanimated_1.default.View>);
}
Container.displayName = 'ModalContainer';
exports.default = Container;
