"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useUpdateFeedBrokenConnection;
var react_1 = require("react");
var CardUtils_1 = require("@libs/CardUtils");
var CompanyCards_1 = require("@userActions/CompanyCards");
var CONST_1 = require("@src/CONST");
var useCardFeeds_1 = require("./useCardFeeds");
var useCardsList_1 = require("./useCardsList");
var usePolicy_1 = require("./usePolicy");
function useUpdateFeedBrokenConnection(_a) {
    var _b, _c;
    var policyID = _a.policyID, feed = _a.feed;
    var cardsList = (0, useCardsList_1.default)(policyID, feed)[0];
    var policy = (0, usePolicy_1.default)(policyID);
    var cardFeeds = (0, useCardFeeds_1.default)(policyID)[0];
    var companyFeeds = (0, CardUtils_1.getCompanyFeeds)(cardFeeds);
    var _d = cardsList !== null && cardsList !== void 0 ? cardsList : {}, cardList = _d.cardList, cards = __rest(_d, ["cardList"]);
    var workspaceAccountID = (_b = policy === null || policy === void 0 ? void 0 : policy.workspaceAccountID) !== null && _b !== void 0 ? _b : CONST_1.default.DEFAULT_NUMBER_ID;
    var domainOrWorkspaceAccountID = feed ? (0, CardUtils_1.getDomainOrWorkspaceAccountID)(workspaceAccountID, companyFeeds[feed]) : CONST_1.default.DEFAULT_NUMBER_ID;
    var isFeedConnectionBroken = (0, CardUtils_1.checkIfFeedConnectionIsBroken)(cards);
    var brokenCard = (0, CardUtils_1.getFeedConnectionBrokenCard)(cards);
    var brokenCardId = (_c = brokenCard === null || brokenCard === void 0 ? void 0 : brokenCard.cardID) === null || _c === void 0 ? void 0 : _c.toString();
    var updateBrokenConnection = (0, react_1.useCallback)(function () {
        if (!brokenCardId || !feed) {
            return;
        }
        (0, CompanyCards_1.updateWorkspaceCompanyCard)(domainOrWorkspaceAccountID, brokenCardId, feed, brokenCard === null || brokenCard === void 0 ? void 0 : brokenCard.lastScrapeResult);
    }, [brokenCard === null || brokenCard === void 0 ? void 0 : brokenCard.lastScrapeResult, brokenCardId, domainOrWorkspaceAccountID, feed]);
    return { updateBrokenConnection: updateBrokenConnection, isFeedConnectionBroken: isFeedConnectionBroken };
}
