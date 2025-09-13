"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Text_1 = require("@components/Text");
const ValidateCodeForm_1 = require("@components/ValidateCodeActionModal/ValidateCodeForm");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function ValidateCodeActionForm({ descriptionPrimary, descriptionSecondary, descriptionPrimaryStyles, descriptionSecondaryStyles, validatePendingAction, validateError, hasMagicCodeBeenSent, handleSubmitForm, clearError, sendValidateCode, isLoading, submitButtonText, forwardedRef, shouldSkipInitialValidation, }) {
    const themeStyles = (0, useThemeStyles_1.default)();
    const isUnmounted = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        if (!shouldSkipInitialValidation) {
            sendValidateCode();
        }
        return () => {
            isUnmounted.current = true;
        };
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [shouldSkipInitialValidation]);
    (0, react_1.useEffect)(() => {
        return () => {
            if (!isUnmounted.current) {
                return;
            }
            clearError();
        };
    }, [clearError]);
    return (<react_native_1.View style={[themeStyles.ph5, themeStyles.mt3, themeStyles.mb5, themeStyles.flex1]}>
            <Text_1.default style={[themeStyles.mb6, descriptionPrimaryStyles]}>{descriptionPrimary}</Text_1.default>
            {!!descriptionSecondary && <Text_1.default style={[themeStyles.mb6, descriptionSecondaryStyles]}>{descriptionSecondary}</Text_1.default>}
            <ValidateCodeForm_1.default isLoading={isLoading} hasMagicCodeBeenSent={hasMagicCodeBeenSent} validatePendingAction={validatePendingAction} validateCodeActionErrorField="validateLogin" validateError={validateError} handleSubmitForm={handleSubmitForm} sendValidateCode={sendValidateCode} clearError={clearError} buttonStyles={[themeStyles.justifyContentEnd, themeStyles.flex1]} ref={forwardedRef} submitButtonText={submitButtonText}/>
        </react_native_1.View>);
}
ValidateCodeActionForm.displayName = 'ValidateCodeActionForm';
exports.default = (0, react_1.forwardRef)((props, ref) => (<ValidateCodeActionForm 
// eslint-disable-next-line react/jsx-props-no-spreading
{...props} forwardedRef={ref}/>));
