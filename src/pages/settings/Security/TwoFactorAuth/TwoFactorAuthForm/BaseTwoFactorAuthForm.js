"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const MagicCodeInput_1 = require("@components/MagicCodeInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const Browser_1 = require("@libs/Browser");
const canFocusInputOnScreenFocus_1 = require("@libs/canFocusInputOnScreenFocus");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const Session_1 = require("@userActions/Session");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const isMobile = !(0, canFocusInputOnScreenFocus_1.default)();
function BaseTwoFactorAuthForm({ autoComplete, validateInsteadOfDisable, onFocus, shouldAutoFocusOnMobile = true }, ref) {
    const { translate } = (0, useLocalize_1.default)();
    const [formError, setFormError] = (0, react_1.useState)({});
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: false });
    const [twoFactorAuthCode, setTwoFactorAuthCode] = (0, react_1.useState)('');
    const inputRef = (0, react_1.useRef)(null);
    const shouldClearData = account?.needsTwoFactorAuthSetup ?? false;
    /**
     * Handle text input and clear formError upon text change
     */
    const onTextInput = (0, react_1.useCallback)((text) => {
        setTwoFactorAuthCode(text);
        setFormError({});
        if (account?.errors) {
            (0, Session_1.clearAccountMessages)();
        }
    }, [account?.errors]);
    /**
     * Check that all the form fields are valid, then trigger the submit callback
     */
    const validateAndSubmitForm = (0, react_1.useCallback)(() => {
        if (inputRef.current) {
            inputRef.current.blur();
        }
        if (!twoFactorAuthCode.trim()) {
            setFormError({ twoFactorAuthCode: translate('twoFactorAuthForm.error.pleaseFillTwoFactorAuth') });
            return;
        }
        if (!(0, ValidationUtils_1.isValidTwoFactorCode)(twoFactorAuthCode)) {
            setFormError({ twoFactorAuthCode: translate('twoFactorAuthForm.error.incorrect2fa') });
            return;
        }
        setFormError({});
        if (validateInsteadOfDisable !== false) {
            (0, Session_1.validateTwoFactorAuth)(twoFactorAuthCode, shouldClearData);
            return;
        }
        (0, Session_1.toggleTwoFactorAuth)(false, twoFactorAuthCode);
    }, [twoFactorAuthCode, validateInsteadOfDisable, translate, shouldClearData]);
    (0, react_1.useImperativeHandle)(ref, () => ({
        validateAndSubmitForm() {
            validateAndSubmitForm();
        },
        focus() {
            if (!inputRef.current) {
                return;
            }
            inputRef.current.focus();
        },
        focusLastSelected() {
            if (!inputRef.current) {
                return;
            }
            setTimeout(() => {
                inputRef.current?.focusLastSelected();
            }, CONST_1.default.ANIMATED_TRANSITION);
        },
    }));
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        if (!inputRef.current || (isMobile && !shouldAutoFocusOnMobile)) {
            return;
        }
        // Keyboard won't show if we focus the input with a delay, so we need to focus immediately.
        if (!(0, Browser_1.isMobileSafari)()) {
            setTimeout(() => {
                inputRef.current?.focusLastSelected();
            }, CONST_1.default.ANIMATED_TRANSITION);
        }
        else {
            inputRef.current?.focusLastSelected();
        }
    }, [shouldAutoFocusOnMobile]));
    return (<MagicCodeInput_1.default autoComplete={autoComplete} name="twoFactorAuthCode" value={twoFactorAuthCode} onChangeText={onTextInput} onFocus={onFocus} onFulfill={validateAndSubmitForm} errorText={formError.twoFactorAuthCode ?? (0, ErrorUtils_1.getLatestErrorMessage)(account)} ref={inputRef} autoFocus={false}/>);
}
exports.default = (0, react_1.forwardRef)(BaseTwoFactorAuthForm);
