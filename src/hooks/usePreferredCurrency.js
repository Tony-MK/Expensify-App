"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useOnyx_1 = require("./useOnyx");
/**
 * Get user's preferred currency in the following order:
 *
 * 1. Payment card currency
 * 2. User's local currency (if it's a valid payment card currency)
 * 3. USD (default currency)
 *
 */
function usePreferredCurrency() {
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST);
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION);
    const [fundList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FUND_LIST);
    const paymentCardCurrency = (0, react_1.useMemo)(() => Object.values(fundList ?? {}).find((card) => card.accountData?.additionalData?.isBillingCard)?.accountData?.currency, [fundList]);
    if (paymentCardCurrency) {
        return paymentCardCurrency;
    }
    const currentUserLocalCurrency = (personalDetails?.[session?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID]?.localCurrencyCode ?? CONST_1.default.PAYMENT_CARD_CURRENCY.USD);
    return Object.values(CONST_1.default.PAYMENT_CARD_CURRENCY).includes(currentUserLocalCurrency) ? currentUserLocalCurrency : CONST_1.default.PAYMENT_CARD_CURRENCY.USD;
}
exports.default = usePreferredCurrency;
