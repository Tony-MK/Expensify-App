"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const ConfirmModal_1 = require("@components/ConfirmModal");
const EmptyStateComponent_1 = require("@components/EmptyStateComponent");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const Expensicons = require("@components/Icon/Expensicons");
const LottieAnimations_1 = require("@components/LottieAnimations");
const NavigationTabBar_1 = require("@components/Navigation/NavigationTabBar");
const NAVIGATION_TABS_1 = require("@components/Navigation/NavigationTabBar/NAVIGATION_TABS");
const TopBar_1 = require("@components/Navigation/TopBar");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const Pressable_1 = require("@components/Pressable");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const SearchBar_1 = require("@components/SearchBar");
const WorkspaceRowSkeleton_1 = require("@components/Skeletons/WorkspaceRowSkeleton");
const SupportalActionRestrictedModal_1 = require("@components/SupportalActionRestrictedModal");
const Text_1 = require("@components/Text");
const useCardFeeds_1 = require("@hooks/useCardFeeds");
const useHandleBackButton_1 = require("@hooks/useHandleBackButton");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePayAndDowngrade_1 = require("@hooks/usePayAndDowngrade");
const usePermissions_1 = require("@hooks/usePermissions");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSearchResults_1 = require("@hooks/useSearchResults");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const connections_1 = require("@libs/actions/connections");
const Member_1 = require("@libs/actions/Policy/Member");
const Policy_1 = require("@libs/actions/Policy/Policy");
const Session_1 = require("@libs/actions/Session");
const CardUtils_1 = require("@libs/CardUtils");
const interceptAnonymousUser_1 = require("@libs/interceptAnonymousUser");
const usePreloadFullScreenNavigators_1 = require("@libs/Navigation/AppNavigator/usePreloadFullScreenNavigators");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const shouldRenderTransferOwnerButton_1 = require("@libs/shouldRenderTransferOwnerButton");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const colors_1 = require("@styles/theme/colors");
const variables_1 = require("@styles/variables");
const User_1 = require("@userActions/User");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const WorkspacesListRow_1 = require("./WorkspacesListRow");
/**
 * Dismisses the errors on one item
 */
function dismissWorkspaceError(policyID, pendingAction) {
    if (pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE) {
        (0, Policy_1.clearDeleteWorkspaceError)(policyID);
        return;
    }
    if (pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD) {
        (0, Policy_1.removeWorkspace)(policyID);
        return;
    }
    (0, Policy_1.clearErrors)(policyID);
}
function WorkspacesListPage() {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const isFocused = (0, native_1.useIsFocused)();
    const { shouldUseNarrowLayout, isMediumScreenWidth } = (0, useResponsiveLayout_1.default)();
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const [allConnectionSyncProgresses] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY_CONNECTION_SYNC_PROGRESS, { canBeMissing: true });
    const [policies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true });
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: true });
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: true });
    const [activePolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, { canBeMissing: true });
    const [isLoadingApp] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true });
    const [lastPaymentMethod] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD, { canBeMissing: true });
    const shouldShowLoadingIndicator = isLoadingApp && !isOffline;
    const route = (0, native_1.useRoute)();
    const [fundList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FUND_LIST, { canBeMissing: true });
    const [duplicateWorkspace] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DUPLICATE_WORKSPACE, { canBeMissing: false });
    const isDuplicatedWorkspaceEnabled = isBetaEnabled(CONST_1.default.BETAS.DUPLICATE_WORKSPACE);
    // This hook preloads the screens of adjacent tabs to make changing tabs faster.
    (0, usePreloadFullScreenNavigators_1.default)();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = (0, react_1.useState)(false);
    const [policyIDToDelete, setPolicyIDToDelete] = (0, react_1.useState)();
    const [policyNameToDelete, setPolicyNameToDelete] = (0, react_1.useState)();
    const { setIsDeletingPaidWorkspace, isLoadingBill } = (0, usePayAndDowngrade_1.default)(setIsDeleteModalOpen);
    const [loadingSpinnerIconIndex, setLoadingSpinnerIconIndex] = (0, react_1.useState)(null);
    const isLessThanMediumScreen = isMediumScreenWidth || shouldUseNarrowLayout;
    const shouldDisplayLHB = !shouldUseNarrowLayout;
    // We need this to update translation for deleting a workspace when it has third party card feeds or expensify card assigned.
    const workspaceAccountID = policies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyIDToDelete}`]?.workspaceAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const [cardFeeds] = (0, useCardFeeds_1.default)(policyIDToDelete);
    const [cardsList] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${workspaceAccountID}_${CONST_1.default.EXPENSIFY_CARD.BANK}`, {
        selector: CardUtils_1.filterInactiveCards,
        canBeMissing: true,
    });
    const flatlistRef = (0, react_1.useRef)(null);
    const [lastAccessedWorkspacePolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.LAST_ACCESSED_WORKSPACE_POLICY_ID, { canBeMissing: true });
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policyToDelete = (0, PolicyUtils_1.getPolicy)(policyIDToDelete);
    const hasCardFeedOrExpensifyCard = !(0, EmptyObject_1.isEmptyObject)(cardFeeds) ||
        !(0, EmptyObject_1.isEmptyObject)(cardsList) ||
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        ((policyToDelete?.areExpensifyCardsEnabled || policyToDelete?.areCompanyCardsEnabled) && policyToDelete?.workspaceAccountID);
    const isSupportalAction = (0, Session_1.isSupportAuthToken)();
    const [isSupportalActionRestrictedModalOpen, setIsSupportalActionRestrictedModalOpen] = (0, react_1.useState)(false);
    const hideSupportalModal = () => {
        setIsSupportalActionRestrictedModalOpen(false);
    };
    const confirmDeleteAndHideModal = () => {
        if (!policyIDToDelete || !policyNameToDelete) {
            return;
        }
        (0, Policy_1.deleteWorkspace)(policyIDToDelete, policyNameToDelete, lastAccessedWorkspacePolicyID, lastPaymentMethod);
        setIsDeleteModalOpen(false);
    };
    const shouldCalculateBillNewDot = (0, SubscriptionUtils_1.shouldCalculateBillNewDot)();
    const resetLoadingSpinnerIconIndex = (0, react_1.useCallback)(() => {
        setLoadingSpinnerIconIndex(null);
    }, []);
    const startChangeOwnershipFlow = (0, react_1.useCallback)((policyID) => {
        if (!policyID) {
            return;
        }
        (0, Member_1.clearWorkspaceOwnerChangeFlow)(policyID);
        (0, Member_1.requestWorkspaceOwnerChange)(policyID);
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_OWNER_CHANGE_CHECK.getRoute(policyID, session?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID, 'amountOwed', Navigation_1.default.getActiveRoute()));
    }, [session?.accountID]);
    /**
     * Gets the menu item for each workspace
     */
    const getMenuItem = (0, react_1.useCallback)(({ item, index }) => {
        const isAdmin = (0, PolicyUtils_1.isPolicyAdmin)(item, session?.email);
        const isOwner = item.ownerAccountID === session?.accountID;
        const isDefault = activePolicyID === item.policyID;
        const shouldAnimateInHighlight = duplicateWorkspace?.policyID === item.policyID;
        const threeDotsMenuItems = [
            {
                icon: Expensicons.Building,
                text: translate('workspace.common.goToWorkspace'),
                onSelected: item.action,
            },
        ];
        const defaultApprover = (0, PolicyUtils_1.getDefaultApprover)(policies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${item.policyID}`]);
        if (!(isAdmin || isOwner) && defaultApprover !== session?.email) {
            threeDotsMenuItems.push({
                icon: Expensicons.Exit,
                text: translate('common.leave'),
                onSelected: (0, Session_1.callFunctionIfActionIsAllowed)(() => (0, Policy_1.leaveWorkspace)(item.policyID)),
            });
        }
        if (isAdmin && isDuplicatedWorkspaceEnabled) {
            threeDotsMenuItems.push({
                icon: Expensicons.Copy,
                text: translate('workspace.common.duplicateWorkspace'),
                onSelected: () => (item.policyID ? Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_DUPLICATE.getRoute(item.policyID)) : undefined),
            });
        }
        if (!isDefault && !item?.isJoinRequestPending) {
            threeDotsMenuItems.push({
                icon: Expensicons.Star,
                text: translate('workspace.common.setAsDefault'),
                onSelected: () => {
                    if (!item.policyID || !activePolicyID) {
                        return;
                    }
                    (0, User_1.setNameValuePair)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, item.policyID, activePolicyID);
                },
            });
        }
        if (isOwner) {
            threeDotsMenuItems.push({
                icon: Expensicons.Trashcan,
                text: translate('workspace.common.delete'),
                shouldShowLoadingSpinnerIcon: loadingSpinnerIconIndex === index,
                onSelected: () => {
                    if (loadingSpinnerIconIndex !== null) {
                        return;
                    }
                    if (isSupportalAction) {
                        setIsSupportalActionRestrictedModalOpen(true);
                        return;
                    }
                    setPolicyIDToDelete(item.policyID);
                    setPolicyNameToDelete(item.title);
                    if (shouldCalculateBillNewDot) {
                        setIsDeletingPaidWorkspace(true);
                        (0, Policy_1.calculateBillNewDot)();
                        setLoadingSpinnerIconIndex(index);
                        return;
                    }
                    setIsDeleteModalOpen(true);
                },
                shouldKeepModalOpen: shouldCalculateBillNewDot,
                shouldCallAfterModalHide: !shouldCalculateBillNewDot,
            });
        }
        if (isAdmin && !isOwner && (0, shouldRenderTransferOwnerButton_1.default)(fundList)) {
            threeDotsMenuItems.push({
                icon: Expensicons.Transfer,
                text: translate('workspace.people.transferOwner'),
                onSelected: () => startChangeOwnershipFlow(item.policyID),
            });
        }
        return (<OfflineWithFeedback_1.default key={`${item.title}_${index}`} pendingAction={item.pendingAction} errorRowStyles={styles.ph5} onClose={item.dismissError} errors={item.errors} style={styles.mb2}>
                    <Pressable_1.PressableWithoutFeedback role={CONST_1.default.ROLE.BUTTON} accessibilityLabel="row" style={[styles.mh5]} disabled={item.disabled} onPress={item.action}>
                        {({ hovered }) => (<WorkspacesListRow_1.default title={item.title} policyID={item.policyID} menuItems={threeDotsMenuItems} workspaceIcon={item.icon} ownerAccountID={item.ownerAccountID} workspaceType={item.type} shouldAnimateInHighlight={shouldAnimateInHighlight} isJoinRequestPending={item?.isJoinRequestPending} rowStyles={hovered && styles.hoveredComponentBG} layoutWidth={isLessThanMediumScreen ? CONST_1.default.LAYOUT_WIDTH.NARROW : CONST_1.default.LAYOUT_WIDTH.WIDE} brickRoadIndicator={item.brickRoadIndicator} shouldDisableThreeDotsMenu={item.disabled} style={[item.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE ? styles.offlineFeedback.deleted : {}]} isDefault={isDefault} isLoadingBill={isLoadingBill} resetLoadingSpinnerIconIndex={resetLoadingSpinnerIconIndex}/>)}
                    </Pressable_1.PressableWithoutFeedback>
                </OfflineWithFeedback_1.default>);
    }, [
        session?.email,
        session?.accountID,
        activePolicyID,
        translate,
        policies,
        fundList,
        styles.mb2,
        styles.mh5,
        styles.ph5,
        duplicateWorkspace?.policyID,
        styles.hoveredComponentBG,
        styles.offlineFeedback.deleted,
        loadingSpinnerIconIndex,
        shouldCalculateBillNewDot,
        isSupportalAction,
        isDuplicatedWorkspaceEnabled,
        setIsDeletingPaidWorkspace,
        startChangeOwnershipFlow,
        isLessThanMediumScreen,
        isLoadingBill,
        resetLoadingSpinnerIconIndex,
    ]);
    const navigateToWorkspace = (0, react_1.useCallback)((policyID) => {
        // On the wide layout, we always want to open the Profile page when opening workspace settings from the list
        if (shouldUseNarrowLayout) {
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_INITIAL.getRoute(policyID));
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_OVERVIEW.getRoute(policyID));
    }, [shouldUseNarrowLayout]);
    /**
     * Add free policies (workspaces) to the list of menu items and returns the list of menu items
     */
    const workspaces = (0, react_1.useMemo)(() => {
        const reimbursementAccountBrickRoadIndicator = !(0, EmptyObject_1.isEmptyObject)(reimbursementAccount?.errors) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined;
        if ((0, EmptyObject_1.isEmptyObject)(policies)) {
            return [];
        }
        return Object.values(policies)
            .filter((policy) => (0, PolicyUtils_1.shouldShowPolicy)(policy, isOffline, session?.email))
            .map((policy) => {
            if (policy?.isJoinRequestPending && policy?.policyDetailsForNonMembers) {
                const policyInfo = Object.values(policy.policyDetailsForNonMembers).at(0);
                const id = Object.keys(policy.policyDetailsForNonMembers).at(0);
                return {
                    title: policyInfo.name,
                    icon: policyInfo?.avatar ? policyInfo.avatar : (0, ReportUtils_1.getDefaultWorkspaceAvatar)(policy.name),
                    disabled: true,
                    ownerAccountID: policyInfo.ownerAccountID,
                    type: policyInfo.type,
                    iconType: policyInfo?.avatar ? CONST_1.default.ICON_TYPE_AVATAR : CONST_1.default.ICON_TYPE_ICON,
                    iconFill: theme.textLight,
                    fallbackIcon: Expensicons.FallbackWorkspaceAvatar,
                    policyID: id,
                    role: CONST_1.default.POLICY.ROLE.USER,
                    errors: undefined,
                    action: () => null,
                    dismissError: () => null,
                    isJoinRequestPending: true,
                };
            }
            return {
                title: policy.name,
                icon: policy.avatarURL ? policy.avatarURL : (0, ReportUtils_1.getDefaultWorkspaceAvatar)(policy.name),
                action: () => navigateToWorkspace(policy.id),
                brickRoadIndicator: !(0, PolicyUtils_1.isPolicyAdmin)(policy)
                    ? undefined
                    : (reimbursementAccountBrickRoadIndicator ??
                        (0, PolicyUtils_1.getPolicyBrickRoadIndicatorStatus)(policy, (0, connections_1.isConnectionInProgress)(allConnectionSyncProgresses?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_CONNECTION_SYNC_PROGRESS}${policy.id}`], policy))),
                pendingAction: policy.pendingAction,
                errors: policy.errors,
                dismissError: () => dismissWorkspaceError(policy.id, policy.pendingAction),
                disabled: policy.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
                iconType: policy.avatarURL ? CONST_1.default.ICON_TYPE_AVATAR : CONST_1.default.ICON_TYPE_ICON,
                iconFill: theme.textLight,
                fallbackIcon: Expensicons.FallbackWorkspaceAvatar,
                policyID: policy.id,
                ownerAccountID: policy.ownerAccountID,
                role: policy.role,
                type: policy.type,
                employeeList: policy.employeeList,
            };
        });
    }, [reimbursementAccount?.errors, policies, isOffline, session?.email, allConnectionSyncProgresses, theme.textLight, navigateToWorkspace]);
    const filterWorkspace = (0, react_1.useCallback)((workspace, inputValue) => workspace.title.toLowerCase().includes(inputValue), []);
    const sortWorkspace = (0, react_1.useCallback)((workspaceItems) => workspaceItems.sort((a, b) => localeCompare(a.title, b.title)), [localeCompare]);
    const [inputValue, setInputValue, filteredWorkspaces] = (0, useSearchResults_1.default)(workspaces, filterWorkspace, sortWorkspace);
    (0, react_1.useEffect)(() => {
        if ((0, EmptyObject_1.isEmptyObject)(duplicateWorkspace) || !filteredWorkspaces.length || !isFocused) {
            return;
        }
        const duplicateWorkspaceIndex = filteredWorkspaces.findIndex((workspace) => workspace.policyID === duplicateWorkspace.policyID);
        if (duplicateWorkspaceIndex > 0) {
            flatlistRef.current?.scrollToIndex({ index: duplicateWorkspaceIndex, animated: false });
            react_native_1.InteractionManager.runAfterInteractions(() => {
                (0, Policy_1.clearDuplicateWorkspace)();
            });
        }
    }, [duplicateWorkspace, isFocused, filteredWorkspaces]);
    const listHeaderComponent = (<>
            {isLessThanMediumScreen && <react_native_1.View style={styles.mt3}/>}
            {workspaces.length > CONST_1.default.SEARCH_ITEM_LIMIT && (<SearchBar_1.default label={translate('workspace.common.findWorkspace')} inputValue={inputValue} onChangeText={setInputValue} shouldShowEmptyState={filteredWorkspaces.length === 0 && inputValue.length > 0}/>)}
            {!isLessThanMediumScreen && filteredWorkspaces.length > 0 && (<react_native_1.View style={[styles.flexRow, styles.gap5, styles.pt2, styles.pb3, styles.pr5, styles.pl10, styles.appBG]}>
                    <react_native_1.View style={[styles.flexRow, styles.flex2]}>
                        <Text_1.default numberOfLines={1} style={[styles.flexGrow1, styles.textLabelSupporting]}>
                            {translate('workspace.common.workspaceName')}
                        </Text_1.default>
                    </react_native_1.View>
                    <react_native_1.View style={[styles.flexRow, styles.flex1, styles.workspaceOwnerSectionTitle, styles.workspaceOwnerSectionMinWidth]}>
                        <Text_1.default numberOfLines={1} style={[styles.flexGrow1, styles.textLabelSupporting]}>
                            {translate('workspace.common.workspaceOwner')}
                        </Text_1.default>
                    </react_native_1.View>
                    <react_native_1.View style={[styles.flexRow, styles.flex1, styles.workspaceTypeSectionTitle]}>
                        <Text_1.default numberOfLines={1} style={[styles.flexGrow1, styles.textLabelSupporting]}>
                            {translate('workspace.common.workspaceType')}
                        </Text_1.default>
                    </react_native_1.View>
                    <react_native_1.View style={[styles.workspaceRightColumn, styles.mr2]}/>
                </react_native_1.View>)}
        </>);
    const getHeaderButton = () => (<Button_1.default accessibilityLabel={translate('workspace.new.newWorkspace')} text={translate('workspace.new.newWorkspace')} onPress={() => (0, interceptAnonymousUser_1.default)(() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_CONFIRMATION.getRoute(ROUTES_1.default.WORKSPACES_LIST.route)))} icon={Expensicons.Plus} style={[shouldUseNarrowLayout && [styles.flexGrow1, styles.mb3]]}/>);
    const onBackButtonPress = () => {
        Navigation_1.default.goBack(route.params?.backTo);
        return true;
    };
    (0, useHandleBackButton_1.default)(onBackButtonPress);
    if ((0, EmptyObject_1.isEmptyObject)(workspaces)) {
        return (<ScreenWrapper_1.default shouldEnablePickerAvoiding={false} shouldEnableMaxHeight testID={WorkspacesListPage.displayName} shouldShowOfflineIndicatorInWideScreen bottomContent={shouldUseNarrowLayout && <NavigationTabBar_1.default selectedTab={NAVIGATION_TABS_1.default.WORKSPACES}/>} enableEdgeToEdgeBottomSafeAreaPadding={false}>
                <react_native_1.View style={styles.topBarWrapper}>
                    <TopBar_1.default breadcrumbLabel={translate('common.workspaces')}/>
                </react_native_1.View>
                {shouldShowLoadingIndicator ? (<react_native_1.View style={[styles.flex1]}>
                        <FullscreenLoadingIndicator_1.default style={[styles.flex1, styles.pRelative]}/>
                    </react_native_1.View>) : (<ScrollView_1.default contentContainerStyle={[styles.pt2, styles.flexGrow1, styles.flexShrink0]}>
                        <EmptyStateComponent_1.default SkeletonComponent={WorkspaceRowSkeleton_1.default} headerMediaType={CONST_1.default.EMPTY_STATE_MEDIA.ANIMATION} headerMedia={LottieAnimations_1.default.WorkspacePlanet} title={translate('workspace.emptyWorkspace.title')} subtitle={translate('workspace.emptyWorkspace.subtitle')} titleStyles={styles.pt2} headerStyles={[styles.overflowHidden, StyleUtils.getBackgroundColorStyle(colors_1.default.pink800), StyleUtils.getHeight(variables_1.default.sectionIllustrationHeight)]} lottieWebViewStyles={styles.emptyWorkspaceListIllustrationStyle} headerContentStyles={styles.emptyWorkspaceListIllustrationStyle} buttons={[
                    {
                        success: true,
                        buttonAction: () => (0, interceptAnonymousUser_1.default)(() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_CONFIRMATION.getRoute(ROUTES_1.default.WORKSPACES_LIST.route))),
                        buttonText: translate('workspace.new.newWorkspace'),
                    },
                ]}/>
                    </ScrollView_1.default>)}
                {shouldDisplayLHB && <NavigationTabBar_1.default selectedTab={NAVIGATION_TABS_1.default.WORKSPACES}/>}
            </ScreenWrapper_1.default>);
    }
    return (<ScreenWrapper_1.default shouldEnablePickerAvoiding={false} shouldShowOfflineIndicatorInWideScreen testID={WorkspacesListPage.displayName} enableEdgeToEdgeBottomSafeAreaPadding={false} bottomContent={shouldUseNarrowLayout && <NavigationTabBar_1.default selectedTab={NAVIGATION_TABS_1.default.WORKSPACES}/>}>
            <react_native_1.View style={styles.flex1}>
                <TopBar_1.default breadcrumbLabel={translate('common.workspaces')}>{!shouldUseNarrowLayout && <react_native_1.View style={[styles.pr2]}>{getHeaderButton()}</react_native_1.View>}</TopBar_1.default>
                {shouldUseNarrowLayout && <react_native_1.View style={[styles.ph5, styles.pt2]}>{getHeaderButton()}</react_native_1.View>}
                <react_native_1.FlatList ref={flatlistRef} data={filteredWorkspaces} onScrollToIndexFailed={(info) => {
            flatlistRef.current?.scrollToOffset({
                offset: info.averageItemLength * info.index,
                animated: true,
            });
        }} renderItem={getMenuItem} ListHeaderComponent={listHeaderComponent} keyboardShouldPersistTaps="handled"/>
            </react_native_1.View>
            <ConfirmModal_1.default title={translate('workspace.common.delete')} isVisible={isDeleteModalOpen} onConfirm={confirmDeleteAndHideModal} onCancel={() => setIsDeleteModalOpen(false)} prompt={hasCardFeedOrExpensifyCard ? translate('workspace.common.deleteWithCardsConfirmation') : translate('workspace.common.deleteConfirmation')} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger/>
            <SupportalActionRestrictedModal_1.default isModalOpen={isSupportalActionRestrictedModalOpen} hideSupportalModal={hideSupportalModal}/>
            {shouldDisplayLHB && <NavigationTabBar_1.default selectedTab={NAVIGATION_TABS_1.default.WORKSPACES}/>}
        </ScreenWrapper_1.default>);
}
WorkspacesListPage.displayName = 'WorkspacesListPage';
exports.default = WorkspacesListPage;
