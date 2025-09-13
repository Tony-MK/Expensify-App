"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConfirmModal_1 = require("@components/ConfirmModal");
const DelegateNoAccessModalProvider_1 = require("@components/DelegateNoAccessModalProvider");
const FeatureList_1 = require("@components/FeatureList");
const Illustrations = require("@components/Icon/Illustrations");
const LockedAccountModalProvider_1 = require("@components/LockedAccountModalProvider");
const Text_1 = require("@components/Text");
const useDismissModalForUSD_1 = require("@hooks/useDismissModalForUSD");
const useExpensifyCardUkEuSupported_1 = require("@hooks/useExpensifyCardUkEuSupported");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const CardUtils_1 = require("@libs/CardUtils");
const ReimbursementAccountUtils_1 = require("@libs/ReimbursementAccountUtils");
const Navigation_1 = require("@navigation/Navigation");
const withPolicyAndFullscreenLoading_1 = require("@pages/workspace/withPolicyAndFullscreenLoading");
const WorkspacePageWithSections_1 = require("@pages/workspace/WorkspacePageWithSections");
const variables_1 = require("@styles/variables");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const expensifyCardFeatures = [
    {
        icon: Illustrations.MoneyReceipts,
        translationKey: 'workspace.moreFeatures.expensifyCard.feed.features.cashBack',
    },
    {
        icon: Illustrations.CreditCardsNew,
        translationKey: 'workspace.moreFeatures.expensifyCard.feed.features.unlimited',
    },
    {
        icon: Illustrations.MoneyWings,
        translationKey: 'workspace.moreFeatures.expensifyCard.feed.features.spend',
    },
];
function WorkspaceExpensifyCardPageEmptyState({ route, policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const [bankAccountList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BANK_ACCOUNT_LIST, { canBeMissing: false });
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const [isCurrencyModalOpen, setIsCurrencyModalOpen] = (0, useDismissModalForUSD_1.default)(policy?.outputCurrency);
    const { windowHeight } = (0, useWindowDimensions_1.default)();
    const { isActingAsDelegate, showDelegateNoAccessModal } = (0, react_1.useContext)(DelegateNoAccessModalProvider_1.DelegateNoAccessContext);
    const { isAccountLocked, showLockedAccountModal } = (0, react_1.useContext)(LockedAccountModalProvider_1.LockedAccountContext);
    const reimbursementAccountStatus = reimbursementAccount?.achData?.state ?? '';
    const isSetupUnfinished = (0, EmptyObject_1.isEmptyObject)(bankAccountList) && reimbursementAccountStatus && reimbursementAccountStatus !== CONST_1.default.BANK_ACCOUNT.STATE.OPEN;
    const isUkEuCurrencySupported = (0, useExpensifyCardUkEuSupported_1.default)(policy?.id);
    const eligibleBankAccounts = isUkEuCurrencySupported ? (0, CardUtils_1.getEligibleBankAccountsForUkEuCard)(bankAccountList, policy?.outputCurrency) : (0, CardUtils_1.getEligibleBankAccountsForCard)(bankAccountList);
    const startFlow = (0, react_1.useCallback)(() => {
        if (!eligibleBankAccounts.length || isSetupUnfinished) {
            Navigation_1.default.navigate(ROUTES_1.default.BANK_ACCOUNT_WITH_STEP_TO_OPEN.getRoute(policy?.id, ReimbursementAccountUtils_1.REIMBURSEMENT_ACCOUNT_ROUTE_NAMES.NEW, ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD.getRoute(policy?.id)));
        }
        else {
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_BANK_ACCOUNT.getRoute(policy?.id));
        }
    }, [eligibleBankAccounts.length, isSetupUnfinished, policy?.id]);
    const confirmCurrencyChangeAndHideModal = (0, react_1.useCallback)(() => {
        if (!policy) {
            return;
        }
        (0, Policy_1.updateGeneralSettings)(policy.id, policy.name, CONST_1.default.CURRENCY.USD);
        setIsCurrencyModalOpen(false);
        startFlow();
    }, [policy, startFlow, setIsCurrencyModalOpen]);
    return (<WorkspacePageWithSections_1.default shouldUseScrollView icon={Illustrations.HandCard} headerText={translate('workspace.common.expensifyCard')} route={route} showLoadingAsFirstRender={false} shouldShowOfflineIndicatorInWideScreen addBottomSafeAreaPadding>
            <react_native_1.View style={[styles.pt3, shouldUseNarrowLayout ? styles.workspaceSectionMobile : styles.workspaceSection, { minHeight: windowHeight - variables_1.default.contentHeaderHeight }]}>
                <FeatureList_1.default menuItems={isUkEuCurrencySupported ? expensifyCardFeatures.slice(1) : expensifyCardFeatures} title={translate('workspace.moreFeatures.expensifyCard.feed.title')} subtitle={translate('workspace.moreFeatures.expensifyCard.feed.subTitle')} ctaText={translate(isSetupUnfinished ? 'workspace.expensifyCard.finishSetup' : 'workspace.expensifyCard.issueNewCard')} ctaAccessibilityLabel={translate('workspace.moreFeatures.expensifyCard.feed.ctaTitle')} onCtaPress={() => {
            if (isActingAsDelegate) {
                showDelegateNoAccessModal();
                return;
            }
            if (isAccountLocked) {
                showLockedAccountModal();
                return;
            }
            if (!(policy?.outputCurrency === CONST_1.default.CURRENCY.USD || isUkEuCurrencySupported)) {
                setIsCurrencyModalOpen(true);
                return;
            }
            startFlow();
        }} illustrationBackgroundColor={theme.fallbackIconColor} illustration={Illustrations.ExpensifyCardIllustration} illustrationStyle={styles.expensifyCardIllustrationContainer} titleStyles={styles.textHeadlineH1}/>
                <ConfirmModal_1.default title={translate('workspace.common.expensifyCard')} isVisible={isCurrencyModalOpen} onConfirm={confirmCurrencyChangeAndHideModal} onCancel={() => setIsCurrencyModalOpen(false)} prompt={translate('workspace.bankAccount.updateCurrencyPrompt')} confirmText={translate('workspace.bankAccount.updateToUSD')} cancelText={translate('common.cancel')} danger/>
            </react_native_1.View>
            <react_native_1.View style={[shouldUseNarrowLayout ? styles.workspaceSectionMobile : styles.workspaceSection]}>
                <Text_1.default style={[styles.textMicroSupporting, styles.m5]}>
                    {translate(isUkEuCurrencySupported ? 'workspace.expensifyCard.euUkDisclaimer' : 'workspace.expensifyCard.disclaimer')}
                </Text_1.default>
            </react_native_1.View>
        </WorkspacePageWithSections_1.default>);
}
WorkspaceExpensifyCardPageEmptyState.displayName = 'WorkspaceExpensifyCardPageEmptyState';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(WorkspaceExpensifyCardPageEmptyState);
