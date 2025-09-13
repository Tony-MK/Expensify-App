"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_config_1 = require("react-native-config");
const Session_1 = require("@libs/actions/Session");
const Localize_1 = require("@libs/Localize");
const Log_1 = require("@libs/Log");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const AppleSignInLocales_1 = require("./AppleSignInLocales");
// react-native-config doesn't trim whitespace on iOS for some reason so we
// add a trim() call to lodashGet here to prevent headaches.
const getConfig = (config, key, defaultValue) => (config?.[key] ?? defaultValue).trim();
/**
 * Apple Sign In Configuration for Web.
 */
const config = {
    clientId: getConfig(react_native_config_1.default, 'ASI_CLIENTID_OVERRIDE', CONFIG_1.default.APPLE_SIGN_IN.SERVICE_ID),
    scope: 'name email',
    // never used, but required for configuration
    redirectURI: getConfig(react_native_config_1.default, 'ASI_REDIRECTURI_OVERRIDE', CONFIG_1.default.APPLE_SIGN_IN.REDIRECT_URI),
    state: '',
    nonce: '',
    usePopup: true,
};
/**
 * Apple Sign In success and failure listeners.
 */
const successListener = (event) => {
    const token = event.detail.authorization.id_token;
    (0, Session_1.beginAppleSignIn)(token);
};
const failureListener = (event) => {
    if (!event.detail || event.detail.error === 'popup_closed_by_user') {
        return null;
    }
    Log_1.default.warn(`Apple sign-in failed: ${event.detail.error}`);
};
/**
 * Apple Sign In button for Web.
 */
function AppleSignInDiv({ isDesktopFlow, onPointerDown }) {
    (0, react_1.useEffect)(() => {
        // `init` renders the button, so it must be called after the div is
        // first mounted.
        window.AppleID.auth.init(config);
    }, []);
    //  Result listeners need to live within the focused item to avoid duplicate
    //  side effects on success and failure.
    react_1.default.useEffect(() => {
        document.addEventListener('AppleIDSignInOnSuccess', successListener);
        document.addEventListener('AppleIDSignInOnFailure', failureListener);
        return () => {
            document.removeEventListener('AppleIDSignInOnSuccess', successListener);
            document.removeEventListener('AppleIDSignInOnFailure', failureListener);
        };
    }, []);
    return isDesktopFlow ? (<div id="appleid-signin" data-mode="center-align" data-type="continue" data-color="white" data-border="false" data-border-radius="50" data-width={CONST_1.default.SIGN_IN_FORM_WIDTH} data-height="52" style={{ cursor: 'pointer' }} onPointerDown={onPointerDown}/>) : (<div id="appleid-signin" data-mode="logo-only" data-type="sign in" data-color="white" data-border="false" data-border-radius="50" data-size="40" style={{ cursor: 'pointer' }} onPointerDown={onPointerDown}/>);
}
// The Sign in with Apple script may fail to render button if there are multiple
// of these divs present in the app, as it matches based on div id. So we'll
// only mount the div when it should be visible.
function SingletonAppleSignInButton({ isDesktopFlow, onPointerDown }) {
    const isFocused = (0, native_1.useIsFocused)();
    if (!isFocused) {
        return null;
    }
    return (<AppleSignInDiv isDesktopFlow={isDesktopFlow} onPointerDown={onPointerDown}/>);
}
function AppleSignIn({ isDesktopFlow = false, onPointerDown }) {
    const [scriptLoaded, setScriptLoaded] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (window.appleAuthScriptLoaded) {
            return;
        }
        const localeCode = AppleSignInLocales_1.default[(0, Localize_1.getDevicePreferredLocale)()];
        const script = document.createElement('script');
        script.src = `https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1//${localeCode}/appleid.auth.js`;
        script.async = true;
        script.onload = () => setScriptLoaded(true);
        document.body.appendChild(script);
    }, []);
    if (scriptLoaded === false) {
        return null;
    }
    return (<SingletonAppleSignInButton isDesktopFlow={isDesktopFlow} onPointerDown={onPointerDown}/>);
}
AppleSignIn.displayName = 'AppleSignIn';
exports.default = AppleSignIn;
