"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_reanimated_1 = require("react-native-reanimated");
var utils_1 = require("@components/Modal/ReanimatedModal/utils");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var CONST_1 = require("@src/CONST");
function Container(_a) {
    var style = _a.style, animationIn = _a.animationIn, animationOut = _a.animationOut, _b = _a.animationInTiming, animationInTiming = _b === void 0 ? CONST_1.default.MODAL.ANIMATION_TIMING.DEFAULT_IN : _b, _c = _a.animationOutTiming, animationOutTiming = _c === void 0 ? CONST_1.default.MODAL.ANIMATION_TIMING.DEFAULT_OUT : _c, onOpenCallBack = _a.onOpenCallBack, onCloseCallBack = _a.onCloseCallBack, type = _a.type, props = __rest(_a, ["style", "animationIn", "animationOut", "animationInTiming", "animationOutTiming", "onOpenCallBack", "onCloseCallBack", "type"]);
    var styles = (0, useThemeStyles_1.default)();
    var onCloseCallbackRef = (0, react_1.useRef)(onCloseCallBack);
    var initProgress = (0, react_native_reanimated_1.useSharedValue)(0);
    var isInitiated = (0, react_native_reanimated_1.useSharedValue)(false);
    (0, react_1.useEffect)(function () {
        onCloseCallbackRef.current = onCloseCallBack;
    }, [onCloseCallBack]);
    (0, react_1.useEffect)(function () {
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
    var animatedStyles = (0, react_native_reanimated_1.useAnimatedStyle)(function () { return (0, utils_1.getModalInAnimationStyle)(animationIn)(initProgress.get()); }, [initProgress]);
    var Exiting = (0, react_1.useMemo)(function () {
        return new react_native_reanimated_1.Keyframe((0, utils_1.getModalOutAnimation)(animationOut))
            .duration(animationOutTiming)
            // eslint-disable-next-line react-compiler/react-compiler
            .withCallback(function () { return onCloseCallbackRef.current(); })
            // on web the callbacks are not called when animations are disabled with the reduced motion setting on
            // we enable the animations to make sure they are called
            .reduceMotion(react_native_reanimated_1.ReduceMotion.Never);
    }, [animationOutTiming, animationOut]);
    return (<react_native_reanimated_1.default.View style={[style, type !== CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED && type !== CONST_1.default.MODAL.MODAL_TYPE.POPOVER && styles.modalAnimatedContainer, animatedStyles, { zIndex: 1 }]} exiting={Exiting} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}>
            {props.children}
        </react_native_reanimated_1.default.View>);
}
Container.displayName = 'ModalContainer';
exports.default = Container;
