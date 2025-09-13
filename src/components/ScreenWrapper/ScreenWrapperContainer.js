"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_picker_select_1 = require("react-native-picker-select");
const InputBlurContext_1 = require("@components/InputBlurContext");
const KeyboardAvoidingView_1 = require("@components/KeyboardAvoidingView");
const ModalContext_1 = require("@components/Modal/ModalContext");
const useBottomSafeSafeAreaPaddingStyle_1 = require("@hooks/useBottomSafeSafeAreaPaddingStyle");
const useInitialWindowDimensions_1 = require("@hooks/useInitialWindowDimensions");
const useSafeAreaPaddings_1 = require("@hooks/useSafeAreaPaddings");
const useTackInputFocus_1 = require("@hooks/useTackInputFocus");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const Browser_1 = require("@libs/Browser");
const VisualViewport_1 = require("@libs/VisualViewport");
const TestTool_1 = require("@userActions/TestTool");
const CONST_1 = require("@src/CONST");
function ScreenWrapperContainer({ children, style, testID, bottomContent, bottomContentStyle: bottomContentStyleProp, keyboardAvoidingViewBehavior = 'padding', keyboardVerticalOffset, shouldEnableKeyboardAvoidingView = true, shouldEnableMaxHeight = false, shouldEnableMinHeight = false, shouldEnablePickerAvoiding = true, shouldDismissKeyboardBeforeClose = true, shouldAvoidScrollOnVirtualViewport = true, shouldUseCachedViewportHeight = false, shouldKeyboardOffsetBottomSafeAreaPadding: shouldKeyboardOffsetBottomSafeAreaPaddingProp, enableEdgeToEdgeBottomSafeAreaPadding, includePaddingTop = true, includeSafeAreaPaddingBottom = false, isFocused = true, ref, forwardedFSClass, }) {
    const { windowHeight } = (0, useWindowDimensions_1.default)(shouldUseCachedViewportHeight);
    const { initialHeight } = (0, useInitialWindowDimensions_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const maxHeight = shouldEnableMaxHeight ? windowHeight : undefined;
    const minHeight = shouldEnableMinHeight && !(0, Browser_1.isSafari)() ? initialHeight : undefined;
    const { isBlurred, setIsBlurred } = (0, InputBlurContext_1.useInputBlurContext)();
    const isAvoidingViewportScroll = (0, useTackInputFocus_1.default)(isFocused && shouldEnableMaxHeight && shouldAvoidScrollOnVirtualViewport && (0, Browser_1.isMobileWebKit)());
    const isUsingEdgeToEdgeMode = enableEdgeToEdgeBottomSafeAreaPadding !== undefined;
    const shouldKeyboardOffsetBottomSafeAreaPadding = shouldKeyboardOffsetBottomSafeAreaPaddingProp ?? isUsingEdgeToEdgeMode;
    const { paddingTop, paddingBottom, unmodifiedPaddings } = (0, useSafeAreaPaddings_1.default)(isUsingEdgeToEdgeMode);
    // since Modals are drawn in separate native view hierarchy we should always add paddings
    const ignoreInsetsConsumption = !(0, react_1.useContext)(ModalContext_1.default).default;
    const paddingTopStyle = (0, react_1.useMemo)(() => {
        if (!includePaddingTop) {
            return {};
        }
        if (isUsingEdgeToEdgeMode) {
            return { paddingTop };
        }
        if (ignoreInsetsConsumption) {
            return { paddingTop: unmodifiedPaddings.top };
        }
        return { paddingTop };
    }, [isUsingEdgeToEdgeMode, ignoreInsetsConsumption, includePaddingTop, paddingTop, unmodifiedPaddings.top]);
    const showBottomContent = isUsingEdgeToEdgeMode ? !!bottomContent : true;
    const edgeToEdgeBottomContentStyle = (0, useBottomSafeSafeAreaPaddingStyle_1.default)({ addBottomSafeAreaPadding: true, addOfflineIndicatorBottomSafeAreaPadding: false });
    const legacyBottomContentStyle = (0, react_1.useMemo)(() => {
        const shouldUseUnmodifiedPaddings = includeSafeAreaPaddingBottom && ignoreInsetsConsumption;
        if (shouldUseUnmodifiedPaddings) {
            return {
                paddingBottom: unmodifiedPaddings.bottom,
            };
        }
        return {
            // We always need the safe area padding bottom if we're showing the offline indicator since it is bottom-docked.
            paddingBottom: includeSafeAreaPaddingBottom ? paddingBottom : undefined,
        };
    }, [ignoreInsetsConsumption, includeSafeAreaPaddingBottom, paddingBottom, unmodifiedPaddings.bottom]);
    const bottomContentStyle = (0, react_1.useMemo)(() => [isUsingEdgeToEdgeMode ? edgeToEdgeBottomContentStyle : legacyBottomContentStyle, bottomContentStyleProp], [isUsingEdgeToEdgeMode, edgeToEdgeBottomContentStyle, legacyBottomContentStyle, bottomContentStyleProp]);
    const panResponder = (0, react_1.useRef)(react_native_1.PanResponder.create({
        onStartShouldSetPanResponderCapture: (_e, gestureState) => gestureState.numberActiveTouches === CONST_1.default.TEST_TOOL.NUMBER_OF_TAPS,
        onPanResponderRelease: TestTool_1.default,
    })).current;
    const keyboardDismissPanResponder = (0, react_1.useRef)(react_native_1.PanResponder.create({
        onMoveShouldSetPanResponderCapture: (_e, gestureState) => {
            const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
            const shouldDismissKeyboard = shouldDismissKeyboardBeforeClose && react_native_1.Keyboard.isVisible() && (0, Browser_1.isMobile)();
            return isHorizontalSwipe && shouldDismissKeyboard;
        },
        onPanResponderGrant: react_native_1.Keyboard.dismiss,
    })).current;
    (0, react_1.useEffect)(() => {
        /**
         * Handler to manage viewport resize events specific to Safari.
         * Disables the blur state when Safari is detected.
         */
        const handleViewportResize = () => {
            if (!(0, Browser_1.isSafari)()) {
                return; // Exit early if not Safari
            }
            setIsBlurred(false); // Disable blur state for Safari
        };
        // Add the viewport resize listener
        const removeResizeListener = (0, VisualViewport_1.default)(handleViewportResize);
        // Cleanup function to remove the listener
        return () => {
            removeResizeListener();
        };
    }, [setIsBlurred]);
    return (<react_native_1.View ref={ref} 
    // This style gives the background for the screens. Stack cards are transparent to make different width screens in RHP possible.
    style={styles.screenWrapperContainer(minHeight)} 
    // eslint-disable-next-line react/jsx-props-no-spreading, react-compiler/react-compiler
    {...panResponder.panHandlers} testID={testID} fsClass={forwardedFSClass}>
            <react_native_1.View 
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    style={[style, paddingTopStyle]} 
    // eslint-disable-next-line react/jsx-props-no-spreading, react-compiler/react-compiler
    {...keyboardDismissPanResponder.panHandlers}>
                <KeyboardAvoidingView_1.default style={[styles.w100, styles.h100, !isBlurred ? { maxHeight } : undefined, isAvoidingViewportScroll ? [styles.overflowAuto, styles.overscrollBehaviorContain] : {}]} behavior={keyboardAvoidingViewBehavior} enabled={shouldEnableKeyboardAvoidingView} 
    // Whether the mobile offline indicator or the content in general
    // should be offset by the bottom safe area padding when the keyboard is open.
    shouldOffsetBottomSafeAreaPadding={shouldKeyboardOffsetBottomSafeAreaPadding} keyboardVerticalOffset={keyboardVerticalOffset}>
                    <react_native_picker_select_1.PickerAvoidingView style={isAvoidingViewportScroll ? [styles.h100, { marginTop: 1 }] : styles.flex1} enabled={shouldEnablePickerAvoiding}>
                        {children}
                    </react_native_picker_select_1.PickerAvoidingView>
                </KeyboardAvoidingView_1.default>
            </react_native_1.View>
            {showBottomContent && <react_native_1.View style={bottomContentStyle}>{bottomContent}</react_native_1.View>}
        </react_native_1.View>);
}
ScreenWrapperContainer.displayName = 'ScreenWrapperContainer';
exports.default = react_1.default.memo(ScreenWrapperContainer);
