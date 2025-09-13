"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Session_1 = require("@libs/actions/Session");
/**
 * Handles the case when the user's copilot has been deleted.
 * If the response contains jsonCode 408 and a message indicating copilot deletion,
 * the function signs the user out and redirects them to the sign-in page.
 */
const handleDeletedAccount = (requestResponse) => requestResponse.then((response) => {
    if (response?.jsonCode !== 408 || !response?.message?.includes('The account you are trying to use is deleted.')) {
        return response;
    }
    (0, Session_1.signOutAndRedirectToSignIn)(true, false, true, true);
});
exports.default = handleDeletedAccount;
