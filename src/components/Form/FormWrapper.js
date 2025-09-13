"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormAlertWithSubmitButton_1 = require("@components/FormAlertWithSubmitButton");
const FormElement_1 = require("@components/FormElement");
const ScrollView_1 = require("@components/ScrollView");
const ScrollViewWithContext_1 = require("@components/ScrollViewWithContext");
const useBottomSafeSafeAreaPaddingStyle_1 = require("@hooks/useBottomSafeSafeAreaPaddingStyle");
const useOnyx_1 = require("@hooks/useOnyx");
const useSafeAreaPaddings_1 = require("@hooks/useSafeAreaPaddings");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function FormWrapper({ onSubmit, children, errors, inputRefs, submitButtonText, footerContent, isSubmitButtonVisible = true, style, submitButtonStyles, submitFlexEnabled = true, enabledWhenOffline, isSubmitActionDangerous = false, formID, shouldUseScrollView = true, scrollContextEnabled = false, shouldHideFixErrorsAlert = false, disablePressOnEnter = false, enterKeyEventListenerPriority = 1, isSubmitDisabled = false, shouldRenderFooterAboveSubmit = false, isLoading = false, shouldScrollToEnd = false, addBottomSafeAreaPadding, addOfflineIndicatorBottomSafeAreaPadding, shouldSubmitButtonStickToBottom: shouldSubmitButtonStickToBottomProp, shouldSubmitButtonBlendOpacity = false, shouldPreventDefaultFocusOnPressSubmit = false, onScroll = () => { }, forwardedFSClass, }) {
    const styles = (0, useThemeStyles_1.default)();
    const formRef = (0, react_1.useRef)(null);
    const formContentRef = (0, react_1.useRef)(null);
    const [formState] = (0, useOnyx_1.default)(`${formID}`, { canBeMissing: true });
    const errorMessage = (0, react_1.useMemo)(() => (formState ? (0, ErrorUtils_1.getLatestErrorMessage)(formState) : undefined), [formState]);
    const onFixTheErrorsLinkPressed = (0, react_1.useCallback)(() => {
        const errorFields = !(0, EmptyObject_1.isEmptyObject)(errors) ? errors : (formState?.errorFields ?? {});
        const focusKey = Object.keys(inputRefs.current ?? {}).find((key) => Object.keys(errorFields).includes(key));
        if (!focusKey) {
            return;
        }
        const focusInput = inputRefs.current?.[focusKey]?.current;
        // Dismiss the keyboard for non-text fields by checking if the component has the isFocused method, as only TextInput has this method.
        if (typeof focusInput?.isFocused !== 'function') {
            react_native_1.Keyboard.dismiss();
        }
        // We subtract 10 to scroll slightly above the input
        if (formContentRef.current) {
            // We measure relative to the content root, not the scroll view, as that gives
            // consistent results across mobile and web
            focusInput?.measureLayout?.(formContentRef.current, (X, y) => formRef.current?.scrollTo({
                y: y - 10,
                animated: false,
            }));
        }
        // Focus the input after scrolling, as on the Web it gives a slightly better visual result
        focusInput?.focus?.();
    }, [errors, formState?.errorFields, inputRefs]);
    // If either of `addBottomSafeAreaPadding` or `shouldSubmitButtonStickToBottom` is explicitly set,
    // we expect that the user wants to use the new edge-to-edge mode.
    // In this case, we want to get and apply the padding unconditionally.
    const isUsingEdgeToEdgeMode = addBottomSafeAreaPadding !== undefined || shouldSubmitButtonStickToBottomProp !== undefined;
    const shouldSubmitButtonStickToBottom = shouldSubmitButtonStickToBottomProp ?? false;
    const { paddingBottom } = (0, useSafeAreaPaddings_1.default)(isUsingEdgeToEdgeMode);
    // Same as above, if `addBottomSafeAreaPadding` is explicitly set true, we default to the new edge-to-edge bottom safe area padding handling.
    // If the paddingBottom is 0, it has already been applied to a parent component and we don't want to apply the padding again.
    const isLegacyBottomSafeAreaPaddingAlreadyApplied = paddingBottom === 0;
    const shouldApplyBottomSafeAreaPadding = addBottomSafeAreaPadding ?? !isLegacyBottomSafeAreaPaddingAlreadyApplied;
    // We need to add bottom safe area padding to the submit button when we don't use a scroll view or
    // when the submit button is sticking to the bottom.
    const addSubmitButtonBottomSafeAreaPadding = addBottomSafeAreaPadding && (!shouldUseScrollView || shouldSubmitButtonStickToBottom);
    const submitButtonStylesWithBottomSafeAreaPadding = (0, useBottomSafeSafeAreaPaddingStyle_1.default)({
        addBottomSafeAreaPadding: addSubmitButtonBottomSafeAreaPadding,
        addOfflineIndicatorBottomSafeAreaPadding,
        styleProperty: shouldSubmitButtonStickToBottom ? 'bottom' : 'paddingBottom',
        additionalPaddingBottom: shouldSubmitButtonStickToBottom ? styles.pb5.paddingBottom : 0,
        style: submitButtonStyles,
    });
    const SubmitButton = (0, react_1.useMemo)(() => isSubmitButtonVisible && (<FormAlertWithSubmitButton_1.default buttonText={submitButtonText} isDisabled={isSubmitDisabled} isAlertVisible={((!(0, EmptyObject_1.isEmptyObject)(errors) || !(0, EmptyObject_1.isEmptyObject)(formState?.errorFields)) && !shouldHideFixErrorsAlert) || !!errorMessage} isLoading={!!formState?.isLoading || isLoading} message={(0, EmptyObject_1.isEmptyObject)(formState?.errorFields) ? errorMessage : undefined} onSubmit={onSubmit} footerContent={footerContent} onFixTheErrorsLinkPressed={onFixTheErrorsLinkPressed} containerStyles={[
            styles.mh0,
            styles.mt5,
            submitFlexEnabled && styles.flex1,
            submitButtonStylesWithBottomSafeAreaPadding,
            shouldSubmitButtonStickToBottom && [styles.stickToBottom, style],
        ]} enabledWhenOffline={enabledWhenOffline} isSubmitActionDangerous={isSubmitActionDangerous} disablePressOnEnter={disablePressOnEnter} enterKeyEventListenerPriority={enterKeyEventListenerPriority} shouldRenderFooterAboveSubmit={shouldRenderFooterAboveSubmit} shouldBlendOpacity={shouldSubmitButtonBlendOpacity} shouldPreventDefaultFocusOnPress={shouldPreventDefaultFocusOnPressSubmit}/>), [
        disablePressOnEnter,
        enterKeyEventListenerPriority,
        enabledWhenOffline,
        errorMessage,
        errors,
        footerContent,
        formState?.errorFields,
        formState?.isLoading,
        isLoading,
        isSubmitActionDangerous,
        isSubmitButtonVisible,
        isSubmitDisabled,
        onFixTheErrorsLinkPressed,
        onSubmit,
        shouldHideFixErrorsAlert,
        shouldSubmitButtonBlendOpacity,
        shouldSubmitButtonStickToBottom,
        style,
        styles.flex1,
        styles.mh0,
        styles.mt5,
        styles.stickToBottom,
        submitButtonStylesWithBottomSafeAreaPadding,
        submitButtonText,
        submitFlexEnabled,
        shouldRenderFooterAboveSubmit,
        shouldPreventDefaultFocusOnPressSubmit,
    ]);
    const scrollViewContent = (0, react_1.useCallback)(() => (<FormElement_1.default key={formID} ref={formContentRef} style={[style, styles.pb5]} onLayout={() => {
            if (!shouldScrollToEnd) {
                return;
            }
            react_native_1.InteractionManager.runAfterInteractions(() => {
                requestAnimationFrame(() => {
                    formRef.current?.scrollToEnd({ animated: true });
                });
            });
        }}>
                {children}
                {!shouldSubmitButtonStickToBottom && SubmitButton}
            </FormElement_1.default>), [formID, style, styles.pb5, children, shouldSubmitButtonStickToBottom, SubmitButton, shouldScrollToEnd]);
    if (!shouldUseScrollView) {
        if (shouldSubmitButtonStickToBottom) {
            return (<>
                    {scrollViewContent()}
                    {SubmitButton}
                </>);
        }
        return scrollViewContent();
    }
    return (<react_native_1.View style={styles.flex1} fsClass={forwardedFSClass}>
            {scrollContextEnabled ? (<ScrollViewWithContext_1.default style={[styles.w100, styles.flex1]} contentContainerStyle={styles.flexGrow1} keyboardShouldPersistTaps="handled" addBottomSafeAreaPadding={shouldApplyBottomSafeAreaPadding} addOfflineIndicatorBottomSafeAreaPadding={addOfflineIndicatorBottomSafeAreaPadding} ref={formRef}>
                    {scrollViewContent()}
                </ScrollViewWithContext_1.default>) : (<ScrollView_1.default style={[styles.w100, styles.flex1]} contentContainerStyle={styles.flexGrow1} keyboardShouldPersistTaps="handled" addBottomSafeAreaPadding={shouldApplyBottomSafeAreaPadding} addOfflineIndicatorBottomSafeAreaPadding={addOfflineIndicatorBottomSafeAreaPadding} ref={formRef} onScroll={onScroll}>
                    {scrollViewContent()}
                </ScrollView_1.default>)}
            {shouldSubmitButtonStickToBottom && SubmitButton}
        </react_native_1.View>);
}
FormWrapper.displayName = 'FormWrapper';
exports.default = FormWrapper;
