"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useAnimatedHighlightStyle;
const react_1 = require("react");
const react_native_reanimated_1 = require("react-native-reanimated");
const useScreenWrapperTransitionStatus_1 = require("@hooks/useScreenWrapperTransitionStatus");
const useTheme_1 = require("@hooks/useTheme");
const CONST_1 = require("@src/CONST");
/**
 * Returns a highlight style that interpolates the color, height and opacity giving a fading effect.
 */
function useAnimatedHighlightStyle({ borderRadius, shouldHighlight, itemEnterDelay = CONST_1.default.ANIMATED_HIGHLIGHT_ENTRY_DELAY, itemEnterDuration = CONST_1.default.ANIMATED_HIGHLIGHT_ENTRY_DURATION, highlightStartDelay = CONST_1.default.ANIMATED_HIGHLIGHT_START_DELAY, highlightStartDuration = CONST_1.default.ANIMATED_HIGHLIGHT_START_DURATION, highlightEndDelay = CONST_1.default.ANIMATED_HIGHLIGHT_END_DELAY, highlightEndDuration = CONST_1.default.ANIMATED_HIGHLIGHT_END_DURATION, height, highlightColor, backgroundColor, }) {
    const [startHighlight, setStartHighlight] = (0, react_1.useState)(false);
    const repeatableProgress = (0, react_native_reanimated_1.useSharedValue)(0);
    const nonRepeatableProgress = (0, react_native_reanimated_1.useSharedValue)(shouldHighlight ? 0 : 1);
    const { didScreenTransitionEnd } = (0, useScreenWrapperTransitionStatus_1.default)();
    const theme = (0, useTheme_1.default)();
    const highlightBackgroundStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        'worklet';
        const repeatableValue = repeatableProgress.get();
        const nonRepeatableValue = nonRepeatableProgress.get();
        return {
            backgroundColor: (0, react_native_reanimated_1.interpolateColor)(repeatableValue, [0, 1], [backgroundColor ?? theme.appBG, highlightColor ?? theme.border]),
            height: height ? (0, react_native_reanimated_1.interpolate)(nonRepeatableValue, [0, 1], [0, height]) : 'auto',
            opacity: (0, react_native_reanimated_1.interpolate)(nonRepeatableValue, [0, 1], [0, 1]),
            borderRadius,
        };
    }, [borderRadius, height, backgroundColor, highlightColor, theme.appBG, theme.border]);
    react_1.default.useEffect(() => {
        if (!shouldHighlight || startHighlight) {
            return;
        }
        setStartHighlight(true);
        // We only need to add shouldHighlight as a dependency and adding startHighlight as deps will cause a loop because
        // if shouldHighlight stays at true the above early return will not be executed and this useEffect will be run
        // as long as shouldHighlight is true as we set startHighlight to false in the below useEffect.
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [shouldHighlight]);
    react_1.default.useEffect(() => {
        if (!startHighlight || !didScreenTransitionEnd) {
            return;
        }
        setStartHighlight(false);
        (0, react_native_reanimated_1.runOnJS)(() => {
            nonRepeatableProgress.set((0, react_native_reanimated_1.withDelay)(itemEnterDelay, (0, react_native_reanimated_1.withTiming)(1, { duration: itemEnterDuration, easing: react_native_reanimated_1.Easing.inOut(react_native_reanimated_1.Easing.ease) }, (finished) => {
                if (!finished) {
                    return;
                }
                repeatableProgress.set((0, react_native_reanimated_1.withSequence)((0, react_native_reanimated_1.withDelay)(highlightStartDelay, (0, react_native_reanimated_1.withTiming)(1, { duration: highlightStartDuration, easing: react_native_reanimated_1.Easing.inOut(react_native_reanimated_1.Easing.ease) })), (0, react_native_reanimated_1.withDelay)(highlightEndDelay, (0, react_native_reanimated_1.withTiming)(0, { duration: highlightEndDuration, easing: react_native_reanimated_1.Easing.inOut(react_native_reanimated_1.Easing.ease) }))));
            })));
        })();
    }, [
        didScreenTransitionEnd,
        startHighlight,
        itemEnterDelay,
        itemEnterDuration,
        highlightStartDelay,
        highlightStartDuration,
        highlightEndDelay,
        highlightEndDuration,
        repeatableProgress,
        nonRepeatableProgress,
    ]);
    return highlightBackgroundStyle;
}
