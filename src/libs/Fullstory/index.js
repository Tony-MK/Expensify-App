"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var browser_1 = require("@fullstory/browser");
var expensify_common_1 = require("expensify-common");
var Session = require("@userActions/Session");
var CONST_1 = require("@src/CONST");
var Environment = require("@src/libs/Environment/Environment");
var common_1 = require("./common");
// Placeholder Browser API does not support Manual Page definition
var FSPage = /** @class */ (function () {
    function FSPage() {
    }
    FSPage.prototype.start = function () { };
    return FSPage;
}());
var FS = {
    Page: FSPage,
    getChatFSClass: common_1.default,
    init: function () { },
    onReady: function () {
        return new Promise(function (resolve) {
            if (!(0, browser_1.isInitialized)()) {
                (0, browser_1.init)({ orgId: 'o-1WN56P-na1' }, resolve);
                // FS init function might have a race condition with the head snippet. If the head snipped is loaded first,
                // then the init function will not call the resolve function, and we'll never identify the user logging in,
                // and we need to call resolve manually. We're adding a 1s timeout to make sure the init function has enough
                // time to call the resolve function in case it ran successfully.
                setTimeout(resolve, 1000);
            }
            else {
                (0, browser_1.FullStory)(CONST_1.default.FULLSTORY.OPERATION.OBSERVE, { type: 'start', callback: resolve });
            }
        });
    },
    consent: function (shouldConsent) { return (0, browser_1.FullStory)(CONST_1.default.FULLSTORY.OPERATION.SET_IDENTITY, { consent: shouldConsent }); },
    identify: function (userMetadata) {
        /**
         * Sets the FullStory user identity based on the provided metadata information.
         * If the metadata does not contain an email, the user identity is anonymized.
         * If the metadata contains an accountID, the user identity is defined with it.
         */
        (0, browser_1.FullStory)(CONST_1.default.FULLSTORY.OPERATION.SET_IDENTITY, {
            uid: String(userMetadata.accountID),
            properties: userMetadata,
        });
    },
    consentAndIdentify: function (userMetadata) {
        // On the first subscribe for UserMetadata, this function will be called. We need
        // to confirm that we actually have any value here before proceeding.
        if (!(userMetadata === null || userMetadata === void 0 ? void 0 : userMetadata.accountID)) {
            return;
        }
        try {
            Environment.getEnvironment().then(function (envName) {
                var _a;
                var isTestEmail = userMetadata.email !== undefined && userMetadata.email.startsWith('fullstory') && userMetadata.email.endsWith(CONST_1.default.EMAIL.QA_DOMAIN);
                if ((CONST_1.default.ENVIRONMENT.PRODUCTION !== envName && !isTestEmail) ||
                    expensify_common_1.Str.extractEmailDomain((_a = userMetadata.email) !== null && _a !== void 0 ? _a : '') === CONST_1.default.EXPENSIFY_PARTNER_NAME ||
                    Session.isSupportAuthToken()) {
                    // On web, if we started FS at some point in a browser, it will run forever. So let's shut it down if we don't want it to run.
                    if ((0, browser_1.isInitialized)()) {
                        (0, browser_1.FullStory)(CONST_1.default.FULLSTORY.OPERATION.SHUTDOWN);
                    }
                    return;
                }
                // If Fullstory was already initialized, we might have shutdown the session. So let's
                // restart it before identifying the user.
                if ((0, browser_1.isInitialized)()) {
                    (0, browser_1.FullStory)(CONST_1.default.FULLSTORY.OPERATION.RESTART);
                }
                FS.onReady().then(function () {
                    FS.consent(true);
                    var localMetadata = userMetadata;
                    localMetadata.environment = envName;
                    FS.identify(localMetadata);
                });
            });
        }
        catch (e) {
            // error handler
        }
    },
    anonymize: function () { return (0, browser_1.FullStory)(CONST_1.default.FULLSTORY.OPERATION.SET_IDENTITY, { anonymous: true }); },
};
exports.default = FS;
