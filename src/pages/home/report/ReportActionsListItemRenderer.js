"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ReportActionItem_1 = require("./ReportActionItem");
const ReportActionItemParentAction_1 = require("./ReportActionItemParentAction");
function ReportActionsListItemRenderer({ allReports, policies, reportAction, reportActions = [], transactions, parentReportAction, index, report, transactionThreadReport, displayAsGroup, mostRecentIOUReportActionID = '', shouldHideThreadDividerLine, shouldDisplayNewMarker, linkedReportActionID = '', shouldDisplayReplyDivider, isFirstVisibleReportAction = false, shouldUseThreadDividerLine = false, shouldHighlight = false, parentReportActionForTransactionThread, draftMessage, emojiReactions, userWalletTierName, linkedTransactionRouteError, isUserValidated, userBillingFundID, personalDetails, allDraftMessages, allEmojiReactions, isTryNewDotNVPDismissed = false, isReportArchived = false, }) {
    const originalMessage = (0, react_1.useMemo)(() => (0, ReportActionsUtils_1.getOriginalMessage)(reportAction), [reportAction]);
    /**
     * Create a lightweight ReportAction so as to keep the re-rendering as light as possible by
     * passing in only the required props.
     */
    const action = (0, react_1.useMemo)(() => ({
        reportActionID: reportAction.reportActionID,
        message: reportAction.message,
        pendingAction: reportAction.pendingAction,
        actionName: reportAction.actionName,
        errors: reportAction.errors,
        originalMessage,
        childCommenterCount: reportAction.childCommenterCount,
        linkMetadata: reportAction.linkMetadata,
        childReportID: reportAction.childReportID,
        childLastVisibleActionCreated: reportAction.childLastVisibleActionCreated,
        error: reportAction.error,
        created: reportAction.created,
        actorAccountID: reportAction.actorAccountID,
        adminAccountID: reportAction.adminAccountID,
        childVisibleActionCount: reportAction.childVisibleActionCount,
        childOldestFourAccountIDs: reportAction.childOldestFourAccountIDs,
        childType: reportAction.childType,
        person: reportAction.person,
        isOptimisticAction: reportAction.isOptimisticAction,
        delegateAccountID: reportAction.delegateAccountID,
        previousMessage: reportAction.previousMessage,
        isAttachmentWithText: reportAction.isAttachmentWithText,
        childStateNum: reportAction.childStateNum,
        childStatusNum: reportAction.childStatusNum,
        childReportName: reportAction.childReportName,
        childManagerAccountID: reportAction.childManagerAccountID,
        childMoneyRequestCount: reportAction.childMoneyRequestCount,
        childOwnerAccountID: reportAction.childOwnerAccountID,
    }), [
        reportAction.reportActionID,
        reportAction.message,
        reportAction.pendingAction,
        reportAction.actionName,
        reportAction.errors,
        reportAction.childCommenterCount,
        reportAction.linkMetadata,
        reportAction.childReportID,
        reportAction.childLastVisibleActionCreated,
        reportAction.error,
        reportAction.created,
        reportAction.actorAccountID,
        reportAction.adminAccountID,
        reportAction.childVisibleActionCount,
        reportAction.childOldestFourAccountIDs,
        reportAction.childType,
        reportAction.person,
        reportAction.isOptimisticAction,
        reportAction.delegateAccountID,
        reportAction.previousMessage,
        reportAction.isAttachmentWithText,
        reportAction.childStateNum,
        reportAction.childStatusNum,
        reportAction.childReportName,
        reportAction.childManagerAccountID,
        reportAction.childMoneyRequestCount,
        reportAction.childOwnerAccountID,
        originalMessage,
    ]);
    const shouldDisplayParentAction = reportAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED && (!(0, ReportActionsUtils_1.isTransactionThread)(parentReportAction) || (0, ReportActionsUtils_1.isSentMoneyReportAction)(parentReportAction));
    if (shouldDisplayParentAction && (0, ReportUtils_1.isChatThread)(report)) {
        return (<ReportActionItemParentAction_1.default allReports={allReports} policies={policies} shouldHideThreadDividerLine={shouldDisplayParentAction && shouldHideThreadDividerLine} shouldDisplayReplyDivider={shouldDisplayReplyDivider} parentReportAction={parentReportAction} reportID={report.reportID} report={report} reportActions={reportActions} transactionThreadReport={transactionThreadReport} index={index} isFirstVisibleReportAction={isFirstVisibleReportAction} shouldUseThreadDividerLine={shouldUseThreadDividerLine} userWalletTierName={userWalletTierName} isUserValidated={isUserValidated} personalDetails={personalDetails} allDraftMessages={allDraftMessages} allEmojiReactions={allEmojiReactions} linkedTransactionRouteError={linkedTransactionRouteError} userBillingFundID={userBillingFundID} isTryNewDotNVPDismissed={isTryNewDotNVPDismissed} isReportArchived={isReportArchived}/>);
    }
    return (<ReportActionItem_1.default allReports={allReports} policies={policies} shouldHideThreadDividerLine={shouldHideThreadDividerLine} parentReportAction={parentReportAction} report={report} transactionThreadReport={transactionThreadReport} parentReportActionForTransactionThread={parentReportActionForTransactionThread} action={action} reportActions={reportActions} linkedReportActionID={linkedReportActionID} displayAsGroup={displayAsGroup} transactions={transactions} shouldDisplayNewMarker={shouldDisplayNewMarker} isMostRecentIOUReportAction={reportAction.reportActionID === mostRecentIOUReportActionID} index={index} isFirstVisibleReportAction={isFirstVisibleReportAction} shouldUseThreadDividerLine={shouldUseThreadDividerLine} shouldHighlight={shouldHighlight} userWalletTierName={userWalletTierName} isUserValidated={isUserValidated} personalDetails={personalDetails} draftMessage={draftMessage} emojiReactions={emojiReactions} linkedTransactionRouteError={linkedTransactionRouteError} userBillingFundID={userBillingFundID} isTryNewDotNVPDismissed={isTryNewDotNVPDismissed}/>);
}
ReportActionsListItemRenderer.displayName = 'ReportActionsListItemRenderer';
exports.default = (0, react_1.memo)(ReportActionsListItemRenderer);
