"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getInputKeysForBankInfoStep(corpayFields) {
    const keys = {};
    corpayFields?.formFields?.forEach((field) => {
        keys[field.id] = field.id;
    });
    return keys;
}
exports.default = getInputKeysForBankInfoStep;
