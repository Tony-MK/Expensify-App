"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const DelegateNoAccessModalProvider_1 = require("@components/DelegateNoAccessModalProvider");
const FeatureList_1 = require("@components/FeatureList");
const Illustrations_1 = require("@components/Icon/Illustrations");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CardUtils_1 = require("@libs/CardUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const withPolicyAndFullscreenLoading_1 = require("@pages/workspace/withPolicyAndFullscreenLoading");
const colors_1 = require("@styles/theme/colors");
const CompanyCards_1 = require("@userActions/CompanyCards");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const WorkspaceCompanyCardExpensifyCardPromotionBanner_1 = require("./WorkspaceCompanyCardExpensifyCardPromotionBanner");
const companyCardFeatures = [
    {
        icon: Illustrations_1.CreditCardsNew,
        translationKey: 'workspace.moreFeatures.companyCards.feed.features.support',
    },
    {
        icon: Illustrations_1.HandCard,
        translationKey: 'workspace.moreFeatures.companyCards.feed.features.assignCards',
    },
    {
        icon: Illustrations_1.MagnifyingGlassMoney,
        translationKey: 'workspace.moreFeatures.companyCards.feed.features.automaticImport',
    },
];
function WorkspaceCompanyCardPageEmptyState({ policy, shouldShowGBDisclaimer }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { isActingAsDelegate, showDelegateNoAccessModal } = (0, react_1.useContext)(DelegateNoAccessModalProvider_1.DelegateNoAccessContext);
    const [allWorkspaceCards] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST, { canBeMissing: true });
    const shouldShowExpensifyCardPromotionBanner = !(0, CardUtils_1.hasIssuedExpensifyCard)(policy?.workspaceAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID, allWorkspaceCards);
    const workspaceAccountID = policy?.workspaceAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const handleCtaPress = (0, react_1.useCallback)(() => {
        if (!policy?.id) {
            return;
        }
        if (isActingAsDelegate) {
            showDelegateNoAccessModal();
            return;
        }
        (0, CompanyCards_1.clearAddNewCardFlow)();
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_COMPANY_CARDS_ADD_NEW.getRoute(policy.id));
    }, [policy, isActingAsDelegate, showDelegateNoAccessModal]);
    return (<react_native_1.View style={[styles.mt3, shouldUseNarrowLayout ? styles.workspaceSectionMobile : styles.workspaceSection]}>
            {shouldShowExpensifyCardPromotionBanner && <WorkspaceCompanyCardExpensifyCardPromotionBanner_1.default policy={policy}/>}
            <FeatureList_1.default menuItems={companyCardFeatures} title={translate('workspace.moreFeatures.companyCards.feed.title')} subtitle={translate('workspace.moreFeatures.companyCards.subtitle')} ctaText={translate('workspace.companyCards.addCards')} ctaAccessibilityLabel={translate('workspace.companyCards.addCards')} onCtaPress={handleCtaPress} illustrationBackgroundColor={colors_1.default.blue700} illustration={Illustrations_1.CompanyCardsEmptyState} illustrationStyle={styles.emptyStateCardIllustration} illustrationContainerStyle={[styles.emptyStateCardIllustrationContainer, styles.justifyContentStart]} titleStyles={styles.textHeadlineH1} isButtonDisabled={workspaceAccountID === CONST_1.default.DEFAULT_NUMBER_ID}/>
            {!!shouldShowGBDisclaimer && <Text_1.default style={[styles.textMicroSupporting, styles.m5]}>{translate('workspace.companyCards.ukRegulation')}</Text_1.default>}
        </react_native_1.View>);
}
WorkspaceCompanyCardPageEmptyState.displayName = 'WorkspaceCompanyCardPageEmptyState';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(WorkspaceCompanyCardPageEmptyState);
