"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const useOnyx_1 = require("@hooks/useOnyx");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Session = require("@userActions/Session");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function ValidateLoginPage({ route: { params: { accountID, validateCode, exitTo }, }, }) {
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION);
    (0, react_1.useEffect)(() => {
        // Wait till navigation becomes available
        Navigation_1.default.isNavigationReady().then(() => {
            if (session?.authToken && session?.authTokenType !== CONST_1.default.AUTH_TOKEN_TYPES.ANONYMOUS) {
                // If already signed in, do not show the validate code if not on web,
                // because we don't want to block the user with the interstitial page.
                if (exitTo) {
                    Session.handleExitToNavigation(exitTo);
                    return;
                }
                Navigation_1.default.goBack();
            }
            else {
                Session.signInWithValidateCodeAndNavigate(Number(accountID), validateCode, '', exitTo);
            }
        });
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    (0, react_1.useEffect)(() => {
        if (session?.autoAuthState !== CONST_1.default.AUTO_AUTH_STATE.FAILED) {
            return;
        }
        // Go back to initial route if validation fails
        Navigation_1.default.isNavigationReady().then(() => {
            Navigation_1.default.goBack();
        });
    }, [session?.autoAuthState]);
    return <FullscreenLoadingIndicator_1.default />;
}
ValidateLoginPage.displayName = 'ValidateLoginPage';
exports.default = ValidateLoginPage;
