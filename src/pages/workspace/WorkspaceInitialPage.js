"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const HighlightableMenuItem_1 = require("@components/HighlightableMenuItem");
const Expensicons_1 = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const NavigationTabBar_1 = require("@components/Navigation/NavigationTabBar");
const NAVIGATION_TABS_1 = require("@components/Navigation/NavigationTabBar/NAVIGATION_TABS");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useCardFeeds_1 = require("@hooks/useCardFeeds");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const usePrevious_1 = require("@hooks/usePrevious");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSingleExecution_1 = require("@hooks/useSingleExecution");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWaitForNavigation_1 = require("@hooks/useWaitForNavigation");
const App_1 = require("@libs/actions/App");
const connections_1 = require("@libs/actions/connections");
const QuickbooksOnline_1 = require("@libs/actions/connections/QuickbooksOnline");
const Policy_1 = require("@libs/actions/Policy/Policy");
const CardUtils_1 = require("@libs/CardUtils");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const withPolicyAndFullscreenLoading_1 = require("./withPolicyAndFullscreenLoading");
function dismissError(policyID, pendingAction) {
    if (!policyID || pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD) {
        (0, PolicyUtils_1.goBackFromInvalidPolicy)();
        if (policyID) {
            (0, Policy_1.removeWorkspace)(policyID);
        }
    }
    else {
        (0, Policy_1.clearErrors)(policyID);
    }
}
function WorkspaceInitialPage({ policyDraft, policy: policyProp, route }) {
    const styles = (0, useThemeStyles_1.default)();
    const policy = policyDraft?.id ? policyDraft : policyProp;
    const workspaceAccountID = policy?.workspaceAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const hasPolicyCreationError = policy?.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD && !(0, EmptyObject_1.isEmptyObject)(policy.errors);
    const [cardFeeds] = (0, useCardFeeds_1.default)(policy?.id);
    const [allFeedsCards] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}`, { canBeMissing: true });
    const [connectionSyncProgress] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CONNECTION_SYNC_PROGRESS}${policy?.id}`, { canBeMissing: true });
    const [currentUserLogin] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { selector: (session) => session?.email, canBeMissing: false });
    const [policyCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${route.params?.policyID}`, { canBeMissing: true });
    const cardsDomainIDs = Object.values((0, CardUtils_1.getCompanyFeeds)(cardFeeds))
        .map((data) => data.domainID)
        .filter((domainID) => !!domainID);
    const { login, accountID } = (0, useCurrentUserPersonalDetails_1.default)();
    const hasSyncError = (0, PolicyUtils_1.shouldShowSyncError)(policy, (0, connections_1.isConnectionInProgress)(connectionSyncProgress, policy));
    const waitForNavigate = (0, useWaitForNavigation_1.default)();
    const { singleExecution, isExecuting } = (0, useSingleExecution_1.default)();
    const activeRoute = (0, native_1.useNavigationState)((state) => (0, native_1.findFocusedRoute)(state)?.name);
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const isUberForBusinessEnabled = isBetaEnabled(CONST_1.default.BETAS.UBER_FOR_BUSINESS);
    const { isOffline } = (0, useNetwork_1.default)();
    const wasRendered = (0, react_1.useRef)(false);
    const [allReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: true });
    const currentUserPolicyExpenseChatReportID = (0, ReportUtils_1.getPolicyExpenseChat)(accountID, policy?.id, allReports)?.reportID;
    const [currentUserPolicyExpenseChat] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${currentUserPolicyExpenseChatReportID}`, { canBeMissing: true });
    const { reportPendingAction } = (0, ReportUtils_1.getReportOfflinePendingActionAndErrors)(currentUserPolicyExpenseChat);
    const isPolicyExpenseChatEnabled = !!policy?.isPolicyExpenseChatEnabled;
    const prevPendingFields = (0, usePrevious_1.default)(policy?.pendingFields);
    const shouldDisplayLHB = !shouldUseNarrowLayout;
    const policyFeatureStates = (0, react_1.useMemo)(() => ({
        [CONST_1.default.POLICY.MORE_FEATURES.ARE_DISTANCE_RATES_ENABLED]: policy?.areDistanceRatesEnabled,
        [CONST_1.default.POLICY.MORE_FEATURES.ARE_WORKFLOWS_ENABLED]: policy?.areWorkflowsEnabled,
        [CONST_1.default.POLICY.MORE_FEATURES.ARE_CATEGORIES_ENABLED]: policy?.areCategoriesEnabled,
        [CONST_1.default.POLICY.MORE_FEATURES.ARE_TAGS_ENABLED]: policy?.areTagsEnabled,
        [CONST_1.default.POLICY.MORE_FEATURES.ARE_TAXES_ENABLED]: policy?.tax?.trackingEnabled,
        [CONST_1.default.POLICY.MORE_FEATURES.ARE_COMPANY_CARDS_ENABLED]: policy?.areCompanyCardsEnabled,
        [CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED]: !!policy?.areConnectionsEnabled || !(0, EmptyObject_1.isEmptyObject)(policy?.connections),
        [CONST_1.default.POLICY.MORE_FEATURES.ARE_EXPENSIFY_CARDS_ENABLED]: policy?.areExpensifyCardsEnabled,
        [CONST_1.default.POLICY.MORE_FEATURES.ARE_REPORT_FIELDS_ENABLED]: policy?.areReportFieldsEnabled,
        [CONST_1.default.POLICY.MORE_FEATURES.ARE_RULES_ENABLED]: policy?.areRulesEnabled,
        [CONST_1.default.POLICY.MORE_FEATURES.ARE_INVOICES_ENABLED]: policy?.areInvoicesEnabled,
        [CONST_1.default.POLICY.MORE_FEATURES.ARE_PER_DIEM_RATES_ENABLED]: policy?.arePerDiemRatesEnabled,
        [CONST_1.default.POLICY.MORE_FEATURES.ARE_RECEIPT_PARTNERS_ENABLED]: isUberForBusinessEnabled && (policy?.areReceiptPartnersEnabled ?? false),
    }), [policy, isUberForBusinessEnabled]);
    const fetchPolicyData = (0, react_1.useCallback)(() => {
        if (policyDraft?.id) {
            return;
        }
        (0, Policy_1.openPolicyInitialPage)(route.params.policyID);
    }, [policyDraft?.id, route.params.policyID]);
    (0, useNetwork_1.default)({ onReconnect: fetchPolicyData });
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        fetchPolicyData();
    }, [fetchPolicyData]));
    const policyID = policy?.id;
    const policyName = policy?.name ?? '';
    const hasMembersError = (0, PolicyUtils_1.shouldShowEmployeeListError)(policy);
    const hasPolicyCategoryError = (0, PolicyUtils_1.hasPolicyCategoriesError)(policyCategories);
    const hasGeneralSettingsError = !(0, EmptyObject_1.isEmptyObject)(policy?.errorFields?.name ?? {}) ||
        !(0, EmptyObject_1.isEmptyObject)(policy?.errorFields?.avatarURL ?? {}) ||
        !(0, EmptyObject_1.isEmptyObject)(policy?.errorFields?.outputCurrency ?? {}) ||
        !(0, EmptyObject_1.isEmptyObject)(policy?.errorFields?.address ?? {});
    const shouldShowProtectedItems = (0, PolicyUtils_1.isPolicyAdmin)(policy, login);
    const [featureStates, setFeatureStates] = (0, react_1.useState)(policyFeatureStates);
    const [highlightedFeature, setHighlightedFeature] = (0, react_1.useState)(undefined);
    const workspaceMenuItems = (0, react_1.useMemo)(() => {
        const protectedMenuItems = [];
        protectedMenuItems.push({
            translationKey: 'common.reports',
            icon: Expensicons_1.Document,
            action: singleExecution(waitForNavigate(() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_REPORTS.getRoute(policyID)))),
            screenName: SCREENS_1.default.WORKSPACE.REPORTS,
        });
        if (featureStates?.[CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED]) {
            protectedMenuItems.push({
                translationKey: 'workspace.common.accounting',
                icon: Expensicons_1.Sync,
                action: singleExecution(waitForNavigate(() => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING.getRoute(policyID)))),
                brickRoadIndicator: hasSyncError || (0, QuickbooksOnline_1.shouldShowQBOReimbursableExportDestinationAccountError)(policy) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined,
                screenName: SCREENS_1.default.WORKSPACE.ACCOUNTING.ROOT,
                highlighted: highlightedFeature === CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED,
            });
        }
        if (featureStates?.[CONST_1.default.POLICY.MORE_FEATURES.ARE_RECEIPT_PARTNERS_ENABLED]) {
            protectedMenuItems.push({
                translationKey: 'workspace.common.receiptPartners',
                icon: Expensicons_1.Receipt,
                action: singleExecution(waitForNavigate(() => {
                    Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_RECEIPT_PARTNERS.getRoute(policyID));
                })),
                screenName: SCREENS_1.default.WORKSPACE.RECEIPT_PARTNERS,
                highlighted: highlightedFeature === CONST_1.default.POLICY.MORE_FEATURES.ARE_RECEIPT_PARTNERS_ENABLED,
            });
        }
        if (featureStates?.[CONST_1.default.POLICY.MORE_FEATURES.ARE_CATEGORIES_ENABLED]) {
            protectedMenuItems.push({
                translationKey: 'workspace.common.categories',
                icon: Expensicons_1.Folder,
                action: singleExecution(waitForNavigate(() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_CATEGORIES.getRoute(policyID)))),
                brickRoadIndicator: hasPolicyCategoryError ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined,
                screenName: SCREENS_1.default.WORKSPACE.CATEGORIES,
                highlighted: highlightedFeature === CONST_1.default.POLICY.MORE_FEATURES.ARE_CATEGORIES_ENABLED,
            });
        }
        if (featureStates?.[CONST_1.default.POLICY.MORE_FEATURES.ARE_TAGS_ENABLED]) {
            protectedMenuItems.push({
                translationKey: 'workspace.common.tags',
                icon: Expensicons_1.Tag,
                action: singleExecution(waitForNavigate(() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_TAGS.getRoute(policyID)))),
                screenName: SCREENS_1.default.WORKSPACE.TAGS,
                highlighted: highlightedFeature === CONST_1.default.POLICY.MORE_FEATURES.ARE_TAGS_ENABLED,
            });
        }
        if (featureStates?.[CONST_1.default.POLICY.MORE_FEATURES.ARE_TAXES_ENABLED]) {
            protectedMenuItems.push({
                translationKey: 'workspace.common.taxes',
                icon: Expensicons_1.Coins,
                action: singleExecution(waitForNavigate(() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_TAXES.getRoute(policyID)))),
                screenName: SCREENS_1.default.WORKSPACE.TAXES,
                brickRoadIndicator: (0, PolicyUtils_1.shouldShowTaxRateError)(policy) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined,
                highlighted: highlightedFeature === CONST_1.default.POLICY.MORE_FEATURES.ARE_TAXES_ENABLED,
            });
        }
        if (featureStates?.[CONST_1.default.POLICY.MORE_FEATURES.ARE_WORKFLOWS_ENABLED]) {
            protectedMenuItems.push({
                translationKey: 'workspace.common.workflows',
                icon: Expensicons_1.Workflows,
                action: singleExecution(waitForNavigate(() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_WORKFLOWS.getRoute(policyID)))),
                screenName: SCREENS_1.default.WORKSPACE.WORKFLOWS,
                brickRoadIndicator: !(0, EmptyObject_1.isEmptyObject)(policy?.errorFields?.reimburser ?? {}) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined,
                highlighted: highlightedFeature === CONST_1.default.POLICY.MORE_FEATURES.ARE_WORKFLOWS_ENABLED,
            });
        }
        if (featureStates?.[CONST_1.default.POLICY.MORE_FEATURES.ARE_RULES_ENABLED]) {
            protectedMenuItems.push({
                translationKey: 'workspace.common.rules',
                icon: Expensicons_1.Feed,
                action: singleExecution(waitForNavigate(() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_RULES.getRoute(policyID)))),
                screenName: SCREENS_1.default.WORKSPACE.RULES,
                highlighted: highlightedFeature === CONST_1.default.POLICY.MORE_FEATURES.ARE_RULES_ENABLED,
            });
        }
        if (featureStates?.[CONST_1.default.POLICY.MORE_FEATURES.ARE_DISTANCE_RATES_ENABLED]) {
            protectedMenuItems.push({
                translationKey: 'workspace.common.distanceRates',
                icon: Expensicons_1.Car,
                action: singleExecution(waitForNavigate(() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_DISTANCE_RATES.getRoute(policyID)))),
                screenName: SCREENS_1.default.WORKSPACE.DISTANCE_RATES,
                highlighted: highlightedFeature === CONST_1.default.POLICY.MORE_FEATURES.ARE_DISTANCE_RATES_ENABLED,
            });
        }
        if (featureStates?.[CONST_1.default.POLICY.MORE_FEATURES.ARE_EXPENSIFY_CARDS_ENABLED]) {
            protectedMenuItems.push({
                translationKey: 'workspace.common.expensifyCard',
                icon: Expensicons_1.ExpensifyCard,
                action: singleExecution(waitForNavigate(() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD.getRoute(policyID)))),
                screenName: SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD,
                highlighted: highlightedFeature === CONST_1.default.POLICY.MORE_FEATURES.ARE_EXPENSIFY_CARDS_ENABLED,
            });
        }
        if (featureStates?.[CONST_1.default.POLICY.MORE_FEATURES.ARE_COMPANY_CARDS_ENABLED]) {
            const hasBrokenFeedConnection = (0, CardUtils_1.checkIfFeedConnectionIsBroken)((0, CardUtils_1.flatAllCardsList)(allFeedsCards, workspaceAccountID, cardsDomainIDs));
            protectedMenuItems.push({
                translationKey: 'workspace.common.companyCards',
                icon: Expensicons_1.CreditCard,
                action: singleExecution(waitForNavigate(() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_COMPANY_CARDS.getRoute(policyID)))),
                screenName: SCREENS_1.default.WORKSPACE.COMPANY_CARDS,
                brickRoadIndicator: hasBrokenFeedConnection ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined,
                highlighted: highlightedFeature === CONST_1.default.POLICY.MORE_FEATURES.ARE_COMPANY_CARDS_ENABLED,
            });
        }
        if (featureStates?.[CONST_1.default.POLICY.MORE_FEATURES.ARE_PER_DIEM_RATES_ENABLED]) {
            protectedMenuItems.push({
                translationKey: 'common.perDiem',
                icon: Expensicons_1.CalendarSolid,
                action: singleExecution(waitForNavigate(() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_PER_DIEM.getRoute(policyID)))),
                screenName: SCREENS_1.default.WORKSPACE.PER_DIEM,
                highlighted: highlightedFeature === CONST_1.default.POLICY.MORE_FEATURES.ARE_PER_DIEM_RATES_ENABLED,
            });
        }
        if (featureStates?.[CONST_1.default.POLICY.MORE_FEATURES.ARE_INVOICES_ENABLED]) {
            const currencyCode = policy?.outputCurrency ?? CONST_1.default.CURRENCY.USD;
            protectedMenuItems.push({
                translationKey: 'workspace.common.invoices',
                icon: Expensicons_1.InvoiceGeneric,
                action: singleExecution(waitForNavigate(() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_INVOICES.getRoute(policyID)))),
                screenName: SCREENS_1.default.WORKSPACE.INVOICES,
                badgeText: (0, CurrencyUtils_1.convertToDisplayString)(policy?.invoice?.bankAccount?.stripeConnectAccountBalance ?? 0, currencyCode),
                highlighted: highlightedFeature === CONST_1.default.POLICY.MORE_FEATURES.ARE_INVOICES_ENABLED,
            });
        }
        protectedMenuItems.push({
            translationKey: 'workspace.common.moreFeatures',
            icon: Expensicons_1.Gear,
            action: singleExecution(waitForNavigate(() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_MORE_FEATURES.getRoute(policyID)))),
            screenName: SCREENS_1.default.WORKSPACE.MORE_FEATURES,
        });
        const menuItems = [
            {
                translationKey: 'workspace.common.profile',
                icon: Expensicons_1.Building,
                action: singleExecution(waitForNavigate(() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_OVERVIEW.getRoute(policyID)))),
                brickRoadIndicator: hasGeneralSettingsError ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined,
                screenName: SCREENS_1.default.WORKSPACE.PROFILE,
            },
            {
                translationKey: 'workspace.common.members',
                icon: Expensicons_1.Users,
                action: singleExecution(waitForNavigate(() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_MEMBERS.getRoute(policyID)))),
                brickRoadIndicator: hasMembersError ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined,
                screenName: SCREENS_1.default.WORKSPACE.MEMBERS,
            },
            ...((0, PolicyUtils_1.isPaidGroupPolicy)(policy) && shouldShowProtectedItems ? protectedMenuItems : []),
        ];
        return menuItems;
    }, [
        featureStates,
        hasGeneralSettingsError,
        hasMembersError,
        hasPolicyCategoryError,
        hasSyncError,
        highlightedFeature,
        policy,
        policyID,
        shouldShowProtectedItems,
        singleExecution,
        waitForNavigate,
        allFeedsCards,
        cardsDomainIDs,
        workspaceAccountID,
    ]);
    // We only update feature states if they aren't pending.
    // These changes are made to synchronously change feature states along with AccessOrNotFoundWrapperComponent.
    (0, react_1.useEffect)(() => {
        setFeatureStates((currentFeatureStates) => {
            const newFeatureStates = {};
            let newlyEnabledFeature = null;
            Object.keys(policy?.pendingFields ?? {}).forEach((key) => {
                const isFeatureEnabled = (0, PolicyUtils_1.isPolicyFeatureEnabled)(policy, key);
                // Determine if this feature is newly enabled (wasn't enabled before but is now)
                if (isFeatureEnabled && !currentFeatureStates[key]) {
                    newlyEnabledFeature = key;
                }
                newFeatureStates[key] =
                    prevPendingFields?.[key] !== policy?.pendingFields?.[key] || isOffline || !policy?.pendingFields?.[key] ? isFeatureEnabled : currentFeatureStates[key];
            });
            // Only highlight the newly enabled feature
            if (newlyEnabledFeature) {
                setHighlightedFeature(newlyEnabledFeature);
            }
            return {
                ...policyFeatureStates,
                ...newFeatureStates,
            };
        });
    }, [policy, isOffline, policyFeatureStates, prevPendingFields]);
    (0, react_1.useEffect)(() => {
        (0, App_1.confirmReadyToOpenApp)();
    }, []);
    const prevPolicy = (0, usePrevious_1.default)(policy);
    const shouldShowPolicy = (0, react_1.useMemo)(() => (0, PolicyUtils_1.shouldShowPolicy)(policy, false, currentUserLogin), [policy, currentUserLogin]);
    const isPendingDelete = (0, PolicyUtils_1.isPendingDeletePolicy)(policy);
    const prevIsPendingDelete = (0, PolicyUtils_1.isPendingDeletePolicy)(prevPolicy);
    // We check isPendingDelete and prevIsPendingDelete to prevent the NotFound view from showing right after we delete the workspace
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowNotFoundPage = !shouldShowPolicy && (!isPendingDelete || prevIsPendingDelete);
    (0, react_1.useEffect)(() => {
        if ((0, EmptyObject_1.isEmptyObject)(prevPolicy) || prevIsPendingDelete || !isPendingDelete) {
            return;
        }
        (0, PolicyUtils_1.goBackFromInvalidPolicy)();
    }, [isPendingDelete, policy, prevIsPendingDelete, prevPolicy]);
    // We are checking if the user can access the route.
    // If user can't access the route, we are dismissing any modals that are open when the NotFound view is shown
    const canAccessRoute = activeRoute && (workspaceMenuItems.some((item) => item.screenName === activeRoute) || activeRoute === SCREENS_1.default.WORKSPACE.INITIAL);
    (0, react_1.useEffect)(() => {
        if (!shouldShowNotFoundPage && canAccessRoute) {
            return;
        }
        if (wasRendered.current) {
            return;
        }
        wasRendered.current = true;
        // We are dismissing any modals that are open when the NotFound view is shown
        Navigation_1.default.isNavigationReady().then(() => {
            Navigation_1.default.closeRHPFlow();
        });
    }, [canAccessRoute, shouldShowNotFoundPage]);
    const policyAvatar = (0, react_1.useMemo)(() => {
        if (!policy) {
            return { source: Expensicons_1.ExpensifyAppIcon, name: CONST_1.default.EXPENSIFY_ICON_NAME, type: CONST_1.default.ICON_TYPE_AVATAR };
        }
        const avatar = policy?.avatarURL ? policy.avatarURL : (0, ReportUtils_1.getDefaultWorkspaceAvatar)(policy?.name);
        return {
            source: avatar,
            name: policy?.name ?? '',
            type: CONST_1.default.ICON_TYPE_WORKSPACE,
            id: policy.id,
        };
    }, [policy]);
    const shouldShowNavigationTabBar = !shouldShowNotFoundPage;
    return (<ScreenWrapper_1.default testID={WorkspaceInitialPage.displayName} enableEdgeToEdgeBottomSafeAreaPadding={false} bottomContent={shouldShowNavigationTabBar && !shouldDisplayLHB && <NavigationTabBar_1.default selectedTab={NAVIGATION_TABS_1.default.WORKSPACES}/>}>
            <FullPageNotFoundView_1.default onBackButtonPress={Navigation_1.default.dismissModal} onLinkPress={Navigation_1.default.goBackToHome} shouldShow={shouldShowNotFoundPage} subtitleKey={shouldShowPolicy ? 'workspace.common.notAuthorized' : undefined} addBottomSafeAreaPadding shouldForceFullScreen shouldDisplaySearchRouter>
                <HeaderWithBackButton_1.default title={policyName} onBackButtonPress={() => Navigation_1.default.goBack(route.params?.backTo ?? ROUTES_1.default.WORKSPACES_LIST.route)} policyAvatar={policyAvatar} shouldDisplayHelpButton={shouldUseNarrowLayout}/>

                <ScrollView_1.default contentContainerStyle={[styles.flexColumn]}>
                    <OfflineWithFeedback_1.default pendingAction={policy?.pendingAction} onClose={() => dismissError(policyID, policy?.pendingAction)} errors={policy?.errors} errorRowStyles={[styles.ph5, styles.pv2]} shouldDisableStrikeThrough={false} shouldHideOnDelete={false}>
                        <react_native_1.View style={[styles.pb4, styles.mh3, styles.mt3]}>
                            {/*
            Ideally we should use MenuList component for MenuItems with singleExecution/Navigation actions.
            In this case where user can click on workspace avatar or menu items, we need to have a check for `isExecuting`. So, we are directly mapping menuItems.
        */}
                            {workspaceMenuItems.map((item) => (<HighlightableMenuItem_1.default key={item.translationKey} disabled={hasPolicyCreationError || isExecuting} interactive={!hasPolicyCreationError} title={translate(item.translationKey)} icon={item.icon} onPress={item.action} brickRoadIndicator={item.brickRoadIndicator} wrapperStyle={styles.sectionMenuItem} highlighted={!!item?.highlighted} focused={!!(item.screenName && activeRoute?.startsWith(item.screenName))} badgeText={item.badgeText} shouldIconUseAutoWidthStyle/>))}
                        </react_native_1.View>
                    </OfflineWithFeedback_1.default>
                    {isPolicyExpenseChatEnabled && !!currentUserPolicyExpenseChatReportID && (<react_native_1.View style={[styles.pb4, styles.mh3, styles.mt3]}>
                            <Text_1.default style={[styles.textSupporting, styles.fontSizeLabel, styles.ph2]}>{translate('workspace.common.submitExpense')}</Text_1.default>
                            <OfflineWithFeedback_1.default pendingAction={reportPendingAction}>
                                <MenuItem_1.default title={(0, ReportUtils_1.getReportName)(currentUserPolicyExpenseChat)} description={translate('workspace.common.workspace')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(currentUserPolicyExpenseChat?.reportID))} shouldShowRightIcon wrapperStyle={[styles.br2, styles.pl2, styles.pr0, styles.pv3, styles.mt1, styles.alignItemsCenter]} iconReportID={currentUserPolicyExpenseChatReportID}/>
                            </OfflineWithFeedback_1.default>
                        </react_native_1.View>)}
                </ScrollView_1.default>
                {shouldShowNavigationTabBar && shouldDisplayLHB && <NavigationTabBar_1.default selectedTab={NAVIGATION_TABS_1.default.WORKSPACES}/>}
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
WorkspaceInitialPage.displayName = 'WorkspaceInitialPage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(WorkspaceInitialPage);
