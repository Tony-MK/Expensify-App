"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const AddressStep_1 = require("@components/SubStepForms/AddressStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const { STREET, CITY, STATE, ZIP_CODE, COUNTRY, PREFIX } = CONST_1.default.NON_USD_BANK_ACCOUNT.BENEFICIAL_OWNER_INFO_STEP.BENEFICIAL_OWNER_DATA;
function Address({ onNext, isEditing, onMove, isUserEnteringHisOwnData, ownerBeingModifiedID }) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT);
    const countryStepCountryValue = reimbursementAccountDraft?.[ReimbursementAccountForm_1.default.ADDITIONAL_DATA.COUNTRY] ?? '';
    const countryInputKey = `${PREFIX}_${ownerBeingModifiedID}_${COUNTRY}`;
    const inputKeys = {
        street: `${PREFIX}_${ownerBeingModifiedID}_${STREET}`,
        city: `${PREFIX}_${ownerBeingModifiedID}_${CITY}`,
        state: `${PREFIX}_${ownerBeingModifiedID}_${STATE}`,
        zipCode: `${PREFIX}_${ownerBeingModifiedID}_${ZIP_CODE}`,
        country: countryInputKey,
    };
    const defaultValues = {
        street: String(reimbursementAccountDraft?.[inputKeys.street] ?? ''),
        city: String(reimbursementAccountDraft?.[inputKeys.city] ?? ''),
        state: String(reimbursementAccountDraft?.[inputKeys.state] ?? ''),
        zipCode: String(reimbursementAccountDraft?.[inputKeys.zipCode] ?? ''),
        country: (reimbursementAccountDraft?.[inputKeys.country] ?? ''),
    };
    const formTitle = translate(isUserEnteringHisOwnData ? 'ownershipInfoStep.whatsYourAddress' : 'ownershipInfoStep.whatsTheOwnersAddress');
    // Has to be stored in state and updated on country change due to the fact that we can't relay on onyxValues when user is editing the form (draft values are not being saved in that case)
    const [shouldDisplayStateSelector, setShouldDisplayStateSelector] = (0, react_1.useState)(defaultValues.country === CONST_1.default.COUNTRY.US || defaultValues.country === CONST_1.default.COUNTRY.CA || defaultValues.country === '');
    const stepFieldsWithState = (0, react_1.useMemo)(() => [inputKeys.street, inputKeys.city, inputKeys.state, inputKeys.zipCode, countryInputKey], [countryInputKey, inputKeys.city, inputKeys.state, inputKeys.street, inputKeys.zipCode]);
    const stepFieldsWithoutState = (0, react_1.useMemo)(() => [inputKeys.street, inputKeys.city, inputKeys.zipCode, countryInputKey], [countryInputKey, inputKeys.city, inputKeys.street, inputKeys.zipCode]);
    const stepFields = shouldDisplayStateSelector ? stepFieldsWithState : stepFieldsWithoutState;
    const handleCountryChange = (country) => {
        if (typeof country !== 'string' || country === '') {
            return;
        }
        setShouldDisplayStateSelector(country === CONST_1.default.COUNTRY.US || country === CONST_1.default.COUNTRY.CA);
    };
    const handleNextStep = () => {
        // owner is US based we need to gather last four digits of his SSN
        if (reimbursementAccountDraft?.[inputKeys.country] === CONST_1.default.COUNTRY.US) {
            onNext();
            // currency is set to GBP and owner is UK based, so we skip SSN and Documents step
        }
        else if (countryStepCountryValue === CONST_1.default.COUNTRY.GB && reimbursementAccountDraft?.[inputKeys.country] === CONST_1.default.COUNTRY.GB) {
            onMove(6, false);
            // owner is not US based so we skip SSN step
        }
        else {
            onMove(5, false);
        }
    };
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: stepFields,
        onNext: handleNextStep,
        shouldSaveDraft: isEditing,
    });
    return (<AddressStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} formTitle={formTitle} formPOBoxDisclaimer={translate('common.noPO')} onSubmit={handleSubmit} stepFields={stepFields} inputFieldsIDs={inputKeys} defaultValues={defaultValues} onCountryChange={handleCountryChange} shouldDisplayStateSelector={shouldDisplayStateSelector} shouldDisplayCountrySelector shouldValidateZipCodeFormat={reimbursementAccountDraft?.[inputKeys.country] === CONST_1.default.COUNTRY.US}/>);
}
Address.displayName = 'Address';
exports.default = Address;
