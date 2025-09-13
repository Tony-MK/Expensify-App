"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function useGetExpensifyCardFromReportAction({ reportAction, policyID }) {
    const allUserCards = (0, OnyxListItemProvider_1.useCardList)();
    const workspaceAccountID = (0, PolicyUtils_1.getWorkspaceAccountID)(policyID);
    const allExpensifyCards = (0, OnyxListItemProvider_1.useWorkspaceCardList)();
    const expensifyCards = allExpensifyCards?.[`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${workspaceAccountID}_${CONST_1.default.EXPENSIFY_CARD.BANK}`] ?? {};
    const cardIssuedActionOriginalMessage = (0, ReportActionsUtils_1.isCardIssuedAction)(reportAction) ? (0, ReportActionsUtils_1.getOriginalMessage)(reportAction) : undefined;
    const cardID = cardIssuedActionOriginalMessage?.cardID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    return (0, PolicyUtils_1.isPolicyAdmin)((0, PolicyUtils_1.getPolicy)(policyID)) ? expensifyCards?.[cardID] : allUserCards?.[cardID];
}
exports.default = useGetExpensifyCardFromReportAction;
