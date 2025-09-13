"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@fullstory/react-native");
const expensify_common_1 = require("expensify-common");
const CONST_1 = require("@src/CONST");
const Environment = require("@src/libs/Environment/Environment");
const common_1 = require("./common");
const FS = {
    Page: react_native_1.FSPage,
    getChatFSClass: common_1.default,
    init: (userMetadata) => FS.consentAndIdentify(userMetadata),
    onReady: () => Promise.resolve(),
    consent: (shouldConsent) => react_native_1.default.consent(shouldConsent),
    identify: (userMetadata, envName) => {
        const localMetadata = userMetadata;
        localMetadata.environment = envName;
        react_native_1.default.identify(String(localMetadata.accountID), localMetadata);
    },
    consentAndIdentify: (userMetadata) => {
        // On the first subscribe for UserMetadata, this function will be called. We need
        // to confirm that we actually have any value here before proceeding.
        if (!userMetadata?.accountID) {
            return;
        }
        try {
            // We only use FullStory in production environment. We need to check this here
            // after the init function since this function is also called on updates for
            // UserMetadata onyx key.
            Environment.getEnvironment().then((envName) => {
                const isTestEmail = userMetadata.email !== undefined && userMetadata.email.startsWith('fullstory') && userMetadata.email.endsWith(CONST_1.default.EMAIL.QA_DOMAIN);
                if ((CONST_1.default.ENVIRONMENT.PRODUCTION !== envName && !isTestEmail) || expensify_common_1.Str.extractEmailDomain(userMetadata.email ?? '') === CONST_1.default.EXPENSIFY_PARTNER_NAME) {
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
    anonymize: () => react_native_1.default.anonymize(),
};
exports.default = FS;
