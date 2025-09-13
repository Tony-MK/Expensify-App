"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Button_1 = require("@components/Button");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var RenderHTML_1 = require("@components/RenderHTML");
var useGetExpensifyCardFromReportAction_1 = require("@hooks/useGetExpensifyCardFromReportAction");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Navigation_1 = require("@libs/Navigation/Navigation");
var ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var EmptyObject_1 = require("@src/types/utils/EmptyObject");
function IssueCardMessage(_a) {
    var _b, _c;
    var action = _a.action, policyID = _a.policyID;
    var translate = (0, useLocalize_1.default)().translate;
    var styles = (0, useThemeStyles_1.default)();
    var session = (0, OnyxListItemProvider_1.useSession)();
    var assigneeAccountID = (_b = (0, ReportActionsUtils_1.getOriginalMessage)(action)) === null || _b === void 0 ? void 0 : _b.assigneeAccountID;
    var expensifyCard = (0, useGetExpensifyCardFromReportAction_1.default)({ reportAction: action, policyID: policyID });
    var isAssigneeCurrentUser = !(0, EmptyObject_1.isEmptyObject)(session) && session.accountID === assigneeAccountID;
    var shouldShowAddMissingDetailsButton = isAssigneeCurrentUser && (0, ReportActionsUtils_1.shouldShowAddMissingDetails)(action === null || action === void 0 ? void 0 : action.actionName, expensifyCard);
    var cardList = (0, useOnyx_1.default)(ONYXKEYS_1.default.CARD_LIST, { canBeMissing: true })[0];
    var companyCard = cardList === null || cardList === void 0 ? void 0 : cardList[(_c = (0, ReportActionsUtils_1.getOriginalMessage)(action)) === null || _c === void 0 ? void 0 : _c.cardID];
    return (<>
            <RenderHTML_1.default html={"<muted-text>".concat((0, ReportActionsUtils_1.getCardIssuedMessage)({ reportAction: action, shouldRenderHTML: true, policyID: policyID, expensifyCard: expensifyCard, companyCard: companyCard }), "</muted-text>")}/>
            {shouldShowAddMissingDetailsButton && (<Button_1.default onPress={function () { return Navigation_1.default.navigate(ROUTES_1.default.MISSING_PERSONAL_DETAILS); }} success style={[styles.alignSelfStart, styles.mt3]} text={translate('workspace.expensifyCard.addShippingDetails')}/>)}
        </>);
}
IssueCardMessage.displayName = 'IssueCardMessage';
exports.default = IssueCardMessage;
