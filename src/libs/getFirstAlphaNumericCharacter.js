"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getFirstAlphaNumericCharacter(str) {
    if (str === void 0) { str = ''; }
    return str
        .normalize('NFD')
        .replace(/[^0-9a-z]/gi, '')
        .toUpperCase()[0];
}
exports.default = getFirstAlphaNumericCharacter;
