"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("@src/CONST");
const usePreferredCurrency_1 = require("./usePreferredCurrency");
const usePrivateSubscription_1 = require("./usePrivateSubscription");
const useSubscriptionPlan_1 = require("./useSubscriptionPlan");
const POSSIBLE_COST_SAVINGS = {
    [CONST_1.default.PAYMENT_CARD_CURRENCY.USD]: {
        [CONST_1.default.POLICY.TYPE.TEAM]: 1000,
        [CONST_1.default.POLICY.TYPE.CORPORATE]: 1800,
    },
    [CONST_1.default.PAYMENT_CARD_CURRENCY.AUD]: {
        [CONST_1.default.POLICY.TYPE.TEAM]: 1400,
        [CONST_1.default.POLICY.TYPE.CORPORATE]: 3000,
    },
    [CONST_1.default.PAYMENT_CARD_CURRENCY.GBP]: {
        [CONST_1.default.POLICY.TYPE.TEAM]: 800,
        [CONST_1.default.POLICY.TYPE.CORPORATE]: 1400,
    },
    [CONST_1.default.PAYMENT_CARD_CURRENCY.NZD]: {
        [CONST_1.default.POLICY.TYPE.TEAM]: 1600,
        [CONST_1.default.POLICY.TYPE.CORPORATE]: 3200,
    },
    [CONST_1.default.PAYMENT_CARD_CURRENCY.EUR]: {
        [CONST_1.default.POLICY.TYPE.TEAM]: 1000,
        [CONST_1.default.POLICY.TYPE.CORPORATE]: 1600,
    },
};
function useSubscriptionPossibleCostSavings() {
    const preferredCurrency = (0, usePreferredCurrency_1.default)();
    const subscriptionPlan = (0, useSubscriptionPlan_1.default)();
    const privateSubscription = (0, usePrivateSubscription_1.default)();
    if (!subscriptionPlan || !privateSubscription?.type) {
        return 0;
    }
    return POSSIBLE_COST_SAVINGS[preferredCurrency][subscriptionPlan];
}
exports.default = useSubscriptionPossibleCostSavings;
