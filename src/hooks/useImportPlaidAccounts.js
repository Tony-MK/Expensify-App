"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useImportPlaidAccounts;
const react_1 = require("react");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Plaid_1 = require("@userActions/Plaid");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useOnyx_1 = require("./useOnyx");
function useImportPlaidAccounts(policyID) {
    const [assignCard] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ASSIGN_CARD, { canBeMissing: true });
    const [addNewCard] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ADD_NEW_COMPANY_CARD, { canBeMissing: true });
    const plaidToken = addNewCard?.data?.publicToken ?? assignCard?.data?.plaidAccessToken;
    const plaidFeed = addNewCard?.data?.plaidConnectedFeed ?? assignCard?.data?.institutionId;
    const plaidFeedName = addNewCard?.data?.plaidConnectedFeedName ?? assignCard?.data?.plaidConnectedFeedName;
    const plaidAccounts = addNewCard?.data?.plaidAccounts ?? assignCard?.data?.plaidAccounts;
    const country = addNewCard?.data?.selectedCountry;
    const statementPeriodEnd = addNewCard?.data?.statementPeriodEnd;
    const statementPeriodEndDay = addNewCard?.data?.statementPeriodEndDay;
    return (0, react_1.useCallback)(() => {
        if (!policyID || !plaidToken || !plaidFeed || !plaidFeedName || !country || !plaidAccounts?.length) {
            return;
        }
        (0, Plaid_1.importPlaidAccounts)(plaidToken, plaidFeed, plaidFeedName, country, (0, PolicyUtils_1.getDomainNameForPolicy)(policyID), JSON.stringify(plaidAccounts), statementPeriodEnd, statementPeriodEndDay);
    }, [statementPeriodEnd, statementPeriodEndDay, country, plaidAccounts, plaidFeed, plaidFeedName, plaidToken, policyID]);
}
