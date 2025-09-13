"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var ValidateCodeActionContent_1 = require("@components/ValidateCodeActionModal/ValidateCodeActionContent");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var User_1 = require("@libs/actions/User");
var ErrorUtils_1 = require("@libs/ErrorUtils");
var Navigation_1 = require("@libs/Navigation/Navigation");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var EmptyObject_1 = require("@src/types/utils/EmptyObject");
/**
 * This is a base page as RHP for account verification. The back & forward url logic should be handled on per case basis in higher component.
 */
function VerifyAccountPageBase(_a) {
    var _b, _c, _d;
    var navigateBackTo = _a.navigateBackTo, navigateForwardTo = _a.navigateForwardTo;
    var styles = (0, useThemeStyles_1.default)();
    var account = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true })[0];
    var loginList = (0, useOnyx_1.default)(ONYXKEYS_1.default.LOGIN_LIST, { canBeMissing: true })[0];
    var contactMethod = (_b = account === null || account === void 0 ? void 0 : account.primaryLogin) !== null && _b !== void 0 ? _b : '';
    var _e = (0, useLocalize_1.default)(), translate = _e.translate, formatPhoneNumber = _e.formatPhoneNumber;
    var loginData = loginList === null || loginList === void 0 ? void 0 : loginList[contactMethod];
    var validateLoginError = (0, ErrorUtils_1.getEarliestErrorField)(loginData, 'validateLogin');
    var isUserValidated = (_c = account === null || account === void 0 ? void 0 : account.validated) !== null && _c !== void 0 ? _c : false;
    (0, react_1.useEffect)(function () { return function () { return (0, User_1.clearUnvalidatedNewContactMethodAction)(); }; }, []);
    var handleSubmitForm = (0, react_1.useCallback)(function (validateCode) {
        (0, User_1.validateSecondaryLogin)(loginList, contactMethod, validateCode, formatPhoneNumber, true);
    }, [loginList, contactMethod, formatPhoneNumber]);
    var handleClose = (0, react_1.useCallback)(function () {
        Navigation_1.default.goBack(navigateBackTo);
    }, [navigateBackTo]);
    // Handle navigation once the user is validated
    (0, react_1.useEffect)(function () {
        if (!isUserValidated) {
            return;
        }
        if (navigateForwardTo) {
            Navigation_1.default.navigate(navigateForwardTo, { forceReplace: true });
        }
        else {
            handleClose();
        }
    }, [isUserValidated, navigateForwardTo, handleClose]);
    // Once user is validated or the modal is dismissed, we don't want to show empty content.
    if (isUserValidated) {
        return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom testID={VerifyAccountPageBase.displayName}>
                <HeaderWithBackButton_1.default title={translate('contacts.validateAccount')} onBackButtonPress={handleClose}/>
                <FullscreenLoadingIndicator_1.default style={[styles.flex1, styles.pRelative]}/>
            </ScreenWrapper_1.default>);
    }
    return (<ValidateCodeActionContent_1.default title={translate('contacts.validateAccount')} descriptionPrimary={translate('contacts.featureRequiresValidate')} descriptionSecondary={translate('contacts.enterMagicCode', { contactMethod: contactMethod })} sendValidateCode={User_1.requestValidateCodeAction} validateCodeActionErrorField="validateLogin" validatePendingAction={(_d = loginData === null || loginData === void 0 ? void 0 : loginData.pendingFields) === null || _d === void 0 ? void 0 : _d.validateCodeSent} handleSubmitForm={handleSubmitForm} validateError={!(0, EmptyObject_1.isEmptyObject)(validateLoginError) ? validateLoginError : (0, ErrorUtils_1.getLatestErrorField)(loginData, 'validateCodeSent')} clearError={function () { return (0, User_1.clearContactMethodErrors)(contactMethod, !(0, EmptyObject_1.isEmptyObject)(validateLoginError) ? 'validateLogin' : 'validateCodeSent'); }} onClose={handleClose}/>);
}
VerifyAccountPageBase.displayName = 'VerifyAccountPageBase';
exports.default = VerifyAccountPageBase;
