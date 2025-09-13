"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CardUtils_1 = require("@libs/CardUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useOnyx_1 = require("./useOnyx");
const useWorkspaceAccountID_1 = require("./useWorkspaceAccountID");
/**
 * Hook to get the default fundID for a given policyID. This is used to get the settings and cards for each of the feeds.
 * It will always return lastSelectedExpensifyCardFeed if it exists or fallback to the domainFundID or workspaceAccountID.
 */
function useDefaultFundID(policyID) {
    const workspaceAccountID = (0, useWorkspaceAccountID_1.default)(policyID);
    const [lastSelectedExpensifyCardFeed] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.LAST_SELECTED_EXPENSIFY_CARD_FEED}${policyID}`, { canBeMissing: true });
    const [lastSelectedCardSettings] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.PRIVATE_EXPENSIFY_CARD_SETTINGS}${lastSelectedExpensifyCardFeed}`, { canBeMissing: true });
    const [domainFundID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.PRIVATE_EXPENSIFY_CARD_SETTINGS, {
        selector: (cardSettings) => {
            const matchingKey = Object.entries(cardSettings ?? {}).find(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ([key, settings]) => settings?.preferredPolicy && settings.preferredPolicy === policyID && !key.includes(workspaceAccountID.toString()));
            return (0, CardUtils_1.getFundIdFromSettingsKey)(matchingKey?.[0] ?? '');
        },
        canBeMissing: true,
    });
    if (lastSelectedExpensifyCardFeed && lastSelectedCardSettings?.paymentBankAccountID) {
        return lastSelectedExpensifyCardFeed;
    }
    if (domainFundID) {
        return domainFundID;
    }
    if (workspaceAccountID) {
        return workspaceAccountID;
    }
    return CONST_1.default.DEFAULT_NUMBER_ID;
}
exports.default = useDefaultFundID;
