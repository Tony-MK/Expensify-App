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
const _1 = require(".");
function AnimatedSettlementButton({ isPaidAnimationRunning, isApprovedAnimationRunning, onAnimationFinish, shouldAddTopMargin = false, isDisabled, canIOUBePaid, wrapperStyle, ...settlementButtonProps }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const isAnimationRunning = isPaidAnimationRunning || isApprovedAnimationRunning;
    const buttonDuration = isPaidAnimationRunning ? CONST_1.default.ANIMATION_PAID_DURATION : CONST_1.default.ANIMATION_THUMBS_UP_DURATION;
    const buttonDelay = CONST_1.default.ANIMATION_PAID_BUTTON_HIDE_DELAY;
    const gap = styles.expenseAndReportPreviewTextButtonContainer.gap;
    const buttonMarginTop = (0, react_native_reanimated_1.useSharedValue)(gap);
    const height = (0, react_native_reanimated_1.useSharedValue)(variables_1.default.componentSizeNormal);
    const [canShow, setCanShow] = react_1.default.useState(true);
    const [minWidth, setMinWidth] = react_1.default.useState(0);
    const viewRef = (0, react_1.useRef)(null);
    const containerStyles = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        height: height.get(),
        justifyContent: 'center',
        ...(shouldAddTopMargin && { marginTop: buttonMarginTop.get() }),
    }));
    const willShowPaymentButton = canIOUBePaid && isApprovedAnimationRunning;
    const stretchOutY = (0, react_1.useCallback)(() => {
        'worklet';
        if (shouldAddTopMargin) {
            buttonMarginTop.set((0, react_native_reanimated_1.withTiming)(willShowPaymentButton ? gap : 0, { duration: buttonDuration }));
        }
        if (willShowPaymentButton) {
            (0, react_native_reanimated_1.runOnJS)(onAnimationFinish)();
            return;
        }
        height.set((0, react_native_reanimated_1.withTiming)(0, { duration: buttonDuration }, () => (0, react_native_reanimated_1.runOnJS)(onAnimationFinish)()));
    }, [buttonDuration, buttonMarginTop, gap, height, onAnimationFinish, shouldAddTopMargin, willShowPaymentButton]);
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
        .delay(buttonDelay)
        .duration(buttonDuration)
        .withCallback(stretchOutY), [buttonDelay, buttonDuration, stretchOutY]);
    let icon;
    if (isApprovedAnimationRunning) {
        icon = Expensicons.ThumbsUp;
    }
    else if (isPaidAnimationRunning) {
        icon = Expensicons.Checkmark;
    }
    (0, react_1.useEffect)(() => {
        if (!isAnimationRunning) {
            setMinWidth(0);
            setCanShow(true);
            height.set(variables_1.default.componentSizeNormal);
            buttonMarginTop.set(shouldAddTopMargin ? gap : 0);
            return;
        }
        setMinWidth(viewRef.current?.getBoundingClientRect?.().width ?? 0);
        const timer = setTimeout(() => setCanShow(false), CONST_1.default.ANIMATION_PAID_BUTTON_HIDE_DELAY);
        return () => clearTimeout(timer);
    }, [buttonMarginTop, gap, height, isAnimationRunning, shouldAddTopMargin]);
    return (<react_native_reanimated_1.default.View style={[containerStyles, wrapperStyle, { minWidth }]}>
            {isAnimationRunning && canShow && (<react_native_reanimated_1.default.View ref={(el) => {
                viewRef.current = el;
            }} exiting={buttonAnimation}>
                    <Button_1.default text={isApprovedAnimationRunning ? translate('iou.approved') : translate('iou.paymentComplete')} success icon={icon}/>
                </react_native_reanimated_1.default.View>)}
            {!isAnimationRunning && (<_1.default 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...settlementButtonProps} wrapperStyle={wrapperStyle} isDisabled={isAnimationRunning || isDisabled}/>)}
        </react_native_reanimated_1.default.View>);
}
AnimatedSettlementButton.displayName = 'AnimatedSettlementButton';
exports.default = AnimatedSettlementButton;
