"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ValidateCodeActionModal_1 = require("@components/ValidateCodeActionModal");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const Delegate_1 = require("@libs/actions/Delegate");
const User_1 = require("@libs/actions/User");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function UpdateDelegateMagicCodeModal({ login, role, isValidateCodeActionModalVisible, onClose }) {
    const { translate } = (0, useLocalize_1.default)();
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const [validateCodeAction] = (0, useOnyx_1.default)(ONYXKEYS_1.default.VALIDATE_ACTION_CODE, { canBeMissing: true });
    const currentDelegate = account?.delegatedAccess?.delegates?.find((d) => d.email === login);
    const updateDelegateErrors = account?.delegatedAccess?.errorFields?.updateDelegateRole?.[login];
    (0, react_1.useEffect)(() => {
        if (currentDelegate?.role !== role || !!currentDelegate.pendingFields?.role || !!updateDelegateErrors) {
            return;
        }
        // Dismiss modal on successful magic code verification
        Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_SECURITY);
    }, [login, currentDelegate, role, updateDelegateErrors]);
    const onBackButtonPress = () => {
        onClose?.();
    };
    const clearError = () => {
        if ((0, EmptyObject_1.isEmptyObject)(updateDelegateErrors) && (0, EmptyObject_1.isEmptyObject)(validateCodeAction?.errorFields)) {
            return;
        }
        (0, Delegate_1.clearDelegateErrorsByField)(currentDelegate?.email ?? '', 'updateDelegateRole');
    };
    return (<ValidateCodeActionModal_1.default clearError={clearError} onClose={onBackButtonPress} validateCodeActionErrorField="updateDelegateRole" isLoading={currentDelegate?.isLoading} validateError={updateDelegateErrors} isVisible={isValidateCodeActionModalVisible} title={translate('delegate.makeSureItIsYou')} sendValidateCode={() => (0, User_1.requestValidateCodeAction)()} handleSubmitForm={(validateCode) => (0, Delegate_1.updateDelegateRole)(login, role, validateCode)} descriptionPrimary={translate('delegate.enterMagicCode', { contactMethod: account?.primaryLogin ?? '' })}/>);
}
UpdateDelegateMagicCodeModal.displayName = 'UpdateDelegateMagicCodeModal';
exports.default = UpdateDelegateMagicCodeModal;
