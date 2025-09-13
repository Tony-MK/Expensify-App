"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const useOnyx_1 = require("./useOnyx");
function usePrivateSubscription() {
    const [privateSubscription, privateSubscriptionResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PRIVATE_SUBSCRIPTION, { canBeMissing: true });
    if ((0, isLoadingOnyxValue_1.default)(privateSubscriptionResult)) {
        return undefined;
    }
    return privateSubscription
        ? {
            ...privateSubscription,
            autoRenew: privateSubscription.autoRenew ?? true,
        }
        : undefined;
}
exports.default = usePrivateSubscription;
