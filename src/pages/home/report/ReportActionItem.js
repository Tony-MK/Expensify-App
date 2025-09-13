"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const useOnyx_1 = require("@hooks/useOnyx");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const ModifiedExpenseMessage_1 = require("@libs/ModifiedExpenseMessage");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const Report_1 = require("@userActions/Report");
const ReportActions_1 = require("@userActions/ReportActions");
const Transaction_1 = require("@userActions/Transaction");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const PureReportActionItem_1 = require("./PureReportActionItem");
function ReportActionItem({ allReports, policies, action, report, transactions, draftMessage, emojiReactions, userWalletTierName, isUserValidated, personalDetails, linkedTransactionRouteError, userBillingFundID, isTryNewDotNVPDismissed, ...props }) {
    const reportID = report?.reportID;
    const originalMessage = (0, ReportActionsUtils_1.getOriginalMessage)(action);
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const originalReportID = (0, react_1.useMemo)(() => (0, ReportUtils_1.getOriginalReportID)(reportID, action), [reportID, action]);
    const originalReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${originalReportID}`];
    const isOriginalReportArchived = (0, useReportIsArchived_1.default)(originalReportID);
    const [currentUserAccountID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false, selector: (session) => session?.accountID });
    const iouReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${(0, ReportActionsUtils_1.getIOUReportIDFromReportActionPreview)(action)}`];
    const movedFromReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${(0, ModifiedExpenseMessage_1.getMovedReportID)(action, CONST_1.default.REPORT.MOVE_TYPE.FROM)}`];
    const movedToReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${(0, ModifiedExpenseMessage_1.getMovedReportID)(action, CONST_1.default.REPORT.MOVE_TYPE.TO)}`];
    const policy = policies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${report?.policyID}`];
    const [bankAccountList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BANK_ACCOUNT_LIST, { canBeMissing: true });
    // The app would crash due to subscribing to the entire report collection if parentReportID is an empty string. So we should have a fallback ID here.
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const parentReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.parentReportID || undefined}`];
    const blockedFromConcierge = (0, OnyxListItemProvider_1.useBlockedFromConcierge)();
    const targetReport = (0, ReportUtils_1.isChatThread)(report) ? parentReport : report;
    const missingPaymentMethod = (0, ReportUtils_1.getIndicatedMissingPaymentMethod)(userWalletTierName, targetReport?.reportID, action, bankAccountList);
    const taskReport = originalMessage && 'taskReportID' in originalMessage ? allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${originalMessage.taskReportID}`] : undefined;
    const linkedReport = originalMessage && 'linkedReportID' in originalMessage ? allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${originalMessage.linkedReportID}`] : undefined;
    const iouReportOfLinkedReport = linkedReport && 'iouReportID' in linkedReport ? allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${linkedReport.iouReportID}`] : undefined;
    return (<PureReportActionItem_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} allReports={allReports} policies={policies} action={action} report={report} policy={policy} currentUserAccountID={currentUserAccountID} draftMessage={draftMessage} iouReport={iouReport} taskReport={taskReport} linkedReport={linkedReport} iouReportOfLinkedReport={iouReportOfLinkedReport} emojiReactions={emojiReactions} linkedTransactionRouteError={linkedTransactionRouteError} isUserValidated={isUserValidated} parentReport={parentReport} personalDetails={personalDetails} blockedFromConcierge={blockedFromConcierge} originalReportID={originalReportID} deleteReportActionDraft={Report_1.deleteReportActionDraft} isArchivedRoom={(0, ReportUtils_1.isArchivedNonExpenseReport)(originalReport, isOriginalReportArchived)} isChronosReport={(0, ReportUtils_1.chatIncludesChronosWithID)(originalReportID)} toggleEmojiReaction={Report_1.toggleEmojiReaction} createDraftTransactionAndNavigateToParticipantSelector={ReportUtils_1.createDraftTransactionAndNavigateToParticipantSelector} resolveActionableReportMentionWhisper={Report_1.resolveActionableReportMentionWhisper} resolveActionableMentionWhisper={Report_1.resolveActionableMentionWhisper} isClosedExpenseReportWithNoExpenses={(0, ReportUtils_1.isClosedExpenseReportWithNoExpenses)(iouReport, transactions)} isCurrentUserTheOnlyParticipant={ReportUtils_1.isCurrentUserTheOnlyParticipant} missingPaymentMethod={missingPaymentMethod} reimbursementDeQueuedOrCanceledActionMessage={(0, ReportUtils_1.getReimbursementDeQueuedOrCanceledActionMessage)(action, report)} modifiedExpenseMessage={(0, ModifiedExpenseMessage_1.getForReportAction)({
            reportAction: action,
            policyID: report?.policyID,
            movedFromReport,
            movedToReport,
        })} getTransactionsWithReceipts={ReportUtils_1.getTransactionsWithReceipts} clearError={Transaction_1.clearError} clearAllRelatedReportActionErrors={ReportActions_1.clearAllRelatedReportActionErrors} dismissTrackExpenseActionableWhisper={Report_1.dismissTrackExpenseActionableWhisper} userBillingFundID={userBillingFundID} isTryNewDotNVPDismissed={isTryNewDotNVPDismissed}/>);
}
exports.default = ReportActionItem;
