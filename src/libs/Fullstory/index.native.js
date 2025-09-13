"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("@fullstory/react-native");
var expensify_common_1 = require("expensify-common");
var CONST_1 = require("@src/CONST");
var Environment = require("@src/libs/Environment/Environment");
var common_1 = require("./common");
var FS = {
    Page: react_native_1.FSPage,
    getChatFSClass: common_1.default,
    init: function (userMetadata) { return FS.consentAndIdentify(userMetadata); },
    onReady: function () { return Promise.resolve(); },
    consent: function (shouldConsent) { return react_native_1.default.consent(shouldConsent); },
    identify: function (userMetadata, envName) {
        var localMetadata = userMetadata;
        localMetadata.environment = envName;
        react_native_1.default.identify(String(localMetadata.accountID), localMetadata);
    },
    consentAndIdentify: function (userMetadata) {
        // On the first subscribe for UserMetadata, this function will be called. We need
        // to confirm that we actually have any value here before proceeding.
        if (!(userMetadata === null || userMetadata === void 0 ? void 0 : userMetadata.accountID)) {
            return;
        }
        try {
            // We only use FullStory in production environment. We need to check this here
            // after the init function since this function is also called on updates for
            // UserMetadata onyx key.
            Environment.getEnvironment().then(function (envName) {
                var _a;
                var isTestEmail = userMetadata.email !== undefined && userMetadata.email.startsWith('fullstory') && userMetadata.email.endsWith(CONST_1.default.EMAIL.QA_DOMAIN);
                if ((CONST_1.default.ENVIRONMENT.PRODUCTION !== envName && !isTestEmail) || expensify_common_1.Str.extractEmailDomain((_a = userMetadata.email) !== null && _a !== void 0 ? _a : '') === CONST_1.default.EXPENSIFY_PARTNER_NAME) {
                    return;
                }
                react_native_1.default.restart();
                react_native_1.default.consent(true);
                FS.identify(userMetadata, envName);
            });
        }
        catch (e) {
            // error handler
        }
    },
    anonymize: function () { return react_native_1.default.anonymize(); },
};
exports.default = FS;
