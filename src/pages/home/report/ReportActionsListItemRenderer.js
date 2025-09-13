"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var CONST_1 = require("@src/CONST");
var ReportActionItem_1 = require("./ReportActionItem");
var ReportActionItemParentAction_1 = require("./ReportActionItemParentAction");
function ReportActionsListItemRenderer(_a) {
    var allReports = _a.allReports, policies = _a.policies, reportAction = _a.reportAction, _b = _a.reportActions, reportActions = _b === void 0 ? [] : _b, transactions = _a.transactions, parentReportAction = _a.parentReportAction, index = _a.index, report = _a.report, transactionThreadReport = _a.transactionThreadReport, displayAsGroup = _a.displayAsGroup, _c = _a.mostRecentIOUReportActionID, mostRecentIOUReportActionID = _c === void 0 ? '' : _c, shouldHideThreadDividerLine = _a.shouldHideThreadDividerLine, shouldDisplayNewMarker = _a.shouldDisplayNewMarker, _d = _a.linkedReportActionID, linkedReportActionID = _d === void 0 ? '' : _d, shouldDisplayReplyDivider = _a.shouldDisplayReplyDivider, _e = _a.isFirstVisibleReportAction, isFirstVisibleReportAction = _e === void 0 ? false : _e, _f = _a.shouldUseThreadDividerLine, shouldUseThreadDividerLine = _f === void 0 ? false : _f, _g = _a.shouldHighlight, shouldHighlight = _g === void 0 ? false : _g, parentReportActionForTransactionThread = _a.parentReportActionForTransactionThread, draftMessage = _a.draftMessage, emojiReactions = _a.emojiReactions, userWalletTierName = _a.userWalletTierName, linkedTransactionRouteError = _a.linkedTransactionRouteError, isUserValidated = _a.isUserValidated, userBillingFundID = _a.userBillingFundID, personalDetails = _a.personalDetails, allDraftMessages = _a.allDraftMessages, allEmojiReactions = _a.allEmojiReactions, _h = _a.isTryNewDotNVPDismissed, isTryNewDotNVPDismissed = _h === void 0 ? false : _h, _j = _a.isReportArchived, isReportArchived = _j === void 0 ? false : _j;
    var originalMessage = (0, react_1.useMemo)(function () { return (0, ReportActionsUtils_1.getOriginalMessage)(reportAction); }, [reportAction]);
    /**
     * Create a lightweight ReportAction so as to keep the re-rendering as light as possible by
     * passing in only the required props.
     */
    var action = (0, react_1.useMemo)(function () {
        return ({
            reportActionID: reportAction.reportActionID,
            message: reportAction.message,
            pendingAction: reportAction.pendingAction,
            actionName: reportAction.actionName,
            errors: reportAction.errors,
            originalMessage: originalMessage,
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
        });
    }, [
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
    var shouldDisplayParentAction = reportAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED && (!(0, ReportActionsUtils_1.isTransactionThread)(parentReportAction) || (0, ReportActionsUtils_1.isSentMoneyReportAction)(parentReportAction));
    if (shouldDisplayParentAction && (0, ReportUtils_1.isChatThread)(report)) {
        return (<ReportActionItemParentAction_1.default allReports={allReports} policies={policies} shouldHideThreadDividerLine={shouldDisplayParentAction && shouldHideThreadDividerLine} shouldDisplayReplyDivider={shouldDisplayReplyDivider} parentReportAction={parentReportAction} reportID={report.reportID} report={report} reportActions={reportActions} transactionThreadReport={transactionThreadReport} index={index} isFirstVisibleReportAction={isFirstVisibleReportAction} shouldUseThreadDividerLine={shouldUseThreadDividerLine} userWalletTierName={userWalletTierName} isUserValidated={isUserValidated} personalDetails={personalDetails} allDraftMessages={allDraftMessages} allEmojiReactions={allEmojiReactions} linkedTransactionRouteError={linkedTransactionRouteError} userBillingFundID={userBillingFundID} isTryNewDotNVPDismissed={isTryNewDotNVPDismissed} isReportArchived={isReportArchived}/>);
    }
    return (<ReportActionItem_1.default allReports={allReports} policies={policies} shouldHideThreadDividerLine={shouldHideThreadDividerLine} parentReportAction={parentReportAction} report={report} transactionThreadReport={transactionThreadReport} parentReportActionForTransactionThread={parentReportActionForTransactionThread} action={action} reportActions={reportActions} linkedReportActionID={linkedReportActionID} displayAsGroup={displayAsGroup} transactions={transactions} shouldDisplayNewMarker={shouldDisplayNewMarker} isMostRecentIOUReportAction={reportAction.reportActionID === mostRecentIOUReportActionID} index={index} isFirstVisibleReportAction={isFirstVisibleReportAction} shouldUseThreadDividerLine={shouldUseThreadDividerLine} shouldHighlight={shouldHighlight} userWalletTierName={userWalletTierName} isUserValidated={isUserValidated} personalDetails={personalDetails} draftMessage={draftMessage} emojiReactions={emojiReactions} linkedTransactionRouteError={linkedTransactionRouteError} userBillingFundID={userBillingFundID} isTryNewDotNVPDismissed={isTryNewDotNVPDismissed}/>);
}
ReportActionsListItemRenderer.displayName = 'ReportActionsListItemRenderer';
exports.default = (0, react_1.memo)(ReportActionsListItemRenderer);
