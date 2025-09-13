"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONFIG_1 = require("@src/CONFIG");
const getPlaidLinkTokenParameters = () => ({
    redirectURI: `${CONFIG_1.default.EXPENSIFY.NEW_EXPENSIFY_URL}partners/plaid/oauth_ios`,
});
exports.default = getPlaidLinkTokenParameters;
