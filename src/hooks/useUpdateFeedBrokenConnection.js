"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useUpdateFeedBrokenConnection;
const react_1 = require("react");
const CardUtils_1 = require("@libs/CardUtils");
const CompanyCards_1 = require("@userActions/CompanyCards");
const CONST_1 = require("@src/CONST");
const useCardFeeds_1 = require("./useCardFeeds");
const useCardsList_1 = require("./useCardsList");
const usePolicy_1 = require("./usePolicy");
function useUpdateFeedBrokenConnection({ policyID, feed }) {
    const [cardsList] = (0, useCardsList_1.default)(policyID, feed);
    const policy = (0, usePolicy_1.default)(policyID);
    const [cardFeeds] = (0, useCardFeeds_1.default)(policyID);
    const companyFeeds = (0, CardUtils_1.getCompanyFeeds)(cardFeeds);
    const { cardList, ...cards } = cardsList ?? {};
    const workspaceAccountID = policy?.workspaceAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const domainOrWorkspaceAccountID = feed ? (0, CardUtils_1.getDomainOrWorkspaceAccountID)(workspaceAccountID, companyFeeds[feed]) : CONST_1.default.DEFAULT_NUMBER_ID;
    const isFeedConnectionBroken = (0, CardUtils_1.checkIfFeedConnectionIsBroken)(cards);
    const brokenCard = (0, CardUtils_1.getFeedConnectionBrokenCard)(cards);
    const brokenCardId = brokenCard?.cardID?.toString();
    const updateBrokenConnection = (0, react_1.useCallback)(() => {
        if (!brokenCardId || !feed) {
            return;
        }
        (0, CompanyCards_1.updateWorkspaceCompanyCard)(domainOrWorkspaceAccountID, brokenCardId, feed, brokenCard?.lastScrapeResult);
    }, [brokenCard?.lastScrapeResult, brokenCardId, domainOrWorkspaceAccountID, feed]);
    return { updateBrokenConnection, isFeedConnectionBroken };
}
