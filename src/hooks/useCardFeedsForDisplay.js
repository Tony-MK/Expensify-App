"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const CardFeedUtils_1 = require("@libs/CardFeedUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useLocalize_1 = require("./useLocalize");
const useOnyx_1 = require("./useOnyx");
const useCardFeedsForDisplay = () => {
    const { localeCompare } = (0, useLocalize_1.default)();
    const [allFeeds] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER, { canBeMissing: true });
    const [activePolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, { canBeMissing: true });
    const [eligiblePoliciesIDs] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, {
        selector: (policies) => {
            return Object.values(policies ?? {}).reduce((policiesIDs, policy) => {
                if ((0, PolicyUtils_1.isPaidGroupPolicy)(policy) && policy?.areCompanyCardsEnabled) {
                    policiesIDs.add(policy.id);
                }
                return policiesIDs;
            }, new Set());
        },
        canBeMissing: true,
    });
    const cardFeedsByPolicy = (0, react_1.useMemo)(() => (0, CardFeedUtils_1.getCardFeedsForDisplayPerPolicy)(allFeeds), [allFeeds]);
    const defaultCardFeed = (0, react_1.useMemo)(() => {
        if (!eligiblePoliciesIDs) {
            return undefined;
        }
        // Prioritize the active policy if eligible
        if (activePolicyID && eligiblePoliciesIDs.has(activePolicyID)) {
            const policyCardFeeds = cardFeedsByPolicy[activePolicyID];
            if (policyCardFeeds?.length) {
                return policyCardFeeds.sort((a, b) => localeCompare(a.name, b.name)).at(0);
            }
        }
        // If the active policy doesn't have card feeds, use the first eligible policy that does
        for (const eligiblePolicyID of eligiblePoliciesIDs) {
            const policyCardFeeds = cardFeedsByPolicy[eligiblePolicyID];
            if (policyCardFeeds?.length) {
                return policyCardFeeds.sort((a, b) => localeCompare(a.name, b.name)).at(0);
            }
        }
    }, [eligiblePoliciesIDs, activePolicyID, cardFeedsByPolicy, localeCompare]);
    return { defaultCardFeed, cardFeedsByPolicy };
};
exports.default = useCardFeedsForDisplay;
