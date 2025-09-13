"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const DateOfBirthStep_1 = require("@components/SubStepForms/DateOfBirthStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const HelpLinks_1 = require("@pages/ReimbursementAccount/USD/Requestor/PersonalInfo/HelpLinks");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const PERSONAL_INFO_DOB_KEY = ReimbursementAccountForm_1.default.PERSONAL_INFO_STEP.DOB;
const STEP_FIELDS = [PERSONAL_INFO_DOB_KEY];
function DateOfBirth({ onNext, onMove, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [reimbursementAccount, reimbursementAccountResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT);
    const isLoadingReimbursementAccount = (0, isLoadingOnyxValue_1.default)(reimbursementAccountResult);
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT);
    const dobDefaultValue = reimbursementAccount?.achData?.[PERSONAL_INFO_DOB_KEY] ?? reimbursementAccountDraft?.[PERSONAL_INFO_DOB_KEY] ?? '';
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: isEditing,
    });
    if (isLoadingReimbursementAccount) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<DateOfBirthStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} formTitle={translate('personalInfoStep.enterYourDateOfBirth')} onSubmit={handleSubmit} stepFields={STEP_FIELDS} dobInputID={PERSONAL_INFO_DOB_KEY} dobDefaultValue={dobDefaultValue} footerComponent={<HelpLinks_1.default containerStyles={[styles.mt5]}/>}/>);
}
DateOfBirth.displayName = 'DateOfBirth';
exports.default = DateOfBirth;
