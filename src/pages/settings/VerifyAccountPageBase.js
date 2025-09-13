"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ValidateCodeActionContent_1 = require("@components/ValidateCodeActionModal/ValidateCodeActionContent");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const User_1 = require("@libs/actions/User");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
/**
 * This is a base page as RHP for account verification. The back & forward url logic should be handled on per case basis in higher component.
 */
function VerifyAccountPageBase({ navigateBackTo, navigateForwardTo }) {
    const styles = (0, useThemeStyles_1.default)();
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const [loginList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.LOGIN_LIST, { canBeMissing: true });
    const contactMethod = account?.primaryLogin ?? '';
    const { translate, formatPhoneNumber } = (0, useLocalize_1.default)();
    const loginData = loginList?.[contactMethod];
    const validateLoginError = (0, ErrorUtils_1.getEarliestErrorField)(loginData, 'validateLogin');
    const isUserValidated = account?.validated ?? false;
    (0, react_1.useEffect)(() => () => (0, User_1.clearUnvalidatedNewContactMethodAction)(), []);
    const handleSubmitForm = (0, react_1.useCallback)((validateCode) => {
        (0, User_1.validateSecondaryLogin)(loginList, contactMethod, validateCode, formatPhoneNumber, true);
    }, [loginList, contactMethod, formatPhoneNumber]);
    const handleClose = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(navigateBackTo);
    }, [navigateBackTo]);
    // Handle navigation once the user is validated
    (0, react_1.useEffect)(() => {
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
    return (<ValidateCodeActionContent_1.default title={translate('contacts.validateAccount')} descriptionPrimary={translate('contacts.featureRequiresValidate')} descriptionSecondary={translate('contacts.enterMagicCode', { contactMethod })} sendValidateCode={User_1.requestValidateCodeAction} validateCodeActionErrorField="validateLogin" validatePendingAction={loginData?.pendingFields?.validateCodeSent} handleSubmitForm={handleSubmitForm} validateError={!(0, EmptyObject_1.isEmptyObject)(validateLoginError) ? validateLoginError : (0, ErrorUtils_1.getLatestErrorField)(loginData, 'validateCodeSent')} clearError={() => (0, User_1.clearContactMethodErrors)(contactMethod, !(0, EmptyObject_1.isEmptyObject)(validateLoginError) ? 'validateLogin' : 'validateCodeSent')} onClose={handleClose}/>);
}
VerifyAccountPageBase.displayName = 'VerifyAccountPageBase';
exports.default = VerifyAccountPageBase;
