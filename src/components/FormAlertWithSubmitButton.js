"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const getPlatform_1 = require("@libs/getPlatform");
const CONST_1 = require("@src/CONST");
const Button_1 = require("./Button");
const FormAlertWrapper_1 = require("./FormAlertWrapper");
function FormAlertWithSubmitButton({ message = '', isDisabled = false, isMessageHtml = false, containerStyles, isLoading = false, onFixTheErrorsLinkPressed = () => { }, enabledWhenOffline = false, disablePressOnEnter = false, isSubmitActionDangerous = false, footerContent, buttonRef, buttonStyles, buttonText, isAlertVisible = false, onSubmit, useSmallerSubmitButtonSize = false, errorMessageStyle, enterKeyEventListenerPriority = 0, shouldRenderFooterAboveSubmit = false, shouldBlendOpacity = false, addButtonBottomPadding = true, shouldPreventDefaultFocusOnPress = false, }) {
    const styles = (0, useThemeStyles_1.default)();
    const style = [!shouldRenderFooterAboveSubmit && footerContent && addButtonBottomPadding ? styles.mb3 : {}, buttonStyles];
    // Disable pressOnEnter for Android Native to avoid issues with the Samsung keyboard,
    // where pressing Enter saves the form instead of adding a new line in multiline input.
    // More details: https://github.com/Expensify/App/issues/46644
    const isAndroidNative = (0, getPlatform_1.default)() === CONST_1.default.PLATFORM.ANDROID;
    const pressOnEnter = isAndroidNative ? false : !disablePressOnEnter;
    return (<FormAlertWrapper_1.default containerStyles={[styles.justifyContentEnd, containerStyles]} isAlertVisible={isAlertVisible} isMessageHtml={isMessageHtml} message={message} onFixTheErrorsLinkPressed={onFixTheErrorsLinkPressed} errorMessageStyle={errorMessageStyle}>
            {(isOffline) => (<react_native_1.View>
                    {shouldRenderFooterAboveSubmit && footerContent}
                    {isOffline && !enabledWhenOffline ? (<Button_1.default success shouldBlendOpacity={shouldBlendOpacity} isDisabled text={buttonText} style={style} danger={isSubmitActionDangerous} medium={useSmallerSubmitButtonSize} large={!useSmallerSubmitButtonSize} onMouseDown={shouldPreventDefaultFocusOnPress ? (e) => e.preventDefault() : undefined}/>) : (<Button_1.default ref={buttonRef} success shouldBlendOpacity={shouldBlendOpacity} pressOnEnter={pressOnEnter} enterKeyEventListenerPriority={enterKeyEventListenerPriority} text={buttonText} style={style} onPress={onSubmit} isDisabled={isDisabled} isLoading={isLoading} danger={isSubmitActionDangerous} medium={useSmallerSubmitButtonSize} large={!useSmallerSubmitButtonSize} onMouseDown={shouldPreventDefaultFocusOnPress ? (e) => e.preventDefault() : undefined}/>)}
                    {!shouldRenderFooterAboveSubmit && footerContent}
                </react_native_1.View>)}
        </FormAlertWrapper_1.default>);
}
FormAlertWithSubmitButton.displayName = 'FormAlertWithSubmitButton';
exports.default = FormAlertWithSubmitButton;
