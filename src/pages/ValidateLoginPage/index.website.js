"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const ExpiredValidateCodeModal_1 = require("@components/ValidateCode/ExpiredValidateCodeModal");
const JustSignedInModal_1 = require("@components/ValidateCode/JustSignedInModal");
const ValidateCodeModal_1 = require("@components/ValidateCode/ValidateCodeModal");
const useOnyx_1 = require("@hooks/useOnyx");
const desktopLoginRedirect_1 = require("@libs/desktopLoginRedirect");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ValidationUtils = require("@libs/ValidationUtils");
const Session = require("@userActions/Session");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function ValidateLoginPage({ route: { params: { accountID, validateCode, exitTo }, }, }) {
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT);
    const [credentials] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CREDENTIALS);
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION);
    const login = credentials?.login;
    const isSignedIn = !!session?.authToken && session?.authTokenType !== CONST_1.default.AUTH_TOKEN_TYPES.ANONYMOUS;
    // To ensure that the previous autoAuthState does not impact the rendering of the current magic link page, the autoAuthState prop sets initWithStoredValues to false.
    // This is done unless the user is signed in, in which case the page will be remounted upon successful sign-in, as explained in Session.initAutoAuthState.
    const [autoAuthState] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { initWithStoredValues: isSignedIn, selector: (sessionValue) => sessionValue?.autoAuthState });
    const autoAuthStateWithDefault = autoAuthState ?? CONST_1.default.AUTO_AUTH_STATE.NOT_STARTED;
    const is2FARequired = !!account?.requiresTwoFactorAuth;
    const cachedAccountID = credentials?.accountID;
    const isUserClickedSignIn = !login && isSignedIn && (autoAuthStateWithDefault === CONST_1.default.AUTO_AUTH_STATE.SIGNING_IN || autoAuthStateWithDefault === CONST_1.default.AUTO_AUTH_STATE.JUST_SIGNED_IN);
    const shouldStartSignInWithValidateCode = !isUserClickedSignIn && !isSignedIn && (!!login || !!exitTo) && ValidationUtils.isValidValidateCode(validateCode);
    const isNavigatingToExitTo = isSignedIn && !!exitTo;
    (0, react_1.useEffect)(() => {
        if (isUserClickedSignIn) {
            // The user clicked the option to sign in the current tab
            Navigation_1.default.isNavigationReady().then(() => {
                Navigation_1.default.goBack();
            });
            return;
        }
        Session.initAutoAuthState(autoAuthStateWithDefault);
        if (!shouldStartSignInWithValidateCode) {
            if (exitTo) {
                Session.handleExitToNavigation(exitTo);
            }
            return;
        }
        // The user has initiated the sign in process on the same browser, in another tab.
        Session.signInWithValidateCode(Number(accountID), validateCode);
        // Since on Desktop we don't have multi-tab functionality to handle the login flow,
        // we need to `popToTop` the stack after `signInWithValidateCode` in order to
        // perform login for both 2FA and non-2FA accounts.
        (0, desktopLoginRedirect_1.default)(autoAuthStateWithDefault, isSignedIn);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    (0, react_1.useEffect)(() => {
        if (!!login || !cachedAccountID || !is2FARequired) {
            if (exitTo) {
                Session.handleExitToNavigation(exitTo);
            }
            return;
        }
        // The user clicked the option to sign in the current tab
        Navigation_1.default.isNavigationReady().then(() => {
            Navigation_1.default.goBack();
        });
    }, [login, cachedAccountID, is2FARequired, exitTo]);
    return (<>
            {autoAuthStateWithDefault === CONST_1.default.AUTO_AUTH_STATE.FAILED && <ExpiredValidateCodeModal_1.default />}
            {autoAuthStateWithDefault === CONST_1.default.AUTO_AUTH_STATE.JUST_SIGNED_IN && is2FARequired && !isSignedIn && !!login && <JustSignedInModal_1.default is2FARequired/>}
            {autoAuthStateWithDefault === CONST_1.default.AUTO_AUTH_STATE.JUST_SIGNED_IN && isSignedIn && !exitTo && !!login && <JustSignedInModal_1.default is2FARequired={false}/>}
            {/* If session.autoAuthState isn't available yet, we use shouldStartSignInWithValidateCode to conditionally render the component instead of local autoAuthState which contains a default value of NOT_STARTED */}
            {(!autoAuthState ? !shouldStartSignInWithValidateCode : autoAuthStateWithDefault === CONST_1.default.AUTO_AUTH_STATE.NOT_STARTED && !isNavigatingToExitTo) && (<ValidateCodeModal_1.default accountID={Number(accountID)} code={validateCode}/>)}
            {(!autoAuthState ? shouldStartSignInWithValidateCode : autoAuthStateWithDefault === CONST_1.default.AUTO_AUTH_STATE.SIGNING_IN) && <FullscreenLoadingIndicator_1.default />}
        </>);
}
ValidateLoginPage.displayName = 'ValidateLoginPage';
exports.default = ValidateLoginPage;
