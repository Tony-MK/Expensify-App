"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_webview_1 = require("react-native-webview");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const SAMLLoadingIndicator_1 = require("@components/SAMLLoadingIndicator");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const getPlatform_1 = require("@libs/getPlatform");
const getUAForWebView_1 = require("@libs/getUAForWebView");
const Log_1 = require("@libs/Log");
const LoginUtils_1 = require("@libs/LoginUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Session_1 = require("@userActions/Session");
const CONFIG_1 = require("@src/CONFIG");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function SAMLSignInPage() {
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT);
    const [credentials] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CREDENTIALS);
    const [showNavigation, shouldShowNavigation] = (0, react_1.useState)(true);
    const [SAMLUrl, setSAMLUrl] = (0, react_1.useState)('');
    const webViewRef = (0, react_1.useRef)(null);
    const { translate } = (0, useLocalize_1.default)();
    (0, react_1.useEffect)(() => {
        // If we don't have a valid login to pass here, direct the user back to a clean sign in state to try again
        if (!credentials?.login) {
            (0, LoginUtils_1.handleSAMLLoginError)(translate('common.error.email'), true);
            return;
        }
        // If we've already gotten a url back to log into the user's Identity Provider (IdP), then don't re-fetch it
        if (SAMLUrl) {
            return;
        }
        const body = new FormData();
        body.append('email', credentials.login);
        body.append('referer', CONFIG_1.default.EXPENSIFY.EXPENSIFY_CASH_REFERER);
        body.append('platform', (0, getPlatform_1.default)());
        (0, LoginUtils_1.postSAMLLogin)(body)
            .then((response) => {
            if (!response || !response.url) {
                (0, LoginUtils_1.handleSAMLLoginError)(translate('common.error.login'), false);
                return;
            }
            setSAMLUrl(response.url);
        })
            .catch((error) => {
            (0, LoginUtils_1.handleSAMLLoginError)(error.message ?? translate('common.error.login'), false);
        });
    }, [credentials?.login, SAMLUrl, translate]);
    /**
     * Handles in-app navigation once we get a response back from Expensify
     */
    const handleNavigationStateChange = (0, react_1.useCallback)(({ url }) => {
        // If we've gotten a callback then remove the option to navigate back to the sign-in page
        if (url.includes('loginCallback')) {
            shouldShowNavigation(false);
        }
        const searchParams = new URLSearchParams(new URL(url).search);
        const shortLivedAuthToken = searchParams.get('shortLivedAuthToken');
        if (!account?.isLoading && credentials?.login && !!shortLivedAuthToken) {
            Log_1.default.info('SAMLSignInPage - Successfully received shortLivedAuthToken. Signing in...');
            (0, Session_1.signInWithShortLivedAuthToken)(shortLivedAuthToken);
        }
        // If the login attempt is unsuccessful, set the error message for the account and redirect to sign in page
        if (searchParams.has('error')) {
            (0, Session_1.clearSignInData)();
            (0, Session_1.setAccountError)(searchParams.get('error') ?? '');
            Navigation_1.default.isNavigationReady().then(() => {
                // We must call goBack() to remove the /transition route from history
                Navigation_1.default.goBack();
                Navigation_1.default.navigate(ROUTES_1.default.HOME);
            });
        }
    }, [credentials?.login, shouldShowNavigation, account?.isLoading]);
    return (<ScreenWrapper_1.default shouldShowOfflineIndicator={false} includeSafeAreaPaddingBottom={false} testID={SAMLSignInPage.displayName}>
            {showNavigation && (<HeaderWithBackButton_1.default title="" onBackButtonPress={() => {
                (0, Session_1.clearSignInData)();
                Navigation_1.default.isNavigationReady().then(() => {
                    Navigation_1.default.goBack();
                });
            }}/>)}
            <FullPageOfflineBlockingView_1.default>
                {!SAMLUrl ? (<SAMLLoadingIndicator_1.default />) : (<react_native_webview_1.default ref={webViewRef} originWhitelist={['https://*']} source={{ uri: SAMLUrl }} userAgent={(0, getUAForWebView_1.default)()} incognito // 'incognito' prop required for Android, issue here https://github.com/react-native-webview/react-native-webview/issues/1352
         startInLoadingState renderLoading={() => <SAMLLoadingIndicator_1.default />} onNavigationStateChange={handleNavigationStateChange}/>)}
            </FullPageOfflineBlockingView_1.default>
        </ScreenWrapper_1.default>);
}
SAMLSignInPage.displayName = 'SAMLSignInPage';
exports.default = SAMLSignInPage;
