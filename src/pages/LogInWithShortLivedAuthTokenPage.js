"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const useOnyx_1 = require("@hooks/useOnyx");
const Log_1 = require("@libs/Log");
const Navigation_1 = require("@libs/Navigation/Navigation");
const NetworkStore_1 = require("@libs/Network/NetworkStore");
const Session_1 = require("@userActions/Session");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SessionExpiredPage_1 = require("./ErrorPage/SessionExpiredPage");
function LogInWithShortLivedAuthTokenPage({ route }) {
    const { shortLivedAuthToken = '', shortLivedToken = '', authTokenType, exitTo, error } = route?.params ?? {};
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: false });
    (0, react_1.useEffect)(() => {
        // We have to check for both shortLivedAuthToken and shortLivedToken, as the old mobile app uses shortLivedToken, and is not being actively updated.
        const token = shortLivedAuthToken || shortLivedToken;
        // This is to prevent re-authenticating when logging out if the initial URL (deep link) hasn't changed.
        if (token === (0, NetworkStore_1.getLastShortAuthToken)()) {
            return;
        }
        if (!account?.isLoading && authTokenType === CONST_1.default.AUTH_TOKEN_TYPES.SUPPORT) {
            (0, Session_1.signInWithSupportAuthToken)(shortLivedAuthToken);
            Navigation_1.default.isNavigationReady().then(() => {
                // We must call goBack() to remove the /transition route from history
                Navigation_1.default.goBack();
                Navigation_1.default.navigate(ROUTES_1.default.HOME);
            });
            return;
        }
        // Try to authenticate using the shortLivedToken if we're not already trying to load the accounts
        if (token && !account?.isLoading) {
            Log_1.default.info('LogInWithShortLivedAuthTokenPage - Successfully received shortLivedAuthToken. Signing in...');
            (0, Session_1.signInWithShortLivedAuthToken)(token);
            return;
        }
        // If an error is returned as part of the route, ensure we set it in the onyxData for the account
        if (error) {
            (0, Session_1.setAccountError)(error);
        }
        if (exitTo) {
            Navigation_1.default.isNavigationReady().then(() => {
                // We must call goBack() to remove the /transition route from history
                Navigation_1.default.goBack();
                Navigation_1.default.navigate(exitTo);
            });
        }
        // The only dependencies of the effect are based on props.route
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [route]);
    if (account?.isLoading) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return <SessionExpiredPage_1.default />;
}
LogInWithShortLivedAuthTokenPage.displayName = 'LogInWithShortLivedAuthTokenPage';
exports.default = LogInWithShortLivedAuthTokenPage;
