"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
var useOnyx_1 = require("./useOnyx");
function usePrivateSubscription() {
    var _a;
    var _b = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PRIVATE_SUBSCRIPTION, { canBeMissing: true }), privateSubscription = _b[0], privateSubscriptionResult = _b[1];
    if ((0, isLoadingOnyxValue_1.default)(privateSubscriptionResult)) {
        return undefined;
    }
    return privateSubscription
        ? __assign(__assign({}, privateSubscription), { autoRenew: (_a = privateSubscription.autoRenew) !== null && _a !== void 0 ? _a : true }) : undefined;
}
exports.default = usePrivateSubscription;
