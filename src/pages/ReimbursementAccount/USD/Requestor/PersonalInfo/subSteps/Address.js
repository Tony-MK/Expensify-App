"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const AddressStep_1 = require("@components/SubStepForms/AddressStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const PERSONAL_INFO_STEP_KEY = ReimbursementAccountForm_1.default.PERSONAL_INFO_STEP;
const INPUT_KEYS = {
    street: PERSONAL_INFO_STEP_KEY.STREET,
    city: PERSONAL_INFO_STEP_KEY.CITY,
    state: PERSONAL_INFO_STEP_KEY.STATE,
    zipCode: PERSONAL_INFO_STEP_KEY.ZIP_CODE,
};
const STEP_FIELDS = [PERSONAL_INFO_STEP_KEY.STREET, PERSONAL_INFO_STEP_KEY.CITY, PERSONAL_INFO_STEP_KEY.STATE, PERSONAL_INFO_STEP_KEY.ZIP_CODE];
function Address({ onNext, onMove, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccount, reimbursementAccountResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const isLoadingReimbursementAccount = (0, isLoadingOnyxValue_1.default)(reimbursementAccountResult);
    const defaultValues = {
        street: reimbursementAccount?.achData?.[PERSONAL_INFO_STEP_KEY.STREET] ?? '',
        city: reimbursementAccount?.achData?.[PERSONAL_INFO_STEP_KEY.CITY] ?? '',
        state: reimbursementAccount?.achData?.[PERSONAL_INFO_STEP_KEY.STATE] ?? '',
        zipCode: reimbursementAccount?.achData?.[PERSONAL_INFO_STEP_KEY.ZIP_CODE] ?? '',
        country: reimbursementAccount?.achData?.country ?? '',
    };
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: isEditing,
    });
    if (isLoadingReimbursementAccount) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<AddressStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} formTitle={translate('personalInfoStep.enterYourAddress')} formPOBoxDisclaimer={translate('common.noPO')} onSubmit={handleSubmit} stepFields={STEP_FIELDS} inputFieldsIDs={INPUT_KEYS} defaultValues={defaultValues} shouldAllowCountryChange={false}/>);
}
Address.displayName = 'Address';
exports.default = Address;
