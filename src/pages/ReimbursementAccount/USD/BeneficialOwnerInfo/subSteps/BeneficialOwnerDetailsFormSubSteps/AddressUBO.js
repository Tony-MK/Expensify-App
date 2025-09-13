"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const AddressStep_1 = require("@components/SubStepForms/AddressStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const BENEFICIAL_OWNER_INFO_KEY = CONST_1.default.BANK_ACCOUNT.BENEFICIAL_OWNER_INFO_STEP.BENEFICIAL_OWNER_DATA;
const BENEFICIAL_OWNER_PREFIX = CONST_1.default.BANK_ACCOUNT.BENEFICIAL_OWNER_INFO_STEP.BENEFICIAL_OWNER_DATA.PREFIX;
function AddressUBO({ onNext, onMove, isEditing, beneficialOwnerBeingModifiedID }) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT);
    const inputKeys = {
        street: `${BENEFICIAL_OWNER_PREFIX}_${beneficialOwnerBeingModifiedID}_${BENEFICIAL_OWNER_INFO_KEY.STREET}`,
        city: `${BENEFICIAL_OWNER_PREFIX}_${beneficialOwnerBeingModifiedID}_${BENEFICIAL_OWNER_INFO_KEY.CITY}`,
        state: `${BENEFICIAL_OWNER_PREFIX}_${beneficialOwnerBeingModifiedID}_${BENEFICIAL_OWNER_INFO_KEY.STATE}`,
        zipCode: `${BENEFICIAL_OWNER_PREFIX}_${beneficialOwnerBeingModifiedID}_${BENEFICIAL_OWNER_INFO_KEY.ZIP_CODE}`,
    };
    const defaultValues = {
        street: String(reimbursementAccountDraft?.[inputKeys.street] ?? ''),
        city: String(reimbursementAccountDraft?.[inputKeys.city] ?? ''),
        state: String(reimbursementAccountDraft?.[inputKeys.state] ?? ''),
        zipCode: String(reimbursementAccountDraft?.[inputKeys.zipCode] ?? ''),
    };
    const stepFields = [inputKeys.street, inputKeys.city, inputKeys.state, inputKeys.zipCode];
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: stepFields,
        onNext,
        shouldSaveDraft: isEditing,
    });
    return (<AddressStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} formTitle={translate('beneficialOwnerInfoStep.enterTheOwnersAddress')} formPOBoxDisclaimer={translate('common.noPO')} onSubmit={handleSubmit} stepFields={stepFields} inputFieldsIDs={inputKeys} defaultValues={defaultValues} shouldShowHelpLinks={false}/>);
}
AddressUBO.displayName = 'AddressUBO';
exports.default = AddressUBO;
