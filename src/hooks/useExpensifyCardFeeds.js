"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useOnyx_1 = require("./useOnyx");
const useWorkspaceAccountID_1 = require("./useWorkspaceAccountID");
function useExpensifyCardFeeds(policyID) {
    const workspaceAccountID = (0, useWorkspaceAccountID_1.default)(policyID);
    const [allExpensifyCardFeeds] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.PRIVATE_EXPENSIFY_CARD_SETTINGS, {
        selector: (cardSettings) => {
            const matchingEntries = Object.entries(cardSettings ?? {}).filter(([key, settings]) => {
                const isDomainFeed = !!(settings?.preferredPolicy && settings.preferredPolicy === policyID);
                const isWorkspaceFeed = key.includes(workspaceAccountID.toString()) && settings && Object.keys(settings).length > 1;
                return isDomainFeed || isWorkspaceFeed;
            });
            return Object.fromEntries(matchingEntries);
        },
        canBeMissing: true,
    });
    return allExpensifyCardFeeds;
}
exports.default = useExpensifyCardFeeds;
