"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useSubStep_1 = require("@hooks/useSubStep");
const getPlaidOAuthReceivedRedirectURI_1 = require("@libs/getPlaidOAuthReceivedRedirectURI");
const getSubStepValues_1 = require("@pages/ReimbursementAccount/utils/getSubStepValues");
const BankAccounts_1 = require("@userActions/BankAccounts");
const ReimbursementAccount_1 = require("@userActions/ReimbursementAccount");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const Manual_1 = require("./subSteps/Manual");
const Plaid_1 = require("./subSteps/Plaid");
const BANK_INFO_STEP_KEYS = ReimbursementAccountForm_1.default.BANK_INFO_STEP;
const manualSubSteps = [Manual_1.default];
const plaidSubSteps = [Plaid_1.default];
const receivedRedirectURI = (0, getPlaidOAuthReceivedRedirectURI_1.default)();
function BankInfo({ onBackButtonPress, policyID, setUSDBankAccountStep }) {
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: false });
    const [plaidLinkToken] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PLAID_LINK_TOKEN, { canBeMissing: true });
    const [lastPaymentMethod] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD, { canBeMissing: true });
    const { translate } = (0, useLocalize_1.default)();
    const [redirectedFromPlaidToManual, setRedirectedFromPlaidToManual] = react_1.default.useState(false);
    const values = (0, react_1.useMemo)(() => (0, getSubStepValues_1.default)(BANK_INFO_STEP_KEYS, reimbursementAccountDraft, reimbursementAccount ?? {}), [reimbursementAccount, reimbursementAccountDraft]);
    let setupType = reimbursementAccount?.achData?.subStep ?? '';
    const shouldReinitializePlaidLink = plaidLinkToken && receivedRedirectURI && setupType !== CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.MANUAL;
    if (shouldReinitializePlaidLink) {
        setupType = CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.PLAID;
    }
    const bankAccountID = Number(reimbursementAccount?.achData?.bankAccountID);
    const submit = (0, react_1.useCallback)((submitData) => {
        const data = submitData;
        if (setupType === CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.MANUAL) {
            (0, BankAccounts_1.connectBankAccountManually)(bankAccountID, {
                [BANK_INFO_STEP_KEYS.ROUTING_NUMBER]: data[BANK_INFO_STEP_KEYS.ROUTING_NUMBER] ?? '',
                [BANK_INFO_STEP_KEYS.ACCOUNT_NUMBER]: data[BANK_INFO_STEP_KEYS.ACCOUNT_NUMBER] ?? '',
                [BANK_INFO_STEP_KEYS.BANK_NAME]: data[BANK_INFO_STEP_KEYS.BANK_NAME] ?? values?.bankName ?? '',
                [BANK_INFO_STEP_KEYS.PLAID_ACCOUNT_ID]: data[BANK_INFO_STEP_KEYS.PLAID_ACCOUNT_ID] ?? values?.plaidAccountID,
                [BANK_INFO_STEP_KEYS.PLAID_ACCESS_TOKEN]: data[BANK_INFO_STEP_KEYS.PLAID_ACCESS_TOKEN] ?? values?.plaidAccessToken ?? '',
                [BANK_INFO_STEP_KEYS.PLAID_MASK]: data[BANK_INFO_STEP_KEYS.PLAID_MASK] ?? values?.mask ?? '',
                [BANK_INFO_STEP_KEYS.IS_SAVINGS]: data[BANK_INFO_STEP_KEYS.IS_SAVINGS] ?? false,
            }, policyID);
        }
        else if (setupType === CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.PLAID) {
            (0, BankAccounts_1.connectBankAccountWithPlaid)(bankAccountID, {
                [BANK_INFO_STEP_KEYS.ROUTING_NUMBER]: data[BANK_INFO_STEP_KEYS.ROUTING_NUMBER] ?? '',
                [BANK_INFO_STEP_KEYS.ACCOUNT_NUMBER]: data[BANK_INFO_STEP_KEYS.ACCOUNT_NUMBER] ?? '',
                [BANK_INFO_STEP_KEYS.BANK_NAME]: data[BANK_INFO_STEP_KEYS.BANK_NAME] ?? '',
                [BANK_INFO_STEP_KEYS.PLAID_ACCOUNT_ID]: data[BANK_INFO_STEP_KEYS.PLAID_ACCOUNT_ID] ?? '',
                [BANK_INFO_STEP_KEYS.PLAID_ACCESS_TOKEN]: data[BANK_INFO_STEP_KEYS.PLAID_ACCESS_TOKEN] ?? '',
                [BANK_INFO_STEP_KEYS.PLAID_MASK]: data[BANK_INFO_STEP_KEYS.PLAID_MASK] ?? '',
                [BANK_INFO_STEP_KEYS.IS_SAVINGS]: data[BANK_INFO_STEP_KEYS.IS_SAVINGS] ?? false,
            }, policyID, lastPaymentMethod?.[policyID]);
        }
    }, [setupType, bankAccountID, lastPaymentMethod, values?.bankName, values?.plaidAccountID, values?.plaidAccessToken, values?.mask, policyID]);
    const bodyContent = setupType === CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.PLAID ? plaidSubSteps : manualSubSteps;
    const { componentToRender: SubStep, isEditing, screenIndex, nextScreen, prevScreen, moveTo } = (0, useSubStep_1.default)({ bodyContent, startFrom: 0, onFinished: submit });
    // Some services user connects to via Plaid return dummy account numbers and routing numbers e.g. Chase
    // In this case we need to redirect user to manual flow to enter real account number and routing number
    // and we need to do it only once so redirectedFromPlaidToManual flag is used
    (0, react_1.useEffect)(() => {
        if (redirectedFromPlaidToManual) {
            return;
        }
        if (setupType === CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.MANUAL && values.bankName !== '' && !redirectedFromPlaidToManual) {
            setRedirectedFromPlaidToManual(true);
        }
    }, [redirectedFromPlaidToManual, setupType, values]);
    const handleBackButtonPress = () => {
        if (screenIndex === 0) {
            onBackButtonPress();
            (0, ReimbursementAccount_1.hideBankAccountErrors)();
        }
        else {
            prevScreen();
        }
    };
    return (<InteractiveStepWrapper_1.default wrapperID={BankInfo.displayName} shouldEnablePickerAvoiding={false} handleBackButtonPress={handleBackButtonPress} headerTitle={translate('bankAccount.bankInfo')} startStepIndex={1} stepNames={CONST_1.default.BANK_ACCOUNT.STEP_NAMES}>
            <SubStep isEditing={isEditing} onNext={nextScreen} onMove={moveTo} setUSDBankAccountStep={setUSDBankAccountStep}/>
        </InteractiveStepWrapper_1.default>);
}
BankInfo.displayName = 'BankInfo';
exports.default = BankInfo;
