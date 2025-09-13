"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
const Onfido_1 = require("@components/Onfido");
const ScrollView_1 = require("@components/ScrollView");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Growl_1 = require("@libs/Growl");
const BankAccounts_1 = require("@userActions/BankAccounts");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ONFIDO_ERROR_DISPLAY_DURATION = 10000;
function VerifyIdentity({ onBackButtonPress }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: true });
    const [onfidoApplicantID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONFIDO_APPLICANT_ID, { canBeMissing: false });
    const [onfidoToken] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONFIDO_TOKEN, { canBeMissing: false });
    const [onfidoKey, setOnfidoKey] = (0, react_1.useState)(() => Math.floor(Math.random() * 1000000));
    const policyID = reimbursementAccount?.achData?.policyID;
    const bankAccountID = reimbursementAccount?.achData?.bankAccountID;
    const handleOnfidoSuccess = (0, react_1.useCallback)((onfidoData) => {
        if (!policyID) {
            return;
        }
        (0, BankAccounts_1.verifyIdentityForBankAccount)(Number(bankAccountID), { ...onfidoData, applicantID: onfidoApplicantID }, policyID);
        (0, BankAccounts_1.updateReimbursementAccountDraft)({ isOnfidoSetupComplete: true });
    }, [bankAccountID, onfidoApplicantID, policyID]);
    const handleOnfidoError = () => {
        // In case of any unexpected error we log it to the server, show a growl, and return the user back to the requestor step so they can try again.
        Growl_1.default.error(translate('onfidoStep.genericError'), ONFIDO_ERROR_DISPLAY_DURATION);
        (0, BankAccounts_1.clearOnfidoToken)();
        (0, BankAccounts_1.goToWithdrawalAccountSetupStep)(CONST_1.default.BANK_ACCOUNT.STEP.REQUESTOR);
    };
    const handleOnfidoUserExit = (isUserInitiated) => {
        if (isUserInitiated) {
            (0, BankAccounts_1.clearOnfidoToken)();
            (0, BankAccounts_1.goToWithdrawalAccountSetupStep)(CONST_1.default.BANK_ACCOUNT.STEP.REQUESTOR);
        }
        else {
            setOnfidoKey(Math.floor(Math.random() * 1000000));
        }
    };
    return (<InteractiveStepWrapper_1.default wrapperID={VerifyIdentity.displayName} headerTitle={translate('onfidoStep.verifyIdentity')} handleBackButtonPress={onBackButtonPress} startStepIndex={3} stepNames={CONST_1.default.BANK_ACCOUNT.STEP_NAMES} enableEdgeToEdgeBottomSafeAreaPadding>
            <FullPageOfflineBlockingView_1.default addBottomSafeAreaPadding>
                <ScrollView_1.default contentContainerStyle={styles.flex1}>
                    <Onfido_1.default key={onfidoKey} sdkToken={onfidoToken ?? ''} onUserExit={handleOnfidoUserExit} onError={handleOnfidoError} onSuccess={handleOnfidoSuccess}/>
                </ScrollView_1.default>
            </FullPageOfflineBlockingView_1.default>
        </InteractiveStepWrapper_1.default>);
}
VerifyIdentity.displayName = 'VerifyIdentity';
exports.default = VerifyIdentity;
