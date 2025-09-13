"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openOldDotLink = openOldDotLink;
exports.openExternalLink = openExternalLink;
exports.openLink = openLink;
exports.getInternalNewExpensifyPath = getInternalNewExpensifyPath;
exports.getInternalExpensifyPath = getInternalExpensifyPath;
exports.openTravelDotLink = openTravelDotLink;
exports.buildTravelDotURL = buildTravelDotURL;
exports.openExternalLinkWithToken = openExternalLinkWithToken;
exports.getTravelDotLink = getTravelDotLink;
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const asyncOpenURL_1 = require("@libs/asyncOpenURL");
const Environment = require("@libs/Environment/Environment");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Url = require("@libs/Url");
const UrlUtils_1 = require("@libs/UrlUtils");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const Session_1 = require("./Session");
let isNetworkOffline = false;
// Use connectWithoutView since this is to open an external link and doesn't affect any UI
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.NETWORK,
    callback: (value) => (isNetworkOffline = value?.isOffline ?? false),
});
let currentUserEmail = '';
let currentUserAccountID = CONST_1.default.DEFAULT_NUMBER_ID;
// Use connectWithoutView since this is to open an external link and doesn't affect any UI
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.SESSION,
    callback: (value) => {
        currentUserEmail = value?.email ?? '';
        currentUserAccountID = value?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    },
});
function buildOldDotURL(url, shortLivedAuthToken) {
    const hashIndex = url.lastIndexOf('#');
    const hasHashParams = hashIndex !== -1;
    const hasURLParams = url.indexOf('?') !== -1;
    let originURL = url;
    let hashParams = '';
    if (hasHashParams) {
        originURL = url.substring(0, hashIndex);
        hashParams = url.substring(hashIndex);
    }
    const authTokenParam = shortLivedAuthToken ? `authToken=${shortLivedAuthToken}` : '';
    const emailParam = `email=${encodeURIComponent(currentUserEmail)}`;
    const paramsArray = [authTokenParam, emailParam];
    const params = paramsArray.filter(Boolean).join('&');
    return Environment.getOldDotEnvironmentURL().then((environmentURL) => {
        const oldDotDomain = (0, UrlUtils_1.default)(environmentURL);
        // If the URL contains # or ?, we can assume they don't need to have the `?` token to start listing url parameters.
        return `${oldDotDomain}${originURL}${hasURLParams ? '&' : '?'}${params}${hashParams}`;
    });
}
/**
 * @param shouldSkipCustomSafariLogic When true, we will use `Linking.openURL` even if the browser is Safari.
 */
function openExternalLink(url, shouldSkipCustomSafariLogic = false, shouldOpenInSameTab = false) {
    (0, asyncOpenURL_1.default)(Promise.resolve(), url, shouldSkipCustomSafariLogic, shouldOpenInSameTab);
}
function openOldDotLink(url, shouldOpenInSameTab = false) {
    if (isNetworkOffline) {
        buildOldDotURL(url).then((oldDotURL) => openExternalLink(oldDotURL, undefined, shouldOpenInSameTab));
        return;
    }
    // If shortLivedAuthToken is not accessible, fallback to opening the link without the token.
    (0, asyncOpenURL_1.default)(
    // eslint-disable-next-line rulesdir/no-api-side-effects-method
    API.makeRequestWithSideEffects(types_1.SIDE_EFFECT_REQUEST_COMMANDS.OPEN_OLD_DOT_LINK, {}, {})
        .then((response) => (response ? buildOldDotURL(url, response.shortLivedAuthToken) : buildOldDotURL(url)))
        .catch(() => buildOldDotURL(url)), (oldDotURL) => oldDotURL, undefined, shouldOpenInSameTab);
}
function buildTravelDotURL(spotnanaToken, isTestAccount, postLoginPath) {
    const environmentURL = isTestAccount ? CONST_1.default.STAGING_TRAVEL_DOT_URL : CONST_1.default.TRAVEL_DOT_URL;
    const tmcID = isTestAccount ? CONST_1.default.STAGING_SPOTNANA_TMC_ID : CONST_1.default.SPOTNANA_TMC_ID;
    const authCode = `authCode=${spotnanaToken}`;
    const tmcIDParam = `tmcId=${tmcID}`;
    const redirectURL = postLoginPath ? `redirectUrl=${Url.addLeadingForwardSlash(postLoginPath)}` : '';
    const paramsArray = [authCode, tmcIDParam, redirectURL];
    const params = paramsArray.filter(Boolean).join('&');
    const travelDotDomain = (0, UrlUtils_1.default)(environmentURL);
    return `${travelDotDomain}auth/code?${params}`;
}
/**
 * @param postLoginPath When provided, we will redirect the user to this path post login on travelDot. eg: 'trips/:tripID'
 */
function openTravelDotLink(policyID, postLoginPath) {
    if (policyID === null || policyID === undefined) {
        return;
    }
    const parameters = {
        policyID,
    };
    return new Promise((resolve, reject) => {
        const error = new Error('Failed to generate spotnana token.');
        (0, asyncOpenURL_1.default)(
        // eslint-disable-next-line rulesdir/no-api-side-effects-method
        API.makeRequestWithSideEffects(types_1.SIDE_EFFECT_REQUEST_COMMANDS.GENERATE_SPOTNANA_TOKEN, parameters, {})
            .then((response) => {
            if (!response?.spotnanaToken) {
                reject(error);
                throw error;
            }
            const travelURL = buildTravelDotURL(response.spotnanaToken, response.isTestAccount ?? false, postLoginPath);
            resolve(undefined);
            return travelURL;
        })
            .catch(() => {
            reject(error);
            throw error;
        }), (travelDotURL) => travelDotURL ?? '');
    });
}
function getInternalNewExpensifyPath(href) {
    if (!href) {
        return '';
    }
    const attrPath = Url.getPathFromURL(href);
    return (Url.hasSameExpensifyOrigin(href, CONST_1.default.NEW_EXPENSIFY_URL) || Url.hasSameExpensifyOrigin(href, CONST_1.default.STAGING_NEW_EXPENSIFY_URL) || href.startsWith(CONST_1.default.DEV_NEW_EXPENSIFY_URL)) &&
        !CONST_1.default.PATHS_TO_TREAT_AS_EXTERNAL.find((path) => attrPath.startsWith(path))
        ? attrPath
        : '';
}
function getInternalExpensifyPath(href) {
    if (!href) {
        return '';
    }
    const attrPath = Url.getPathFromURL(href);
    const hasExpensifyOrigin = Url.hasSameExpensifyOrigin(href, CONFIG_1.default.EXPENSIFY.EXPENSIFY_URL) || Url.hasSameExpensifyOrigin(href, CONFIG_1.default.EXPENSIFY.STAGING_API_ROOT);
    if (!hasExpensifyOrigin || attrPath.startsWith(CONFIG_1.default.EXPENSIFY.CONCIERGE_URL_PATHNAME) || attrPath.startsWith(CONFIG_1.default.EXPENSIFY.DEVPORTAL_URL_PATHNAME)) {
        return '';
    }
    return attrPath;
}
function openLink(href, environmentURL, isAttachment = false) {
    const hasSameOrigin = Url.hasSameExpensifyOrigin(href, environmentURL);
    const hasExpensifyOrigin = Url.hasSameExpensifyOrigin(href, CONFIG_1.default.EXPENSIFY.EXPENSIFY_URL) || Url.hasSameExpensifyOrigin(href, CONFIG_1.default.EXPENSIFY.STAGING_API_ROOT);
    const internalNewExpensifyPath = getInternalNewExpensifyPath(href);
    const internalExpensifyPath = getInternalExpensifyPath(href);
    // There can be messages from Concierge with links to specific NewDot reports. Those URLs look like this:
    // https://www.expensify.com.dev/newdotreport?reportID=3429600449838908 and they have a target="_blank" attribute. This is so that when a user is on OldDot,
    // clicking on the link will open the chat in NewDot. However, when a user is in NewDot and clicks on the concierge link, the link needs to be handled differently.
    // Normally, the link would be sent to Link.openOldDotLink() and opened in a new tab, and that's jarring to the user. Since the intention is to link to a specific NewDot chat,
    // the reportID is extracted from the URL and then opened as an internal link, taking the user straight to the chat in the same tab.
    if (hasExpensifyOrigin && href.indexOf('newdotreport?reportID=') > -1) {
        const reportID = href.split('newdotreport?reportID=').pop();
        const reportRoute = ROUTES_1.default.REPORT_WITH_ID.getRoute(reportID);
        Navigation_1.default.navigate(reportRoute);
        return;
    }
    // If we are handling a New Expensify link then we will assume this should be opened by the app internally. This ensures that the links are opened internally via react-navigation
    // instead of in a new tab or with a page refresh (which is the default behavior of an anchor tag)
    if (internalNewExpensifyPath && hasSameOrigin) {
        if ((0, Session_1.isAnonymousUser)() && !(0, Session_1.canAnonymousUserAccessRoute)(internalNewExpensifyPath)) {
            (0, Session_1.signOutAndRedirectToSignIn)();
            return;
        }
        Navigation_1.default.navigate(internalNewExpensifyPath);
        return;
    }
    // If we are handling an old dot Expensify link we need to open it with openOldDotLink() so we can navigate to it with the user already logged in.
    // As attachments also use expensify.com we don't want it working the same as links.
    const isPublicOldDotURL = Object.values(CONST_1.default.OLD_DOT_PUBLIC_URLS).includes(href);
    if (internalExpensifyPath && !isAttachment && !isPublicOldDotURL) {
        openOldDotLink(internalExpensifyPath);
        return;
    }
    openExternalLink(href);
}
function buildURLWithAuthToken(url, shortLivedAuthToken) {
    const authTokenParam = shortLivedAuthToken ? `shortLivedAuthToken=${shortLivedAuthToken}` : '';
    const emailParam = `email=${encodeURIComponent(currentUserEmail)}`;
    const exitTo = `exitTo=${encodeURIComponent(url)}`;
    const accountID = `accountID=${currentUserAccountID}`;
    const referrer = 'referrer=desktop';
    const paramsArray = [accountID, emailParam, authTokenParam, exitTo, referrer];
    const params = paramsArray.filter(Boolean).join('&');
    return `${CONFIG_1.default.EXPENSIFY.NEW_EXPENSIFY_URL}transition?${params}`;
}
/**
 * @param shouldSkipCustomSafariLogic When true, we will use `Linking.openURL` even if the browser is Safari.
 */
function openExternalLinkWithToken(url, shouldSkipCustomSafariLogic = false) {
    (0, asyncOpenURL_1.default)(
    // eslint-disable-next-line rulesdir/no-api-side-effects-method
    API.makeRequestWithSideEffects(types_1.SIDE_EFFECT_REQUEST_COMMANDS.OPEN_OLD_DOT_LINK, {}, {})
        .then((response) => (response ? buildURLWithAuthToken(url, response.shortLivedAuthToken) : buildURLWithAuthToken(url)))
        .catch(() => buildURLWithAuthToken(url)), (link) => link, shouldSkipCustomSafariLogic);
}
function getTravelDotLink(policyID) {
    if (policyID === null || policyID === undefined) {
        return Promise.reject(new Error('Policy ID is required'));
    }
    const parameters = {
        policyID,
    };
    // eslint-disable-next-line rulesdir/no-api-side-effects-method
    return API.makeRequestWithSideEffects(types_1.SIDE_EFFECT_REQUEST_COMMANDS.GENERATE_SPOTNANA_TOKEN, parameters, {}).then((response) => {
        if (!response?.spotnanaToken) {
            throw new Error('Failed to generate spotnana token.');
        }
        return response;
    });
}
