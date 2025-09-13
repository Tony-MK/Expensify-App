"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConfirmModal_1 = require("@components/ConfirmModal");
const DelegateNoAccessModalProvider_1 = require("@components/DelegateNoAccessModalProvider");
const FloatingActionButton_1 = require("@components/FloatingActionButton");
const Expensicons = require("@components/Icon/Expensicons");
const PopoverMenu_1 = require("@components/PopoverMenu");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const usePrevious_1 = require("@hooks/usePrevious");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const IOU_1 = require("@libs/actions/IOU");
const Link_1 = require("@libs/actions/Link");
const QuickActionNavigation_1 = require("@libs/actions/QuickActionNavigation");
const Report_1 = require("@libs/actions/Report");
const Session_1 = require("@libs/actions/Session");
const Tour_1 = require("@libs/actions/Tour");
const getIconForAction_1 = require("@libs/getIconForAction");
const interceptAnonymousUser_1 = require("@libs/interceptAnonymousUser");
const isSearchTopmostFullScreenRoute_1 = require("@libs/Navigation/helpers/isSearchTopmostFullScreenRoute");
const navigateAfterInteraction_1 = require("@libs/Navigation/navigateAfterInteraction");
const Navigation_1 = require("@libs/Navigation/Navigation");
const onboardingSelectors_1 = require("@libs/onboardingSelectors");
const openTravelDotLink_1 = require("@libs/openTravelDotLink");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const QuickActionUtils_1 = require("@libs/QuickActionUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const variables_1 = require("@styles/variables");
const HybridApp_1 = require("@userActions/HybridApp");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const mapOnyxCollectionItems_1 = require("@src/utils/mapOnyxCollectionItems");
const policySelector = (policy) => (policy && {
    type: policy.type,
    role: policy.role,
    id: policy.id,
    isPolicyExpenseChatEnabled: policy.isPolicyExpenseChatEnabled,
    pendingAction: policy.pendingAction,
    avatarURL: policy.avatarURL,
    name: policy.name,
    areInvoicesEnabled: policy.areInvoicesEnabled,
});
/**
 * Responsible for rendering the {@link PopoverMenu}, and the accompanying
 * FAB that can open or close the menu.
 */
function FloatingActionButtonAndPopover({ onHideCreateMenu, onShowCreateMenu, isTooltipAllowed, ref }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [isLoading = false] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true });
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: true });
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false, selector: (onyxSession) => ({ email: onyxSession?.email, accountID: onyxSession?.accountID }) });
    const [quickAction] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_QUICK_ACTION_GLOBAL_CREATE, { canBeMissing: true });
    const [quickActionReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${quickAction?.chatReportID}`, { canBeMissing: true });
    const [activePolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, { canBeMissing: true });
    const [allReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: true });
    const [allTransactionDrafts] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT, { canBeMissing: true });
    const [activePolicy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${activePolicyID}`, { canBeMissing: true });
    const policyChatForActivePolicy = (0, react_1.useMemo)(() => {
        if ((0, EmptyObject_1.isEmptyObject)(activePolicy) || !activePolicy?.isPolicyExpenseChatEnabled) {
            return {};
        }
        const policyChatsForActivePolicy = (0, ReportUtils_1.getWorkspaceChats)(activePolicyID, [session?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID], allReports);
        return policyChatsForActivePolicy.length > 0 ? policyChatsForActivePolicy.at(0) : {};
    }, [activePolicy, activePolicyID, session?.accountID, allReports]);
    const [quickActionPolicy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${quickActionReport?.policyID}`, { canBeMissing: true });
    const [allPolicies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { selector: (c) => (0, mapOnyxCollectionItems_1.default)(c, policySelector), canBeMissing: true });
    const [lastDistanceExpenseType] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_DISTANCE_EXPENSE_TYPE, { canBeMissing: true });
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const { isDelegateAccessRestricted, showDelegateNoAccessModal } = (0, react_1.useContext)(DelegateNoAccessModalProvider_1.DelegateNoAccessContext);
    const [isCreateMenuActive, setIsCreateMenuActive] = (0, react_1.useState)(false);
    const [modalVisible, setModalVisible] = (0, react_1.useState)(false);
    const fabRef = (0, react_1.useRef)(null);
    const { windowHeight } = (0, useWindowDimensions_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const isFocused = (0, native_1.useIsFocused)();
    const prevIsFocused = (0, usePrevious_1.default)(isFocused);
    const isReportArchived = (0, useReportIsArchived_1.default)(quickActionReport?.reportID);
    const { isOffline } = (0, useNetwork_1.default)();
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const isBlockedFromSpotnanaTravel = isBetaEnabled(CONST_1.default.BETAS.PREVENT_SPOTNANA_TRAVEL);
    const isManualDistanceTrackingEnabled = isBetaEnabled(CONST_1.default.BETAS.MANUAL_DISTANCE);
    const [primaryLogin] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { selector: (account) => account?.primaryLogin, canBeMissing: true });
    const primaryContactMethod = primaryLogin ?? session?.email ?? '';
    const [travelSettings] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_TRAVEL_SETTINGS, { canBeMissing: true });
    const canSendInvoice = (0, react_1.useMemo)(() => (0, PolicyUtils_1.canSendInvoice)(allPolicies, session?.email), [allPolicies, session?.email]);
    const isValidReport = !((0, EmptyObject_1.isEmptyObject)(quickActionReport) || isReportArchived);
    const [introSelected] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_INTRO_SELECTED, { canBeMissing: true });
    const [hasSeenTour = false] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ONBOARDING, {
        selector: onboardingSelectors_1.hasSeenTourSelector,
        canBeMissing: true,
    });
    const [tryNewDot] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_TRY_NEW_DOT, { selector: onboardingSelectors_1.tryNewDotOnyxSelector, canBeMissing: true });
    const [isUserPaidPolicyMember = false] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, {
        canBeMissing: true,
        selector: (policies) => Object.values(policies ?? {}).some((policy) => (0, PolicyUtils_1.isPaidGroupPolicy)(policy) && (0, PolicyUtils_1.isPolicyMember)(policy, currentUserPersonalDetails.login)),
    });
    const groupPoliciesWithChatEnabled = (0, PolicyUtils_1.getGroupPaidPoliciesWithExpenseChatEnabled)();
    /**
     * There are scenarios where users who have not yet had their group workspace-chats in NewDot (isPolicyExpenseChatEnabled). In those scenarios, things can get confusing if they try to submit/track expenses. To address this, we block them from Creating, Tracking, Submitting expenses from NewDot if they are:
     * 1. on at least one group policy
     * 2. none of the group policies they are a member of have isPolicyExpenseChatEnabled=true
     */
    const shouldRedirectToExpensifyClassic = (0, react_1.useMemo)(() => {
        return (0, PolicyUtils_1.areAllGroupPoliciesExpenseChatDisabled)(allPolicies ?? {});
    }, [allPolicies]);
    const shouldShowCreateReportOption = shouldRedirectToExpensifyClassic || groupPoliciesWithChatEnabled.length > 0;
    const shouldShowNewWorkspaceButton = Object.values(allPolicies ?? {}).every((policy) => !(0, PolicyUtils_1.shouldShowPolicy)(policy, !!isOffline, session?.email));
    const quickActionAvatars = (0, react_1.useMemo)(() => {
        if (isValidReport) {
            const avatars = (0, ReportUtils_1.getIcons)(quickActionReport, personalDetails, null, undefined, undefined, undefined, undefined, isReportArchived);
            return avatars.length <= 1 || (0, ReportUtils_1.isPolicyExpenseChat)(quickActionReport) ? avatars : avatars.filter((avatar) => avatar.id !== session?.accountID);
        }
        if (!(0, EmptyObject_1.isEmptyObject)(policyChatForActivePolicy)) {
            return (0, ReportUtils_1.getIcons)(policyChatForActivePolicy, personalDetails, null, undefined, undefined, undefined, undefined, isReportArchived);
        }
        return [];
        // Policy is needed as a dependency in order to update the shortcut details when the workspace changes
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [personalDetails, session?.accountID, quickActionReport, quickActionPolicy, policyChatForActivePolicy, isReportArchived, isValidReport]);
    const quickActionTitle = (0, react_1.useMemo)(() => {
        if ((0, EmptyObject_1.isEmptyObject)(quickActionReport)) {
            return '';
        }
        if (quickAction?.action === CONST_1.default.QUICK_ACTIONS.SEND_MONEY && quickActionAvatars.length > 0) {
            const accountID = quickActionAvatars.at(0)?.id ?? CONST_1.default.DEFAULT_NUMBER_ID;
            const name = (0, ReportUtils_1.getDisplayNameForParticipant)({ accountID: Number(accountID), shouldUseShortForm: true }) ?? '';
            return translate('quickAction.paySomeone', { name });
        }
        const titleKey = (0, QuickActionUtils_1.getQuickActionTitle)(quickAction?.action ?? '');
        return titleKey ? translate(titleKey) : '';
    }, [quickAction, translate, quickActionAvatars, quickActionReport]);
    const hideQABSubtitle = (0, react_1.useMemo)(() => {
        if (!isValidReport) {
            return true;
        }
        if (quickActionAvatars.length === 0) {
            return false;
        }
        const displayName = personalDetails?.[quickActionAvatars.at(0)?.id ?? CONST_1.default.DEFAULT_NUMBER_ID]?.firstName ?? '';
        return quickAction?.action === CONST_1.default.QUICK_ACTIONS.SEND_MONEY && displayName.length === 0;
    }, [isValidReport, quickActionAvatars, personalDetails, quickAction?.action]);
    const quickActionSubtitle = (0, react_1.useMemo)(() => {
        return !hideQABSubtitle ? ((0, ReportUtils_1.getReportName)(quickActionReport) ?? translate('quickAction.updateDestination')) : '';
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hideQABSubtitle, personalDetails, quickAction?.action, quickActionPolicy?.name, quickActionReport, translate]);
    const selectOption = (0, react_1.useCallback)((onSelected, shouldRestrictAction) => {
        if (shouldRestrictAction && quickActionReport?.policyID && (0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(quickActionReport.policyID)) {
            Navigation_1.default.navigate(ROUTES_1.default.RESTRICTED_ACTION.getRoute(quickActionReport.policyID));
            return;
        }
        onSelected();
    }, [quickActionReport?.policyID]);
    const startScan = (0, react_1.useCallback)(() => {
        (0, interceptAnonymousUser_1.default)(() => {
            if (shouldRedirectToExpensifyClassic) {
                setModalVisible(true);
                return;
            }
            // Start the scan flow directly
            (0, IOU_1.startMoneyRequest)(CONST_1.default.IOU.TYPE.CREATE, (0, ReportUtils_1.generateReportID)(), CONST_1.default.IOU.REQUEST_TYPE.SCAN, false, undefined, allTransactionDrafts);
        });
    }, [shouldRedirectToExpensifyClassic, allTransactionDrafts]);
    /**
     * Check if LHN status changed from active to inactive.
     * Used to close already opened FAB menu when open any other pages (i.e. Press Command + K on web).
     */
    const didScreenBecomeInactive = (0, react_1.useCallback)(() => 
    // When any other page is opened over LHN
    !isFocused && prevIsFocused, [isFocused, prevIsFocused]);
    /**
     * Method called when we click the floating action button
     */
    const showCreateMenu = (0, react_1.useCallback)(() => {
        if (!isFocused && shouldUseNarrowLayout) {
            return;
        }
        setIsCreateMenuActive(true);
        onShowCreateMenu?.();
    }, 
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    [isFocused, shouldUseNarrowLayout]);
    /**
     * Method called either when:
     * - Pressing the floating action button to open the CreateMenu modal
     * - Selecting an item on CreateMenu or closing it by clicking outside of the modal component
     */
    const hideCreateMenu = (0, react_1.useCallback)(() => {
        if (!isCreateMenuActive) {
            return;
        }
        setIsCreateMenuActive(false);
        onHideCreateMenu?.();
    }, 
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    [isCreateMenuActive]);
    (0, react_1.useEffect)(() => {
        if (!didScreenBecomeInactive()) {
            return;
        }
        // Hide menu manually when other pages are opened using shortcut key
        hideCreateMenu();
    }, [didScreenBecomeInactive, hideCreateMenu]);
    (0, react_1.useImperativeHandle)(ref, () => ({
        hideCreateMenu() {
            hideCreateMenu();
        },
    }));
    const toggleCreateMenu = () => {
        if (isCreateMenuActive) {
            hideCreateMenu();
        }
        else {
            showCreateMenu();
        }
    };
    const expenseMenuItems = (0, react_1.useMemo)(() => {
        return [
            {
                icon: (0, getIconForAction_1.default)(CONST_1.default.IOU.TYPE.CREATE),
                text: translate('iou.createExpense'),
                testID: 'create-expense',
                shouldCallAfterModalHide: shouldRedirectToExpensifyClassic || shouldUseNarrowLayout,
                onSelected: () => (0, interceptAnonymousUser_1.default)(() => {
                    if (shouldRedirectToExpensifyClassic) {
                        setModalVisible(true);
                        return;
                    }
                    (0, IOU_1.startMoneyRequest)(CONST_1.default.IOU.TYPE.CREATE, 
                    // When starting to create an expense from the global FAB, there is not an existing report yet. A random optimistic reportID is generated and used
                    // for all of the routes in the creation flow.
                    (0, ReportUtils_1.generateReportID)(), undefined, undefined, undefined, allTransactionDrafts);
                }),
            },
        ];
    }, [translate, shouldRedirectToExpensifyClassic, shouldUseNarrowLayout, allTransactionDrafts]);
    const quickActionMenuItems = (0, react_1.useMemo)(() => {
        // Define common properties in baseQuickAction
        const baseQuickAction = {
            label: translate('quickAction.header'),
            labelStyle: [styles.pt3, styles.pb2],
            isLabelHoverable: false,
            numberOfLinesDescription: 1,
            tooltipAnchorAlignment: {
                vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
                horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT,
            },
            shouldTeleportPortalToModalLayer: true,
        };
        if (quickAction?.action) {
            if (!(0, QuickActionUtils_1.isQuickActionAllowed)(quickAction, quickActionReport, quickActionPolicy, isReportArchived)) {
                return [];
            }
            const onSelected = () => {
                (0, interceptAnonymousUser_1.default)(() => {
                    if (quickAction?.action === CONST_1.default.QUICK_ACTIONS.SEND_MONEY && isDelegateAccessRestricted) {
                        showDelegateNoAccessModal();
                        return;
                    }
                    (0, QuickActionNavigation_1.navigateToQuickAction)(isValidReport, quickAction, selectOption, isManualDistanceTrackingEnabled);
                });
            };
            return [
                {
                    ...baseQuickAction,
                    icon: (0, QuickActionUtils_1.getQuickActionIcon)(quickAction?.action),
                    text: quickActionTitle,
                    rightIconAccountID: quickActionAvatars.at(0)?.id ?? CONST_1.default.DEFAULT_NUMBER_ID,
                    description: quickActionSubtitle,
                    onSelected,
                    shouldCallAfterModalHide: shouldUseNarrowLayout,
                    rightIconReportID: quickActionReport?.reportID,
                },
            ];
        }
        if (!(0, EmptyObject_1.isEmptyObject)(policyChatForActivePolicy)) {
            const onSelected = () => {
                (0, interceptAnonymousUser_1.default)(() => {
                    if (policyChatForActivePolicy?.policyID && (0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(policyChatForActivePolicy.policyID)) {
                        Navigation_1.default.navigate(ROUTES_1.default.RESTRICTED_ACTION.getRoute(policyChatForActivePolicy.policyID));
                        return;
                    }
                    const quickActionReportID = policyChatForActivePolicy?.reportID || (0, ReportUtils_1.generateReportID)();
                    (0, IOU_1.startMoneyRequest)(CONST_1.default.IOU.TYPE.SUBMIT, quickActionReportID, CONST_1.default.IOU.REQUEST_TYPE.SCAN, true, undefined, allTransactionDrafts);
                });
            };
            return [
                {
                    ...baseQuickAction,
                    icon: Expensicons.ReceiptScan,
                    text: translate('quickAction.scanReceipt'),
                    description: (0, ReportUtils_1.getReportName)(policyChatForActivePolicy),
                    shouldCallAfterModalHide: shouldUseNarrowLayout,
                    onSelected,
                    rightIconReportID: policyChatForActivePolicy?.reportID,
                },
            ];
        }
        return [];
    }, [
        translate,
        styles.pt3,
        styles.pb2,
        quickActionAvatars,
        quickAction,
        policyChatForActivePolicy,
        quickActionTitle,
        quickActionSubtitle,
        quickActionPolicy,
        quickActionReport,
        isValidReport,
        selectOption,
        shouldUseNarrowLayout,
        isDelegateAccessRestricted,
        showDelegateNoAccessModal,
        isReportArchived,
        isManualDistanceTrackingEnabled,
        allTransactionDrafts,
    ]);
    const isTravelEnabled = (0, react_1.useMemo)(() => {
        if (!!isBlockedFromSpotnanaTravel || !primaryContactMethod || expensify_common_1.Str.isSMSLogin(primaryContactMethod) || !(0, PolicyUtils_1.isPaidGroupPolicy)(activePolicy)) {
            return false;
        }
        const isPolicyProvisioned = activePolicy?.travelSettings?.spotnanaCompanyID ?? activePolicy?.travelSettings?.associatedTravelDomainAccountID;
        return activePolicy?.travelSettings?.hasAcceptedTerms ?? (travelSettings?.hasAcceptedTerms && isPolicyProvisioned);
    }, [activePolicy, isBlockedFromSpotnanaTravel, primaryContactMethod, travelSettings?.hasAcceptedTerms]);
    const openTravel = (0, react_1.useCallback)(() => {
        if (isTravelEnabled) {
            (0, openTravelDotLink_1.openTravelDotLink)(activePolicy?.id);
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.TRAVEL_MY_TRIPS);
    }, [activePolicy, isTravelEnabled]);
    const menuItems = [
        ...expenseMenuItems,
        ...(isManualDistanceTrackingEnabled
            ? [
                {
                    icon: Expensicons.Location,
                    text: translate('iou.trackDistance'),
                    shouldCallAfterModalHide: shouldUseNarrowLayout,
                    onSelected: () => {
                        (0, interceptAnonymousUser_1.default)(() => {
                            if (shouldRedirectToExpensifyClassic) {
                                setModalVisible(true);
                                return;
                            }
                            // Start the flow to start tracking a distance request
                            (0, IOU_1.startDistanceRequest)(CONST_1.default.IOU.TYPE.CREATE, 
                            // When starting to create an expense from the global FAB, there is not an existing report yet. A random optimistic reportID is generated and used
                            // for all of the routes in the creation flow.
                            (0, ReportUtils_1.generateReportID)(), lastDistanceExpenseType);
                        });
                    },
                },
            ]
            : []),
        ...(shouldShowCreateReportOption
            ? [
                {
                    icon: Expensicons.Document,
                    text: translate('report.newReport.createReport'),
                    shouldCallAfterModalHide: shouldUseNarrowLayout,
                    onSelected: () => {
                        (0, interceptAnonymousUser_1.default)(() => {
                            if (shouldRedirectToExpensifyClassic) {
                                setModalVisible(true);
                                return;
                            }
                            let workspaceIDForReportCreation;
                            if (activePolicy && activePolicy.isPolicyExpenseChatEnabled && (0, PolicyUtils_1.isPaidGroupPolicy)(activePolicy)) {
                                // If the user's default workspace is a paid group workspace with chat enabled, we create a report with it by default
                                workspaceIDForReportCreation = activePolicyID;
                            }
                            else if (groupPoliciesWithChatEnabled.length === 1) {
                                // If the user has only one paid group workspace with chat enabled, we create a report with it
                                workspaceIDForReportCreation = groupPoliciesWithChatEnabled.at(0)?.id;
                            }
                            if (!workspaceIDForReportCreation || ((0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(workspaceIDForReportCreation) && groupPoliciesWithChatEnabled.length > 1)) {
                                // If we couldn't guess the workspace to create the report, or a guessed workspace is past it's grace period and we have other workspaces to choose from
                                Navigation_1.default.navigate(ROUTES_1.default.NEW_REPORT_WORKSPACE_SELECTION);
                                return;
                            }
                            if (!(0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(workspaceIDForReportCreation)) {
                                const createdReportID = (0, Report_1.createNewReport)(currentUserPersonalDetails, workspaceIDForReportCreation);
                                Navigation_1.default.setNavigationActionToMicrotaskQueue(() => {
                                    Navigation_1.default.navigate((0, isSearchTopmostFullScreenRoute_1.default)()
                                        ? ROUTES_1.default.SEARCH_MONEY_REQUEST_REPORT.getRoute({ reportID: createdReportID, backTo: Navigation_1.default.getActiveRoute() })
                                        : ROUTES_1.default.REPORT_WITH_ID.getRoute(createdReportID, undefined, undefined, Navigation_1.default.getActiveRoute()));
                                });
                            }
                            else {
                                Navigation_1.default.navigate(ROUTES_1.default.RESTRICTED_ACTION.getRoute(workspaceIDForReportCreation));
                            }
                        });
                    },
                },
            ]
            : []),
        {
            icon: Expensicons.ChatBubble,
            text: translate('sidebarScreen.fabNewChat'),
            shouldCallAfterModalHide: shouldUseNarrowLayout,
            onSelected: () => (0, interceptAnonymousUser_1.default)(Report_1.startNewChat),
        },
        ...(canSendInvoice
            ? [
                {
                    icon: Expensicons.InvoiceGeneric,
                    text: translate('workspace.invoices.sendInvoice'),
                    shouldCallAfterModalHide: shouldRedirectToExpensifyClassic || shouldUseNarrowLayout,
                    onSelected: () => (0, interceptAnonymousUser_1.default)(() => {
                        if (shouldRedirectToExpensifyClassic) {
                            setModalVisible(true);
                            return;
                        }
                        (0, IOU_1.startMoneyRequest)(CONST_1.default.IOU.TYPE.INVOICE, 
                        // When starting to create an invoice from the global FAB, there is not an existing report yet. A random optimistic reportID is generated and used
                        // for all of the routes in the creation flow.
                        (0, ReportUtils_1.generateReportID)(), undefined, undefined, undefined, allTransactionDrafts);
                    }),
                },
            ]
            : []),
        ...[
            {
                icon: Expensicons.Suitcase,
                text: translate('travel.bookTravel'),
                rightIcon: isTravelEnabled && (0, openTravelDotLink_1.shouldOpenTravelDotLinkWeb)() ? Expensicons.NewWindow : undefined,
                onSelected: () => (0, interceptAnonymousUser_1.default)(() => openTravel()),
            },
        ],
        ...(!hasSeenTour
            ? [
                {
                    icon: Expensicons.Binoculars,
                    iconStyles: styles.popoverIconCircle,
                    iconFill: theme.icon,
                    text: translate('testDrive.quickAction.takeATwoMinuteTestDrive'),
                    onSelected: () => (0, interceptAnonymousUser_1.default)(() => (0, Tour_1.startTestDrive)(introSelected, (0, Session_1.isAnonymousUser)(), tryNewDot?.hasBeenAddedToNudgeMigration ?? false, isUserPaidPolicyMember)),
                },
            ]
            : []),
        ...(!isLoading && shouldShowNewWorkspaceButton
            ? [
                {
                    displayInDefaultIconColor: true,
                    contentFit: 'contain',
                    icon: Expensicons.NewWorkspace,
                    iconWidth: variables_1.default.w46,
                    iconHeight: variables_1.default.h40,
                    text: translate('workspace.new.newWorkspace'),
                    description: translate('workspace.new.getTheExpensifyCardAndMore'),
                    shouldCallAfterModalHide: shouldUseNarrowLayout,
                    onSelected: () => (0, interceptAnonymousUser_1.default)(() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_CONFIRMATION.getRoute(Navigation_1.default.getActiveRoute()))),
                },
            ]
            : []),
        ...quickActionMenuItems,
    ];
    return (<react_native_1.View style={[styles.flexGrow1, styles.justifyContentCenter, styles.alignItemsCenter]}>
            <PopoverMenu_1.default onClose={hideCreateMenu} shouldEnableMaxHeight={false} isVisible={isCreateMenuActive && (!shouldUseNarrowLayout || isFocused)} anchorPosition={styles.createMenuPositionSidebar(windowHeight)} onItemSelected={hideCreateMenu} fromSidebarMediumScreen={!shouldUseNarrowLayout} animationInTiming={CONST_1.default.MODAL.ANIMATION_TIMING.FAB_IN} animationOutTiming={CONST_1.default.MODAL.ANIMATION_TIMING.FAB_OUT} menuItems={menuItems.map((item) => {
            return {
                ...item,
                onSelected: () => {
                    if (!item.onSelected) {
                        return;
                    }
                    (0, navigateAfterInteraction_1.default)(item.onSelected);
                },
            };
        })} anchorRef={fabRef}/>
            <ConfirmModal_1.default prompt={translate('sidebarScreen.redirectToExpensifyClassicModal.description')} isVisible={modalVisible} onConfirm={() => {
            setModalVisible(false);
            if (CONFIG_1.default.IS_HYBRID_APP) {
                (0, HybridApp_1.closeReactNativeApp)({ shouldSetNVP: true });
                return;
            }
            (0, Link_1.openOldDotLink)(CONST_1.default.OLDDOT_URLS.INBOX);
        }} onCancel={() => setModalVisible(false)} title={translate('sidebarScreen.redirectToExpensifyClassicModal.title')} confirmText={translate('exitSurvey.goToExpensifyClassic')} cancelText={translate('common.cancel')}/>
            <FloatingActionButton_1.default isTooltipAllowed={isTooltipAllowed} accessibilityLabel={translate('sidebarScreen.fabNewChatExplained')} role={CONST_1.default.ROLE.BUTTON} isActive={isCreateMenuActive} ref={fabRef} onPress={toggleCreateMenu} onLongPress={startScan}/>
        </react_native_1.View>);
}
FloatingActionButtonAndPopover.displayName = 'FloatingActionButtonAndPopover';
exports.default = FloatingActionButtonAndPopover;
