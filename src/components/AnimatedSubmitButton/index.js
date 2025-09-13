"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_reanimated_1 = require("react-native-reanimated");
const Button_1 = require("@components/Button");
const Expensicons = require("@components/Icon/Expensicons");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
function AnimatedSubmitButton({ success, text, onPress, isSubmittingAnimationRunning, onAnimationFinish }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const isAnimationRunning = isSubmittingAnimationRunning;
    const buttonDuration = isSubmittingAnimationRunning ? CONST_1.default.ANIMATION_SUBMIT_DURATION : CONST_1.default.ANIMATION_SUBMITTED_DURATION;
    const gap = styles.expenseAndReportPreviewTextButtonContainer.gap;
    const buttonMarginTop = (0, react_native_reanimated_1.useSharedValue)(gap);
    const height = (0, react_native_reanimated_1.useSharedValue)(variables_1.default.componentSizeNormal);
    const [canShow, setCanShow] = (0, react_1.useState)(true);
    const [minWidth, setMinWidth] = (0, react_1.useState)(0);
    const [isShowingLoading, setIsShowingLoading] = (0, react_1.useState)(false);
    const viewRef = (0, react_1.useRef)(null);
    const containerStyles = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        height: height.get(),
        justifyContent: 'center',
    }));
    const stretchOutY = (0, react_1.useCallback)(() => {
        'worklet';
        if (canShow) {
            (0, react_native_reanimated_1.runOnJS)(onAnimationFinish)();
            return;
        }
        height.set((0, react_native_reanimated_1.withTiming)(0, { duration: buttonDuration }, () => (0, react_native_reanimated_1.runOnJS)(onAnimationFinish)()));
    }, [buttonDuration, height, onAnimationFinish, canShow]);
    const buttonAnimation = (0, react_1.useMemo)(() => new react_native_reanimated_1.Keyframe({
        from: {
            opacity: 1,
            transform: [{ scale: 1 }],
        },
        to: {
            opacity: 0,
            transform: [{ scale: 0 }],
        },
    })
        .duration(buttonDuration)
        .withCallback(stretchOutY), [buttonDuration, stretchOutY]);
    const icon = isAnimationRunning ? Expensicons.Send : null;
    (0, react_1.useEffect)(() => {
        if (!isAnimationRunning) {
            setMinWidth(0);
            setCanShow(true);
            setIsShowingLoading(false);
            height.set(variables_1.default.componentSizeNormal);
            buttonMarginTop.set(0);
            return;
        }
        setMinWidth(viewRef.current?.getBoundingClientRect?.().width ?? 0);
        setIsShowingLoading(true);
        const timer = setTimeout(() => {
            setIsShowingLoading(false);
        }, CONST_1.default.ANIMATION_SUBMIT_LOADING_STATE_DURATION);
        return () => clearTimeout(timer);
    }, [buttonMarginTop, gap, height, isAnimationRunning]);
    (0, react_1.useEffect)(() => {
        if (!isAnimationRunning || isShowingLoading) {
            return;
        }
        const timer = setTimeout(() => setCanShow(false), CONST_1.default.ANIMATION_SUBMIT_SUBMITTED_STATE_VISIBLE_DURATION);
        return () => clearTimeout(timer);
    }, [isAnimationRunning, isShowingLoading]);
    // eslint-disable-next-line react-compiler/react-compiler
    const showLoading = isShowingLoading || (!viewRef.current && isAnimationRunning);
    return (<react_native_reanimated_1.default.View style={[containerStyles, { minWidth }]}>
            {isAnimationRunning && canShow && (<react_native_reanimated_1.default.View ref={(el) => {
                viewRef.current = el;
            }} exiting={buttonAnimation}>
                    <Button_1.default success={success} text={showLoading ? text : translate('common.submitted')} isLoading={showLoading} icon={!showLoading ? icon : undefined} isDisabled shouldStayNormalOnDisable/>
                </react_native_reanimated_1.default.View>)}
            {!isAnimationRunning && (<Button_1.default success={success} text={text} onPress={onPress} icon={icon}/>)}
        </react_native_reanimated_1.default.View>);
}
AnimatedSubmitButton.displayName = 'AnimatedSubmitButton';
exports.default = AnimatedSubmitButton;
