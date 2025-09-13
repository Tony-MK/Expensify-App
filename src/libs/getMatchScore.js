"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getMatchScore;
function getMatchScore(str, query) {
    const lowerStr = str.toLowerCase();
    const lowerQuery = query.toLowerCase();
    if (lowerStr === lowerQuery) {
        return 3;
    }
    if (lowerStr.startsWith(lowerQuery)) {
        return 2;
    }
    if (lowerStr.includes(lowerQuery)) {
        return 1;
    }
    return 0;
}
