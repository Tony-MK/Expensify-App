"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var CardFeedUtils_1 = require("@libs/CardFeedUtils");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var useLocalize_1 = require("./useLocalize");
var useOnyx_1 = require("./useOnyx");
var useCardFeedsForDisplay = function () {
    var localeCompare = (0, useLocalize_1.default)().localeCompare;
    var allFeeds = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER, { canBeMissing: true })[0];
    var activePolicyID = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, { canBeMissing: true })[0];
    var eligiblePoliciesIDs = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, {
        selector: function (policies) {
            return Object.values(policies !== null && policies !== void 0 ? policies : {}).reduce(function (policiesIDs, policy) {
                if ((0, PolicyUtils_1.isPaidGroupPolicy)(policy) && (policy === null || policy === void 0 ? void 0 : policy.areCompanyCardsEnabled)) {
                    policiesIDs.add(policy.id);
                }
                return policiesIDs;
            }, new Set());
        },
        canBeMissing: true,
    })[0];
    var cardFeedsByPolicy = (0, react_1.useMemo)(function () { return (0, CardFeedUtils_1.getCardFeedsForDisplayPerPolicy)(allFeeds); }, [allFeeds]);
    var defaultCardFeed = (0, react_1.useMemo)(function () {
        if (!eligiblePoliciesIDs) {
            return undefined;
        }
        // Prioritize the active policy if eligible
        if (activePolicyID && eligiblePoliciesIDs.has(activePolicyID)) {
            var policyCardFeeds = cardFeedsByPolicy[activePolicyID];
            if (policyCardFeeds === null || policyCardFeeds === void 0 ? void 0 : policyCardFeeds.length) {
                return policyCardFeeds.sort(function (a, b) { return localeCompare(a.name, b.name); }).at(0);
            }
        }
        // If the active policy doesn't have card feeds, use the first eligible policy that does
        for (var _i = 0, eligiblePoliciesIDs_1 = eligiblePoliciesIDs; _i < eligiblePoliciesIDs_1.length; _i++) {
            var eligiblePolicyID = eligiblePoliciesIDs_1[_i];
            var policyCardFeeds = cardFeedsByPolicy[eligiblePolicyID];
            if (policyCardFeeds === null || policyCardFeeds === void 0 ? void 0 : policyCardFeeds.length) {
                return policyCardFeeds.sort(function (a, b) { return localeCompare(a.name, b.name); }).at(0);
            }
        }
    }, [eligiblePoliciesIDs, activePolicyID, cardFeedsByPolicy, localeCompare]);
    return { defaultCardFeed: defaultCardFeed, cardFeedsByPolicy: cardFeedsByPolicy };
};
exports.default = useCardFeedsForDisplay;
