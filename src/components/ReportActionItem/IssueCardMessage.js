"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Button_1 = require("@components/Button");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const RenderHTML_1 = require("@components/RenderHTML");
const useGetExpensifyCardFromReportAction_1 = require("@hooks/useGetExpensifyCardFromReportAction");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function IssueCardMessage({ action, policyID }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const session = (0, OnyxListItemProvider_1.useSession)();
    const assigneeAccountID = (0, ReportActionsUtils_1.getOriginalMessage)(action)?.assigneeAccountID;
    const expensifyCard = (0, useGetExpensifyCardFromReportAction_1.default)({ reportAction: action, policyID });
    const isAssigneeCurrentUser = !(0, EmptyObject_1.isEmptyObject)(session) && session.accountID === assigneeAccountID;
    const shouldShowAddMissingDetailsButton = isAssigneeCurrentUser && (0, ReportActionsUtils_1.shouldShowAddMissingDetails)(action?.actionName, expensifyCard);
    const [cardList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CARD_LIST, { canBeMissing: true });
    const companyCard = cardList?.[(0, ReportActionsUtils_1.getOriginalMessage)(action)?.cardID];
    return (<>
            <RenderHTML_1.default html={`<muted-text>${(0, ReportActionsUtils_1.getCardIssuedMessage)({ reportAction: action, shouldRenderHTML: true, policyID, expensifyCard, companyCard })}</muted-text>`}/>
            {shouldShowAddMissingDetailsButton && (<Button_1.default onPress={() => Navigation_1.default.navigate(ROUTES_1.default.MISSING_PERSONAL_DETAILS)} success style={[styles.alignSelfStart, styles.mt3]} text={translate('workspace.expensifyCard.addShippingDetails')}/>)}
        </>);
}
IssueCardMessage.displayName = 'IssueCardMessage';
exports.default = IssueCardMessage;
