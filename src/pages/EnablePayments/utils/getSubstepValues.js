"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getSubstepValues(inputKeys, walletAdditionalDetailsDraft, walletAdditionalDetails) {
    return Object.entries(inputKeys).reduce((acc, [, value]) => {
        acc[value] = walletAdditionalDetailsDraft?.[value] ?? walletAdditionalDetails?.[value] ?? '';
        return acc;
    }, {});
}
exports.default = getSubstepValues;
