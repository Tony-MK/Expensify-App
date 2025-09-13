"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useOnyx_1 = require("./useOnyx");
const useWorkspaceAccountID_1 = require("./useWorkspaceAccountID");
/**
 * This is a custom hook that combines workspace and domain card feeds for a given policy.
 *
 * This hook:
 * - Gets all available feeds (ONYXKEYS.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER) from Onyx.
 * - Extracts and compiles card feeds data including only feeds where the `preferredPolicy` matches the `policyID`.
 * - Merges a workspace feed with relevant domain feeds.
 *
 * @param policyID - The workspace policyID to filter and construct card feeds for.
 * @returns -
 *   A tuple containing:
 *     1. Card feeds specific to the given policyID (or `undefined` if unavailable).
 *     2. The result metadata from the Onyx collection fetch.
 */
const useCardFeeds = (policyID) => {
    const workspaceAccountID = (0, useWorkspaceAccountID_1.default)(policyID);
    const [allFeeds, allFeedsResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER, { canBeMissing: true });
    const workspaceFeeds = (0, react_1.useMemo)(() => {
        if (!policyID || !allFeeds) {
            return undefined;
        }
        const defaultFeed = allFeeds?.[`${ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER}${workspaceAccountID}`];
        const { companyCards = {}, companyCardNicknames = {}, oAuthAccountDetails = {} } = defaultFeed?.settings ?? {};
        const result = {
            settings: {
                companyCards: { ...companyCards },
                companyCardNicknames: { ...companyCardNicknames },
                oAuthAccountDetails: { ...oAuthAccountDetails },
            },
            isLoading: defaultFeed?.isLoading,
        };
        return Object.entries(allFeeds).reduce((acc, [onyxKey, feed]) => {
            if (!feed?.settings?.companyCards) {
                return acc;
            }
            Object.entries(feed.settings.companyCards).forEach(([key, feedSettings]) => {
                const feedName = key;
                const feedOAuthAccountDetails = feed.settings.oAuthAccountDetails?.[feedName];
                const feedCompanyCardNicknames = feed.settings.companyCardNicknames?.[feedName];
                if (feedSettings.preferredPolicy !== policyID || acc.settings.companyCards[feedName]) {
                    return;
                }
                const domainID = onyxKey.split('_').at(-1);
                acc.settings.companyCards[feedName] = { ...feedSettings, domainID: domainID ? Number(domainID) : undefined };
                if (feedOAuthAccountDetails) {
                    acc.settings.oAuthAccountDetails[feedName] = feedOAuthAccountDetails;
                }
                if (feedCompanyCardNicknames) {
                    acc.settings.companyCardNicknames[feedName] = feedCompanyCardNicknames;
                }
            });
            return acc;
        }, result);
    }, [allFeeds, policyID, workspaceAccountID]);
    return [workspaceFeeds, allFeedsResult];
};
exports.default = useCardFeeds;
