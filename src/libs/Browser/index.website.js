"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetIsOpeningRouteInDesktop = exports.isOpeningRouteInDesktop = exports.openRouteInDesktopApp = exports.isChromeIOS = exports.isMobileChrome = exports.isModernSafari = exports.isSafari = exports.isMobileWebKit = exports.isMobileSafari = exports.isMobileIOS = exports.isMobile = exports.getBrowser = void 0;
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
let isOpenRouteInDesktop = false;
/**
 * Fetch browser name from UA string
 *
 */
const getBrowser = () => {
    const { userAgent } = window.navigator;
    const match = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))/i) ?? [];
    let temp;
    let browserName = '';
    if (/trident/i.test(match[1])) {
        return 'IE';
    }
    if (match[1] && match[1].toLowerCase() === 'chrome') {
        temp = userAgent.match(/\b(OPR)/);
        if (temp !== null) {
            return 'Opera';
        }
        temp = userAgent.match(/\b(Edg)/);
        if (temp !== null) {
            return 'Edge';
        }
    }
    browserName = match[1];
    return browserName ? browserName.toLowerCase() : CONST_1.default.BROWSER.OTHER;
};
exports.getBrowser = getBrowser;
/**
 * Whether the platform is a mobile browser.
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
 *
 */
const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Silk|Opera Mini/i.test(navigator.userAgent);
exports.isMobile = isMobile;
const isMobileIOS = () => {
    const userAgent = navigator.userAgent;
    return /iP(ad|od|hone)/i.test(userAgent);
};
exports.isMobileIOS = isMobileIOS;
/**
 * Checks if requesting user agent is Safari browser on a mobile device
 *
 */
const isMobileSafari = () => {
    const userAgent = navigator.userAgent;
    return /iP(ad|od|hone)/i.test(userAgent) && /WebKit/i.test(userAgent) && !/(CriOS|FxiOS|OPiOS|mercury)/i.test(userAgent);
};
exports.isMobileSafari = isMobileSafari;
/**
 * Checks if requesting user agent is Chrome browser on a mobile device
 *
 */
const isMobileChrome = () => {
    const userAgent = navigator.userAgent;
    return /Android/i.test(userAgent) && /chrome|chromium|crios/i.test(userAgent);
};
exports.isMobileChrome = isMobileChrome;
/**
 * Checks if the requesting user agent is a WebKit-based browser on an iOS mobile device.
 */
const isMobileWebKit = () => {
    const userAgent = navigator.userAgent;
    return /iP(ad|od|hone)/i.test(userAgent) && /WebKit/i.test(userAgent);
};
exports.isMobileWebKit = isMobileWebKit;
/**
 * Checks if the requesting user agent is a Chrome browser on an iOS mobile device.
 */
const isChromeIOS = () => {
    const userAgent = navigator.userAgent;
    return /iP(ad|od|hone)/i.test(userAgent) && /CriOS/i.test(userAgent);
};
exports.isChromeIOS = isChromeIOS;
const isSafari = () => getBrowser() === 'safari' || isMobileSafari();
exports.isSafari = isSafari;
/**
 * Checks if the requesting user agent is a modern version of Safari on iOS (version 18 or higher).
 */
const isModernSafari = () => {
    const version = navigator.userAgent.match(/OS (\d+_\d+)/);
    const iosVersion = version ? version[1].replace('_', '.') : '';
    return parseFloat(iosVersion) >= 18;
};
exports.isModernSafari = isModernSafari;
/**
 * The session information needs to be passed to the Desktop app, and the only way to do that is by using query params. There is no other way to transfer the data.
 */
const openRouteInDesktopApp = (shortLivedAuthToken = '', email = '', initialRoute = '') => {
    const params = new URLSearchParams();
    // If the user is opening the desktop app through a third party signin flow, we need to manually add the exitTo param
    // so that the desktop app redirects to the correct home route after signin is complete.
    const openingFromDesktopRedirect = window.location.pathname === `/${ROUTES_1.default.DESKTOP_SIGN_IN_REDIRECT}`;
    params.set('exitTo', `${openingFromDesktopRedirect ? '/r' : initialRoute || window.location.pathname}${window.location.search}${window.location.hash}`);
    if (email && shortLivedAuthToken) {
        params.set('email', email);
        params.set('shortLivedAuthToken', shortLivedAuthToken);
    }
    const expensifyUrl = new URL(CONFIG_1.default.EXPENSIFY.NEW_EXPENSIFY_URL);
    const expensifyDeeplinkUrl = `${CONST_1.default.DEEPLINK_BASE_URL}${expensifyUrl.host}/transition?${params.toString()}`;
    const browser = getBrowser();
    // This check is necessary for Safari, otherwise, if the user
    // does NOT have the Expensify desktop app installed, it's gonna
    // show an error in the page saying that the address is invalid.
    // It is also necessary for Firefox, otherwise the window.location.href redirect
    // will abort the fetch request from NetInfo, which will cause the app to go offline temporarily.
    if (browser === CONST_1.default.BROWSER.SAFARI || browser === CONST_1.default.BROWSER.FIREFOX) {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        if (iframe.contentWindow) {
            iframe.contentWindow.location.href = expensifyDeeplinkUrl;
        }
        // Since we're creating an iframe for Safari to handle deeplink,
        // we need to give Safari some time to open the pop-up window.
        // After that we can just remove the iframe.
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 0);
    }
    else {
        isOpenRouteInDesktop = true;
        window.location.href = expensifyDeeplinkUrl;
    }
};
exports.openRouteInDesktopApp = openRouteInDesktopApp;
const isOpeningRouteInDesktop = () => {
    return isOpenRouteInDesktop;
};
exports.isOpeningRouteInDesktop = isOpeningRouteInDesktop;
const resetIsOpeningRouteInDesktop = () => {
    isOpenRouteInDesktop = false;
};
exports.resetIsOpeningRouteInDesktop = resetIsOpeningRouteInDesktop;
