"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const react_1 = require("react");
const react_native_1 = require("react-native");
const DatePicker_1 = require("@components/DatePicker");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const TextLink_1 = require("@components/TextLink");
const withCurrentUserPersonalDetails_1 = require("@components/withCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const PhoneNumber_1 = require("@libs/PhoneNumber");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const AddressFormFields_1 = require("@pages/ReimbursementAccount/AddressFormFields");
const Wallet_1 = require("@userActions/Wallet");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const AdditionalDetailStepForm_1 = require("@src/types/form/AdditionalDetailStepForm");
const IdologyQuestions_1 = require("./IdologyQuestions");
const DEFAULT_WALLET_ADDITIONAL_DETAILS = {
    errorFields: {},
    isLoading: false,
    errors: {},
    questions: [],
    idNumber: '',
    errorCode: '',
};
const fieldNameTranslationKeys = {
    legalFirstName: 'additionalDetailsStep.legalFirstNameLabel',
    legalLastName: 'additionalDetailsStep.legalLastNameLabel',
    addressStreet: 'common.personalAddress',
    phoneNumber: 'common.phoneNumber',
    dob: 'common.dob',
    ssn: 'common.ssnLast4',
    ssnFull9: 'common.ssnFull9',
};
const STEP_FIELDS = [
    AdditionalDetailStepForm_1.default.LEGAL_FIRST_NAME,
    AdditionalDetailStepForm_1.default.LEGAL_LAST_NAME,
    AdditionalDetailStepForm_1.default.ADDRESS_STREET,
    AdditionalDetailStepForm_1.default.ADDRESS_CITY,
    AdditionalDetailStepForm_1.default.ADDRESS_ZIP_CODE,
    AdditionalDetailStepForm_1.default.PHONE_NUMBER,
    AdditionalDetailStepForm_1.default.DOB,
    AdditionalDetailStepForm_1.default.ADDRESS_STATE,
    AdditionalDetailStepForm_1.default.SSN,
];
function AdditionalDetailsStep({ currentUserPersonalDetails }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [walletAdditionalDetails = DEFAULT_WALLET_ADDITIONAL_DETAILS] = (0, useOnyx_1.default)(ONYXKEYS_1.default.WALLET_ADDITIONAL_DETAILS);
    const currentDate = new Date();
    const minDate = (0, date_fns_1.subYears)(currentDate, CONST_1.default.DATE_BIRTH.MAX_AGE);
    const maxDate = (0, date_fns_1.subYears)(currentDate, CONST_1.default.DATE_BIRTH.MIN_AGE_FOR_PAYMENT);
    const shouldAskForFullSSN = walletAdditionalDetails?.errorCode === CONST_1.default.WALLET.ERROR.SSN;
    const validate = (values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, STEP_FIELDS);
        if (values.dob) {
            if (!(0, ValidationUtils_1.isValidPastDate)(values.dob) || !(0, ValidationUtils_1.meetsMaximumAgeRequirement)(values.dob)) {
                errors.dob = translate('bankAccount.error.dob');
            }
            else if (!(0, ValidationUtils_1.meetsMinimumAgeRequirement)(values.dob)) {
                errors.dob = translate('bankAccount.error.age');
            }
        }
        if (values.addressStreet && !(0, ValidationUtils_1.isValidAddress)(values.addressStreet)) {
            errors.addressStreet = translate('bankAccount.error.addressStreet');
        }
        if (values.addressZipCode && !(0, ValidationUtils_1.isValidZipCode)(values.addressZipCode)) {
            errors.addressZipCode = translate('bankAccount.error.zipCode');
        }
        if (values.phoneNumber && !(0, ValidationUtils_1.isValidUSPhone)(values.phoneNumber, true)) {
            errors.phoneNumber = translate('bankAccount.error.phoneNumber');
        }
        // walletAdditionalDetails stores errors returned by the server. If the server returns an SSN error
        // then the user needs to provide the full 9 digit SSN.
        if (walletAdditionalDetails?.errorCode === CONST_1.default.WALLET.ERROR.SSN) {
            if (values.ssn && !(0, ValidationUtils_1.isValidSSNFullNine)(values.ssn)) {
                errors.ssn = translate('additionalDetailsStep.ssnFull9Error');
            }
        }
        else if (values.ssn && !(0, ValidationUtils_1.isValidSSNLastFour)(values.ssn)) {
            errors.ssn = translate('bankAccount.error.ssnLast4');
        }
        return errors;
    };
    const activateWallet = (values) => {
        const personalDetails = {
            phoneNumber: (values.phoneNumber && (0, PhoneNumber_1.parsePhoneNumber)(values.phoneNumber, { regionCode: CONST_1.default.COUNTRY.US }).number?.significant) ?? '',
            legalFirstName: values.legalFirstName ?? '',
            legalLastName: values.legalLastName ?? '',
            addressStreet: values.addressStreet ?? '',
            addressCity: values.addressCity ?? '',
            addressState: values.addressState ?? '',
            addressZip: values.addressZipCode ?? '',
            dob: values.dob ?? '',
            ssn: values.ssn ?? '',
        };
        // Attempt to set the personal details
        (0, Wallet_1.updatePersonalDetails)(personalDetails);
    };
    if (walletAdditionalDetails?.questions && walletAdditionalDetails.questions.length > 0) {
        return (<ScreenWrapper_1.default shouldShowOfflineIndicator={false} style={[styles.flex1, styles.pt0]} keyboardAvoidingViewBehavior="height" testID={AdditionalDetailsStep.displayName}>
                <HeaderWithBackButton_1.default title={translate('additionalDetailsStep.headerTitle')} onBackButtonPress={() => (0, Wallet_1.setAdditionalDetailsQuestions)(null)}/>
                <IdologyQuestions_1.default questions={walletAdditionalDetails.questions} idNumber={walletAdditionalDetails.idNumber ?? ''}/>
            </ScreenWrapper_1.default>);
    }
    return (<>
            <HeaderWithBackButton_1.default title={translate('additionalDetailsStep.headerTitle')}/>
            <react_native_1.View style={[styles.flex1]}>
                <react_native_1.View style={[styles.ph5]}>
                    <Text_1.default style={styles.mb3}>{translate('additionalDetailsStep.helpText')}</Text_1.default>
                    <TextLink_1.default style={styles.mb3} href={CONST_1.default.HELP_LINK_URL}>
                        {translate('additionalDetailsStep.helpLink')}
                    </TextLink_1.default>
                </react_native_1.View>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.WALLET_ADDITIONAL_DETAILS} validate={validate} onSubmit={activateWallet} scrollContextEnabled submitButtonText={translate('common.saveAndContinue')} style={[styles.mh5, styles.flexGrow1]}>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} inputID="legalFirstName" containerStyles={[styles.mt4]} label={translate(fieldNameTranslationKeys.legalFirstName)} accessibilityLabel={translate(fieldNameTranslationKeys.legalFirstName)} role={CONST_1.default.ROLE.PRESENTATION} defaultValue={(0, PersonalDetailsUtils_1.extractFirstAndLastNameFromAvailableDetails)(currentUserPersonalDetails).firstName} shouldSaveDraft/>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} inputID="legalLastName" containerStyles={[styles.mt4]} label={translate(fieldNameTranslationKeys.legalLastName)} accessibilityLabel={translate(fieldNameTranslationKeys.legalLastName)} role={CONST_1.default.ROLE.PRESENTATION} defaultValue={(0, PersonalDetailsUtils_1.extractFirstAndLastNameFromAvailableDetails)(currentUserPersonalDetails).lastName} shouldSaveDraft/>
                    <AddressFormFields_1.default inputKeys={{
            street: 'addressStreet',
            city: 'addressCity',
            state: 'addressState',
            zipCode: 'addressZipCode',
        }} streetTranslationKey={fieldNameTranslationKeys.addressStreet} shouldSaveDraft/>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} inputID="phoneNumber" containerStyles={[styles.mt4]} inputMode={CONST_1.default.INPUT_MODE.TEL} label={translate(fieldNameTranslationKeys.phoneNumber)} accessibilityLabel={translate(fieldNameTranslationKeys.phoneNumber)} role={CONST_1.default.ROLE.PRESENTATION} defaultValue={currentUserPersonalDetails.phoneNumber} placeholder={translate('common.phoneNumberPlaceholder')} shouldSaveDraft/>
                    <InputWrapper_1.default InputComponent={DatePicker_1.default} inputID="dob" containerStyles={[styles.mt4]} label={translate(fieldNameTranslationKeys.dob)} placeholder={translate('common.dob')} minDate={minDate} maxDate={maxDate} shouldSaveDraft/>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} inputID="ssn" containerStyles={[styles.mt4]} label={translate(fieldNameTranslationKeys[shouldAskForFullSSN ? 'ssnFull9' : 'ssn'])} accessibilityLabel={translate(fieldNameTranslationKeys[shouldAskForFullSSN ? 'ssnFull9' : 'ssn'])} role={CONST_1.default.ROLE.PRESENTATION} maxLength={shouldAskForFullSSN ? CONST_1.default.BANK_ACCOUNT.MAX_LENGTH.FULL_SSN : CONST_1.default.BANK_ACCOUNT.MAX_LENGTH.SSN} inputMode={CONST_1.default.INPUT_MODE.NUMERIC}/>
                </FormProvider_1.default>
            </react_native_1.View>
        </>);
}
AdditionalDetailsStep.displayName = 'AdditionalDetailsStep';
exports.default = (0, withCurrentUserPersonalDetails_1.default)(AdditionalDetailsStep);
