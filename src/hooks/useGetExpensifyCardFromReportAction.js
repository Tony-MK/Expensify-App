"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
function useGetExpensifyCardFromReportAction(_a) {
    var _b, _c;
    var reportAction = _a.reportAction, policyID = _a.policyID;
    var allUserCards = (0, OnyxListItemProvider_1.useCardList)();
    var workspaceAccountID = (0, PolicyUtils_1.getWorkspaceAccountID)(policyID);
    var allExpensifyCards = (0, OnyxListItemProvider_1.useWorkspaceCardList)();
    var expensifyCards = (_b = allExpensifyCards === null || allExpensifyCards === void 0 ? void 0 : allExpensifyCards["".concat(ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST).concat(workspaceAccountID, "_").concat(CONST_1.default.EXPENSIFY_CARD.BANK)]) !== null && _b !== void 0 ? _b : {};
    var cardIssuedActionOriginalMessage = (0, ReportActionsUtils_1.isCardIssuedAction)(reportAction) ? (0, ReportActionsUtils_1.getOriginalMessage)(reportAction) : undefined;
    var cardID = (_c = cardIssuedActionOriginalMessage === null || cardIssuedActionOriginalMessage === void 0 ? void 0 : cardIssuedActionOriginalMessage.cardID) !== null && _c !== void 0 ? _c : CONST_1.default.DEFAULT_NUMBER_ID;
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    return (0, PolicyUtils_1.isPolicyAdmin)((0, PolicyUtils_1.getPolicy)(policyID)) ? expensifyCards === null || expensifyCards === void 0 ? void 0 : expensifyCards[cardID] : allUserCards === null || allUserCards === void 0 ? void 0 : allUserCards[cardID];
}
exports.default = useGetExpensifyCardFromReportAction;
