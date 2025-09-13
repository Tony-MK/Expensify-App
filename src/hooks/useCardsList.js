"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CardUtils_1 = require("@libs/CardUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useCardFeeds_1 = require("./useCardFeeds");
const useOnyx_1 = require("./useOnyx");
const useWorkspaceAccountID_1 = require("./useWorkspaceAccountID");
/* Custom hook that retrieves a list of company cards for the given policy and selected feed. */
const useCardsList = (policyID, selectedFeed) => {
    const workspaceAccountID = (0, useWorkspaceAccountID_1.default)(policyID);
    const [cardFeeds] = (0, useCardFeeds_1.default)(policyID);
    const companyCards = (0, CardUtils_1.getCompanyFeeds)(cardFeeds);
    const domainOrWorkspaceAccountID = (0, CardUtils_1.getDomainOrWorkspaceAccountID)(workspaceAccountID, selectedFeed ? companyCards[selectedFeed] : undefined);
    const [cardsList, cardsListMetadata] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${domainOrWorkspaceAccountID}_${selectedFeed}`, {
        selector: CardUtils_1.filterInactiveCards,
        canBeMissing: true,
    });
    return [cardsList, cardsListMetadata];
};
exports.default = useCardsList;
