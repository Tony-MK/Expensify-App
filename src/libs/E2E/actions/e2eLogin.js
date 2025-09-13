"use strict";
/* eslint-disable rulesdir/prefer-actions-set-data */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
/* eslint-disable rulesdir/prefer-onyx-connect-in-libs */
const react_native_onyx_1 = require("react-native-onyx");
const Authentication_1 = require("@libs/Authentication");
const getConfigValueOrThrow_1 = require("@libs/E2E/utils/getConfigValueOrThrow");
const CONFIG_1 = require("@src/CONFIG");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const e2eUserCredentials = {
    email: (0, getConfigValueOrThrow_1.default)('EXPENSIFY_PARTNER_PASSWORD_EMAIL'),
    partnerUserID: (0, getConfigValueOrThrow_1.default)('EXPENSIFY_PARTNER_USER_ID'),
    partnerUserSecret: (0, getConfigValueOrThrow_1.default)('EXPENSIFY_PARTNER_USER_SECRET'),
    partnerName: CONFIG_1.default.EXPENSIFY.PARTNER_NAME,
    partnerPassword: CONFIG_1.default.EXPENSIFY.PARTNER_PASSWORD,
};
/**
 * Command for e2e test to automatically sign in a user.
 * If the user is already logged in the function will simply
 * resolve.
 *
 * @return Resolved true when the user was actually signed in. Returns false if the user was already logged in.
 */
function default_1() {
    const waitForBeginSignInToFinish = () => new Promise((resolve) => {
        // We opted for `connectWithoutView` here as this is being used for mocking data for E2E flow.
        const id = react_native_onyx_1.default.connectWithoutView({
            key: ONYXKEYS_1.default.CREDENTIALS,
            callback: (credentials) => {
                // beginSignUp writes to credentials.login once the API call is complete
                if (!credentials?.login) {
                    return;
                }
                resolve();
                react_native_onyx_1.default.disconnect(id);
            },
        });
    });
    let neededLogin = false;
    // Subscribe to auth token, to check if we are authenticated
    return new Promise((resolve, reject) => {
        // We opted for `connectWithoutView` here as this is being used for mocking data for E2E flow.
        const connection = react_native_onyx_1.default.connectWithoutView({
            key: ONYXKEYS_1.default.SESSION,
            callback: (session) => {
                if (session?.authToken == null || session.authToken.length === 0) {
                    neededLogin = true;
                    // authenticate with a predefined user
                    console.debug('[E2E] Signing in…');
                    (0, Authentication_1.Authenticate)(e2eUserCredentials)
                        .then((response) => {
                        if (!response) {
                            return;
                        }
                        react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, {
                            authToken: response.authToken,
                            creationDate: new Date().getTime(),
                            email: e2eUserCredentials.email,
                        });
                        console.debug('[E2E] Signed in finished!');
                        return waitForBeginSignInToFinish();
                    })
                        .catch((error) => {
                        console.error('[E2E] Error while signing in', error);
                        reject(error);
                    });
                }
                // signal that auth was completed
                resolve(neededLogin);
                react_native_onyx_1.default.disconnect(connection);
            },
        });
    });
}
