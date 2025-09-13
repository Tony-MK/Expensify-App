"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const BlockingView_1 = require("@components/BlockingViews/BlockingView");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const Button_1 = require("@components/Button");
const DelegateNoAccessWrapper_1 = require("@components/DelegateNoAccessWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const BankIcons_1 = require("@components/Icon/BankIcons");
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const LottieAnimations_1 = require("@components/LottieAnimations");
const MenuItem_1 = require("@components/MenuItem");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const useBottomSafeSafeAreaPaddingStyle_1 = require("@hooks/useBottomSafeSafeAreaPaddingStyle");
const useExpensifyCardUkEuSupported_1 = require("@hooks/useExpensifyCardUkEuSupported");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWorkspaceAccountID_1 = require("@hooks/useWorkspaceAccountID");
const BankAccountUtils_1 = require("@libs/BankAccountUtils");
const CardUtils_1 = require("@libs/CardUtils");
const ReimbursementAccountUtils_1 = require("@libs/ReimbursementAccountUtils");
const Navigation_1 = require("@navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const variables_1 = require("@styles/variables");
const Card_1 = require("@userActions/Card");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function WorkspaceExpensifyCardBankAccounts({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [bankAccountsList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BANK_ACCOUNT_LIST, { canBeMissing: false });
    const policyID = route?.params?.policyID;
    const policy = (0, usePolicy_1.default)(policyID);
    const isUkEuCurrencySupported = (0, useExpensifyCardUkEuSupported_1.default)(policyID);
    const workspaceAccountID = (0, useWorkspaceAccountID_1.default)(policyID);
    const [cardBankAccountMetadata] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.EXPENSIFY_CARD_BANK_ACCOUNT_METADATA}${workspaceAccountID}`, { canBeMissing: true });
    const [cardOnWaitlist] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.NVP_EXPENSIFY_ON_CARD_WAITLIST}${policyID}`, { canBeMissing: true });
    const getVerificationState = () => {
        if (cardOnWaitlist) {
            return CONST_1.default.EXPENSIFY_CARD.VERIFICATION_STATE.ON_WAITLIST;
        }
        if (cardBankAccountMetadata?.isSuccess) {
            return CONST_1.default.EXPENSIFY_CARD.VERIFICATION_STATE.VERIFIED;
        }
        if (cardBankAccountMetadata?.isLoading) {
            return CONST_1.default.EXPENSIFY_CARD.VERIFICATION_STATE.LOADING;
        }
        return '';
    };
    const handleAddBankAccount = () => {
        Navigation_1.default.navigate(ROUTES_1.default.BANK_ACCOUNT_WITH_STEP_TO_OPEN.getRoute(policyID, ReimbursementAccountUtils_1.REIMBURSEMENT_ACCOUNT_ROUTE_NAMES.NEW, ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD.getRoute(policyID)));
    };
    const handleSelectBankAccount = (value) => {
        (0, Card_1.configureExpensifyCardsForPolicy)(policyID, value);
    };
    const renderBankOptions = () => {
        if (!bankAccountsList || (0, EmptyObject_1.isEmptyObject)(bankAccountsList)) {
            return null;
        }
        const eligibleBankAccounts = isUkEuCurrencySupported
            ? (0, CardUtils_1.getEligibleBankAccountsForUkEuCard)(bankAccountsList, policy?.outputCurrency)
            : (0, CardUtils_1.getEligibleBankAccountsForCard)(bankAccountsList);
        return eligibleBankAccounts.map((bankAccount) => {
            const bankName = (bankAccount.accountData?.addressName ?? '');
            const bankAccountNumber = bankAccount.accountData?.accountNumber ?? '';
            const bankAccountID = bankAccount.accountData?.bankAccountID ?? bankAccount?.methodID;
            const { icon, iconSize, iconStyles } = (0, BankIcons_1.default)({ bankName, styles });
            return (<MenuItem_1.default key={bankAccountID} title={bankName} description={`${translate('workspace.expensifyCard.accountEndingIn')} ${(0, BankAccountUtils_1.getLastFourDigits)(bankAccountNumber)}`} onPress={() => handleSelectBankAccount(bankAccountID)} icon={icon} iconHeight={iconSize} iconWidth={iconSize} iconStyles={iconStyles} shouldShowRightIcon displayInDefaultIconColor/>);
        });
    };
    const verificationState = getVerificationState();
    const isInVerificationState = !!verificationState;
    const bottomSafeAreaPaddingStyle = (0, useBottomSafeSafeAreaPaddingStyle_1.default)({ addBottomSafeAreaPadding: true });
    const renderVerificationStateView = () => {
        switch (verificationState) {
            case CONST_1.default.EXPENSIFY_CARD.VERIFICATION_STATE.LOADING:
                return (<BlockingView_1.default title={translate('workspace.expensifyCard.verifyingBankAccount')} subtitle={translate('workspace.expensifyCard.verifyingBankAccountDescription')} animation={LottieAnimations_1.default.ReviewingBankInfo} animationStyles={styles.loadingVBAAnimation} animationWebStyle={styles.loadingVBAAnimationWeb} subtitleStyle={styles.textLabelSupporting} containerStyle={styles.pb20} addBottomSafeAreaPadding/>);
            case CONST_1.default.EXPENSIFY_CARD.VERIFICATION_STATE.ON_WAITLIST:
                return (<>
                        <BlockingView_1.default title={translate('workspace.expensifyCard.oneMoreStep')} subtitle={translate('workspace.expensifyCard.oneMoreStepDescription')} icon={Illustrations.Puzzle} subtitleStyle={styles.textLabelSupporting} iconHeight={variables_1.default.cardPreviewHeight} iconWidth={variables_1.default.cardPreviewHeight}/>
                        <Button_1.default success large text={translate('workspace.expensifyCard.goToConcierge')} style={[styles.m5, bottomSafeAreaPaddingStyle]} pressOnEnter onPress={() => Navigation_1.default.navigate(ROUTES_1.default.CONCIERGE)}/>
                    </>);
            case CONST_1.default.EXPENSIFY_CARD.VERIFICATION_STATE.VERIFIED:
                return (<>
                        <BlockingView_1.default title={translate('workspace.expensifyCard.bankAccountVerified')} subtitle={translate('workspace.expensifyCard.bankAccountVerifiedDescription')} animation={LottieAnimations_1.default.Fireworks} animationStyles={styles.loadingVBAAnimation} animationWebStyle={styles.loadingVBAAnimationWeb} subtitleStyle={styles.textLabelSupporting}/>
                        <Button_1.default success large text={translate('workspace.expensifyCard.gotIt')} style={[styles.m5, bottomSafeAreaPaddingStyle]} pressOnEnter onPress={() => {
                        (0, Card_1.setIssueNewCardStepAndData)({ policyID, isChangeAssigneeDisabled: false });
                        Navigation_1.default.dismissModal();
                        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_ISSUE_NEW.getRoute(policyID));
                    }}/>
                    </>);
            default:
                return null;
        }
    };
    const getHeaderButtonText = () => {
        switch (verificationState) {
            case CONST_1.default.EXPENSIFY_CARD.VERIFICATION_STATE.ON_WAITLIST:
            case CONST_1.default.EXPENSIFY_CARD.VERIFICATION_STATE.LOADING:
                return translate('workspace.expensifyCard.verifyingHeader');
            case CONST_1.default.EXPENSIFY_CARD.VERIFICATION_STATE.VERIFIED:
                return translate('workspace.expensifyCard.bankAccountVerifiedHeader');
            default:
                return translate('workspace.expensifyCard.chooseBankAccount');
        }
    };
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_EXPENSIFY_CARDS_ENABLED}>
            <ScreenWrapper_1.default testID={WorkspaceExpensifyCardBankAccounts.displayName} enableEdgeToEdgeBottomSafeAreaPadding shouldEnablePickerAvoiding={false} shouldShowOfflineIndicator={false}>
                <DelegateNoAccessWrapper_1.default accessDeniedVariants={[CONST_1.default.DELEGATE.DENIED_ACCESS_VARIANTS.DELEGATE]}>
                    <HeaderWithBackButton_1.default shouldShowBackButton onBackButtonPress={() => Navigation_1.default.goBack()} title={getHeaderButtonText()}/>
                    {isInVerificationState && renderVerificationStateView()}
                    {!isInVerificationState && (<FullPageOfflineBlockingView_1.default addBottomSafeAreaPadding>
                            <react_native_1.View style={styles.flex1}>
                                <Text_1.default style={[styles.mh5, styles.mb3]}>{translate('workspace.expensifyCard.chooseExistingBank')}</Text_1.default>
                                {renderBankOptions()}
                                <MenuItem_1.default icon={Expensicons.Plus} title={translate('workspace.expensifyCard.addNewBankAccount')} onPress={handleAddBankAccount}/>
                            </react_native_1.View>
                        </FullPageOfflineBlockingView_1.default>)}
                </DelegateNoAccessWrapper_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceExpensifyCardBankAccounts.displayName = 'WorkspaceExpensifyCardBankAccounts';
exports.default = WorkspaceExpensifyCardBankAccounts;
