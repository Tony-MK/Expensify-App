"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const falso_1 = require("@ngneat/falso");
function getValidCodeCredentials(login = (0, falso_1.randEmail)()) {
    return {
        login,
        validateCode: `${(0, falso_1.randNumber)()}`,
    };
}
exports.default = getValidCodeCredentials;
