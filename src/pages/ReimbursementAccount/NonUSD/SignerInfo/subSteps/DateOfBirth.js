"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const DateOfBirthStep_1 = require("@components/SubStepForms/DateOfBirthStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const WhyLink_1 = require("@pages/ReimbursementAccount/WhyLink");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const { SIGNER_DATE_OF_BIRTH } = ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY;
function DateOfBirth({ onNext, onMove, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const inputID = SIGNER_DATE_OF_BIRTH;
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: true });
    const defaultValue = reimbursementAccount?.achData?.corpay?.[inputID] ?? reimbursementAccountDraft?.[inputID] ?? '';
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: [inputID],
        onNext,
        shouldSaveDraft: isEditing,
    });
    return (<DateOfBirthStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} formTitle={translate('signerInfoStep.whatsYourDOB')} onSubmit={handleSubmit} stepFields={[inputID]} dobInputID={inputID} dobDefaultValue={defaultValue} footerComponent={<WhyLink_1.default containerStyles={[styles.mt6]}/>}/>);
}
DateOfBirth.displayName = 'DateOfBirth';
exports.default = DateOfBirth;
