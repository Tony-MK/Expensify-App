"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ValidateCodeActionModal_1 = require("@components/ValidateCodeActionModal");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const User_1 = require("@libs/actions/User");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Delegate_1 = require("@userActions/Delegate");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function DelegateMagicCodeModal({ login, role, onClose, isValidateCodeActionModalVisible, shouldHandleNavigationBack, disableAnimation }) {
    const { translate } = (0, useLocalize_1.default)();
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const [validateCodeAction] = (0, useOnyx_1.default)(ONYXKEYS_1.default.VALIDATE_ACTION_CODE, { canBeMissing: true });
    const currentDelegate = account?.delegatedAccess?.delegates?.find((d) => d.email === login);
    const addDelegateErrors = account?.delegatedAccess?.errorFields?.addDelegate?.[login];
    const validateLoginError = (0, ErrorUtils_1.getLatestError)(addDelegateErrors);
    (0, react_1.useEffect)(() => {
        if (!currentDelegate || !!currentDelegate.pendingFields?.email || !!addDelegateErrors) {
            return;
        }
        // Dismiss modal on successful magic code verification
        Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_SECURITY);
    }, [login, currentDelegate, role, addDelegateErrors]);
    const clearError = () => {
        if ((0, EmptyObject_1.isEmptyObject)(validateLoginError) && (0, EmptyObject_1.isEmptyObject)(validateCodeAction?.errorFields)) {
            return;
        }
        (0, Delegate_1.clearDelegateErrorsByField)(currentDelegate?.email ?? '', 'addDelegate');
    };
    return (<ValidateCodeActionModal_1.default disableAnimation={disableAnimation} shouldHandleNavigationBack={shouldHandleNavigationBack} clearError={clearError} onClose={onClose} validateCodeActionErrorField="addDelegate" validateError={validateLoginError} isVisible={isValidateCodeActionModalVisible} title={translate('delegate.makeSureItIsYou')} sendValidateCode={() => (0, User_1.requestValidateCodeAction)()} handleSubmitForm={(validateCode) => (0, Delegate_1.addDelegate)(login, role, validateCode)} descriptionPrimary={translate('delegate.enterMagicCode', { contactMethod: account?.primaryLogin ?? '' })}/>);
}
DelegateMagicCodeModal.displayName = 'DelegateMagicCodeModal';
exports.default = DelegateMagicCodeModal;
