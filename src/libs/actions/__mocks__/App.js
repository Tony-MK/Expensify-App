"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KEYS_TO_PRESERVE = exports.updateLastVisitedPath = exports.createWorkspaceWithPolicyDraftAndNavigateToIt = exports.savePolicyDraftByNewWorkspace = exports.finalReconnectAppAfterActivatingReliableUpdates = exports.beginDeepLinkRedirectAfterTransition = exports.beginDeepLinkRedirect = exports.handleRestrictedEvent = exports.confirmReadyToOpenApp = exports.reconnectApp = exports.openApp = exports.redirectThirdPartyDesktopSignIn = exports.setUpPoliciesAndNavigate = exports.setSidebarLoaded = exports.setLocale = exports.mockValues = exports.getMissingOnyxUpdates = void 0;
const OnyxUpdates = require("@userActions/OnyxUpdates");
const createProxyForObject_1 = require("@src/utils/createProxyForObject");
jest.mock('@libs/actions/OnyxUpdates');
jest.mock('@libs/actions/OnyxUpdateManager/utils/applyUpdates');
const AppImplementation = jest.requireActual('@libs/actions/App');
const { setLocale, setSidebarLoaded, setUpPoliciesAndNavigate, redirectThirdPartyDesktopSignIn, openApp, reconnectApp, confirmReadyToOpenApp, handleRestrictedEvent, beginDeepLinkRedirect, beginDeepLinkRedirectAfterTransition, finalReconnectAppAfterActivatingReliableUpdates, savePolicyDraftByNewWorkspace, createWorkspaceWithPolicyDraftAndNavigateToIt, updateLastVisitedPath, KEYS_TO_PRESERVE, } = AppImplementation;
exports.setLocale = setLocale;
exports.setSidebarLoaded = setSidebarLoaded;
exports.setUpPoliciesAndNavigate = setUpPoliciesAndNavigate;
exports.redirectThirdPartyDesktopSignIn = redirectThirdPartyDesktopSignIn;
exports.openApp = openApp;
exports.reconnectApp = reconnectApp;
exports.confirmReadyToOpenApp = confirmReadyToOpenApp;
exports.handleRestrictedEvent = handleRestrictedEvent;
exports.beginDeepLinkRedirect = beginDeepLinkRedirect;
exports.beginDeepLinkRedirectAfterTransition = beginDeepLinkRedirectAfterTransition;
exports.finalReconnectAppAfterActivatingReliableUpdates = finalReconnectAppAfterActivatingReliableUpdates;
exports.savePolicyDraftByNewWorkspace = savePolicyDraftByNewWorkspace;
exports.createWorkspaceWithPolicyDraftAndNavigateToIt = createWorkspaceWithPolicyDraftAndNavigateToIt;
exports.updateLastVisitedPath = updateLastVisitedPath;
exports.KEYS_TO_PRESERVE = KEYS_TO_PRESERVE;
const mockValues = {
    missingOnyxUpdatesToBeApplied: undefined,
};
const mockValuesProxy = (0, createProxyForObject_1.default)(mockValues);
exports.mockValues = mockValuesProxy;
const getMissingOnyxUpdates = jest.fn((updateIDFrom, updateIDTo) => {
    const updates = mockValuesProxy.missingOnyxUpdatesToBeApplied ?? [];
    if (updates.length === 0) {
        for (let i = updateIDFrom + 1; i <= updateIDTo; i++) {
            updates.push({
                lastUpdateID: i,
                previousUpdateID: i - 1,
            });
        }
    }
    let chain = Promise.resolve();
    updates.forEach((update) => {
        chain = chain.then(() => {
            if (!OnyxUpdates.doesClientNeedToBeUpdated({ previousUpdateID: Number(update.previousUpdateID) })) {
                return OnyxUpdates.apply(update).then(() => undefined);
            }
            OnyxUpdates.saveUpdateInformation(update);
            return Promise.resolve();
        });
    });
    return chain;
});
exports.getMissingOnyxUpdates = getMissingOnyxUpdates;
