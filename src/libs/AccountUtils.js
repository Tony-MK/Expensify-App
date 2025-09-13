"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("@src/CONST");
const isValidateCodeFormSubmitting = (account) => !!account?.isLoading && account.loadingForm === (account.requiresTwoFactorAuth ? CONST_1.default.FORMS.VALIDATE_TFA_CODE_FORM : CONST_1.default.FORMS.VALIDATE_CODE_FORM);
function isDelegateOnlySubmitter(account) {
    const delegateEmail = account?.delegatedAccess?.delegate;
    const delegateRole = account?.delegatedAccess?.delegates?.find((delegate) => delegate.email === delegateEmail)?.role;
    return delegateRole === CONST_1.default.DELEGATE_ROLE.SUBMITTER;
}
exports.default = { isValidateCodeFormSubmitting, isDelegateOnlySubmitter };
