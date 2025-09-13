"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useHandleBackButton_1 = require("@hooks/useHandleBackButton");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const App_1 = require("@libs/actions/App");
const Browser_1 = require("@libs/Browser");
const Navigation_1 = require("@libs/Navigation/Navigation");
const SequentialQueue_1 = require("@libs/Network/SequentialQueue");
const CONST_1 = require("@src/CONST");
const SCREENS_1 = require("@src/SCREENS");
const SignInPage_1 = require("./SignInPage");
function SignInModal() {
    const theme = (0, useTheme_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const signinPageRef = (0, react_1.useRef)(null);
    const session = (0, OnyxListItemProvider_1.useSession)();
    // Use of SignInPageWrapped (with shouldEnableMaxHeight prop in SignInPageWrapper) is a workaround for Safari not supporting interactive-widget=resizes-content.
    // This allows better scrolling experience after keyboard shows for modals with input, that are larger than remaining screen height.
    // More info https://github.com/Expensify/App/pull/62799#issuecomment-2943136220.
    const SignInPageBase = (0, react_1.useMemo)(() => ((0, Browser_1.isMobileSafari)() ? SignInPage_1.default : SignInPage_1.SignInPage), []);
    // The SignInPage (child component of SignInModal) uses useHandleBackButton, which adds a hardwareBackPress listener that remains active in the SignInModal.
    // Use of useHandleBackButton with a returning true callback disables the default SignInModal hardware Android button behaviour, leaving only SignInPage handling (https://github.com/Expensify/App/issues/69391).
    // The SignInPage Android back button behavior needs to remain because it is a fix for issue (https://github.com/Expensify/App/issues/67883) that occurs in the SignInModal.
    (0, useHandleBackButton_1.default)(() => {
        return true;
    });
    (0, react_1.useEffect)(() => {
        const isAnonymousUser = session?.authTokenType === CONST_1.default.AUTH_TOKEN_TYPES.ANONYMOUS;
        if (!isAnonymousUser) {
            // Signing in RHP is only for anonymous users
            Navigation_1.default.isNavigationReady().then(() => {
                Navigation_1.default.dismissModal();
            });
            // To prevent deadlock when OpenReport and OpenApp overlap, wait for the queue to be idle before calling openApp.
            // This ensures that any communication gaps between the client and server during OpenReport processing do not cause the queue to pause,
            // which would prevent us from processing or clearing the queue.
            (0, SequentialQueue_1.waitForIdle)().then(() => {
                (0, App_1.openApp)(true);
            });
        }
    }, [session?.authTokenType]);
    return (<ScreenWrapper_1.default style={[StyleUtils.getBackgroundColorStyle(theme.PAGE_THEMES[SCREENS_1.default.RIGHT_MODAL.SIGN_IN].backgroundColor)]} includeSafeAreaPaddingBottom={false} shouldShowOfflineIndicator={false} testID={SignInModal.displayName}>
            <HeaderWithBackButton_1.default onBackButtonPress={() => {
            if (!signinPageRef.current) {
                Navigation_1.default.goBack();
                return;
            }
            signinPageRef.current?.navigateBack();
        }}/>
            <SignInPageBase ref={signinPageRef}/>
        </ScreenWrapper_1.default>);
}
SignInModal.displayName = 'SignInModal';
exports.default = SignInModal;
