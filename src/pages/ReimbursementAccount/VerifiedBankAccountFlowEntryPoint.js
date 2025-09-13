"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Icon_1 = require("@components/Icon");
const Expensicons_1 = require("@components/Icon/Expensicons");
const LottieAnimations_1 = require("@components/LottieAnimations");
const MenuItem_1 = require("@components/MenuItem");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Section_1 = require("@components/Section");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const ValidateCodeActionModal_1 = require("@components/ValidateCodeActionModal");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const getPlaidDesktopMessage_1 = require("@libs/getPlaidDesktopMessage");
const ReimbursementAccountUtils_1 = require("@libs/ReimbursementAccountUtils");
const WorkspaceResetBankAccountModal_1 = require("@pages/workspace/WorkspaceResetBankAccountModal");
const BankAccounts_1 = require("@userActions/BankAccounts");
const Link_1 = require("@userActions/Link");
const ReimbursementAccount_1 = require("@userActions/ReimbursementAccount");
const User_1 = require("@userActions/User");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const bankInfoStepKeys = ReimbursementAccountForm_1.default.BANK_INFO_STEP;
function VerifiedBankAccountFlowEntryPoint({ policyName = '', policyID = '', onBackButtonPress, reimbursementAccount, onContinuePress, shouldShowContinueSetupButton, isNonUSDWorkspace, isValidateCodeActionModalVisible, toggleValidateCodeActionModal, setNonUSDBankAccountStep, setUSDBankAccountStep, setShouldShowContinueSetupButton, }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate, formatPhoneNumber } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const [isPlaidDisabled] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_PLAID_DISABLED, { canBeMissing: true });
    const [bankAccountList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BANK_ACCOUNT_LIST, { canBeMissing: true });
    const errors = reimbursementAccount?.errors ?? {};
    const pendingAction = reimbursementAccount?.pendingAction ?? null;
    const [loginList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.LOGIN_LIST, { canBeMissing: true });
    const [reimbursementAccountOptionPressed] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT_OPTION_PRESSED, { canBeMissing: true });
    const isAccountValidated = account?.validated ?? false;
    const contactMethod = account?.primaryLogin ?? '';
    const loginData = (0, react_1.useMemo)(() => loginList?.[contactMethod], [loginList, contactMethod]);
    const validateLoginError = (0, ErrorUtils_1.getEarliestErrorField)(loginData, 'validateLogin');
    const plaidDesktopMessage = (0, getPlaidDesktopMessage_1.default)();
    const bankAccountRoute = `${ROUTES_1.default.BANK_ACCOUNT_WITH_STEP_TO_OPEN.getRoute(policyID, ReimbursementAccountUtils_1.REIMBURSEMENT_ACCOUNT_ROUTE_NAMES.NEW, ROUTES_1.default.WORKSPACE_INITIAL.getRoute(policyID))}`;
    const personalBankAccounts = bankAccountList ? Object.keys(bankAccountList).filter((key) => bankAccountList[key].accountType === CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT) : [];
    const removeExistingBankAccountDetails = () => {
        const bankAccountData = {
            [bankInfoStepKeys.ROUTING_NUMBER]: '',
            [bankInfoStepKeys.ACCOUNT_NUMBER]: '',
            [bankInfoStepKeys.PLAID_MASK]: '',
            [bankInfoStepKeys.IS_SAVINGS]: undefined,
            [bankInfoStepKeys.BANK_NAME]: '',
            [bankInfoStepKeys.PLAID_ACCOUNT_ID]: '',
            [bankInfoStepKeys.PLAID_ACCESS_TOKEN]: '',
        };
        (0, BankAccounts_1.updateReimbursementAccountDraft)(bankAccountData);
    };
    /**
     * Prepares and redirects user to next step in the USD flow
     */
    const prepareNextStep = (0, react_1.useCallback)((setupType) => {
        (0, ReimbursementAccount_1.setBankAccountSubStep)(setupType);
        setUSDBankAccountStep(CONST_1.default.BANK_ACCOUNT.STEP.COUNTRY);
        (0, BankAccounts_1.goToWithdrawalAccountSetupStep)(CONST_1.default.BANK_ACCOUNT.STEP.COUNTRY);
    }, [setUSDBankAccountStep]);
    /**
     * optionPressed ref indicates what user selected before modal to validate account was displayed
     * In this hook we check if account was validated and then proceed with the option user selected
     * note: non USD accounts only have manual option available
     */
    (0, react_1.useEffect)(() => {
        if (!isAccountValidated) {
            return;
        }
        if (reimbursementAccountOptionPressed === CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.MANUAL) {
            if (isNonUSDWorkspace) {
                setNonUSDBankAccountStep(CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.COUNTRY);
                (0, ReimbursementAccount_1.setReimbursementAccountOptionPressed)(CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.NONE);
                return;
            }
            prepareNextStep(CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.MANUAL);
            (0, ReimbursementAccount_1.setReimbursementAccountOptionPressed)(CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.NONE);
        }
        else if (reimbursementAccountOptionPressed === CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.PLAID) {
            (0, BankAccounts_1.openPlaidView)();
            prepareNextStep(CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.PLAID);
            (0, ReimbursementAccount_1.setReimbursementAccountOptionPressed)(CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.NONE);
        }
    }, [isAccountValidated, isNonUSDWorkspace, prepareNextStep, reimbursementAccountOptionPressed, setNonUSDBankAccountStep]);
    const handleConnectManually = () => {
        if (!isAccountValidated) {
            (0, ReimbursementAccount_1.setReimbursementAccountOptionPressed)(CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.MANUAL);
            toggleValidateCodeActionModal?.(true);
            return;
        }
        if (isNonUSDWorkspace) {
            setNonUSDBankAccountStep(CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.COUNTRY);
            return;
        }
        removeExistingBankAccountDetails();
        prepareNextStep(CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.MANUAL);
    };
    const handleConnectPlaid = () => {
        if (isPlaidDisabled) {
            return;
        }
        if (!isAccountValidated) {
            (0, ReimbursementAccount_1.setReimbursementAccountOptionPressed)(CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.PLAID);
            toggleValidateCodeActionModal?.(true);
            return;
        }
        removeExistingBankAccountDetails();
        prepareNextStep(CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.PLAID);
    };
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} testID={VerifiedBankAccountFlowEntryPoint.displayName}>
            <HeaderWithBackButton_1.default title={translate('bankAccount.addBankAccount')} subtitle={policyName} onBackButtonPress={onBackButtonPress}/>

            <ScrollView_1.default style={styles.flex1}>
                <Section_1.default title={translate(shouldShowContinueSetupButton === true ? 'workspace.bankAccount.almostDone' : 'workspace.bankAccount.streamlinePayments')} titleStyles={styles.textHeadline} subtitle={translate(shouldShowContinueSetupButton === true ? 'workspace.bankAccount.youAreAlmostDone' : 'bankAccount.toGetStarted')} subtitleStyles={styles.textSupporting} subtitleMuted illustration={LottieAnimations_1.default.FastMoney} illustrationBackgroundColor={theme.fallbackIconColor} isCentralPane>
                    {!!plaidDesktopMessage && !isNonUSDWorkspace && (<react_native_1.View style={[styles.mt3, styles.flexRow, styles.justifyContentBetween]}>
                            <TextLink_1.default onPress={() => (0, Link_1.openExternalLinkWithToken)(bankAccountRoute)}>{translate(plaidDesktopMessage)}</TextLink_1.default>
                        </react_native_1.View>)}
                    {!!personalBankAccounts.length && (<react_native_1.View style={[styles.flexRow, styles.mt4, styles.alignItemsCenter, styles.pb1, styles.pt1]}>
                            <Icon_1.default src={Expensicons_1.Lightbulb} fill={theme.icon} additionalStyles={styles.mr2} medium/>
                            <Text_1.default style={[styles.textLabelSupportingNormal, styles.flex1]} suppressHighlighting>
                                {translate('workspace.bankAccount.connectBankAccountNote')}
                            </Text_1.default>
                        </react_native_1.View>)}
                    <react_native_1.View style={styles.mt4}>
                        {shouldShowContinueSetupButton === true ? (<OfflineWithFeedback_1.default errors={reimbursementAccount?.maxAttemptsReached ? (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('connectBankAccountStep.maxAttemptsReached') : (0, ErrorUtils_1.getLatestError)(errors)} errorRowStyles={styles.mt2} shouldShowErrorMessages canDismissError={!reimbursementAccount?.maxAttemptsReached} onClose={ReimbursementAccount_1.resetReimbursementAccount}>
                                <MenuItem_1.default title={translate('workspace.bankAccount.continueWithSetup')} icon={Expensicons_1.Connect} onPress={onContinuePress} shouldShowRightIcon outerWrapperStyle={shouldUseNarrowLayout ? styles.mhn5 : styles.mhn8} disabled={!!pendingAction || (!(0, EmptyObject_1.isEmptyObject)(errors) && !reimbursementAccount?.maxAttemptsReached)}/>
                                <MenuItem_1.default title={translate('workspace.bankAccount.startOver')} icon={Expensicons_1.RotateLeft} onPress={ReimbursementAccount_1.requestResetBankAccount} shouldShowRightIcon outerWrapperStyle={shouldUseNarrowLayout ? styles.mhn5 : styles.mhn8} disabled={!!pendingAction || (!(0, EmptyObject_1.isEmptyObject)(errors) && !reimbursementAccount?.maxAttemptsReached)}/>
                            </OfflineWithFeedback_1.default>) : (<>
                                {!isNonUSDWorkspace && !shouldShowContinueSetupButton && (<MenuItem_1.default title={translate('bankAccount.connectOnlineWithPlaid')} icon={Expensicons_1.Bank} disabled={!!isPlaidDisabled} onPress={handleConnectPlaid} shouldShowRightIcon outerWrapperStyle={shouldUseNarrowLayout ? styles.mhn5 : styles.mhn8}/>)}
                                <MenuItem_1.default title={translate('bankAccount.connectManually')} icon={Expensicons_1.Connect} onPress={handleConnectManually} shouldShowRightIcon outerWrapperStyle={shouldUseNarrowLayout ? styles.mhn5 : styles.mhn8}/>
                            </>)}
                    </react_native_1.View>
                </Section_1.default>
                <react_native_1.View style={[styles.mv0, styles.mh5, styles.flexRow, styles.justifyContentBetween]}>
                    <TextLink_1.default href={CONST_1.default.OLD_DOT_PUBLIC_URLS.PRIVACY_URL}>{translate('common.privacy')}</TextLink_1.default>
                    <PressableWithoutFeedback_1.default onPress={() => (0, Link_1.openExternalLink)(CONST_1.default.ENCRYPTION_AND_SECURITY_HELP_URL)} style={[styles.flexRow, styles.alignItemsCenter]} accessibilityLabel={translate('bankAccount.yourDataIsSecure')}>
                        <TextLink_1.default href={CONST_1.default.ENCRYPTION_AND_SECURITY_HELP_URL}>{translate('bankAccount.yourDataIsSecure')}</TextLink_1.default>
                        <react_native_1.View style={styles.ml1}>
                            <Icon_1.default src={Expensicons_1.Lock} fill={theme.link}/>
                        </react_native_1.View>
                    </PressableWithoutFeedback_1.default>
                </react_native_1.View>
            </ScrollView_1.default>

            {!!reimbursementAccount?.shouldShowResetModal && (<WorkspaceResetBankAccountModal_1.default reimbursementAccount={reimbursementAccount} isNonUSDWorkspace={isNonUSDWorkspace} setUSDBankAccountStep={setUSDBankAccountStep} setNonUSDBankAccountStep={setNonUSDBankAccountStep} setShouldShowContinueSetupButton={setShouldShowContinueSetupButton}/>)}

            <ValidateCodeActionModal_1.default title={translate('contacts.validateAccount')} descriptionPrimary={translate('contacts.featureRequiresValidate')} descriptionSecondary={translate('contacts.enterMagicCode', { contactMethod })} isVisible={!!isValidateCodeActionModalVisible} validateCodeActionErrorField="validateLogin" validatePendingAction={loginData?.pendingFields?.validateCodeSent} sendValidateCode={() => (0, User_1.requestValidateCodeAction)()} handleSubmitForm={(validateCode) => (0, User_1.validateSecondaryLogin)(loginList, contactMethod, validateCode, formatPhoneNumber)} validateError={!(0, EmptyObject_1.isEmptyObject)(validateLoginError) ? validateLoginError : (0, ErrorUtils_1.getLatestErrorField)(loginData, 'validateCodeSent')} clearError={() => (0, User_1.clearContactMethodErrors)(contactMethod, !(0, EmptyObject_1.isEmptyObject)(validateLoginError) ? 'validateLogin' : 'validateCodeSent')} onClose={() => toggleValidateCodeActionModal?.(false)}/>
        </ScreenWrapper_1.default>);
}
VerifiedBankAccountFlowEntryPoint.displayName = 'VerifiedBankAccountFlowEntryPoint';
exports.default = VerifiedBankAccountFlowEntryPoint;
