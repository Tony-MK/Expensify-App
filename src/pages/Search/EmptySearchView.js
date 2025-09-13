"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const BookTravelButton_1 = require("@components/BookTravelButton");
const ConfirmModal_1 = require("@components/ConfirmModal");
const EmptyStateComponent_1 = require("@components/EmptyStateComponent");
const Illustrations_1 = require("@components/Icon/Illustrations");
const LottieAnimations_1 = require("@components/LottieAnimations");
const MenuItem_1 = require("@components/MenuItem");
const PressableWithSecondaryInteraction_1 = require("@components/PressableWithSecondaryInteraction");
const ScrollView_1 = require("@components/ScrollView");
const SearchScopeProvider_1 = require("@components/Search/SearchScopeProvider");
const SearchRowSkeleton_1 = require("@components/Skeletons/SearchRowSkeleton");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useSearchTypeMenuSections_1 = require("@hooks/useSearchTypeMenuSections");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const IOU_1 = require("@libs/actions/IOU");
const Link_1 = require("@libs/actions/Link");
const Report_1 = require("@libs/actions/Report");
const Tour_1 = require("@libs/actions/Tour");
const interceptAnonymousUser_1 = require("@libs/interceptAnonymousUser");
const Navigation_1 = require("@libs/Navigation/Navigation");
const onboardingSelectors_1 = require("@libs/onboardingSelectors");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const ReportActionContextMenu_1 = require("@pages/home/report/ContextMenu/ReportActionContextMenu");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const tripsFeatures = [
    {
        icon: Illustrations_1.PiggyBank,
        translationKey: 'travel.features.saveMoney',
    },
    {
        icon: Illustrations_1.Alert,
        translationKey: 'travel.features.alerts',
    },
];
function EmptySearchView({ similarSearchHash, type, groupBy, hasResults }) {
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const { typeMenuSections } = (0, useSearchTypeMenuSections_1.default)();
    const [allPolicies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: false });
    const [isUserPaidPolicyMember = false] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, {
        canBeMissing: true,
        selector: (policies) => Object.values(policies ?? {}).some((policy) => (0, PolicyUtils_1.isPaidGroupPolicy)(policy) && (0, PolicyUtils_1.isPolicyMember)(policy, currentUserPersonalDetails.login)),
    });
    const [activePolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, { canBeMissing: true });
    const [activePolicy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${activePolicyID}`, { canBeMissing: true });
    const groupPoliciesWithChatEnabled = (0, PolicyUtils_1.getGroupPaidPoliciesWithExpenseChatEnabled)();
    const [introSelected] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_INTRO_SELECTED, { canBeMissing: true });
    const [hasSeenTour = false] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ONBOARDING, {
        selector: onboardingSelectors_1.hasSeenTourSelector,
        canBeMissing: true,
    });
    return (<SearchScopeProvider_1.default isOnSearch>
            <EmptySearchViewContent similarSearchHash={similarSearchHash} type={type} groupBy={groupBy} hasResults={hasResults} currentUserPersonalDetails={currentUserPersonalDetails} typeMenuSections={typeMenuSections} allPolicies={allPolicies} isUserPaidPolicyMember={isUserPaidPolicyMember} activePolicyID={activePolicyID} activePolicy={activePolicy} groupPoliciesWithChatEnabled={groupPoliciesWithChatEnabled} introSelected={introSelected} hasSeenTour={hasSeenTour}/>
        </SearchScopeProvider_1.default>);
}
function EmptySearchViewContent({ similarSearchHash, type, groupBy, hasResults, currentUserPersonalDetails, typeMenuSections, allPolicies, isUserPaidPolicyMember, activePolicyID, activePolicy, groupPoliciesWithChatEnabled, introSelected, hasSeenTour, }) {
    const theme = (0, useTheme_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const contextMenuAnchor = (0, react_1.useRef)(null);
    const [modalVisible, setModalVisible] = (0, react_1.useState)(false);
    const [hasTransactions] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, {
        canBeMissing: true,
        selector: (transactions) => Object.values(transactions ?? {}).filter((transaction) => transaction?.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE).length > 0,
    });
    const [tryNewDot] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_TRY_NEW_DOT, { selector: onboardingSelectors_1.tryNewDotOnyxSelector, canBeMissing: true });
    const shouldRedirectToExpensifyClassic = (0, react_1.useMemo)(() => {
        return (0, PolicyUtils_1.areAllGroupPoliciesExpenseChatDisabled)(allPolicies ?? {});
    }, [allPolicies]);
    const typeMenuItems = (0, react_1.useMemo)(() => {
        return typeMenuSections.map((section) => section.menuItems).flat();
    }, [typeMenuSections]);
    const tripViewChildren = (0, react_1.useMemo)(() => {
        const onLongPress = (event) => {
            (0, ReportActionContextMenu_1.showContextMenu)({
                type: CONST_1.default.CONTEXT_MENU_TYPES.LINK,
                event,
                selection: CONST_1.default.BOOK_TRAVEL_DEMO_URL,
                contextMenuAnchor: contextMenuAnchor.current,
            });
        };
        return (<>
                <Text_1.default style={[styles.textSupporting, styles.textNormal]}>
                    {translate('travel.subtitle')}{' '}
                    <PressableWithSecondaryInteraction_1.default inline onSecondaryInteraction={onLongPress} accessible accessibilityLabel={translate('travel.bookADemo')}>
                        <TextLink_1.default onLongPress={onLongPress} onPress={() => {
                react_native_1.Linking.openURL(CONST_1.default.BOOK_TRAVEL_DEMO_URL);
            }} ref={contextMenuAnchor}>
                            {translate('travel.bookADemo')}
                        </TextLink_1.default>
                    </PressableWithSecondaryInteraction_1.default>
                    {translate('travel.toLearnMore')}
                </Text_1.default>
                <react_native_1.View style={[styles.flex1, styles.flexRow, styles.flexWrap, styles.rowGap4, styles.pt4, styles.pl1, styles.mb5]}>
                    {tripsFeatures.map((tripsFeature) => (<react_native_1.View key={tripsFeature.translationKey} style={styles.w100}>
                            <MenuItem_1.default title={translate(tripsFeature.translationKey)} icon={tripsFeature.icon} iconWidth={variables_1.default.menuIconSize} iconHeight={variables_1.default.menuIconSize} interactive={false} displayInDefaultIconColor wrapperStyle={[styles.p0, styles.cursorAuto]} containerStyle={[styles.m0, styles.wAuto]} numberOfLinesTitle={0}/>
                        </react_native_1.View>))}
                </react_native_1.View>
                <BookTravelButton_1.default text={translate('search.searchResults.emptyTripResults.buttonText')}/>
            </>);
    }, [styles, translate]);
    // Default 'Folder' lottie animation, along with its background styles
    const defaultViewItemHeader = (0, react_1.useMemo)(() => ({
        headerMedia: LottieAnimations_1.default.GenericEmptyState,
        headerContentStyles: [styles.emptyStateFolderWebStyles, StyleUtils.getBackgroundColorStyle(theme.emptyFolderBG)],
        lottieWebViewStyles: { backgroundColor: theme.emptyFolderBG, ...styles.emptyStateFolderWebStyles },
    }), [StyleUtils, styles.emptyStateFolderWebStyles, theme.emptyFolderBG]);
    const content = (0, react_1.useMemo)(() => {
        // Begin by going through all of our To-do searches, and returning their empty state
        // if it exists
        for (const menuItem of typeMenuItems) {
            if (menuItem.similarSearchHash === similarSearchHash && menuItem.emptyState) {
                return {
                    headerMedia: menuItem.emptyState.headerMedia,
                    title: translate(menuItem.emptyState.title),
                    subtitle: translate(menuItem.emptyState.subtitle),
                    headerStyles: StyleUtils.getBackgroundColorStyle(theme.todoBG),
                    headerContentStyles: [StyleUtils.getWidthAndHeightStyle(375, 240), StyleUtils.getBackgroundColorStyle(theme.todoBG)],
                    lottieWebViewStyles: styles.emptyStateFireworksWebStyles,
                    buttons: menuItem.emptyState.buttons?.map((button) => ({
                        ...button,
                        buttonText: translate(button.buttonText),
                    })),
                };
            }
        }
        const startTestDriveAction = () => {
            (0, Tour_1.startTestDrive)(introSelected, false, tryNewDot?.hasBeenAddedToNudgeMigration ?? false, isUserPaidPolicyMember);
        };
        // If we are grouping by reports, show a custom message rather than a type-specific message
        if (groupBy === CONST_1.default.SEARCH.GROUP_BY.REPORTS) {
            if (hasResults) {
                return {
                    ...defaultViewItemHeader,
                    title: translate('search.searchResults.emptyResults.title'),
                    subtitle: translate('search.searchResults.emptyResults.subtitle'),
                };
            }
            return {
                ...defaultViewItemHeader,
                title: translate('search.searchResults.emptyReportResults.title'),
                subtitle: translate(hasSeenTour ? 'search.searchResults.emptyReportResults.subtitleWithOnlyCreateButton' : 'search.searchResults.emptyReportResults.subtitle'),
                buttons: [
                    ...(!hasSeenTour
                        ? [
                            {
                                buttonText: translate('emptySearchView.takeATestDrive'),
                                buttonAction: startTestDriveAction,
                            },
                        ]
                        : []),
                    ...(groupPoliciesWithChatEnabled.length > 0
                        ? [
                            {
                                buttonText: translate('quickAction.createReport'),
                                buttonAction: () => {
                                    (0, interceptAnonymousUser_1.default)(() => {
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
                                                Navigation_1.default.navigate(ROUTES_1.default.SEARCH_MONEY_REQUEST_REPORT.getRoute({ reportID: createdReportID, backTo: Navigation_1.default.getActiveRoute() }));
                                            });
                                        }
                                        else {
                                            Navigation_1.default.navigate(ROUTES_1.default.RESTRICTED_ACTION.getRoute(workspaceIDForReportCreation));
                                        }
                                    });
                                },
                                success: true,
                            },
                        ]
                        : []),
                ],
            };
        }
        // If we didn't match a specific search hash, show a specific message
        // based on the type of the data
        switch (type) {
            case CONST_1.default.SEARCH.DATA_TYPES.TRIP:
                return {
                    headerMedia: LottieAnimations_1.default.TripsEmptyState,
                    headerContentStyles: [styles.emptyStateFolderWebStyles, StyleUtils.getBackgroundColorStyle(theme.travelBG)],
                    title: translate('travel.title'),
                    titleStyles: { ...styles.textAlignLeft },
                    children: tripViewChildren,
                    lottieWebViewStyles: { backgroundColor: theme.travelBG, ...styles.emptyStateFolderWebStyles, ...styles.tripEmptyStateLottieWebView },
                };
            case CONST_1.default.SEARCH.DATA_TYPES.EXPENSE:
                if (!hasResults || !hasTransactions) {
                    return {
                        ...defaultViewItemHeader,
                        title: translate('search.searchResults.emptyExpenseResults.title'),
                        subtitle: translate(hasSeenTour ? 'search.searchResults.emptyExpenseResults.subtitleWithOnlyCreateButton' : 'search.searchResults.emptyExpenseResults.subtitle'),
                        buttons: [
                            ...(!hasSeenTour
                                ? [
                                    {
                                        buttonText: translate('emptySearchView.takeATestDrive'),
                                        buttonAction: startTestDriveAction,
                                    },
                                ]
                                : []),
                            {
                                buttonText: translate('iou.createExpense'),
                                buttonAction: () => (0, interceptAnonymousUser_1.default)(() => {
                                    if (shouldRedirectToExpensifyClassic) {
                                        setModalVisible(true);
                                        return;
                                    }
                                    (0, IOU_1.startMoneyRequest)(CONST_1.default.IOU.TYPE.CREATE, (0, ReportUtils_1.generateReportID)());
                                }),
                                success: true,
                            },
                        ],
                    };
                }
            // We want to display the default nothing to show message if there is any filter applied.
            // eslint-disable-next-line no-fallthrough
            case CONST_1.default.SEARCH.DATA_TYPES.INVOICE:
                if (!hasResults) {
                    return {
                        title: translate('search.searchResults.emptyInvoiceResults.title'),
                        subtitle: translate(hasSeenTour ? 'search.searchResults.emptyInvoiceResults.subtitleWithOnlyCreateButton' : 'search.searchResults.emptyInvoiceResults.subtitle'),
                        buttons: [
                            ...(!hasSeenTour
                                ? [
                                    {
                                        buttonText: translate('emptySearchView.takeATestDrive'),
                                        buttonAction: startTestDriveAction,
                                    },
                                ]
                                : []),
                            {
                                buttonText: translate('workspace.invoices.sendInvoice'),
                                buttonAction: () => (0, interceptAnonymousUser_1.default)(() => {
                                    if (shouldRedirectToExpensifyClassic) {
                                        setModalVisible(true);
                                        return;
                                    }
                                    (0, IOU_1.startMoneyRequest)(CONST_1.default.IOU.TYPE.INVOICE, (0, ReportUtils_1.generateReportID)());
                                }),
                                success: true,
                            },
                        ],
                        ...defaultViewItemHeader,
                    };
                }
            // eslint-disable-next-line no-fallthrough
            case CONST_1.default.SEARCH.DATA_TYPES.CHAT:
            default:
                return {
                    ...defaultViewItemHeader,
                    title: translate('search.searchResults.emptyResults.title'),
                    subtitle: translate('search.searchResults.emptyResults.subtitle'),
                };
        }
    }, [
        groupBy,
        type,
        typeMenuItems,
        similarSearchHash,
        translate,
        StyleUtils,
        theme.todoBG,
        theme.travelBG,
        styles.emptyStateFireworksWebStyles,
        styles.emptyStateFolderWebStyles,
        styles.textAlignLeft,
        styles.tripEmptyStateLottieWebView,
        introSelected,
        hasResults,
        defaultViewItemHeader,
        hasSeenTour,
        groupPoliciesWithChatEnabled,
        activePolicy,
        activePolicyID,
        currentUserPersonalDetails,
        tripViewChildren,
        shouldRedirectToExpensifyClassic,
        hasTransactions,
        tryNewDot?.hasBeenAddedToNudgeMigration,
        isUserPaidPolicyMember,
    ]);
    return (<>
            <ScrollView_1.default showsVerticalScrollIndicator={false} contentContainerStyle={[styles.flexGrow1, styles.flexShrink0]}>
                <EmptyStateComponent_1.default SkeletonComponent={SearchRowSkeleton_1.default} headerMediaType={CONST_1.default.EMPTY_STATE_MEDIA.ANIMATION} headerMedia={content.headerMedia} headerStyles={[styles.emptyStateCardIllustrationContainer, styles.overflowHidden, content.headerStyles]} title={content.title} titleStyles={content.titleStyles} subtitle={content.subtitle} buttons={content.buttons} headerContentStyles={[styles.h100, styles.w100, ...content.headerContentStyles]} lottieWebViewStyles={content.lottieWebViewStyles}>
                    {content.children}
                </EmptyStateComponent_1.default>
            </ScrollView_1.default>
            <ConfirmModal_1.default prompt={translate('sidebarScreen.redirectToExpensifyClassicModal.description')} isVisible={modalVisible} onConfirm={() => {
            setModalVisible(false);
            (0, Link_1.openOldDotLink)(CONST_1.default.OLDDOT_URLS.INBOX);
        }} onCancel={() => setModalVisible(false)} title={translate('sidebarScreen.redirectToExpensifyClassicModal.title')} confirmText={translate('exitSurvey.goToExpensifyClassic')} cancelText={translate('common.cancel')}/>
        </>);
}
EmptySearchView.displayName = 'EmptySearchView';
exports.default = EmptySearchView;
