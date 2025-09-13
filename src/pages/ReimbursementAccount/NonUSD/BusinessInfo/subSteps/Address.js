"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const AddressStep_1 = require("@components/SubStepForms/AddressStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
const getSubStepValues_1 = require("@pages/ReimbursementAccount/utils/getSubStepValues");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const { COMPANY_STREET, COMPANY_POSTAL_CODE, COMPANY_STATE, COMPANY_CITY, COMPANY_COUNTRY_CODE } = ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY;
const INPUT_KEYS = {
    street: COMPANY_STREET,
    city: COMPANY_CITY,
    state: COMPANY_STATE,
    zipCode: COMPANY_POSTAL_CODE,
    country: COMPANY_COUNTRY_CODE,
};
const STEP_FIELDS = [COMPANY_STREET, COMPANY_CITY, COMPANY_STATE, COMPANY_POSTAL_CODE, COMPANY_COUNTRY_CODE];
const STEP_FIELDS_WITHOUT_STATE = [COMPANY_STREET, COMPANY_CITY, COMPANY_POSTAL_CODE, COMPANY_COUNTRY_CODE];
function Address({ onNext, onMove, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT);
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT);
    const onyxValues = (0, react_1.useMemo)(() => (0, getSubStepValues_1.default)(INPUT_KEYS, reimbursementAccountDraft, reimbursementAccount), [reimbursementAccount, reimbursementAccountDraft]);
    const businessStepCountryDefaultValue = onyxValues[COMPANY_COUNTRY_CODE] ?? '';
    const countryStepCountryValue = reimbursementAccount?.achData?.[ReimbursementAccountForm_1.default.ADDITIONAL_DATA.COUNTRY] ?? '';
    const countryDefaultValue = businessStepCountryDefaultValue === '' ? countryStepCountryValue : businessStepCountryDefaultValue;
    const shouldDisplayStateSelector = countryDefaultValue === CONST_1.default.COUNTRY.US || countryDefaultValue === CONST_1.default.COUNTRY.CA;
    const defaultValues = {
        street: onyxValues[COMPANY_STREET] ?? '',
        city: onyxValues[COMPANY_CITY] ?? '',
        state: onyxValues[COMPANY_STATE] ?? '',
        zipCode: onyxValues[COMPANY_POSTAL_CODE] ?? '',
        country: countryDefaultValue,
    };
    const stepFields = shouldDisplayStateSelector ? STEP_FIELDS : STEP_FIELDS_WITHOUT_STATE;
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: stepFields,
        onNext,
        shouldSaveDraft: isEditing,
    });
    return (<AddressStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} formTitle={translate('businessInfoStep.whatsTheBusinessAddress')} formPOBoxDisclaimer={translate('common.noPO')} onSubmit={handleSubmit} stepFields={stepFields} inputFieldsIDs={INPUT_KEYS} defaultValues={defaultValues} shouldDisplayStateSelector={shouldDisplayStateSelector} shouldDisplayCountrySelector shouldAllowCountryChange={false} shouldValidateZipCodeFormat={countryDefaultValue === CONST_1.default.COUNTRY.US}/>);
}
Address.displayName = 'Address';
exports.default = Address;
