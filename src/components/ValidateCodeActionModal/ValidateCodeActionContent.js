"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ValidateCodeForm_1 = require("./ValidateCodeForm");
function ValidateCodeActionContent({ title, descriptionPrimary, descriptionSecondary, onClose, validateError, validatePendingAction, validateCodeActionErrorField, handleSubmitForm, clearError, sendValidateCode, isLoading, threeDotsMenuItems = [], onThreeDotsButtonPress = () => { }, }) {
    const themeStyles = (0, useThemeStyles_1.default)();
    const validateCodeFormRef = (0, react_1.useRef)(null);
    const [validateCodeAction] = (0, useOnyx_1.default)(ONYXKEYS_1.default.VALIDATE_ACTION_CODE, { canBeMissing: true });
    const firstRenderRef = (0, react_1.useRef)(true);
    (0, react_1.useEffect)(() => {
        if (!firstRenderRef.current || validateCodeAction?.validateCodeSent) {
            return;
        }
        firstRenderRef.current = false;
        sendValidateCode();
        // We only want to send validate code on first render not on change of validateCodeSent, so we don't add it as a dependency.
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sendValidateCode]);
    const hide = (0, react_1.useCallback)(() => {
        clearError();
        onClose?.();
    }, [onClose, clearError]);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom includePaddingTop shouldEnableMaxHeight testID={ValidateCodeActionContent.displayName} offlineIndicatorStyle={themeStyles.mtAuto}>
            <HeaderWithBackButton_1.default title={title} onBackButtonPress={hide} threeDotsMenuItems={threeDotsMenuItems} shouldShowThreeDotsButton={threeDotsMenuItems.length > 0} shouldOverlayDots onThreeDotsButtonPress={onThreeDotsButtonPress}/>

            <ScrollView_1.default style={[themeStyles.w100, themeStyles.h100, themeStyles.flex1]} contentContainerStyle={themeStyles.flexGrow1} keyboardShouldPersistTaps="handled">
                <react_native_1.View style={[themeStyles.ph5, themeStyles.mt3, themeStyles.mb5, themeStyles.flex1]}>
                    <Text_1.default style={themeStyles.mb3}>{descriptionPrimary}</Text_1.default>
                    {!!descriptionSecondary && <Text_1.default style={themeStyles.mb3}>{descriptionSecondary}</Text_1.default>}
                    <ValidateCodeForm_1.default isLoading={isLoading} validatePendingAction={validatePendingAction} validateCodeActionErrorField={validateCodeActionErrorField} validateError={validateError} handleSubmitForm={handleSubmitForm} sendValidateCode={sendValidateCode} clearError={clearError} buttonStyles={[themeStyles.justifyContentEnd, themeStyles.flex1]} ref={validateCodeFormRef}/>
                </react_native_1.View>
            </ScrollView_1.default>
        </ScreenWrapper_1.default>);
}
ValidateCodeActionContent.displayName = 'ValidateCodeActionContent';
exports.default = ValidateCodeActionContent;
