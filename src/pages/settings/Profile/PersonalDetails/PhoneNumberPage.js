"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const DelegateNoAccessWrapper_1 = require("@components/DelegateNoAccessWrapper");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const LoginUtils_1 = require("@libs/LoginUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const PersonalDetails_1 = require("@userActions/PersonalDetails");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const PersonalDetailsForm_1 = require("@src/types/form/PersonalDetailsForm");
function PhoneNumberPage() {
    const [privatePersonalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS, { canBeMissing: true });
    const [isLoadingApp = true] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true });
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const phoneNumber = privatePersonalDetails?.phoneNumber ?? '';
    const validateLoginError = (0, ErrorUtils_1.getEarliestErrorField)(privatePersonalDetails, 'phoneNumber');
    const currenPhoneNumber = privatePersonalDetails?.phoneNumber ?? '';
    const updatePhoneNumber = (values) => {
        // Clear the error when the user tries to submit the form
        if (validateLoginError) {
            (0, PersonalDetails_1.clearPhoneNumberError)();
        }
        // Only call the API if the user has changed their phone number
        if (values?.phoneNumber && phoneNumber !== values.phoneNumber) {
            (0, PersonalDetails_1.updatePhoneNumber)((0, LoginUtils_1.formatE164PhoneNumber)(values.phoneNumber) ?? '', currenPhoneNumber);
        }
        Navigation_1.default.goBack();
    };
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        const phoneNumberValue = values[PersonalDetailsForm_1.default.PHONE_NUMBER];
        if (!(0, ValidationUtils_1.isRequiredFulfilled)(phoneNumberValue)) {
            errors[PersonalDetailsForm_1.default.PHONE_NUMBER] = translate('common.error.fieldRequired');
            return errors;
        }
        const phoneNumberWithCountryCode = (0, LoginUtils_1.appendCountryCode)(phoneNumberValue);
        if (!(0, ValidationUtils_1.isValidPhoneNumber)(phoneNumberWithCountryCode)) {
            errors[PersonalDetailsForm_1.default.PHONE_NUMBER] = translate('common.error.phoneNumber');
            return errors;
        }
        if (validateLoginError && Object.keys(errors).length > 0) {
            (0, PersonalDetails_1.clearPhoneNumberError)();
        }
        return errors;
    }, [translate, validateLoginError]);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom shouldEnableMaxHeight testID={PhoneNumberPage.displayName}>
            <DelegateNoAccessWrapper_1.default accessDeniedVariants={[CONST_1.default.DELEGATE.DENIED_ACCESS_VARIANTS.DELEGATE]}>
                <HeaderWithBackButton_1.default title={translate('common.phoneNumber')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
                {isLoadingApp ? (<FullscreenLoadingIndicator_1.default style={[styles.flex1, styles.pRelative]}/>) : (<FormProvider_1.default style={[styles.flexGrow1, styles.ph5]} formID={ONYXKEYS_1.default.FORMS.PERSONAL_DETAILS_FORM} validate={validate} onSubmit={updatePhoneNumber} submitButtonText={translate('common.save')} enabledWhenOffline shouldHideFixErrorsAlert>
                        <OfflineWithFeedback_1.default errors={validateLoginError} errorRowStyles={styles.mt2} onClose={() => (0, PersonalDetails_1.clearPhoneNumberError)()}>
                            <InputWrapper_1.default InputComponent={TextInput_1.default} ref={inputCallbackRef} inputID={PersonalDetailsForm_1.default.PHONE_NUMBER} name="legalFirstName" label={translate('common.phoneNumber')} aria-label={translate('common.phoneNumber')} role={CONST_1.default.ROLE.PRESENTATION} defaultValue={phoneNumber} spellCheck={false} onBlur={() => {
                if (!validateLoginError) {
                    return;
                }
                (0, PersonalDetails_1.clearPhoneNumberError)();
            }} inputMode={CONST_1.default.INPUT_MODE.TEL}/>
                        </OfflineWithFeedback_1.default>
                    </FormProvider_1.default>)}
            </DelegateNoAccessWrapper_1.default>
        </ScreenWrapper_1.default>);
}
PhoneNumberPage.displayName = 'PhoneNumberPage';
exports.default = PhoneNumberPage;
