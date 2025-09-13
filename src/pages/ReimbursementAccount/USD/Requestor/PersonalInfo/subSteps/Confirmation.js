"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConfirmationStep_1 = require("@components/SubStepForms/ConfirmationStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const getSubStepValues_1 = require("@pages/ReimbursementAccount/utils/getSubStepValues");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const PERSONAL_INFO_STEP_KEYS = ReimbursementAccountForm_1.default.PERSONAL_INFO_STEP;
const PERSONAL_INFO_STEP_INDEXES = CONST_1.default.REIMBURSEMENT_ACCOUNT.SUBSTEP_INDEX.PERSONAL_INFO;
function Confirmation({ onNext, onMove, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT);
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT);
    const isLoading = reimbursementAccount?.isLoading ?? false;
    const values = (0, react_1.useMemo)(() => (0, getSubStepValues_1.default)(PERSONAL_INFO_STEP_KEYS, reimbursementAccountDraft, reimbursementAccount), [reimbursementAccount, reimbursementAccountDraft]);
    const error = (0, ErrorUtils_1.getLatestErrorMessage)(reimbursementAccount ?? {});
    const summaryItems = [
        {
            description: translate('personalInfoStep.legalName'),
            title: `${values[PERSONAL_INFO_STEP_KEYS.FIRST_NAME]} ${values[PERSONAL_INFO_STEP_KEYS.LAST_NAME]}`,
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(PERSONAL_INFO_STEP_INDEXES.LEGAL_NAME);
            },
        },
        {
            description: translate('common.dob'),
            title: values[PERSONAL_INFO_STEP_KEYS.DOB],
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(PERSONAL_INFO_STEP_INDEXES.DATE_OF_BIRTH);
            },
        },
        {
            description: translate('personalInfoStep.last4SSN'),
            title: values[PERSONAL_INFO_STEP_KEYS.SSN_LAST_4],
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(PERSONAL_INFO_STEP_INDEXES.SSN);
            },
        },
        {
            description: translate('personalInfoStep.address'),
            title: `${values[PERSONAL_INFO_STEP_KEYS.STREET]}, ${values[PERSONAL_INFO_STEP_KEYS.CITY]}, ${values[PERSONAL_INFO_STEP_KEYS.STATE]} ${values[PERSONAL_INFO_STEP_KEYS.ZIP_CODE]}`,
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(PERSONAL_INFO_STEP_INDEXES.ADDRESS);
            },
        },
    ];
    return (<ConfirmationStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} pageTitle={translate('personalInfoStep.letsDoubleCheck')} summaryItems={summaryItems} showOnfidoLinks onfidoLinksTitle={`${translate('personalInfoStep.byAddingThisBankAccount')} `} isLoading={isLoading} error={error}/>);
}
Confirmation.displayName = 'Confirmation';
exports.default = Confirmation;
