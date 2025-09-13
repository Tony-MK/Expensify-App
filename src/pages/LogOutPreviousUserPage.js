"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const InitialURLContextProvider_1 = require("@components/InitialURLContextProvider");
const useOnyx_1 = require("@hooks/useOnyx");
const SessionUtils_1 = require("@libs/SessionUtils");
const Navigation_1 = require("@navigation/Navigation");
const Session_1 = require("@userActions/Session");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
// This page is responsible for handling transitions from OldDot. Specifically, it logs the current user
// out if the transition is for another user.
//
// This component should not do any other navigation as that handled in App.setUpPoliciesAndNavigate
function LogOutPreviousUserPage({ route }) {
    const { initialURL } = (0, react_1.useContext)(InitialURLContextProvider_1.InitialURLContext);
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const isAccountLoading = account?.isLoading;
    const { authTokenType, shortLivedAuthToken = '', exitTo } = route?.params ?? {};
    (0, react_1.useEffect)(() => {
        const sessionEmail = session?.email;
        const transitionURL = CONFIG_1.default.IS_HYBRID_APP ? `${CONST_1.default.DEEPLINK_BASE_URL}${initialURL ?? ''}` : initialURL;
        const isLoggingInAsNewUser = (0, SessionUtils_1.isLoggingInAsNewUser)(transitionURL ?? undefined, sessionEmail);
        const isSupportalLogin = authTokenType === CONST_1.default.AUTH_TOKEN_TYPES.SUPPORT;
        if (isLoggingInAsNewUser) {
            // We don't want to close react-native app in this particular case.
            (0, Session_1.signOutAndRedirectToSignIn)(false, isSupportalLogin);
            return;
        }
        if (isSupportalLogin) {
            (0, Session_1.signInWithSupportAuthToken)(shortLivedAuthToken);
            Navigation_1.default.isNavigationReady().then(() => {
                // We must call goBack() to remove the /transition route from history
                Navigation_1.default.goBack();
                Navigation_1.default.navigate(ROUTES_1.default.HOME);
            });
            return;
        }
        // Even if the user was already authenticated in NewDot, we need to reauthenticate them with shortLivedAuthToken,
        // because the old authToken stored in Onyx may be invalid.
        (0, Session_1.signInWithShortLivedAuthToken)(shortLivedAuthToken);
        // We only want to run this effect once on mount (when the page first loads after transitioning from OldDot)
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [initialURL]);
    (0, react_1.useEffect)(() => {
        const sessionEmail = session?.email;
        const transitionURL = CONFIG_1.default.IS_HYBRID_APP ? `${CONST_1.default.DEEPLINK_BASE_URL}${initialURL ?? ''}` : initialURL;
        const isLoggingInAsNewUser = (0, SessionUtils_1.isLoggingInAsNewUser)(transitionURL ?? undefined, sessionEmail);
        // We don't want to navigate to the exitTo route when creating a new workspace from a deep link,
        // because we already handle creating the optimistic policy and navigating to it in App.setUpPoliciesAndNavigate,
        // which is already called when AuthScreens mounts.
        // For HybridApp we have separate logic to handle transitions.
        if (!CONFIG_1.default.IS_HYBRID_APP && exitTo !== ROUTES_1.default.WORKSPACE_NEW && !isAccountLoading && !isLoggingInAsNewUser) {
            Navigation_1.default.isNavigationReady().then(() => {
                // remove this screen and navigate to exit route
                Navigation_1.default.goBack();
                if (exitTo) {
                    Navigation_1.default.navigate(exitTo);
                }
            });
        }
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [initialURL, isAccountLoading]);
    return <FullscreenLoadingIndicator_1.default />;
}
LogOutPreviousUserPage.displayName = 'LogOutPreviousUserPage';
exports.default = LogOutPreviousUserPage;
