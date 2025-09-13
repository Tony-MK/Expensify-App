"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var ScrollView_1 = require("@components/ScrollView");
var Text_1 = require("@components/Text");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ValidateCodeForm_1 = require("./ValidateCodeForm");
function ValidateCodeActionContent(_a) {
    var title = _a.title, descriptionPrimary = _a.descriptionPrimary, descriptionSecondary = _a.descriptionSecondary, onClose = _a.onClose, validateError = _a.validateError, validatePendingAction = _a.validatePendingAction, validateCodeActionErrorField = _a.validateCodeActionErrorField, handleSubmitForm = _a.handleSubmitForm, clearError = _a.clearError, sendValidateCode = _a.sendValidateCode, isLoading = _a.isLoading, _b = _a.threeDotsMenuItems, threeDotsMenuItems = _b === void 0 ? [] : _b, _c = _a.onThreeDotsButtonPress, onThreeDotsButtonPress = _c === void 0 ? function () { } : _c;
    var themeStyles = (0, useThemeStyles_1.default)();
    var validateCodeFormRef = (0, react_1.useRef)(null);
    var validateCodeAction = (0, useOnyx_1.default)(ONYXKEYS_1.default.VALIDATE_ACTION_CODE, { canBeMissing: true })[0];
    var firstRenderRef = (0, react_1.useRef)(true);
    (0, react_1.useEffect)(function () {
        if (!firstRenderRef.current || (validateCodeAction === null || validateCodeAction === void 0 ? void 0 : validateCodeAction.validateCodeSent)) {
            return;
        }
        firstRenderRef.current = false;
        sendValidateCode();
        // We only want to send validate code on first render not on change of validateCodeSent, so we don't add it as a dependency.
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sendValidateCode]);
    var hide = (0, react_1.useCallback)(function () {
        clearError();
        onClose === null || onClose === void 0 ? void 0 : onClose();
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
