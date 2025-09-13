"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("@src/CONST");
const useHasTeam2025Pricing_1 = require("./useHasTeam2025Pricing");
const usePreferredCurrency_1 = require("./usePreferredCurrency");
const usePrivateSubscription_1 = require("./usePrivateSubscription");
const useSubscriptionPlan_1 = require("./useSubscriptionPlan");
function useSubscriptionPrice() {
    const preferredCurrency = (0, usePreferredCurrency_1.default)();
    const subscriptionPlan = (0, useSubscriptionPlan_1.default)();
    const hasTeam2025Pricing = (0, useHasTeam2025Pricing_1.default)();
    const privateSubscription = (0, usePrivateSubscription_1.default)();
    const subscriptionType = privateSubscription?.type;
    if (!subscriptionPlan || !subscriptionType) {
        return 0;
    }
    if (hasTeam2025Pricing && subscriptionPlan === CONST_1.default.POLICY.TYPE.TEAM) {
        return CONST_1.default.SUBSCRIPTION_PRICES[preferredCurrency][subscriptionPlan][CONST_1.default.SUBSCRIPTION.PRICING_TYPE_2025];
    }
    return CONST_1.default.SUBSCRIPTION_PRICES[preferredCurrency][subscriptionPlan][subscriptionType];
}
exports.default = useSubscriptionPrice;
