"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SearchUIUtils_1 = require("@libs/SearchUIUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const mapOnyxCollectionItems_1 = require("@src/utils/mapOnyxCollectionItems");
const useCardFeedsForDisplay_1 = require("./useCardFeedsForDisplay");
const useNetwork_1 = require("./useNetwork");
const useOnyx_1 = require("./useOnyx");
const policySelector = (policy) => policy && {
    id: policy.id,
    name: policy.name,
    type: policy.type,
    role: policy.role,
    owner: policy.owner,
    outputCurrency: policy.outputCurrency,
    isPolicyExpenseChatEnabled: policy.isPolicyExpenseChatEnabled,
    reimburser: policy.reimburser,
    exporter: policy.exporter,
    approver: policy.approver,
    approvalMode: policy.approvalMode,
    employeeList: policy.employeeList,
    reimbursementChoice: policy.reimbursementChoice,
    areCompanyCardsEnabled: policy.areCompanyCardsEnabled,
    areExpensifyCardsEnabled: policy.areExpensifyCardsEnabled,
    achAccount: policy.achAccount,
};
/**
 * Get a list of all search groupings, along with their search items. Also returns the
 * currently focused search, based on the hash
 */
const useSearchTypeMenuSections = () => {
    const { defaultCardFeed, cardFeedsByPolicy } = (0, useCardFeedsForDisplay_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const [allPolicies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { selector: (policies) => (0, mapOnyxCollectionItems_1.default)(policies, policySelector), canBeMissing: true });
    const [currentUserLoginAndAccountID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { selector: (session) => ({ email: session?.email, accountID: session?.accountID }), canBeMissing: false });
    const [activePolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, { canBeMissing: true });
    const [savedSearches] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SAVED_SEARCHES, { canBeMissing: true });
    const typeMenuSections = (0, react_1.useMemo)(() => (0, SearchUIUtils_1.createTypeMenuSections)(currentUserLoginAndAccountID?.email, currentUserLoginAndAccountID?.accountID, cardFeedsByPolicy, defaultCardFeed, allPolicies, activePolicyID, savedSearches, isOffline), [currentUserLoginAndAccountID?.email, currentUserLoginAndAccountID?.accountID, cardFeedsByPolicy, defaultCardFeed, allPolicies, activePolicyID, savedSearches, isOffline]);
    return { typeMenuSections };
};
exports.default = useSearchTypeMenuSections;
