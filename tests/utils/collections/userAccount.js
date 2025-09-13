"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValidAccount = getValidAccount;
const CONST_1 = require("@src/CONST");
function getValidAccount(credentialLogin = '') {
    return {
        validated: true,
        primaryLogin: credentialLogin,
        isLoading: false,
        requiresTwoFactorAuth: false,
    };
}
exports.default = CONST_1.default.DEFAULT_ACCOUNT_DATA;
