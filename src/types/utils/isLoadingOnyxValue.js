"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isLoadingOnyxValue(...results) {
    return results.some((result) => result.status === 'loading');
}
exports.default = isLoadingOnyxValue;
