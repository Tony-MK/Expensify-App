"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var SearchUIUtils_1 = require("@libs/SearchUIUtils");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var mapOnyxCollectionItems_1 = require("@src/utils/mapOnyxCollectionItems");
var useCardFeedsForDisplay_1 = require("./useCardFeedsForDisplay");
var useNetwork_1 = require("./useNetwork");
var useOnyx_1 = require("./useOnyx");
var policySelector = function (policy) {
    return policy && {
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
};
/**
 * Get a list of all search groupings, along with their search items. Also returns the
 * currently focused search, based on the hash
 */
var useSearchTypeMenuSections = function () {
    var _a = (0, useCardFeedsForDisplay_1.default)(), defaultCardFeed = _a.defaultCardFeed, cardFeedsByPolicy = _a.cardFeedsByPolicy;
    var isOffline = (0, useNetwork_1.default)().isOffline;
    var allPolicies = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { selector: function (policies) { return (0, mapOnyxCollectionItems_1.default)(policies, policySelector); }, canBeMissing: true })[0];
    var currentUserLoginAndAccountID = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { selector: function (session) { return ({ email: session === null || session === void 0 ? void 0 : session.email, accountID: session === null || session === void 0 ? void 0 : session.accountID }); }, canBeMissing: false })[0];
    var activePolicyID = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, { canBeMissing: true })[0];
    var savedSearches = (0, useOnyx_1.default)(ONYXKEYS_1.default.SAVED_SEARCHES, { canBeMissing: true })[0];
    var typeMenuSections = (0, react_1.useMemo)(function () {
        return (0, SearchUIUtils_1.createTypeMenuSections)(currentUserLoginAndAccountID === null || currentUserLoginAndAccountID === void 0 ? void 0 : currentUserLoginAndAccountID.email, currentUserLoginAndAccountID === null || currentUserLoginAndAccountID === void 0 ? void 0 : currentUserLoginAndAccountID.accountID, cardFeedsByPolicy, defaultCardFeed, allPolicies, activePolicyID, savedSearches, isOffline);
    }, [currentUserLoginAndAccountID === null || currentUserLoginAndAccountID === void 0 ? void 0 : currentUserLoginAndAccountID.email, currentUserLoginAndAccountID === null || currentUserLoginAndAccountID === void 0 ? void 0 : currentUserLoginAndAccountID.accountID, cardFeedsByPolicy, defaultCardFeed, allPolicies, activePolicyID, savedSearches, isOffline]);
    return { typeMenuSections: typeMenuSections };
};
exports.default = useSearchTypeMenuSections;
