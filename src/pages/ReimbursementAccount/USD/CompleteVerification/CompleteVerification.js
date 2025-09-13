"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useSubStep_1 = require("@hooks/useSubStep");
const getSubStepValues_1 = require("@pages/ReimbursementAccount/utils/getSubStepValues");
const BankAccounts_1 = require("@userActions/BankAccounts");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const ConfirmAgreements_1 = require("./subSteps/ConfirmAgreements");
const COMPLETE_VERIFICATION_KEYS = ReimbursementAccountForm_1.default.COMPLETE_VERIFICATION;
const bodyContent = [ConfirmAgreements_1.default];
function CompleteVerification({ onBackButtonPress }) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: true });
    const values = (0, react_1.useMemo)(() => (0, getSubStepValues_1.default)(COMPLETE_VERIFICATION_KEYS, reimbursementAccountDraft, reimbursementAccount), [reimbursementAccount, reimbursementAccountDraft]);
    const policyID = reimbursementAccount?.achData?.policyID;
    const submit = (0, react_1.useCallback)(() => {
        (0, BankAccounts_1.acceptACHContractForBankAccount)(Number(reimbursementAccount?.achData?.bankAccountID), {
            isAuthorizedToUseBankAccount: values.isAuthorizedToUseBankAccount,
            certifyTrueInformation: values.certifyTrueInformation,
            acceptTermsAndConditions: values.acceptTermsAndConditions,
        }, policyID);
    }, [reimbursementAccount, values, policyID]);
    const { componentToRender: SubStep, isEditing, screenIndex, nextScreen, prevScreen, moveTo, goToTheLastStep } = (0, useSubStep_1.default)({ bodyContent, startFrom: 0, onFinished: submit });
    const handleBackButtonPress = () => {
        if (isEditing) {
            goToTheLastStep();
            return;
        }
        if (screenIndex === 0) {
            onBackButtonPress();
        }
        else {
            prevScreen();
        }
    };
    return (<InteractiveStepWrapper_1.default wrapperID={CompleteVerification.displayName} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight headerTitle={translate('completeVerificationStep.completeVerification')} handleBackButtonPress={handleBackButtonPress} startStepIndex={6} stepNames={CONST_1.default.BANK_ACCOUNT.STEP_NAMES}>
            <SubStep isEditing={isEditing} onNext={nextScreen} onMove={moveTo}/>
        </InteractiveStepWrapper_1.default>);
}
CompleteVerification.displayName = 'CompleteVerification';
exports.default = CompleteVerification;
