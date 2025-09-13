"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_onyx_1 = require("react-native-onyx");
const ComposeProviders_1 = require("@components/ComposeProviders");
const DelegateNoAccessModalProvider_1 = require("@components/DelegateNoAccessModalProvider");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const InitialURLContextProvider_1 = require("@components/InitialURLContextProvider");
const LockedAccountModalProvider_1 = require("@components/LockedAccountModalProvider");
const OptionListContextProvider_1 = require("@components/OptionListContextProvider");
const PriorityModeController_1 = require("@components/PriorityModeController");
const SearchContext_1 = require("@components/Search/SearchContext");
const SearchRouterContext_1 = require("@components/Search/SearchRouter/SearchRouterContext");
const SearchRouterModal_1 = require("@components/Search/SearchRouter/SearchRouterModal");
const WideRHPContextProvider_1 = require("@components/WideRHPContextProvider");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useOnboardingFlow_1 = require("@hooks/useOnboardingFlow");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSidebarOrderedReports_1 = require("@hooks/useSidebarOrderedReports");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const Delegate_1 = require("@libs/actions/Delegate");
const setFullscreenVisibility_1 = require("@libs/actions/setFullscreenVisibility");
const ActiveClientManager_1 = require("@libs/ActiveClientManager");
const types_1 = require("@libs/API/types");
const HttpUtils_1 = require("@libs/HttpUtils");
const KeyboardShortcut_1 = require("@libs/KeyboardShortcut");
const Log_1 = require("@libs/Log");
const NavBarManager_1 = require("@libs/NavBarManager");
const currentUrl_1 = require("@libs/Navigation/currentUrl");
const Navigation_1 = require("@libs/Navigation/Navigation");
const animation_1 = require("@libs/Navigation/PlatformStackNavigation/navigationOptions/animation");
const presentation_1 = require("@libs/Navigation/PlatformStackNavigation/navigationOptions/presentation");
const NetworkConnection_1 = require("@libs/NetworkConnection");
const OnboardingUtils_1 = require("@libs/OnboardingUtils");
const onyxSubscribe_1 = require("@libs/onyxSubscribe");
const Pusher_1 = require("@libs/Pusher");
const PusherConnectionManager_1 = require("@libs/PusherConnectionManager");
const ReportUtils_1 = require("@libs/ReportUtils");
const SessionUtils = require("@libs/SessionUtils");
const Url_1 = require("@libs/Url");
const ConnectionCompletePage_1 = require("@pages/ConnectionCompletePage");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const RequireTwoFactorAuthenticationPage_1 = require("@pages/RequireTwoFactorAuthenticationPage");
const DesktopSignInRedirectPage_1 = require("@pages/signin/DesktopSignInRedirectPage");
const WorkspacesListPage_1 = require("@pages/workspace/WorkspacesListPage");
const App = require("@userActions/App");
const Download = require("@userActions/Download");
const Modal = require("@userActions/Modal");
const PersonalDetails = require("@userActions/PersonalDetails");
const Report = require("@userActions/Report");
const Session = require("@userActions/Session");
const User = require("@userActions/User");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
require("@src/libs/subscribeToFullReconnect");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const attachmentModalScreenOptions_1 = require("./attachmentModalScreenOptions");
const createRootStackNavigator_1 = require("./createRootStackNavigator");
const GetStateForActionHandlers_1 = require("./createRootStackNavigator/GetStateForActionHandlers");
const defaultScreenOptions_1 = require("./defaultScreenOptions");
const ModalStackNavigators_1 = require("./ModalStackNavigators");
const ExplanationModalNavigator_1 = require("./Navigators/ExplanationModalNavigator");
const FeatureTrainingModalNavigator_1 = require("./Navigators/FeatureTrainingModalNavigator");
const MigratedUserWelcomeModalNavigator_1 = require("./Navigators/MigratedUserWelcomeModalNavigator");
const OnboardingModalNavigator_1 = require("./Navigators/OnboardingModalNavigator");
const RightModalNavigator_1 = require("./Navigators/RightModalNavigator");
const TestDriveModalNavigator_1 = require("./Navigators/TestDriveModalNavigator");
const TestToolsModalNavigator_1 = require("./Navigators/TestToolsModalNavigator");
const TestDriveDemoNavigator_1 = require("./TestDriveDemoNavigator");
const useModalCardStyleInterpolator_1 = require("./useModalCardStyleInterpolator");
const useRootNavigatorScreenOptions_1 = require("./useRootNavigatorScreenOptions");
const loadAttachmentModalScreen = () => require('../../../pages/media/AttachmentModalScreen').default;
const loadValidateLoginPage = () => require('../../../pages/ValidateLoginPage').default;
const loadLogOutPreviousUserPage = () => require('../../../pages/LogOutPreviousUserPage').default;
const loadConciergePage = () => require('../../../pages/ConciergePage').default;
const loadTrackExpensePage = () => require('../../../pages/TrackExpensePage').default;
const loadSubmitExpensePage = () => require('../../../pages/SubmitExpensePage').default;
const loadProfileAvatar = () => require('../../../pages/settings/Profile/ProfileAvatar').default;
const loadWorkspaceAvatar = () => require('../../../pages/workspace/WorkspaceAvatar').default;
const loadReportAvatar = () => require('../../../pages/ReportAvatar').default;
const loadReceiptView = () => require('../../../pages/TransactionReceiptPage').default;
const loadWorkspaceJoinUser = () => require('@pages/workspace/WorkspaceJoinUserPage').default;
const loadReportSplitNavigator = () => require('./Navigators/ReportsSplitNavigator').default;
const loadSettingsSplitNavigator = () => require('./Navigators/SettingsSplitNavigator').default;
const loadWorkspaceSplitNavigator = () => require('./Navigators/WorkspaceSplitNavigator').default;
const loadSearchNavigator = () => require('./Navigators/SearchFullscreenNavigator').default;
function initializePusher() {
    return Pusher_1.default.init({
        appKey: CONFIG_1.default.PUSHER.APP_KEY,
        cluster: CONFIG_1.default.PUSHER.CLUSTER,
        authEndpoint: `${CONFIG_1.default.EXPENSIFY.DEFAULT_API_ROOT}api/AuthenticatePusher?`,
    }).then(() => {
        User.subscribeToUserEvents();
    });
}
let timezone;
let currentAccountID = -1;
let lastUpdateIDAppliedToClient;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.SESSION,
    callback: (value) => {
        // When signed out, val hasn't accountID
        if (!(value && 'accountID' in value)) {
            currentAccountID = -1;
            timezone = null;
            return;
        }
        currentAccountID = value.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
        if (Navigation_1.default.isActiveRoute(ROUTES_1.default.SIGN_IN_MODAL)) {
            // This means sign in in RHP was successful, so we can subscribe to user events
            initializePusher();
        }
    },
});
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
    callback: (value) => {
        if (!value || !(0, EmptyObject_1.isEmptyObject)(timezone)) {
            return;
        }
        timezone = value?.[currentAccountID]?.timezone ?? {};
        const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        // If the current timezone is different than the user's timezone, and their timezone is set to automatic
        // then update their timezone.
        if (!(0, EmptyObject_1.isEmptyObject)(currentTimezone) && timezone?.automatic && timezone?.selected !== currentTimezone) {
            PersonalDetails.updateAutomaticTimezone({
                automatic: true,
                selected: currentTimezone,
            });
        }
    },
});
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.ONYX_UPDATES_LAST_UPDATE_ID_APPLIED_TO_CLIENT,
    callback: (value) => {
        lastUpdateIDAppliedToClient = value;
    },
});
function handleNetworkReconnect(isLoadingApp) {
    if (isLoadingApp) {
        App.openApp();
    }
    else {
        Log_1.default.info('[handleNetworkReconnect] Sending ReconnectApp');
        App.reconnectApp(lastUpdateIDAppliedToClient);
    }
}
const RootStack = (0, createRootStackNavigator_1.default)();
// We want to delay the re-rendering for components(e.g. ReportActionCompose)
// that depends on modal visibility until Modal is completely closed and its focused
// When modal screen is focused, update modal visibility in Onyx
// https://reactnavigation.org/docs/navigation-events/
const modalScreenListeners = {
    focus: () => {
        Modal.setModalVisibility(true, CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED);
    },
    blur: () => {
        Modal.setModalVisibility(false);
    },
    beforeRemove: () => {
        Modal.setModalVisibility(false);
        Modal.willAlertModalBecomeVisible(false);
    },
};
const fullScreenListeners = {
    focus: () => {
        (0, setFullscreenVisibility_1.default)(true);
    },
    beforeRemove: () => {
        (0, setFullscreenVisibility_1.default)(false);
    },
};
// Extended modal screen listeners with additional cancellation of pending requests
const modalScreenListenersWithCancelSearch = {
    ...modalScreenListeners,
    beforeRemove: () => {
        modalScreenListeners.beforeRemove();
        HttpUtils_1.default.cancelPendingRequests(types_1.READ_COMMANDS.SEARCH_FOR_REPORTS);
    },
};
function AuthScreens() {
    const theme = (0, useTheme_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const rootNavigatorScreenOptions = (0, useRootNavigatorScreenOptions_1.default)();
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const [isLoadingApp] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true });
    const { toggleSearch } = (0, SearchRouterContext_1.useSearchRouterContext)();
    const currentUrl = (0, currentUrl_1.default)();
    const delegatorEmail = (0, Url_1.getSearchParamFromUrl)(currentUrl, 'delegatorEmail');
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, {
        canBeMissing: true,
    });
    const [onboardingCompanySize] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_COMPANY_SIZE, { canBeMissing: true });
    const [userReportedIntegration] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_USER_REPORTED_INTEGRATION, { canBeMissing: true });
    const modal = (0, react_1.useRef)({});
    const { isOnboardingCompleted } = (0, useOnboardingFlow_1.default)();
    const [isOnboardingLoading] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ONBOARDING, { canBeMissing: true, selector: (value) => !!value?.isLoading });
    const prevIsOnboardingLoading = (0, usePrevious_1.default)(isOnboardingLoading);
    const [shouldShowRequire2FAPage, setShouldShowRequire2FAPage] = (0, react_1.useState)(!!account?.needsTwoFactorAuthSetup && !account.requiresTwoFactorAuth);
    const navigation = (0, native_1.useNavigation)();
    const { initialURL, isAuthenticatedAtStartup, setIsAuthenticatedAtStartup } = (0, react_1.useContext)(InitialURLContextProvider_1.InitialURLContext);
    const modalCardStyleInterpolator = (0, useModalCardStyleInterpolator_1.default)();
    // State to track whether the delegator's authentication is completed before displaying data
    const [isDelegatorFromOldDotIsReady, setIsDelegatorFromOldDotIsReady] = (0, react_1.useState)(false);
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: true });
    const [lastOpenedPublicRoomID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.LAST_OPENED_PUBLIC_ROOM_ID, { canBeMissing: true });
    const [initialLastUpdateIDAppliedToClient] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONYX_UPDATES_LAST_UPDATE_ID_APPLIED_TO_CLIENT, { canBeMissing: true });
    // On HybridApp we need to prevent flickering during transition to OldDot
    const shouldRenderOnboardingExclusivelyOnHybridApp = (0, react_1.useMemo)(() => {
        return CONFIG_1.default.IS_HYBRID_APP && Navigation_1.default.getActiveRoute().includes(ROUTES_1.default.ONBOARDING_INTERESTED_FEATURES.route) && isOnboardingCompleted === true;
    }, [isOnboardingCompleted]);
    const shouldRenderOnboardingExclusively = (0, react_1.useMemo)(() => {
        return (!CONFIG_1.default.IS_HYBRID_APP &&
            Navigation_1.default.getActiveRoute().includes(ROUTES_1.default.ONBOARDING_INTERESTED_FEATURES.route) &&
            (0, OnboardingUtils_1.shouldOnboardingRedirectToOldDot)(onboardingCompanySize, userReportedIntegration) &&
            isOnboardingCompleted === true &&
            (!!isOnboardingLoading || !!prevIsOnboardingLoading));
    }, [onboardingCompanySize, isOnboardingCompleted, isOnboardingLoading, prevIsOnboardingLoading, userReportedIntegration]);
    (0, react_1.useEffect)(() => {
        NavBarManager_1.default.setButtonStyle(theme.navigationBarButtonsStyle);
        return () => {
            NavBarManager_1.default.setButtonStyle(CONST_1.default.NAVIGATION_BAR_BUTTONS_STYLE.LIGHT);
        };
    }, [theme]);
    (0, react_1.useEffect)(() => {
        if (!account?.needsTwoFactorAuthSetup || !!account.requiresTwoFactorAuth || shouldShowRequire2FAPage) {
            return;
        }
        setShouldShowRequire2FAPage(true);
    }, [account?.needsTwoFactorAuthSetup, account?.requiresTwoFactorAuth, shouldShowRequire2FAPage]);
    (0, react_1.useEffect)(() => {
        if (!shouldShowRequire2FAPage) {
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.REQUIRE_TWO_FACTOR_AUTH);
    }, [shouldShowRequire2FAPage]);
    (0, react_1.useEffect)(() => {
        const shortcutsOverviewShortcutConfig = CONST_1.default.KEYBOARD_SHORTCUTS.SHORTCUTS;
        const searchShortcutConfig = CONST_1.default.KEYBOARD_SHORTCUTS.SEARCH;
        const chatShortcutConfig = CONST_1.default.KEYBOARD_SHORTCUTS.NEW_CHAT;
        const markAllMessagesAsReadShortcutConfig = CONST_1.default.KEYBOARD_SHORTCUTS.MARK_ALL_MESSAGES_AS_READ;
        const isLoggingInAsNewUser = !!session?.email && SessionUtils.isLoggingInAsNewUser(currentUrl, session.email);
        // Sign out the current user if we're transitioning with a different user
        const isTransitioning = currentUrl.includes(ROUTES_1.default.TRANSITION_BETWEEN_APPS);
        const isSupportalTransition = currentUrl.includes('authTokenType=support');
        if (isLoggingInAsNewUser && isTransitioning) {
            Session.signOutAndRedirectToSignIn(false, isSupportalTransition);
            return;
        }
        NetworkConnection_1.default.listenForReconnect();
        NetworkConnection_1.default.onReconnect(() => handleNetworkReconnect(!!isLoadingApp));
        PusherConnectionManager_1.default.init();
        initializePusher();
        // Sometimes when we transition from old dot to new dot, the client is not the leader
        // so we need to initialize the client again
        if (!(0, ActiveClientManager_1.isClientTheLeader)() && isTransitioning) {
            (0, ActiveClientManager_1.init)();
        }
        // If we are on this screen then we are "logged in", but the user might not have "just logged in". They could be reopening the app
        // or returning from background. If so, we'll assume they have some app data already and we can call reconnectApp() instead of openApp() and connect() for delegator from OldDot.
        if (SessionUtils.didUserLogInDuringSession() || delegatorEmail) {
            if (delegatorEmail) {
                (0, Delegate_1.connect)(delegatorEmail, true)
                    ?.then((success) => {
                    App.setAppLoading(!!success);
                })
                    .finally(() => {
                    setIsDelegatorFromOldDotIsReady(true);
                });
            }
            else {
                const reportID = (0, ReportUtils_1.getReportIDFromLink)(initialURL ?? null);
                if (reportID && !isAuthenticatedAtStartup) {
                    Report.openReport(reportID);
                    // Don't want to call `openReport` again when logging out and then logging in
                    setIsAuthenticatedAtStartup(true);
                }
                App.openApp();
            }
        }
        else {
            Log_1.default.info('[AuthScreens] Sending ReconnectApp');
            App.reconnectApp(initialLastUpdateIDAppliedToClient);
        }
        App.setUpPoliciesAndNavigate(session);
        App.redirectThirdPartyDesktopSignIn();
        if (lastOpenedPublicRoomID) {
            // Re-open the last opened public room if the user logged in from a public room link
            Report.openLastOpenedPublicRoom(lastOpenedPublicRoomID);
        }
        Download.clearDownloads();
        const unsubscribeOnyxModal = (0, onyxSubscribe_1.default)({
            key: ONYXKEYS_1.default.MODAL,
            callback: (modalArg) => {
                if (modalArg === null || typeof modalArg !== 'object') {
                    return;
                }
                modal.current = modalArg;
            },
        });
        const shortcutConfig = CONST_1.default.KEYBOARD_SHORTCUTS.ESCAPE;
        const unsubscribeEscapeKey = KeyboardShortcut_1.default.subscribe(shortcutConfig.shortcutKey, () => {
            if (modal.current.willAlertModalBecomeVisible) {
                return;
            }
            if (modal.current.disableDismissOnEscape) {
                return;
            }
            Navigation_1.default.dismissModal();
        }, shortcutConfig.descriptionKey, shortcutConfig.modifiers, true, true);
        // Listen to keyboard shortcuts for opening certain pages
        const unsubscribeShortcutsOverviewShortcut = KeyboardShortcut_1.default.subscribe(shortcutsOverviewShortcutConfig.shortcutKey, () => {
            Modal.close(() => {
                if (Navigation_1.default.isOnboardingFlow()) {
                    return;
                }
                if (Navigation_1.default.isActiveRoute(ROUTES_1.default.KEYBOARD_SHORTCUTS.getRoute(Navigation_1.default.getActiveRoute()))) {
                    return;
                }
                return Navigation_1.default.navigate(ROUTES_1.default.KEYBOARD_SHORTCUTS.getRoute(Navigation_1.default.getActiveRoute()));
            });
        }, shortcutsOverviewShortcutConfig.descriptionKey, shortcutsOverviewShortcutConfig.modifiers, true);
        // Listen for the key K being pressed so that focus can be given to
        // Search Router, or new group chat
        // based on the key modifiers pressed and the operating system
        const unsubscribeSearchShortcut = KeyboardShortcut_1.default.subscribe(searchShortcutConfig.shortcutKey, () => {
            Session.callFunctionIfActionIsAllowed(() => {
                if (Navigation_1.default.isOnboardingFlow()) {
                    return;
                }
                toggleSearch();
            })();
        }, shortcutsOverviewShortcutConfig.descriptionKey, shortcutsOverviewShortcutConfig.modifiers, true);
        const unsubscribeChatShortcut = KeyboardShortcut_1.default.subscribe(chatShortcutConfig.shortcutKey, () => {
            if (Navigation_1.default.isOnboardingFlow()) {
                return;
            }
            Modal.close(Session.callFunctionIfActionIsAllowed(() => Navigation_1.default.navigate(ROUTES_1.default.NEW)));
        }, chatShortcutConfig.descriptionKey, chatShortcutConfig.modifiers, true);
        const unsubscribeMarkAllMessagesAsReadShortcut = KeyboardShortcut_1.default.subscribe(markAllMessagesAsReadShortcutConfig.shortcutKey, Report.markAllMessagesAsRead, markAllMessagesAsReadShortcutConfig.descriptionKey, markAllMessagesAsReadShortcutConfig.modifiers, true);
        return () => {
            unsubscribeEscapeKey();
            unsubscribeOnyxModal();
            unsubscribeShortcutsOverviewShortcut();
            unsubscribeSearchShortcut();
            unsubscribeChatShortcut();
            unsubscribeMarkAllMessagesAsReadShortcut();
            Session.cleanupSession();
        };
        // Rule disabled because this effect is only for component did mount & will component unmount lifecycle event
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    // Animation is disabled when navigating to the sidebar screen
    const getWorkspaceSplitNavigatorOptions = ({ route }) => {
        // We don't need to do anything special for the wide screen.
        if (!shouldUseNarrowLayout) {
            return rootNavigatorScreenOptions.splitNavigator;
        }
        // On the narrow screen, we want to animate this navigator if it is opened from the settings split.
        // If it is opened from other tab, we don't want to animate it on the entry.
        // There is a hook inside the workspace navigator that changes animation to SLIDE_FROM_RIGHT after entering.
        // This way it can be animated properly when going back to the settings split.
        const animationEnabled = !GetStateForActionHandlers_1.workspaceSplitsWithoutEnteringAnimation.has(route.key);
        return {
            ...rootNavigatorScreenOptions.splitNavigator,
            animation: animationEnabled ? animation_1.default.SLIDE_FROM_RIGHT : animation_1.default.NONE,
            web: {
                ...rootNavigatorScreenOptions.splitNavigator.web,
                cardStyleInterpolator: (props) => modalCardStyleInterpolator({ props, isFullScreenModal: true, animationEnabled }),
            },
        };
    };
    // Animation is enabled when navigating to any screen different than split sidebar screen
    const getFullscreenNavigatorOptions = ({ route }) => {
        // We don't need to do anything special for the wide screen.
        if (!shouldUseNarrowLayout) {
            return rootNavigatorScreenOptions.splitNavigator;
        }
        // On the narrow screen, we want to animate this navigator if pushed SplitNavigator includes desired screen
        const animationEnabled = GetStateForActionHandlers_1.screensWithEnteringAnimation.has(route.key);
        return {
            ...rootNavigatorScreenOptions.splitNavigator,
            animation: animationEnabled ? animation_1.default.SLIDE_FROM_RIGHT : animation_1.default.NONE,
            web: {
                ...rootNavigatorScreenOptions.splitNavigator.web,
                cardStyleInterpolator: (props) => modalCardStyleInterpolator({ props, isFullScreenModal: true, animationEnabled }),
            },
        };
    };
    const clearStatus = () => {
        User.clearCustomStatus();
        User.clearDraftCustomStatus();
    };
    (0, react_1.useEffect)(() => {
        if (!currentUserPersonalDetails.status?.clearAfter) {
            return;
        }
        const currentTime = new Date();
        const clearAfterTime = new Date(currentUserPersonalDetails.status.clearAfter);
        if (Number.isNaN(clearAfterTime.getTime())) {
            return;
        }
        const subMillisecondsTime = clearAfterTime.getTime() - currentTime.getTime();
        if (subMillisecondsTime > 0) {
            let intervalId = null;
            let timeoutId = null;
            if (subMillisecondsTime > CONST_1.default.LIMIT_TIMEOUT) {
                intervalId = setInterval(() => {
                    const now = new Date();
                    const remainingTime = clearAfterTime.getTime() - now.getTime();
                    if (remainingTime <= 0) {
                        clearStatus();
                        if (intervalId) {
                            clearInterval(intervalId);
                        }
                    }
                    else if (remainingTime <= CONST_1.default.LIMIT_TIMEOUT) {
                        if (intervalId) {
                            clearInterval(intervalId);
                        }
                        timeoutId = setTimeout(() => {
                            clearStatus();
                        }, remainingTime);
                    }
                }, CONST_1.default.LIMIT_TIMEOUT);
            }
            else {
                timeoutId = setTimeout(() => {
                    clearStatus();
                }, subMillisecondsTime);
            }
            return () => {
                if (intervalId) {
                    clearInterval(intervalId);
                }
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            };
        }
        clearStatus();
    }, [currentUserPersonalDetails.status?.clearAfter]);
    if (delegatorEmail && !isDelegatorFromOldDotIsReady) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<ComposeProviders_1.default components={[
            OptionListContextProvider_1.default,
            useSidebarOrderedReports_1.SidebarOrderedReportsContextProvider,
            SearchContext_1.SearchContextProvider,
            LockedAccountModalProvider_1.default,
            DelegateNoAccessModalProvider_1.default,
            WideRHPContextProvider_1.default,
        ]}>
            <RootStack.Navigator persistentScreens={[
            NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR,
            NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR,
            NAVIGATORS_1.default.WORKSPACE_SPLIT_NAVIGATOR,
            NAVIGATORS_1.default.SEARCH_FULLSCREEN_NAVIGATOR,
            NAVIGATORS_1.default.RIGHT_MODAL_NAVIGATOR,
            SCREENS_1.default.WORKSPACES_LIST,
            SCREENS_1.default.SEARCH.ROOT,
        ]}>
                {/* This has to be the first navigator in auth screens. */}
                <RootStack.Screen name={NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR} options={getFullscreenNavigatorOptions} getComponent={loadReportSplitNavigator}/>
                <RootStack.Screen name={NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR} options={getFullscreenNavigatorOptions} getComponent={loadSettingsSplitNavigator}/>
                <RootStack.Screen name={NAVIGATORS_1.default.SEARCH_FULLSCREEN_NAVIGATOR} options={getFullscreenNavigatorOptions} getComponent={loadSearchNavigator}/>
                <RootStack.Screen name={NAVIGATORS_1.default.WORKSPACE_SPLIT_NAVIGATOR} options={getWorkspaceSplitNavigatorOptions} getComponent={loadWorkspaceSplitNavigator}/>
                <RootStack.Screen name={SCREENS_1.default.VALIDATE_LOGIN} options={{
            ...rootNavigatorScreenOptions.fullScreen,
            headerShown: false,
            title: 'New Expensify',
        }} listeners={fullScreenListeners} getComponent={loadValidateLoginPage}/>
                <RootStack.Screen name={SCREENS_1.default.WORKSPACES_LIST} options={rootNavigatorScreenOptions.workspacesListPage} component={WorkspacesListPage_1.default}/>
                <RootStack.Screen name={SCREENS_1.default.TRANSITION_BETWEEN_APPS} options={defaultScreenOptions_1.default} getComponent={loadLogOutPreviousUserPage}/>
                <RootStack.Screen name={SCREENS_1.default.CONCIERGE} options={defaultScreenOptions_1.default} getComponent={loadConciergePage}/>
                <RootStack.Screen name={SCREENS_1.default.TRACK_EXPENSE} options={defaultScreenOptions_1.default} getComponent={loadTrackExpensePage}/>
                <RootStack.Screen name={SCREENS_1.default.SUBMIT_EXPENSE} options={defaultScreenOptions_1.default} getComponent={loadSubmitExpensePage}/>
                <RootStack.Screen name={SCREENS_1.default.ATTACHMENTS} options={attachmentModalScreenOptions_1.default} getComponent={loadAttachmentModalScreen} listeners={modalScreenListeners}/>
                <RootStack.Screen name={SCREENS_1.default.PROFILE_AVATAR} options={{
            headerShown: false,
            presentation: presentation_1.default.TRANSPARENT_MODAL,
            animation: animation_1.default.NONE,
        }} getComponent={loadProfileAvatar} listeners={modalScreenListeners}/>
                <RootStack.Screen name={SCREENS_1.default.WORKSPACE_AVATAR} options={{
            headerShown: false,
            presentation: presentation_1.default.TRANSPARENT_MODAL,
        }} getComponent={loadWorkspaceAvatar} listeners={modalScreenListeners}/>
                <RootStack.Screen name={SCREENS_1.default.REPORT_AVATAR} options={{
            headerShown: false,
            presentation: presentation_1.default.TRANSPARENT_MODAL,
        }} getComponent={loadReportAvatar} listeners={modalScreenListeners}/>
                <RootStack.Screen name={SCREENS_1.default.NOT_FOUND} options={rootNavigatorScreenOptions.fullScreen} component={NotFoundPage_1.default}/>
                <RootStack.Screen name={NAVIGATORS_1.default.RIGHT_MODAL_NAVIGATOR} options={rootNavigatorScreenOptions.rightModalNavigator} component={RightModalNavigator_1.default} listeners={{
            ...modalScreenListenersWithCancelSearch,
            beforeRemove: () => {
                modalScreenListenersWithCancelSearch.beforeRemove();
                // When a 2FA RHP page is closed, if the 2FA require page is visible and the user has now enabled the 2FA, then remove the 2FA require page from the navigator.
                const routeParams = navigation.getState()?.routes?.at(-1)?.params;
                const screen = routeParams && 'screen' in routeParams ? routeParams.screen : '';
                if (!shouldShowRequire2FAPage || !account?.requiresTwoFactorAuth || screen !== SCREENS_1.default.RIGHT_MODAL.TWO_FACTOR_AUTH) {
                    return;
                }
                setShouldShowRequire2FAPage(false);
            },
        }}/>
                <RootStack.Screen name={SCREENS_1.default.DESKTOP_SIGN_IN_REDIRECT} options={rootNavigatorScreenOptions.fullScreen} component={DesktopSignInRedirectPage_1.default}/>
                <RootStack.Screen name={NAVIGATORS_1.default.SHARE_MODAL_NAVIGATOR} options={rootNavigatorScreenOptions.fullScreen} component={ModalStackNavigators_1.ShareModalStackNavigator} listeners={modalScreenListeners}/>
                <RootStack.Screen name={NAVIGATORS_1.default.EXPLANATION_MODAL_NAVIGATOR} options={rootNavigatorScreenOptions.basicModalNavigator} component={ExplanationModalNavigator_1.default}/>
                <RootStack.Screen name={NAVIGATORS_1.default.MIGRATED_USER_MODAL_NAVIGATOR} options={rootNavigatorScreenOptions.basicModalNavigator} component={MigratedUserWelcomeModalNavigator_1.default}/>
                <RootStack.Screen name={NAVIGATORS_1.default.TEST_DRIVE_MODAL_NAVIGATOR} options={rootNavigatorScreenOptions.basicModalNavigator} component={TestDriveModalNavigator_1.default}/>
                <RootStack.Screen name={NAVIGATORS_1.default.TEST_DRIVE_DEMO_NAVIGATOR} options={rootNavigatorScreenOptions.basicModalNavigator} component={TestDriveDemoNavigator_1.default}/>
                <RootStack.Screen name={NAVIGATORS_1.default.FEATURE_TRAINING_MODAL_NAVIGATOR} options={rootNavigatorScreenOptions.basicModalNavigator} component={FeatureTrainingModalNavigator_1.default} listeners={modalScreenListeners}/>
                {(isOnboardingCompleted === false || shouldRenderOnboardingExclusivelyOnHybridApp || shouldRenderOnboardingExclusively) && (<RootStack.Screen name={NAVIGATORS_1.default.ONBOARDING_MODAL_NAVIGATOR} options={{ ...rootNavigatorScreenOptions.basicModalNavigator, gestureEnabled: false }} component={OnboardingModalNavigator_1.default} listeners={{
                focus: () => {
                    Modal.setDisableDismissOnEscape(true);
                },
            }}/>)}
                {shouldShowRequire2FAPage && (<RootStack.Screen name={SCREENS_1.default.REQUIRE_TWO_FACTOR_AUTH} options={{ ...rootNavigatorScreenOptions.fullScreen, gestureEnabled: false }} component={RequireTwoFactorAuthenticationPage_1.default}/>)}
                <RootStack.Screen name={SCREENS_1.default.WORKSPACE_JOIN_USER} options={{
            headerShown: false,
        }} listeners={modalScreenListeners} getComponent={loadWorkspaceJoinUser}/>
                <RootStack.Screen name={SCREENS_1.default.TRANSACTION_RECEIPT} options={{
            headerShown: false,
            presentation: presentation_1.default.TRANSPARENT_MODAL,
        }} getComponent={loadReceiptView} listeners={modalScreenListeners}/>
                <RootStack.Screen name={SCREENS_1.default.MONEY_REQUEST.RECEIPT_PREVIEW} options={{
            headerShown: false,
            presentation: presentation_1.default.TRANSPARENT_MODAL,
        }} getComponent={loadReceiptView} listeners={modalScreenListeners}/>
                <RootStack.Screen name={SCREENS_1.default.CONNECTION_COMPLETE} options={rootNavigatorScreenOptions.fullScreen} component={ConnectionCompletePage_1.default}/>
                <RootStack.Screen name={SCREENS_1.default.BANK_CONNECTION_COMPLETE} options={rootNavigatorScreenOptions.fullScreen} component={ConnectionCompletePage_1.default}/>
                <RootStack.Screen name={NAVIGATORS_1.default.TEST_TOOLS_MODAL_NAVIGATOR} options={{
            ...rootNavigatorScreenOptions.basicModalNavigator,
            native: {
                contentStyle: {
                    ...StyleUtils.getBackgroundColorWithOpacityStyle(theme.overlay, 0.72),
                },
                animation: animation_1.InternalPlatformAnimations.FADE,
            },
            web: {
                cardStyle: {
                    ...StyleUtils.getBackgroundColorWithOpacityStyle(theme.overlay, 0.72),
                },
                animation: animation_1.InternalPlatformAnimations.FADE,
            },
        }} component={TestToolsModalNavigator_1.default} listeners={modalScreenListeners}/>
            </RootStack.Navigator>
            <SearchRouterModal_1.default />
            <PriorityModeController_1.default />
        </ComposeProviders_1.default>);
}
AuthScreens.displayName = 'AuthScreens';
const AuthScreensMemoized = (0, react_1.memo)(AuthScreens, () => true);
exports.default = AuthScreensMemoized;
