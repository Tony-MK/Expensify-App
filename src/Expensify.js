"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_hybrid_app_1 = require("@expensify/react-native-hybrid-app");
const expo_av_1 = require("expo-av");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_onyx_1 = require("react-native-onyx");
const ConfirmModal_1 = require("./components/ConfirmModal");
const DeeplinkWrapper_1 = require("./components/DeeplinkWrapper");
const EmojiPicker_1 = require("./components/EmojiPicker/EmojiPicker");
const GrowlNotification_1 = require("./components/GrowlNotification");
const InitialURLContextProvider_1 = require("./components/InitialURLContextProvider");
const AppleAuthWrapper_1 = require("./components/SignInButtons/AppleAuthWrapper");
const SplashScreenHider_1 = require("./components/SplashScreenHider");
const UpdateAppModal_1 = require("./components/UpdateAppModal");
const CONFIG_1 = require("./CONFIG");
const CONST_1 = require("./CONST");
const useDebugShortcut_1 = require("./hooks/useDebugShortcut");
const useIsAuthenticated_1 = require("./hooks/useIsAuthenticated");
const useLocalize_1 = require("./hooks/useLocalize");
const useOnyx_1 = require("./hooks/useOnyx");
const usePriorityChange_1 = require("./hooks/usePriorityChange");
const App_1 = require("./libs/actions/App");
const Delegate_1 = require("./libs/actions/Delegate");
const EmojiPickerAction = require("./libs/actions/EmojiPickerAction");
const Report = require("./libs/actions/Report");
const User = require("./libs/actions/User");
const ActiveClientManager = require("./libs/ActiveClientManager");
const Browser_1 = require("./libs/Browser");
const Environment = require("./libs/Environment/Environment");
const Fullstory_1 = require("./libs/Fullstory");
const Growl_1 = require("./libs/Growl");
const Log_1 = require("./libs/Log");
const migrateOnyx_1 = require("./libs/migrateOnyx");
const Navigation_1 = require("./libs/Navigation/Navigation");
const NavigationRoot_1 = require("./libs/Navigation/NavigationRoot");
const NetworkConnection_1 = require("./libs/NetworkConnection");
const PushNotification_1 = require("./libs/Notification/PushNotification");
require("./libs/Notification/PushNotification/subscribeToPushNotifications");
const setCrashlyticsUserId_1 = require("./libs/setCrashlyticsUserId");
const StartupTimer_1 = require("./libs/StartupTimer");
// This lib needs to be imported, but it has nothing to export since all it contains is an Onyx connection
require("./libs/UnreadIndicatorUpdater");
const Visibility_1 = require("./libs/Visibility");
const ONYXKEYS_1 = require("./ONYXKEYS");
const PopoverReportActionContextMenu_1 = require("./pages/home/report/ContextMenu/PopoverReportActionContextMenu");
const ReportActionContextMenu = require("./pages/home/report/ContextMenu/ReportActionContextMenu");
const SplashScreenStateContext_1 = require("./SplashScreenStateContext");
react_native_onyx_1.default.registerLogger(({ level, message, parameters }) => {
    if (level === 'alert') {
        Log_1.default.alert(message, parameters);
        console.error(message);
        // useOnyx() calls with "canBeMissing" config set to false will display a visual alert in dev environment
        // when they don't return data.
        const shouldShowAlert = typeof parameters === 'object' && !Array.isArray(parameters) && 'showAlert' in parameters && 'key' in parameters;
        if (Environment.isDevelopment() && shouldShowAlert) {
            Growl_1.default.error(`${message} Key: ${parameters.key}`, 10000);
        }
    }
    else if (level === 'hmmm') {
        Log_1.default.hmmm(message, parameters);
    }
    else {
        Log_1.default.info(message, undefined, parameters);
    }
});
function Expensify() {
    const appStateChangeListener = (0, react_1.useRef)(null);
    const [isNavigationReady, setIsNavigationReady] = (0, react_1.useState)(false);
    const [isOnyxMigrated, setIsOnyxMigrated] = (0, react_1.useState)(false);
    const { splashScreenState, setSplashScreenState } = (0, react_1.useContext)(SplashScreenStateContext_1.default);
    const [hasAttemptedToOpenPublicRoom, setAttemptedToOpenPublicRoom] = (0, react_1.useState)(false);
    const { translate, preferredLocale } = (0, useLocalize_1.default)();
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: true });
    const [lastRoute] = (0, useOnyx_1.default)(ONYXKEYS_1.default.LAST_ROUTE, { canBeMissing: true });
    const [userMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_METADATA, { canBeMissing: true });
    const [isCheckingPublicRoom = true] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_CHECKING_PUBLIC_ROOM, { initWithStoredValues: false, canBeMissing: true });
    const [updateAvailable] = (0, useOnyx_1.default)(ONYXKEYS_1.default.UPDATE_AVAILABLE, { initWithStoredValues: false, canBeMissing: true });
    const [updateRequired] = (0, useOnyx_1.default)(ONYXKEYS_1.default.UPDATE_REQUIRED, { initWithStoredValues: false, canBeMissing: true });
    const [isSidebarLoaded] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_SIDEBAR_LOADED, { canBeMissing: true });
    const [screenShareRequest] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SCREEN_SHARE_REQUEST, { canBeMissing: true });
    const [lastVisitedPath] = (0, useOnyx_1.default)(ONYXKEYS_1.default.LAST_VISITED_PATH, { canBeMissing: true });
    const [currentOnboardingPurposeSelected] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_PURPOSE_SELECTED, { canBeMissing: true });
    const [currentOnboardingCompanySize] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_COMPANY_SIZE, { canBeMissing: true });
    const [onboardingInitialPath] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_LAST_VISITED_PATH, { canBeMissing: true });
    const [allReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: false });
    (0, useDebugShortcut_1.default)();
    (0, usePriorityChange_1.default)();
    const [initialUrl, setInitialUrl] = (0, react_1.useState)(null);
    const { setIsAuthenticatedAtStartup } = (0, react_1.useContext)(InitialURLContextProvider_1.InitialURLContext);
    (0, react_1.useEffect)(() => {
        if (isCheckingPublicRoom) {
            return;
        }
        setAttemptedToOpenPublicRoom(true);
    }, [isCheckingPublicRoom]);
    const isAuthenticated = (0, useIsAuthenticated_1.default)();
    const autoAuthState = (0, react_1.useMemo)(() => session?.autoAuthState ?? '', [session]);
    const isSplashReadyToBeHidden = splashScreenState === CONST_1.default.BOOT_SPLASH_STATE.READY_TO_BE_HIDDEN;
    const isSplashVisible = splashScreenState === CONST_1.default.BOOT_SPLASH_STATE.VISIBLE;
    const shouldInit = isNavigationReady && hasAttemptedToOpenPublicRoom && !!preferredLocale;
    const shouldHideSplash = shouldInit && (CONFIG_1.default.IS_HYBRID_APP ? isSplashReadyToBeHidden : isSplashVisible);
    (0, react_1.useEffect)(() => {
        if (!shouldInit || splashScreenState !== CONST_1.default.BOOT_SPLASH_STATE.HIDDEN) {
            return;
        }
        // Clears OldDot UI after sign-out, if there's no OldDot UI left it has no effect.
        react_native_hybrid_app_1.default.clearOldDotAfterSignOut();
    }, [shouldInit, splashScreenState]);
    const initializeClient = () => {
        if (!Visibility_1.default.isVisible()) {
            return;
        }
        // Delay client init to avoid issues with delayed Onyx events on iOS. All iOS browsers use WebKit, which suspends events in background tabs.
        // Events are flushed only when the tab becomes active again causing issues with client initialization.
        // See: https://stackoverflow.com/questions/54095584/page-becomes-inactive-when-switching-tabs-on-ios
        if ((0, Browser_1.isSafari)()) {
            setTimeout(ActiveClientManager.init, 400);
        }
        else {
            ActiveClientManager.init();
        }
    };
    const setNavigationReady = (0, react_1.useCallback)(() => {
        setIsNavigationReady(true);
        // Navigate to any pending routes now that the NavigationContainer is ready
        Navigation_1.default.setIsNavigationReady();
    }, []);
    const onSplashHide = (0, react_1.useCallback)(() => {
        setSplashScreenState(CONST_1.default.BOOT_SPLASH_STATE.HIDDEN);
    }, [setSplashScreenState]);
    (0, react_1.useLayoutEffect)(() => {
        // Initialize this client as being an active client
        ActiveClientManager.init();
        // Used for the offline indicator appearing when someone is offline
        const unsubscribeNetInfo = NetworkConnection_1.default.subscribeToNetInfo(session?.accountID);
        return unsubscribeNetInfo;
    }, [session?.accountID]);
    (0, react_1.useEffect)(() => {
        // Initialize Fullstory lib
        Fullstory_1.default.init(userMetadata);
    }, [userMetadata]);
    // Log the platform and config to debug .env issues
    (0, react_1.useEffect)(() => {
        Log_1.default.info('App launched', false, { Platform: react_native_1.Platform, CONFIG: CONFIG_1.default });
    }, []);
    (0, react_1.useEffect)(() => {
        setTimeout(() => {
            const appState = react_native_1.AppState.currentState;
            Log_1.default.info('[BootSplash] splash screen status', false, { appState, splashScreenState });
            if (splashScreenState === CONST_1.default.BOOT_SPLASH_STATE.VISIBLE) {
                const propsToLog = {
                    isCheckingPublicRoom,
                    updateRequired,
                    updateAvailable,
                    isSidebarLoaded,
                    screenShareRequest,
                    isAuthenticated,
                    lastVisitedPath,
                };
                Log_1.default.alert('[BootSplash] splash screen is still visible', { propsToLog }, false);
            }
        }, 30 * 1000);
        // This timer is set in the native layer when launching the app and we stop it here so we can measure how long
        // it took for the main app itself to load.
        StartupTimer_1.default.stop();
        // Run any Onyx schema migrations and then continue loading the main app
        (0, migrateOnyx_1.default)().then(() => {
            // In case of a crash that led to disconnection, we want to remove all the push notifications.
            if (!isAuthenticated) {
                PushNotification_1.default.clearNotifications();
            }
            setIsOnyxMigrated(true);
        });
        appStateChangeListener.current = react_native_1.AppState.addEventListener('change', initializeClient);
        setIsAuthenticatedAtStartup(isAuthenticated);
        // If the app is opened from a deep link, get the reportID (if exists) from the deep link and navigate to the chat report
        react_native_1.Linking.getInitialURL().then((url) => {
            setInitialUrl(url);
            Report.openReportFromDeepLink(url ?? '', currentOnboardingPurposeSelected, currentOnboardingCompanySize, onboardingInitialPath, allReports);
        });
        // Open chat report from a deep link (only mobile native)
        react_native_1.Linking.addEventListener('url', (state) => {
            Report.openReportFromDeepLink(state.url, currentOnboardingPurposeSelected, currentOnboardingCompanySize, onboardingInitialPath, allReports);
        });
        if (CONFIG_1.default.IS_HYBRID_APP) {
            react_native_hybrid_app_1.default.onURLListenerAdded();
        }
        return () => {
            if (!appStateChangeListener.current) {
                return;
            }
            appStateChangeListener.current.remove();
        };
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- we don't want this effect to run again
    }, []);
    // This is being done since we want to play sound even when iOS device is on silent mode, to align with other platforms.
    (0, react_1.useEffect)(() => {
        expo_av_1.Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    }, []);
    (0, react_1.useLayoutEffect)(() => {
        if (!isNavigationReady || !lastRoute) {
            return;
        }
        (0, App_1.updateLastRoute)('');
        Navigation_1.default.navigate(lastRoute);
        // Disabling this rule because we only want it to run on the first render.
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [isNavigationReady]);
    (0, react_1.useEffect)(() => {
        if (!isAuthenticated) {
            return;
        }
        (0, setCrashlyticsUserId_1.default)(session?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID);
    }, [isAuthenticated, session?.accountID]);
    (0, react_1.useEffect)(() => {
        if (!account?.delegatedAccess?.delegate) {
            return;
        }
        if (account?.delegatedAccess?.delegates?.some((d) => d.email === account?.delegatedAccess?.delegate)) {
            return;
        }
        (0, Delegate_1.disconnect)();
    }, [account?.delegatedAccess?.delegates, account?.delegatedAccess?.delegate]);
    // Display a blank page until the onyx migration completes
    if (!isOnyxMigrated) {
        return null;
    }
    if (updateRequired) {
        throw new Error(CONST_1.default.ERROR.UPDATE_REQUIRED);
    }
    return (<DeeplinkWrapper_1.default isAuthenticated={isAuthenticated} autoAuthState={autoAuthState} initialUrl={initialUrl ?? ''}>
            {shouldInit && (<>
                    <GrowlNotification_1.default ref={Growl_1.growlRef}/>
                    <PopoverReportActionContextMenu_1.default ref={ReportActionContextMenu.contextMenuRef}/>
                    <EmojiPicker_1.default ref={EmojiPickerAction.emojiPickerRef}/>
                    {/* We include the modal for showing a new update at the top level so the option is always present. */}
                    {updateAvailable && !updateRequired ? <UpdateAppModal_1.default /> : null}
                    {screenShareRequest ? (<ConfirmModal_1.default title={translate('guides.screenShare')} onConfirm={() => User.joinScreenShare(screenShareRequest.accessToken, screenShareRequest.roomName)} onCancel={User.clearScreenShareRequest} prompt={translate('guides.screenShareRequest')} confirmText={translate('common.join')} cancelText={translate('common.decline')} isVisible/>) : null}
                </>)}

            <AppleAuthWrapper_1.default />
            {hasAttemptedToOpenPublicRoom && (<NavigationRoot_1.default onReady={setNavigationReady} authenticated={isAuthenticated} lastVisitedPath={lastVisitedPath} initialUrl={initialUrl}/>)}
            {shouldHideSplash && <SplashScreenHider_1.default onHide={onSplashHide}/>}
        </DeeplinkWrapper_1.default>);
}
Expensify.displayName = 'Expensify';
exports.default = Expensify;
