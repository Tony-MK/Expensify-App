"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONFIG_1 = require("@src/CONFIG");
const ROUTES_1 = require("@src/ROUTES");
const getPlaidLinkTokenParameters = () => {
    const bankAccountRoute = window.location.href.includes('personal') ? ROUTES_1.default.BANK_ACCOUNT_PERSONAL : ROUTES_1.default.BANK_ACCOUNT;
    return { redirectURI: `${CONFIG_1.default.EXPENSIFY.NEW_EXPENSIFY_URL}${bankAccountRoute}` };
};
exports.default = getPlaidLinkTokenParameters;
