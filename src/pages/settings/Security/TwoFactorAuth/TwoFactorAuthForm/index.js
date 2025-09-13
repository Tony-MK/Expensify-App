"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BaseTwoFactorAuthForm_1 = require("./BaseTwoFactorAuthForm");
function TwoFactorAuthForm({ innerRef, validateInsteadOfDisable, onFocus, shouldAutoFocusOnMobile }) {
    return (<BaseTwoFactorAuthForm_1.default ref={innerRef} autoComplete="one-time-code" validateInsteadOfDisable={validateInsteadOfDisable} onFocus={onFocus} shouldAutoFocusOnMobile={shouldAutoFocusOnMobile}/>);
}
TwoFactorAuthForm.displayName = 'TwoFactorAuthForm';
exports.default = TwoFactorAuthForm;
