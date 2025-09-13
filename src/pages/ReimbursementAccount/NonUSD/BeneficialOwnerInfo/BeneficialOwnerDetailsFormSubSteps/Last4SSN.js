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
const { SSN_LAST_4, PREFIX } = CONST_1.default.NON_USD_BANK_ACCOUNT.BENEFICIAL_OWNER_INFO_STEP.BENEFICIAL_OWNER_DATA;
function Last4SSN({ onNext, isEditing, onMove, isUserEnteringHisOwnData, ownerBeingModifiedID }) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT);
    const last4SSNInputID = `${PREFIX}_${ownerBeingModifiedID}_${SSN_LAST_4}`;
    const defaultLast4SSN = String(reimbursementAccountDraft?.[last4SSNInputID] ?? '');
    const formTitle = translate(isUserEnteringHisOwnData ? 'ownershipInfoStep.whatsYourLast' : 'ownershipInfoStep.whatAreTheLast');
    const validate = (0, react_1.useCallback)((values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, [last4SSNInputID]);
        if (values[last4SSNInputID] && !(0, ValidationUtils_1.isValidSSNLastFour)(String(values[last4SSNInputID]))) {
            errors[last4SSNInputID] = translate('bankAccount.error.ssnLast4');
        }
        return errors;
    }, [last4SSNInputID, translate]);
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: [last4SSNInputID],
        onNext,
        shouldSaveDraft: isEditing,
    });
    return (<SingleFieldStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} formTitle={formTitle} formDisclaimer={translate('beneficialOwnerInfoStep.dontWorry')} validate={validate} onSubmit={handleSubmit} inputId={last4SSNInputID} inputLabel={translate('ownershipInfoStep.last4')} inputMode={CONST_1.default.INPUT_MODE.NUMERIC} defaultValue={defaultLast4SSN} shouldShowHelpLinks={false} maxLength={CONST_1.default.BANK_ACCOUNT.MAX_LENGTH.SSN}/>);
}
Last4SSN.displayName = 'Last4SSN';
exports.default = Last4SSN;
