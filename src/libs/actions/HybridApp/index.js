"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHybridAppSettings = getHybridAppSettings;
exports.setReadyToShowAuthScreens = setReadyToShowAuthScreens;
exports.resetSignInFlow = resetSignInFlow;
exports.prepareHybridAppAfterTransitionToNewDot = prepareHybridAppAfterTransitionToNewDot;
exports.setUseNewDotSignInPage = setUseNewDotSignInPage;
exports.setClosingReactNativeApp = setClosingReactNativeApp;
exports.closeReactNativeApp = closeReactNativeApp;
exports.migrateHybridAppToNewPartnerName = migrateHybridAppToNewPartnerName;
const react_native_hybrid_app_1 = require("@expensify/react-native-hybrid-app");
const react_native_onyx_1 = require("react-native-onyx");
const Log_1 = require("@libs/Log");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONFIG_1 = require("@src/CONFIG");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
/*
 * Parses initial settings passed from OldDot app
 */
function parseHybridAppSettings(hybridAppSettings) {
    if (!hybridAppSettings) {
        return null;
    }
    return JSON.parse(hybridAppSettings);
}
function getHybridAppSettings() {
    return react_native_hybrid_app_1.default.getHybridAppSettings().then((hybridAppSettings) => {
        return parseHybridAppSettings(hybridAppSettings);
    });
}
function closeReactNativeApp({ shouldSetNVP }) {
    Navigation_1.default.clearPreloadedRoutes();
    if (CONFIG_1.default.IS_HYBRID_APP) {
        react_native_onyx_1.default.merge(ONYXKEYS_1.default.HYBRID_APP, { closingReactNativeApp: true });
    }
    // eslint-disable-next-line no-restricted-properties
    react_native_hybrid_app_1.default.closeReactNativeApp({ shouldSetNVP });
}
/*
 * Changes value of `readyToShowAuthScreens`
 */
function setReadyToShowAuthScreens(readyToShowAuthScreens) {
    // This value is only relevant for HybridApp, so we can skip it in other environments.
    if (!CONFIG_1.default.IS_HYBRID_APP) {
        return;
    }
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.HYBRID_APP, { readyToShowAuthScreens });
}
function setUseNewDotSignInPage(useNewDotSignInPage) {
    // This value is only relevant for HybridApp, so we can skip it in other environments.
    if (!CONFIG_1.default.IS_HYBRID_APP) {
        return Promise.resolve();
    }
    return react_native_onyx_1.default.merge(ONYXKEYS_1.default.HYBRID_APP, { useNewDotSignInPage });
}
function setClosingReactNativeApp(closingReactNativeApp) {
    // This value is only relevant for HybridApp, so we can skip it in other environments.
    if (!CONFIG_1.default.IS_HYBRID_APP) {
        return;
    }
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.HYBRID_APP, { closingReactNativeApp });
}
/*
 * Starts HybridApp sign-in flow from the beginning.
 */
function resetSignInFlow() {
    // This value is only relevant for HybridApp, so we can skip it in other environments.
    if (!CONFIG_1.default.IS_HYBRID_APP) {
        return Promise.resolve();
    }
    return react_native_onyx_1.default.merge(ONYXKEYS_1.default.HYBRID_APP, {
        readyToShowAuthScreens: false,
        useNewDotSignInPage: true,
    });
}
/*
 * Updates Onyx state after start of React Native runtime based on initial `useNewDotSignInPage` value
 */
function prepareHybridAppAfterTransitionToNewDot(hybridApp) {
    if (hybridApp?.useNewDotSignInPage) {
        return react_native_onyx_1.default.merge(ONYXKEYS_1.default.HYBRID_APP, {
            ...hybridApp,
            readyToShowAuthScreens: !(hybridApp?.useNewDotSignInPage ?? false),
        });
    }
    // When we transition with useNewDotSignInPage === false, it means that we're already authenticated on NewDot side.
    return react_native_onyx_1.default.merge(ONYXKEYS_1.default.HYBRID_APP, {
        ...hybridApp,
        readyToShowAuthScreens: true,
    });
}
function migrateHybridAppToNewPartnerName() {
    if (!CONFIG_1.default.IS_HYBRID_APP) {
        return;
    }
    Log_1.default.info('[HybridApp] Migrating to new partner name');
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.HYBRID_APP, {
        shouldUseNewPartnerName: true,
    });
}
