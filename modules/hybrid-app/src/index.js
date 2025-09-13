"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HybridAppModule = {
    isHybridApp: function () {
        return false;
    },
    shouldUseStaging: function () {
        // eslint-disable-next-line no-console
        console.warn('HybridAppModule: `shouldUseStaging` should never be called on web');
    },
    closeReactNativeApp: function () {
        // eslint-disable-next-line no-console
        console.warn('HybridAppModule: `closeReactNativeApp` should never be called on web');
    },
    completeOnboarding: function () {
        // eslint-disable-next-line no-console
        console.warn('HybridAppModule: `completeOnboarding` should never be called on web');
    },
    switchAccount: function () {
        // eslint-disable-next-line no-console
        console.warn('HybridAppModule: `switchAccount` should never be called on web');
    },
    sendAuthToken: function () {
        // eslint-disable-next-line no-console
        console.warn('HybridAppModule: `sendAuthToken` should never be called on web');
    },
    getHybridAppSettings: function () {
        // eslint-disable-next-line no-console
        console.warn('HybridAppModule: `getHybridAppSettings` should never be called on web');
        return Promise.resolve(null);
    },
    getInitialURL: function () {
        // eslint-disable-next-line no-console
        console.warn('HybridAppModule: `getInitialURL` should never be called on web');
        return Promise.resolve(null);
    },
    onURLListenerAdded: function () {
        // eslint-disable-next-line no-console
        console.warn('HybridAppModule: `onURLListenerAdded` should never be called on web');
    },
    signInToOldDot: function () {
        // eslint-disable-next-line no-console
        console.warn('HybridAppModule: `signInToOldDot` should never be called on web');
    },
    signOutFromOldDot: function () {
        // eslint-disable-next-line no-console
        console.warn('HybridAppModule: `signOutFromOldDot` should never be called on web');
    },
    clearOldDotAfterSignOut: function () {
        // eslint-disable-next-line no-console
        console.warn('HybridAppModule: `clearOldDotAfterSignOut` should never be called on web');
    },
};
exports.default = HybridAppModule;
