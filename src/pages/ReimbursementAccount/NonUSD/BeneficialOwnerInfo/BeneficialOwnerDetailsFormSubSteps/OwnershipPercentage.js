"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SingleFieldStep_1 = require("@components/SubStepForms/SingleFieldStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const { OWNERSHIP_PERCENTAGE, PREFIX } = CONST_1.default.NON_USD_BANK_ACCOUNT.BENEFICIAL_OWNER_INFO_STEP.BENEFICIAL_OWNER_DATA;
function OwnershipPercentage({ onNext, isEditing, onMove, isUserEnteringHisOwnData, ownerBeingModifiedID, totalOwnedPercentage, setTotalOwnedPercentage }) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT);
    const ownershipPercentageInputID = `${PREFIX}_${ownerBeingModifiedID}_${OWNERSHIP_PERCENTAGE}`;
    const defaultOwnershipPercentage = String(reimbursementAccountDraft?.[ownershipPercentageInputID] ?? '');
    const formTitle = translate(isUserEnteringHisOwnData ? 'ownershipInfoStep.whatsYoursPercentage' : 'ownershipInfoStep.whatPercentage');
    const validate = (0, react_1.useCallback)((values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, [ownershipPercentageInputID]);
        if (values[ownershipPercentageInputID] && !(0, ValidationUtils_1.isValidOwnershipPercentage)(String(values[ownershipPercentageInputID]), totalOwnedPercentage, ownerBeingModifiedID)) {
            errors[ownershipPercentageInputID] = translate('bankAccount.error.ownershipPercentage');
        }
        setTotalOwnedPercentage({
            ...totalOwnedPercentage,
            [ownerBeingModifiedID]: Number(values[ownershipPercentageInputID]),
        });
        return errors;
    }, [ownerBeingModifiedID, ownershipPercentageInputID, setTotalOwnedPercentage, totalOwnedPercentage, translate]);
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: [ownershipPercentageInputID],
        onNext,
        shouldSaveDraft: isEditing,
    });
    return (<SingleFieldStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} formTitle={formTitle} validate={validate} onSubmit={handleSubmit} inputId={ownershipPercentageInputID} inputLabel={translate('ownershipInfoStep.ownership')} inputMode={CONST_1.default.INPUT_MODE.NUMERIC} defaultValue={defaultOwnershipPercentage} shouldShowHelpLinks={false}/>);
}
OwnershipPercentage.displayName = 'OwnershipPercentage';
exports.default = OwnershipPercentage;
