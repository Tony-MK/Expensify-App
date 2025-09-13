"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_reanimated_1 = require("react-native-reanimated");
var Button_1 = require("@components/Button");
var Expensicons = require("@components/Icon/Expensicons");
var useLocalize_1 = require("@hooks/useLocalize");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var variables_1 = require("@styles/variables");
var CONST_1 = require("@src/CONST");
function AnimatedSubmitButton(_a) {
    var success = _a.success, text = _a.text, onPress = _a.onPress, isSubmittingAnimationRunning = _a.isSubmittingAnimationRunning, onAnimationFinish = _a.onAnimationFinish;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var isAnimationRunning = isSubmittingAnimationRunning;
    var buttonDuration = isSubmittingAnimationRunning ? CONST_1.default.ANIMATION_SUBMIT_DURATION : CONST_1.default.ANIMATION_SUBMITTED_DURATION;
    var gap = styles.expenseAndReportPreviewTextButtonContainer.gap;
    var buttonMarginTop = (0, react_native_reanimated_1.useSharedValue)(gap);
    var height = (0, react_native_reanimated_1.useSharedValue)(variables_1.default.componentSizeNormal);
    var _b = (0, react_1.useState)(true), canShow = _b[0], setCanShow = _b[1];
    var _c = (0, react_1.useState)(0), minWidth = _c[0], setMinWidth = _c[1];
    var _d = (0, react_1.useState)(false), isShowingLoading = _d[0], setIsShowingLoading = _d[1];
    var viewRef = (0, react_1.useRef)(null);
    var containerStyles = (0, react_native_reanimated_1.useAnimatedStyle)(function () { return ({
        height: height.get(),
        justifyContent: 'center',
    }); });
    var stretchOutY = (0, react_1.useCallback)(function () {
        'worklet';
        if (canShow) {
            (0, react_native_reanimated_1.runOnJS)(onAnimationFinish)();
            return;
        }
        height.set((0, react_native_reanimated_1.withTiming)(0, { duration: buttonDuration }, function () { return (0, react_native_reanimated_1.runOnJS)(onAnimationFinish)(); }));
    }, [buttonDuration, height, onAnimationFinish, canShow]);
    var buttonAnimation = (0, react_1.useMemo)(function () {
        return new react_native_reanimated_1.Keyframe({
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
            .withCallback(stretchOutY);
    }, [buttonDuration, stretchOutY]);
    var icon = isAnimationRunning ? Expensicons.Send : null;
    (0, react_1.useEffect)(function () {
        var _a, _b, _c;
        if (!isAnimationRunning) {
            setMinWidth(0);
            setCanShow(true);
            setIsShowingLoading(false);
            height.set(variables_1.default.componentSizeNormal);
            buttonMarginTop.set(0);
            return;
        }
        setMinWidth((_c = (_b = (_a = viewRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect) === null || _b === void 0 ? void 0 : _b.call(_a).width) !== null && _c !== void 0 ? _c : 0);
        setIsShowingLoading(true);
        var timer = setTimeout(function () {
            setIsShowingLoading(false);
        }, CONST_1.default.ANIMATION_SUBMIT_LOADING_STATE_DURATION);
        return function () { return clearTimeout(timer); };
    }, [buttonMarginTop, gap, height, isAnimationRunning]);
    (0, react_1.useEffect)(function () {
        if (!isAnimationRunning || isShowingLoading) {
            return;
        }
        var timer = setTimeout(function () { return setCanShow(false); }, CONST_1.default.ANIMATION_SUBMIT_SUBMITTED_STATE_VISIBLE_DURATION);
        return function () { return clearTimeout(timer); };
    }, [isAnimationRunning, isShowingLoading]);
    // eslint-disable-next-line react-compiler/react-compiler
    var showLoading = isShowingLoading || (!viewRef.current && isAnimationRunning);
    return (<react_native_reanimated_1.default.View style={[containerStyles, { minWidth: minWidth }]}>
            {isAnimationRunning && canShow && (<react_native_reanimated_1.default.View ref={function (el) {
                viewRef.current = el;
            }} exiting={buttonAnimation}>
                    <Button_1.default success={success} text={showLoading ? text : translate('common.submitted')} isLoading={showLoading} icon={!showLoading ? icon : undefined} isDisabled shouldStayNormalOnDisable/>
                </react_native_reanimated_1.default.View>)}
            {!isAnimationRunning && (<Button_1.default success={success} text={text} onPress={onPress} icon={icon}/>)}
        </react_native_reanimated_1.default.View>);
}
AnimatedSubmitButton.displayName = 'AnimatedSubmitButton';
exports.default = AnimatedSubmitButton;
