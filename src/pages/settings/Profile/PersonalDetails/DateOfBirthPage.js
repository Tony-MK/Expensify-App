"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const react_1 = require("react");
const DatePicker_1 = require("@components/DatePicker");
const DelegateNoAccessWrapper_1 = require("@components/DelegateNoAccessWrapper");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const PersonalDetails_1 = require("@userActions/PersonalDetails");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const DateOfBirthForm_1 = require("@src/types/form/DateOfBirthForm");
function DateOfBirthPage() {
    const [privatePersonalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS);
    const [isLoadingApp = true] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP);
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    /**
     * @returns An object containing the errors for each inputID
     */
    const validate = (0, react_1.useCallback)((values) => {
        const requiredFields = ['dob'];
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, requiredFields);
        const minimumAge = CONST_1.default.DATE_BIRTH.MIN_AGE;
        const maximumAge = CONST_1.default.DATE_BIRTH.MAX_AGE;
        const dateError = (0, ValidationUtils_1.getAgeRequirementError)(values.dob ?? '', minimumAge, maximumAge);
        if (values.dob && dateError) {
            errors.dob = dateError;
        }
        return errors;
    }, []);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom testID={DateOfBirthPage.displayName}>
            <DelegateNoAccessWrapper_1.default accessDeniedVariants={[CONST_1.default.DELEGATE.DENIED_ACCESS_VARIANTS.DELEGATE]}>
                <HeaderWithBackButton_1.default title={translate('common.dob')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
                {isLoadingApp ? (<FullscreenLoadingIndicator_1.default style={[styles.flex1, styles.pRelative]}/>) : (<FormProvider_1.default style={[styles.flexGrow1, styles.ph5]} formID={ONYXKEYS_1.default.FORMS.DATE_OF_BIRTH_FORM} validate={validate} onSubmit={PersonalDetails_1.updateDateOfBirth} submitButtonText={translate('common.save')} enabledWhenOffline shouldHideFixErrorsAlert>
                        <InputWrapper_1.default InputComponent={DatePicker_1.default} inputID={DateOfBirthForm_1.default.DOB} label={translate('common.date')} defaultValue={privatePersonalDetails?.dob ?? ''} minDate={(0, date_fns_1.subYears)(new Date(), CONST_1.default.DATE_BIRTH.MAX_AGE)} maxDate={(0, date_fns_1.subYears)(new Date(), CONST_1.default.DATE_BIRTH.MIN_AGE)} autoFocus/>
                    </FormProvider_1.default>)}
            </DelegateNoAccessWrapper_1.default>
        </ScreenWrapper_1.default>);
}
DateOfBirthPage.displayName = 'DateOfBirthPage';
exports.default = DateOfBirthPage;
