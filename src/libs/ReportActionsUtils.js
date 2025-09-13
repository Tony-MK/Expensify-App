"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIOUActionMatchingTransactionList = void 0;
exports.doesReportHaveVisibleActions = doesReportHaveVisibleActions;
exports.extractLinksFromMessageHtml = extractLinksFromMessageHtml;
exports.formatLastMessageText = formatLastMessageText;
exports.isReportActionUnread = isReportActionUnread;
exports.getHtmlWithAttachmentID = getHtmlWithAttachmentID;
exports.getActionableMentionWhisperMessage = getActionableMentionWhisperMessage;
exports.getAllReportActions = getAllReportActions;
exports.getCombinedReportActions = getCombinedReportActions;
exports.getDismissedViolationMessageText = getDismissedViolationMessageText;
exports.getFirstVisibleReportActionID = getFirstVisibleReportActionID;
exports.getIOUActionForReportID = getIOUActionForReportID;
exports.getIOUActionForTransactionID = getIOUActionForTransactionID;
exports.getIOUReportIDFromReportActionPreview = getIOUReportIDFromReportActionPreview;
exports.getLastClosedReportAction = getLastClosedReportAction;
exports.getLastVisibleAction = getLastVisibleAction;
exports.getLastVisibleMessage = getLastVisibleMessage;
exports.getLatestReportActionFromOnyxData = getLatestReportActionFromOnyxData;
exports.getLinkedTransactionID = getLinkedTransactionID;
exports.getMemberChangeMessageFragment = getMemberChangeMessageFragment;
exports.getUpdateRoomDescriptionFragment = getUpdateRoomDescriptionFragment;
exports.getReportActionMessageFragments = getReportActionMessageFragments;
exports.getMessageOfOldDotReportAction = getMessageOfOldDotReportAction;
exports.getMostRecentIOURequestActionID = getMostRecentIOURequestActionID;
exports.getNumberOfMoneyRequests = getNumberOfMoneyRequests;
exports.getOneTransactionThreadReportAction = getOneTransactionThreadReportAction;
exports.getOneTransactionThreadReportID = getOneTransactionThreadReportID;
exports.getOriginalMessage = getOriginalMessage;
exports.getAddedApprovalRuleMessage = getAddedApprovalRuleMessage;
exports.getDeletedApprovalRuleMessage = getDeletedApprovalRuleMessage;
exports.getUpdatedApprovalRuleMessage = getUpdatedApprovalRuleMessage;
exports.getRemovedFromApprovalChainMessage = getRemovedFromApprovalChainMessage;
exports.getDemotedFromWorkspaceMessage = getDemotedFromWorkspaceMessage;
exports.getReportAction = getReportAction;
exports.getReportActionHtml = getReportActionHtml;
exports.getReportActionMessage = getReportActionMessage;
exports.getReportActionMessageText = getReportActionMessageText;
exports.getReportActionText = getReportActionText;
exports.getReportPreviewAction = getReportPreviewAction;
exports.getSortedReportActions = getSortedReportActions;
exports.getSortedReportActionsForDisplay = getSortedReportActionsForDisplay;
exports.getTextFromHtml = getTextFromHtml;
exports.getTrackExpenseActionableWhisper = getTrackExpenseActionableWhisper;
exports.getWhisperedTo = getWhisperedTo;
exports.hasRequestFromCurrentAccount = hasRequestFromCurrentAccount;
exports.isActionOfType = isActionOfType;
exports.isActionableWhisper = isActionableWhisper;
exports.isActionableJoinRequest = isActionableJoinRequest;
exports.isActionableJoinRequestPending = isActionableJoinRequestPending;
exports.isActionableMentionWhisper = isActionableMentionWhisper;
exports.isActionableMentionInviteToSubmitExpenseConfirmWhisper = isActionableMentionInviteToSubmitExpenseConfirmWhisper;
exports.isActionableReportMentionWhisper = isActionableReportMentionWhisper;
exports.isActionableTrackExpense = isActionableTrackExpense;
exports.isExpenseChatWelcomeWhisper = isExpenseChatWelcomeWhisper;
exports.isConciergeCategoryOptions = isConciergeCategoryOptions;
exports.isResolvedConciergeCategoryOptions = isResolvedConciergeCategoryOptions;
exports.isAddCommentAction = isAddCommentAction;
exports.isApprovedOrSubmittedReportAction = isApprovedOrSubmittedReportAction;
exports.isIOURequestReportAction = isIOURequestReportAction;
exports.isChronosOOOListAction = isChronosOOOListAction;
exports.isClosedAction = isClosedAction;
exports.isConsecutiveActionMadeByPreviousActor = isConsecutiveActionMadeByPreviousActor;
exports.isConsecutiveChronosAutomaticTimerAction = isConsecutiveChronosAutomaticTimerAction;
exports.hasNextActionMadeBySameActor = hasNextActionMadeBySameActor;
exports.isCreatedAction = isCreatedAction;
exports.isCreatedTaskReportAction = isCreatedTaskReportAction;
exports.isCurrentActionUnread = isCurrentActionUnread;
exports.isDeletedAction = isDeletedAction;
exports.isDeletedParentAction = isDeletedParentAction;
exports.isLinkedTransactionHeld = isLinkedTransactionHeld;
exports.isMemberChangeAction = isMemberChangeAction;
exports.isExportIntegrationAction = isExportIntegrationAction;
exports.isIntegrationMessageAction = isIntegrationMessageAction;
exports.isMessageDeleted = isMessageDeleted;
exports.useTableReportViewActionRenderConditionals = useTableReportViewActionRenderConditionals;
exports.isModifiedExpenseAction = isModifiedExpenseAction;
exports.isMovedTransactionAction = isMovedTransactionAction;
exports.isMoneyRequestAction = isMoneyRequestAction;
exports.isOldDotReportAction = isOldDotReportAction;
exports.isPayAction = isPayAction;
exports.isPendingRemove = isPendingRemove;
exports.isPolicyChangeLogAction = isPolicyChangeLogAction;
exports.isReimbursementCanceledAction = isReimbursementCanceledAction;
exports.isReimbursementDeQueuedAction = isReimbursementDeQueuedAction;
exports.isReimbursementDeQueuedOrCanceledAction = isReimbursementDeQueuedOrCanceledAction;
exports.isReimbursementQueuedAction = isReimbursementQueuedAction;
exports.isRenamedAction = isRenamedAction;
exports.isReportActionAttachment = isReportActionAttachment;
exports.isReportActionDeprecated = isReportActionDeprecated;
exports.isReportPreviewAction = isReportPreviewAction;
exports.isReversedTransaction = isReversedTransaction;
exports.getMentionedAccountIDsFromAction = getMentionedAccountIDsFromAction;
exports.isRoomChangeLogAction = isRoomChangeLogAction;
exports.isSentMoneyReportAction = isSentMoneyReportAction;
exports.isSplitBillAction = isSplitBillAction;
exports.isTaskAction = isTaskAction;
exports.isMovedAction = isMovedAction;
exports.isThreadParentMessage = isThreadParentMessage;
exports.isTrackExpenseAction = isTrackExpenseAction;
exports.isTransactionThread = isTransactionThread;
exports.isTripPreview = isTripPreview;
exports.isWhisperAction = isWhisperAction;
exports.isSubmittedAction = isSubmittedAction;
exports.isSubmittedAndClosedAction = isSubmittedAndClosedAction;
exports.isMarkAsClosedAction = isMarkAsClosedAction;
exports.isApprovedAction = isApprovedAction;
exports.isUnapprovedAction = isUnapprovedAction;
exports.isForwardedAction = isForwardedAction;
exports.isWhisperActionTargetedToOthers = isWhisperActionTargetedToOthers;
exports.isTagModificationAction = isTagModificationAction;
exports.isResolvedActionableWhisper = isResolvedActionableWhisper;
exports.isReimbursementDirectionInformationRequiredAction = isReimbursementDirectionInformationRequiredAction;
exports.shouldHideNewMarker = shouldHideNewMarker;
exports.shouldReportActionBeVisible = shouldReportActionBeVisible;
exports.shouldReportActionBeVisibleAsLastAction = shouldReportActionBeVisibleAsLastAction;
exports.wasActionTakenByCurrentUser = wasActionTakenByCurrentUser;
exports.isInviteOrRemovedAction = isInviteOrRemovedAction;
exports.isActionableAddPaymentCard = isActionableAddPaymentCard;
exports.getExportIntegrationActionFragments = getExportIntegrationActionFragments;
exports.getExportIntegrationLastMessageText = getExportIntegrationLastMessageText;
exports.getExportIntegrationMessageHTML = getExportIntegrationMessageHTML;
exports.getUpdateRoomDescriptionMessage = getUpdateRoomDescriptionMessage;
exports.didMessageMentionCurrentUser = didMessageMentionCurrentUser;
exports.getPolicyChangeLogAddEmployeeMessage = getPolicyChangeLogAddEmployeeMessage;
exports.getPolicyChangeLogUpdateEmployee = getPolicyChangeLogUpdateEmployee;
exports.getPolicyChangeLogDeleteMemberMessage = getPolicyChangeLogDeleteMemberMessage;
exports.getPolicyChangeLogEmployeeLeftMessage = getPolicyChangeLogEmployeeLeftMessage;
exports.getRenamedAction = getRenamedAction;
exports.isCardIssuedAction = isCardIssuedAction;
exports.getCardIssuedMessage = getCardIssuedMessage;
exports.getRemovedConnectionMessage = getRemovedConnectionMessage;
exports.getActionableJoinRequestPendingReportAction = getActionableJoinRequestPendingReportAction;
exports.getFilteredReportActionsForReportView = getFilteredReportActionsForReportView;
exports.wasMessageReceivedWhileOffline = wasMessageReceivedWhileOffline;
exports.shouldShowAddMissingDetails = shouldShowAddMissingDetails;
exports.getJoinRequestMessage = getJoinRequestMessage;
exports.getTravelUpdateMessage = getTravelUpdateMessage;
exports.getWorkspaceCategoryUpdateMessage = getWorkspaceCategoryUpdateMessage;
exports.getWorkspaceUpdateFieldMessage = getWorkspaceUpdateFieldMessage;
exports.getWorkspaceCurrencyUpdateMessage = getWorkspaceCurrencyUpdateMessage;
exports.getWorkspaceFrequencyUpdateMessage = getWorkspaceFrequencyUpdateMessage;
exports.getPolicyChangeLogMaxExpenseAmountNoReceiptMessage = getPolicyChangeLogMaxExpenseAmountNoReceiptMessage;
exports.getPolicyChangeLogMaxExpenseAmountMessage = getPolicyChangeLogMaxExpenseAmountMessage;
exports.getPolicyChangeLogDefaultBillableMessage = getPolicyChangeLogDefaultBillableMessage;
exports.getPolicyChangeLogDefaultTitleEnforcedMessage = getPolicyChangeLogDefaultTitleEnforcedMessage;
exports.getWorkspaceDescriptionUpdatedMessage = getWorkspaceDescriptionUpdatedMessage;
exports.getWorkspaceReportFieldAddMessage = getWorkspaceReportFieldAddMessage;
exports.getWorkspaceCustomUnitRateAddedMessage = getWorkspaceCustomUnitRateAddedMessage;
exports.getSendMoneyFlowAction = getSendMoneyFlowAction;
exports.getWorkspaceTagUpdateMessage = getWorkspaceTagUpdateMessage;
exports.getWorkspaceReportFieldUpdateMessage = getWorkspaceReportFieldUpdateMessage;
exports.getWorkspaceReportFieldDeleteMessage = getWorkspaceReportFieldDeleteMessage;
exports.getUpdatedAuditRateMessage = getUpdatedAuditRateMessage;
exports.getUpdatedManualApprovalThresholdMessage = getUpdatedManualApprovalThresholdMessage;
exports.getWorkspaceCustomUnitRateDeletedMessage = getWorkspaceCustomUnitRateDeletedMessage;
exports.getAddedConnectionMessage = getAddedConnectionMessage;
exports.getWorkspaceCustomUnitRateUpdatedMessage = getWorkspaceCustomUnitRateUpdatedMessage;
exports.getTagListNameUpdatedMessage = getTagListNameUpdatedMessage;
exports.getWorkspaceCustomUnitUpdatedMessage = getWorkspaceCustomUnitUpdatedMessage;
exports.getRoomChangeLogMessage = getRoomChangeLogMessage;
exports.getReportActions = getReportActions;
exports.getReopenedMessage = getReopenedMessage;
exports.getLeaveRoomMessage = getLeaveRoomMessage;
exports.getRetractedMessage = getRetractedMessage;
exports.getReportActionFromExpensifyCard = getReportActionFromExpensifyCard;
exports.isReopenedAction = isReopenedAction;
exports.isRetractedAction = isRetractedAction;
exports.getIntegrationSyncFailedMessage = getIntegrationSyncFailedMessage;
exports.getPolicyChangeLogDefaultReimbursableMessage = getPolicyChangeLogDefaultReimbursableMessage;
exports.getManagerOnVacation = getManagerOnVacation;
exports.getVacationer = getVacationer;
exports.getSubmittedTo = getSubmittedTo;
exports.getReceiptScanFailedMessage = getReceiptScanFailedMessage;
exports.getChangedApproverActionMessage = getChangedApproverActionMessage;
exports.getDelegateAccountIDFromReportAction = getDelegateAccountIDFromReportAction;
exports.isPendingHide = isPendingHide;
const date_fns_1 = require("date-fns");
const expensify_common_1 = require("expensify-common");
const clone_1 = require("lodash/clone");
const findLast_1 = require("lodash/findLast");
const isEmpty_1 = require("lodash/isEmpty");
const react_native_onyx_1 = require("react-native-onyx");
const usePrevious_1 = require("@hooks/usePrevious");
const CONST_1 = require("@src/CONST");
const IntlStore_1 = require("@src/languages/IntlStore");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const CurrencyUtils_1 = require("./CurrencyUtils");
const Environment_1 = require("./Environment/Environment");
const getBase62ReportID_1 = require("./getBase62ReportID");
const isReportMessageAttachment_1 = require("./isReportMessageAttachment");
const LocaleDigitUtils_1 = require("./LocaleDigitUtils");
const LocalePhoneNumber_1 = require("./LocalePhoneNumber");
const Localize_1 = require("./Localize");
const Log_1 = require("./Log");
const Parser_1 = require("./Parser");
const PersonalDetailsUtils_1 = require("./PersonalDetailsUtils");
const PolicyUtils_1 = require("./PolicyUtils");
const StringUtils_1 = require("./StringUtils");
const TransactionUtils_1 = require("./TransactionUtils");
const WorkspaceReportFieldUtils_1 = require("./WorkspaceReportFieldUtils");
let allReportActions;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
    waitForCollectionCallback: true,
    callback: (actions) => {
        if (!actions) {
            return;
        }
        allReportActions = actions;
    },
});
let allReports;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.REPORT,
    waitForCollectionCallback: true,
    callback: (value) => {
        allReports = value;
    },
});
let isNetworkOffline = false;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.NETWORK,
    callback: (val) => (isNetworkOffline = val?.isOffline ?? false),
});
let currentUserAccountID;
let currentEmail = '';
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.SESSION,
    callback: (value) => {
        // When signed out, value is undefined
        if (!value) {
            return;
        }
        currentUserAccountID = value.accountID;
        currentEmail = value?.email ?? '';
    },
});
let privatePersonalDetails;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS,
    callback: (personalDetails) => {
        privatePersonalDetails = personalDetails;
    },
});
let environmentURL;
(0, Environment_1.getEnvironmentURL)().then((url) => (environmentURL = url));
let oldDotEnvironmentURL;
(0, Environment_1.getOldDotEnvironmentURL)().then((url) => (oldDotEnvironmentURL = url));
/*
 * Url to the Xero non reimbursable expenses list
 */
const XERO_NON_REIMBURSABLE_EXPENSES_URL = 'https://go.xero.com/Bank/BankAccounts.aspx';
/*
 * Url to the NetSuite global search, which should be suffixed with the reportID.
 */
const NETSUITE_NON_REIMBURSABLE_EXPENSES_URL_PREFIX = 'https://system.netsuite.com/app/common/search/ubersearchresults.nl?quicksearch=T&searchtype=Uber&frame=be&Uber_NAMEtype=KEYWORDSTARTSWITH&Uber_NAME=';
/*
 * Url prefix to any Salesforce transaction or transaction list.
 */
const SALESFORCE_EXPENSES_URL_PREFIX = 'https://login.salesforce.com/';
/*
 * Url to the QBO expenses list
 */
const QBO_EXPENSES_URL = 'https://qbo.intuit.com/app/expenses';
const POLICY_CHANGE_LOG_ARRAY = new Set(Object.values(CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG));
const ROOM_CHANGE_LOG_ARRAY = new Set(Object.values(CONST_1.default.REPORT.ACTIONS.TYPE.ROOM_CHANGE_LOG));
const MEMBER_CHANGE_ARRAY = new Set([
    CONST_1.default.REPORT.ACTIONS.TYPE.ROOM_CHANGE_LOG.INVITE_TO_ROOM,
    CONST_1.default.REPORT.ACTIONS.TYPE.ROOM_CHANGE_LOG.REMOVE_FROM_ROOM,
    CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.INVITE_TO_ROOM,
    CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.REMOVE_FROM_ROOM,
    CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.LEAVE_POLICY,
]);
function isCreatedAction(reportAction) {
    return reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED;
}
function isDeletedAction(reportAction) {
    if (isInviteOrRemovedAction(reportAction) || isActionableMentionWhisper(reportAction)) {
        return false;
    }
    // for report actions with this type we get an empty array as message by design
    if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.REIMBURSEMENT_DIRECTOR_INFORMATION_REQUIRED) {
        return false;
    }
    const message = reportAction?.message ?? [];
    if (!Array.isArray(message)) {
        return message?.html === '' || !!message?.deleted;
    }
    const originalMessage = getOriginalMessage(reportAction);
    // A legacy deleted comment has either an empty array or an object with html field with empty string as value
    const isLegacyDeletedComment = message.length === 0 || message.at(0)?.html === '';
    return isLegacyDeletedComment || !!message.at(0)?.deleted || (!!originalMessage && 'deleted' in originalMessage && !!originalMessage?.deleted);
}
/**
 * This function will add attachment ID attribute on img and video HTML tags inside the passed html content
 * of a report action. This attachment id is the reportActionID concatenated with the order index that the attachment
 * appears inside the report action message so as to identify attachments with identical source inside a report action.
 */
function getHtmlWithAttachmentID(html, reportActionID) {
    if (!reportActionID) {
        return html;
    }
    let attachmentID = 0;
    return html.replace(/<img |<video /g, (m) => m.concat(`${CONST_1.default.ATTACHMENT_ID_ATTRIBUTE}="${reportActionID}_${++attachmentID}" `));
}
function getReportActionMessage(reportAction) {
    return Array.isArray(reportAction?.message) ? reportAction.message.at(0) : reportAction?.message;
}
function isDeletedParentAction(reportAction) {
    return (getReportActionMessage(reportAction)?.isDeletedParentAction ?? false) && (reportAction?.childVisibleActionCount ?? 0) > 0;
}
function isReversedTransaction(reportAction) {
    return (getReportActionMessage(reportAction)?.isReversedTransaction ?? false) && (reportAction?.childVisibleActionCount ?? 0) > 0;
}
function isPendingRemove(reportAction) {
    return getReportActionMessage(reportAction)?.moderationDecision?.decision === CONST_1.default.MODERATION.MODERATOR_DECISION_PENDING_REMOVE;
}
function isPendingHide(reportAction) {
    return getReportActionMessage(reportAction)?.moderationDecision?.decision === CONST_1.default.MODERATION.MODERATOR_DECISION_PENDING_HIDE;
}
function isMoneyRequestAction(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.IOU);
}
function isReportPreviewAction(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW);
}
function isSubmittedAction(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.SUBMITTED);
}
function isSubmittedAndClosedAction(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.SUBMITTED_AND_CLOSED);
}
function isMarkAsClosedAction(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.CLOSED) && !!getOriginalMessage(reportAction)?.amount;
}
function isApprovedAction(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.APPROVED);
}
function isUnapprovedAction(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.UNAPPROVED);
}
function isForwardedAction(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.FORWARDED);
}
function isModifiedExpenseAction(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.MODIFIED_EXPENSE);
}
function isMovedTransactionAction(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.MOVED_TRANSACTION);
}
function isMovedAction(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.MOVED);
}
function isPolicyChangeLogAction(reportAction) {
    return reportAction?.actionName ? POLICY_CHANGE_LOG_ARRAY.has(reportAction.actionName) : false;
}
function isChronosOOOListAction(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.CHRONOS_OOO_LIST);
}
function isAddCommentAction(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT);
}
function isCreatedTaskReportAction(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT) && !!getOriginalMessage(reportAction)?.taskReportID;
}
function isTripPreview(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.TRIP_PREVIEW);
}
function isReimbursementDirectionInformationRequiredAction(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.REIMBURSEMENT_DIRECTOR_INFORMATION_REQUIRED);
}
function isActionOfType(action, actionName) {
    return action?.actionName === actionName;
}
function getOriginalMessage(reportAction) {
    if (!Array.isArray(reportAction?.message)) {
        // eslint-disable-next-line deprecation/deprecation
        return reportAction?.message ?? reportAction?.originalMessage;
    }
    // eslint-disable-next-line deprecation/deprecation
    return reportAction.originalMessage;
}
function getDelegateAccountIDFromReportAction(reportAction) {
    if (!reportAction) {
        return undefined;
    }
    if (reportAction.delegateAccountID) {
        return reportAction.delegateAccountID;
    }
    const originalMessage = getOriginalMessage(reportAction);
    if (!originalMessage) {
        return undefined;
    }
    if ('delegateAccountID' in originalMessage) {
        return originalMessage.delegateAccountID;
    }
    return undefined;
}
function isExportIntegrationAction(reportAction) {
    return reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.EXPORTED_TO_INTEGRATION;
}
function isIntegrationMessageAction(reportAction) {
    return reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.INTEGRATIONS_MESSAGE;
}
function isTravelUpdate(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.TRAVEL_UPDATE);
}
/**
 * We are in the process of deprecating reportAction.originalMessage and will be setting the db version of "message" to reportAction.message in the future see: https://github.com/Expensify/App/issues/39797
 * In the interim, we must check to see if we have an object or array for the reportAction.message, if we have an array we will use the originalMessage as this means we have not yet migrated.
 */
function getWhisperedTo(reportAction) {
    if (!reportAction) {
        return [];
    }
    const originalMessage = getOriginalMessage(reportAction);
    const message = getReportActionMessage(reportAction);
    if (!(originalMessage && typeof originalMessage === 'object' && 'whisperedTo' in originalMessage) && !(message && typeof message === 'object' && 'whisperedTo' in message)) {
        return [];
    }
    if (message !== null && !Array.isArray(message) && typeof message === 'object' && 'whisperedTo' in message) {
        return message?.whisperedTo ?? [];
    }
    if (originalMessage && typeof originalMessage === 'object' && 'whisperedTo' in originalMessage) {
        return originalMessage?.whisperedTo ?? [];
    }
    if (typeof originalMessage !== 'object') {
        Log_1.default.info('Original message is not an object for reportAction: ', true, {
            reportActionID: reportAction?.reportActionID,
            actionName: reportAction?.actionName,
        });
    }
    return [];
}
function isWhisperAction(reportAction) {
    return getWhisperedTo(reportAction).length > 0;
}
/**
 * Checks whether the report action is a whisper targeting someone other than the current user.
 */
function isWhisperActionTargetedToOthers(reportAction) {
    if (!isWhisperAction(reportAction)) {
        return false;
    }
    return !getWhisperedTo(reportAction).includes(currentUserAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID);
}
function isReimbursementQueuedAction(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.REIMBURSEMENT_QUEUED);
}
function isMemberChangeAction(reportAction) {
    return reportAction?.actionName ? MEMBER_CHANGE_ARRAY.has(reportAction.actionName) : false;
}
function isInviteMemberAction(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.ROOM_CHANGE_LOG.INVITE_TO_ROOM) || isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.INVITE_TO_ROOM);
}
function isLeavePolicyAction(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.LEAVE_POLICY);
}
function isReimbursementCanceledAction(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.REIMBURSEMENT_ACH_CANCELED);
}
function isReimbursementDeQueuedAction(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.REIMBURSEMENT_DEQUEUED);
}
function isReimbursementDeQueuedOrCanceledAction(reportAction) {
    return isReimbursementDeQueuedAction(reportAction) || isReimbursementCanceledAction(reportAction);
}
function isClosedAction(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.CLOSED);
}
function isRenamedAction(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.RENAMED);
}
function isReopenedAction(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.REOPENED);
}
function isRetractedAction(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.RETRACTED);
}
function isRoomChangeLogAction(reportAction) {
    return reportAction?.actionName ? ROOM_CHANGE_LOG_ARRAY.has(reportAction.actionName) : false;
}
function isInviteOrRemovedAction(reportAction) {
    return (isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.ROOM_CHANGE_LOG.INVITE_TO_ROOM) ||
        isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.ROOM_CHANGE_LOG.REMOVE_FROM_ROOM) ||
        isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.INVITE_TO_ROOM) ||
        isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.REMOVE_FROM_ROOM));
}
/**
 * Returns whether the comment is a thread parent message/the first message in a thread
 */
function isThreadParentMessage(reportAction, reportID) {
    const { childType, childVisibleActionCount = 0, childReportID } = reportAction ?? {};
    return childType === CONST_1.default.REPORT.TYPE.CHAT && (childVisibleActionCount > 0 || String(childReportID) === reportID);
}
/**
 * Determines if the given report action is sent money report action by checking for 'pay' type and presence of IOUDetails object.
 */
function isSentMoneyReportAction(reportAction) {
    return (isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.IOU) &&
        getOriginalMessage(reportAction)?.type === CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY &&
        !!getOriginalMessage(reportAction)?.IOUDetails);
}
/**
 * Returns whether the thread is a transaction thread, which is any thread with IOU parent
 * report action from requesting money (type - create) or from sending money (type - pay with IOUDetails field)
 */
function isTransactionThread(parentReportAction) {
    if ((0, EmptyObject_1.isEmptyObject)(parentReportAction) || !isMoneyRequestAction(parentReportAction)) {
        return false;
    }
    const originalMessage = getOriginalMessage(parentReportAction);
    return (originalMessage?.type === CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE ||
        originalMessage?.type === CONST_1.default.IOU.REPORT_ACTION_TYPE.TRACK ||
        (originalMessage?.type === CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY && !!originalMessage?.IOUDetails));
}
/**
 * Sort an array of reportActions by their created timestamp first, and reportActionID second
 * This gives us a stable order even in the case of multiple reportActions created on the same millisecond
 *
 */
function getSortedReportActions(reportActions, shouldSortInDescendingOrder = false) {
    if (!Array.isArray(reportActions)) {
        throw new Error(`ReportActionsUtils.getSortedReportActions requires an array, received ${typeof reportActions}`);
    }
    const invertedMultiplier = shouldSortInDescendingOrder ? -1 : 1;
    const sortedActions = reportActions?.filter(Boolean).sort((first, second) => {
        // First sort by action type, ensuring that `CREATED` actions always come first if they have the same or even a later timestamp as another action type
        if ((first.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED || second.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED) && first.actionName !== second.actionName) {
            return (first.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED ? -1 : 1) * invertedMultiplier;
        }
        // Ensure that neither first's nor second's created property is undefined
        if (first.created === undefined || second.created === undefined) {
            return (first.created === undefined ? -1 : 1) * invertedMultiplier;
        }
        // Then sort by timestamp
        if (first.created !== second.created) {
            return (first.created < second.created ? -1 : 1) * invertedMultiplier;
        }
        // Ensure that `REPORT_PREVIEW` actions always come after if they have the same timestamp as another action type
        if ((first.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW || second.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW) && first.actionName !== second.actionName) {
            return (first.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW ? 1 : -1) * invertedMultiplier;
        }
        // Then fallback on reportActionID as the final sorting criteria. It is a random number,
        // but using this will ensure that the order of reportActions with the same created time and action type
        // will be consistent across all users and devices
        return (first.reportActionID < second.reportActionID ? -1 : 1) * invertedMultiplier;
    });
    return sortedActions;
}
/**
 * Returns a sorted and filtered list of report actions from a report and it's associated child
 * transaction thread report in order to correctly display reportActions from both reports in the one-transaction report view.
 */
function getCombinedReportActions(reportActions, transactionThreadReportID, transactionThreadReportActions, reportID) {
    const isSentMoneyReport = reportActions.some((action) => isSentMoneyReportAction(action));
    // We don't want to combine report actions of transaction thread in iou report of send money request because we display the transaction report of send money request as a normal thread
    if ((0, isEmpty_1.default)(transactionThreadReportID) || isSentMoneyReport) {
        return reportActions;
    }
    // Usually, we filter out the created action from the transaction thread report actions, since we already have the parent report's created action in `reportActions`
    // However, in the case of moving track expense, the transaction thread will be created first in a track expense, thus we should keep the CREATED of the transaction thread and filter out CREATED action of the IOU
    // This makes sense because in a combined report action list, whichever CREATED is first need to be retained.
    const transactionThreadCreatedAction = transactionThreadReportActions?.find((action) => action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED);
    const parentReportCreatedAction = reportActions?.find((action) => action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED);
    let filteredTransactionThreadReportActions = transactionThreadReportActions;
    let filteredParentReportActions = reportActions;
    if (transactionThreadCreatedAction && parentReportCreatedAction && transactionThreadCreatedAction.created > parentReportCreatedAction.created) {
        filteredTransactionThreadReportActions = transactionThreadReportActions?.filter((action) => action.actionName !== CONST_1.default.REPORT.ACTIONS.TYPE.CREATED);
    }
    else if (transactionThreadCreatedAction) {
        filteredParentReportActions = reportActions?.filter((action) => action.actionName !== CONST_1.default.REPORT.ACTIONS.TYPE.CREATED);
    }
    const report = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
    const isSelfDM = report?.chatType === CONST_1.default.REPORT.CHAT_TYPE.SELF_DM;
    // Filter out request and send money request actions because we don't want to show any preview actions for one transaction reports
    const filteredReportActions = [...filteredParentReportActions, ...filteredTransactionThreadReportActions].filter((action) => {
        if (!isMoneyRequestAction(action)) {
            return true;
        }
        const actionType = getOriginalMessage(action)?.type ?? '';
        if (isSelfDM) {
            return actionType !== CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE;
        }
        return actionType !== CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE && actionType !== CONST_1.default.IOU.REPORT_ACTION_TYPE.TRACK;
    });
    return getSortedReportActions(filteredReportActions, true);
}
const iouRequestTypes = [CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE, CONST_1.default.IOU.REPORT_ACTION_TYPE.SPLIT, CONST_1.default.IOU.REPORT_ACTION_TYPE.TRACK];
// Get all IOU report actions for the report.
const iouRequestTypesSet = new Set([...iouRequestTypes, CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY]);
/**
 * Finds most recent IOU request action ID.
 */
function getMostRecentIOURequestActionID(reportActions) {
    if (!Array.isArray(reportActions)) {
        return null;
    }
    const iouRequestActions = reportActions?.filter((action) => {
        if (!isActionOfType(action, CONST_1.default.REPORT.ACTIONS.TYPE.IOU)) {
            return false;
        }
        const actionType = getOriginalMessage(action)?.type;
        if (!actionType) {
            return false;
        }
        return iouRequestTypes.includes(actionType);
    }) ?? [];
    if (iouRequestActions.length === 0) {
        return null;
    }
    const sortedReportActions = getSortedReportActions(iouRequestActions);
    return sortedReportActions.at(-1)?.reportActionID ?? null;
}
/**
 * Returns array of links inside a given report action
 */
function extractLinksFromMessageHtml(reportAction) {
    const htmlContent = getReportActionHtml(reportAction);
    const regex = CONST_1.default.REGEX_LINK_IN_ANCHOR;
    if (!htmlContent) {
        return [];
    }
    return [...htmlContent.matchAll(regex)].map((match) => match[1]);
}
/**
 * Returns the report action immediately before the specified index.
 * @param reportActions - all actions
 * @param actionIndex - index of the action
 */
function findPreviousAction(reportActions, actionIndex) {
    for (let i = actionIndex + 1; i < reportActions.length; i++) {
        // Find the next non-pending deletion report action, as the pending delete action means that it is not displayed in the UI, but still is in the report actions list.
        // If we are offline, all actions are pending but shown in the UI, so we take the previous action, even if it is a delete.
        if (isNetworkOffline || reportActions.at(i)?.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE) {
            return reportActions.at(i);
        }
    }
    return undefined;
}
/**
 * Returns the report action immediately after the specified index.
 * @param reportActions - all actions
 * @param actionIndex - index of the action
 */
function findNextAction(reportActions, actionIndex) {
    for (let i = actionIndex - 1; i >= 0; i--) {
        // Find the next non-pending deletion report action, as the pending delete action means that it is not displayed in the UI, but still is in the report actions list.
        // If we are offline, all actions are pending but shown in the UI, so we take the previous action, even if it is a delete.
        if (isNetworkOffline || reportActions.at(i)?.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE) {
            return reportActions.at(i);
        }
    }
    return undefined;
}
/**
 * Returns true when the previous report action (before actionIndex) is made by the same actor who performed the action at actionIndex.
 * Also checks to ensure that the comment is not too old to be shown as a grouped comment.
 *
 * @param reportActions - report actions ordered from latest
 * @param actionIndex - index of the comment item in state to check
 */
function isConsecutiveActionMadeByPreviousActor(reportActions, actionIndex) {
    const previousAction = findPreviousAction(reportActions, actionIndex);
    const currentAction = reportActions.at(actionIndex);
    return canActionsBeGrouped(currentAction, previousAction);
}
/**
 * Returns true when the next report action (after actionIndex) is made by the same actor who performed the action at actionIndex.
 * Also checks to ensure that the comment is not too old to be shown as a grouped comment.
 *
 * @param reportActions - report actions ordered from oldest
 * @param actionIndex - index of the comment item in state to check
 */
function hasNextActionMadeBySameActor(reportActions, actionIndex) {
    const currentAction = reportActions.at(actionIndex);
    const nextAction = findNextAction(reportActions, actionIndex);
    if (actionIndex === 0) {
        return false;
    }
    return canActionsBeGrouped(currentAction, nextAction);
}
/**
 * Combines the logic for grouping chat messages isConsecutiveActionMadeByPreviousActor and hasNextActionMadeBySameActor.
 * Returns true when messages are made by the same actor and not separated by more than 5 minutes.
 *
 * @param currentAction - Chronologically - latest action.
 * @param adjacentAction - Chronologically - previous action. Named adjacentAction to avoid confusion as isConsecutiveActionMadeByPreviousActor and hasNextActionMadeBySameActor take action lists that are in opposite orders.
 */
function canActionsBeGrouped(currentAction, adjacentAction) {
    // It's OK for there to be no previous action, and in that case, false will be returned
    // so that the comment isn't grouped
    if (!currentAction || !adjacentAction) {
        return false;
    }
    // Comments are only grouped if they happen within 5 minutes of each adjacent
    if (new Date(currentAction?.created).getTime() - new Date(adjacentAction.created).getTime() > CONST_1.default.REPORT.ACTIONS.MAX_GROUPING_TIME) {
        return false;
    }
    // Do not group if adjacent action was a created action
    if (adjacentAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED) {
        return false;
    }
    // Do not group if adjacent or current action was a renamed action
    if (adjacentAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.RENAMED || currentAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.RENAMED) {
        return false;
    }
    // Do not group if the delegate account ID is different
    if (adjacentAction.delegateAccountID !== currentAction.delegateAccountID) {
        return false;
    }
    // Do not group if one of previous / adjacent action is report preview and another one is not report preview
    if ((isReportPreviewAction(adjacentAction) && !isReportPreviewAction(currentAction)) || (isReportPreviewAction(currentAction) && !isReportPreviewAction(adjacentAction))) {
        return false;
    }
    if (isSubmittedAction(currentAction)) {
        const currentActionAdminAccountID = currentAction.adminAccountID;
        return typeof currentActionAdminAccountID === 'number'
            ? currentActionAdminAccountID === adjacentAction.actorAccountID
            : currentAction.actorAccountID === adjacentAction.actorAccountID;
    }
    if (isSubmittedAction(adjacentAction)) {
        return typeof adjacentAction.adminAccountID === 'number'
            ? currentAction.actorAccountID === adjacentAction.adminAccountID
            : currentAction.actorAccountID === adjacentAction.actorAccountID;
    }
    return currentAction.actorAccountID === adjacentAction.actorAccountID;
}
function isChronosAutomaticTimerAction(reportAction, isChronosReport) {
    const isAutomaticStartTimerAction = () => /start(?:ed|ing)?(?:\snow)?/i.test(getReportActionText(reportAction));
    const isAutomaticStopTimerAction = () => /stop(?:ped|ping)?(?:\snow)?/i.test(getReportActionText(reportAction));
    return isChronosReport && (isAutomaticStartTimerAction() || isAutomaticStopTimerAction());
}
/**
 * If the user sends consecutive actions to Chronos to automatically start/stop the timer,
 * then detect that and show each individually so that the user can easily see when they were sent.
 */
function isConsecutiveChronosAutomaticTimerAction(reportActions, actionIndex, isChronosReport) {
    const previousAction = findPreviousAction(reportActions, actionIndex);
    const currentAction = reportActions?.at(actionIndex);
    return isChronosAutomaticTimerAction(currentAction, isChronosReport) && isChronosAutomaticTimerAction(previousAction, isChronosReport);
}
/**
 * Checks if a reportAction is deprecated.
 */
function isReportActionDeprecated(reportAction, key) {
    if (!reportAction) {
        return true;
    }
    // HACK ALERT: We're temporarily filtering out any reportActions keyed by sequenceNumber
    // to prevent bugs during the migration from sequenceNumber -> reportActionID
    // eslint-disable-next-line deprecation/deprecation
    if (String(reportAction.sequenceNumber) === key) {
        Log_1.default.info('Front-end filtered out reportAction keyed by sequenceNumber!', false, reportAction);
        return true;
    }
    const deprecatedOldDotReportActions = [
        CONST_1.default.REPORT.ACTIONS.TYPE.DELETED_ACCOUNT,
        CONST_1.default.REPORT.ACTIONS.TYPE.REIMBURSEMENT_REQUESTED,
        CONST_1.default.REPORT.ACTIONS.TYPE.REIMBURSEMENT_SETUP_REQUESTED,
        CONST_1.default.REPORT.ACTIONS.TYPE.DONATION,
        CONST_1.default.REPORT.ACTIONS.TYPE.REIMBURSED,
    ];
    if (deprecatedOldDotReportActions.includes(reportAction.actionName)) {
        return true;
    }
    return false;
}
/**
 * Checks if a given report action corresponds to an actionable mention whisper.
 * @param reportAction
 */
function isActionableMentionWhisper(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.ACTIONABLE_MENTION_WHISPER);
}
function isActionableMentionInviteToSubmitExpenseConfirmWhisper(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.ACTIONABLE_MENTION_INVITE_TO_SUBMIT_EXPENSE_CONFIRM_WHISPER);
}
/**
 * Checks if a given report action corresponds to an actionable report mention whisper.
 * @param reportAction
 */
function isActionableReportMentionWhisper(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.ACTIONABLE_REPORT_MENTION_WHISPER);
}
/**
 * Checks if a given report action corresponds to a welcome whisper.
 * @param reportAction
 */
function isExpenseChatWelcomeWhisper(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_EXPENSE_CHAT_WELCOME_WHISPER);
}
/**
 * Checks whether an action is actionable track expense.
 */
function isActionableTrackExpense(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.ACTIONABLE_TRACK_EXPENSE_WHISPER);
}
function isActionableWhisper(reportAction) {
    return (isActionableMentionWhisper(reportAction) ||
        isActionableTrackExpense(reportAction) ||
        isActionableReportMentionWhisper(reportAction) ||
        isActionableMentionInviteToSubmitExpenseConfirmWhisper(reportAction));
}
const { POLICY_CHANGE_LOG: policyChangelogTypes, ROOM_CHANGE_LOG: roomChangeLogTypes, ...otherActionTypes } = CONST_1.default.REPORT.ACTIONS.TYPE;
const supportedActionTypes = [...Object.values(otherActionTypes), ...Object.values(policyChangelogTypes), ...Object.values(roomChangeLogTypes)];
/**
 * Checks whether an action is actionable track expense and resolved.
 *
 */
function isResolvedActionableWhisper(reportAction) {
    const originalMessage = getOriginalMessage(reportAction);
    const resolution = originalMessage && typeof originalMessage === 'object' && 'resolution' in originalMessage ? originalMessage?.resolution : null;
    return !!resolution;
}
/**
 * Checks whether an action is concierge category options and resolved.
 */
function isResolvedConciergeCategoryOptions(reportAction) {
    const originalMessage = getOriginalMessage(reportAction);
    const selectedCategory = originalMessage && typeof originalMessage === 'object' && 'selectedCategory' in originalMessage ? originalMessage?.selectedCategory : null;
    return !!selectedCategory;
}
/**
 * Checks if a reportAction is fit for display, meaning that it's not deprecated, is of a valid
 * and supported type, it's not deleted and also not closed.
 */
function shouldReportActionBeVisible(reportAction, key, canUserPerformWriteAction) {
    if (!reportAction) {
        return false;
    }
    if (isReportActionDeprecated(reportAction, key)) {
        return false;
    }
    // Filter out any unsupported reportAction types
    if (!supportedActionTypes.includes(reportAction.actionName)) {
        return false;
    }
    // Ignore closed action here since we're already displaying a footer that explains why the report was closed
    if (reportAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CLOSED && !isMarkAsClosedAction(reportAction)) {
        return false;
    }
    // Ignore markedAsReimbursed action here since we're already display message that explains the expense was paid
    // elsewhere in the IOU reportAction
    if (reportAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.MARKED_REIMBURSED) {
        return false;
    }
    if (isWhisperActionTargetedToOthers(reportAction)) {
        return false;
    }
    if (isPendingRemove(reportAction) && !reportAction.childVisibleActionCount) {
        return false;
    }
    if ((isActionableReportMentionWhisper(reportAction) || isActionableJoinRequestPendingReportAction(reportAction) || isActionableMentionWhisper(reportAction)) &&
        !canUserPerformWriteAction) {
        return false;
    }
    if (isTripPreview(reportAction) || isTravelUpdate(reportAction)) {
        return true;
    }
    // If action is actionable whisper and resolved by user, then we don't want to render anything
    if (isActionableWhisper(reportAction) && isResolvedActionableWhisper(reportAction)) {
        return false;
    }
    if (!isVisiblePreviewOrMoneyRequest(reportAction)) {
        return false;
    }
    // All other actions are displayed except thread parents, deleted, or non-pending actions
    const isDeleted = isDeletedAction(reportAction);
    const isPending = !!reportAction.pendingAction;
    return !isDeleted || isPending || isDeletedParentAction(reportAction) || isReversedTransaction(reportAction);
}
/**
 * Checks if the new marker should be hidden for the report action.
 */
function shouldHideNewMarker(reportAction) {
    if (!reportAction) {
        return true;
    }
    return !isNetworkOffline && reportAction.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE;
}
/**
 * Checks if a reportAction is fit for display as report last action, meaning that
 * it satisfies shouldReportActionBeVisible, it's not whisper action and not deleted.
 */
function shouldReportActionBeVisibleAsLastAction(reportAction, canUserPerformWriteAction) {
    if (!reportAction) {
        return false;
    }
    if (Object.keys(reportAction.errors ?? {}).length > 0) {
        return false;
    }
    // If a whisper action is the REPORT_PREVIEW action, we are displaying it.
    // If the action's message text is empty and it is not a deleted parent with visible child actions, hide it. Else, consider the action to be displayable.
    return (shouldReportActionBeVisible(reportAction, reportAction.reportActionID, canUserPerformWriteAction) &&
        (!(isWhisperAction(reportAction) && !isReportPreviewAction(reportAction) && !isMoneyRequestAction(reportAction)) || isActionableMentionWhisper(reportAction)) &&
        !(isDeletedAction(reportAction) && !isDeletedParentAction(reportAction) && !isPendingHide(reportAction)));
}
/**
 * For policy change logs, report URLs are generated in the server,
 * which includes a baseURL placeholder that's replaced in the client.
 */
function replaceBaseURLInPolicyChangeLogAction(reportAction) {
    if (!reportAction?.message || !isPolicyChangeLogAction(reportAction)) {
        return reportAction;
    }
    const updatedReportAction = (0, clone_1.default)(reportAction);
    if (!updatedReportAction.message) {
        return updatedReportAction;
    }
    if (Array.isArray(updatedReportAction.message)) {
        const message = updatedReportAction.message.at(0);
        if (message) {
            message.html = getReportActionHtml(reportAction)?.replace('%baseURL', environmentURL);
        }
    }
    return updatedReportAction;
}
function getLastVisibleAction(reportID, canUserPerformWriteAction, actionsToMerge = {}, reportActionsParam = allReportActions) {
    let reportActions = [];
    if (!(0, isEmpty_1.default)(actionsToMerge)) {
        reportActions = Object.values((0, expensify_common_1.fastMerge)(reportActionsParam?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`] ?? {}, actionsToMerge ?? {}, true));
    }
    else {
        reportActions = Object.values(allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`] ?? {});
    }
    const visibleReportActions = reportActions.filter((action) => shouldReportActionBeVisibleAsLastAction(action, canUserPerformWriteAction));
    const sortedReportActions = getSortedReportActions(visibleReportActions, true);
    if (sortedReportActions.length === 0) {
        return undefined;
    }
    return sortedReportActions.at(0);
}
function formatLastMessageText(lastMessageText) {
    const trimmedMessage = String(lastMessageText).trim();
    // Add support for inline code containing only space characters
    // The message will appear as a blank space in the LHN
    if ((trimmedMessage === '' && (lastMessageText?.length ?? 0) > 0) ||
        (trimmedMessage === '?\u2026' && (lastMessageText?.length ?? 0) > CONST_1.default.REPORT.MIN_LENGTH_LAST_MESSAGE_WITH_ELLIPSIS)) {
        return ' ';
    }
    return StringUtils_1.default.lineBreaksToSpaces(trimmedMessage).substring(0, CONST_1.default.REPORT.LAST_MESSAGE_TEXT_MAX_LENGTH).trim();
}
function getLastVisibleMessage(reportID, canUserPerformWriteAction, actionsToMerge = {}, reportAction = undefined) {
    const lastVisibleAction = reportAction ?? getLastVisibleAction(reportID, canUserPerformWriteAction, actionsToMerge);
    const message = getReportActionMessage(lastVisibleAction);
    if (message && (0, isReportMessageAttachment_1.isReportMessageAttachment)(message)) {
        return {
            lastMessageText: CONST_1.default.ATTACHMENT_MESSAGE_TEXT,
            lastMessageHtml: CONST_1.default.TRANSLATION_KEYS.ATTACHMENT,
        };
    }
    if (isCreatedAction(lastVisibleAction)) {
        return {
            lastMessageText: '',
        };
    }
    let messageText = getReportActionMessageText(lastVisibleAction) ?? '';
    if (messageText) {
        messageText = formatLastMessageText(messageText);
    }
    return {
        lastMessageText: messageText,
    };
}
/**
 * A helper method to filter out report actions keyed by sequenceNumbers.
 */
function filterOutDeprecatedReportActions(reportActions) {
    return Object.entries(reportActions ?? {})
        .filter(([key, reportAction]) => !isReportActionDeprecated(reportAction, key))
        .map((entry) => entry[1]);
}
/**
 * Determines whether a report action should be visible in the report view.
 * Filters out:
 * - ReportPreview with shouldShow set to false and without a pending action
 * - Money request with parent action deleted
 */
function isVisiblePreviewOrMoneyRequest(action) {
    const isDeletedMoneyRequest = isDeletedParentAction(action) && isMoneyRequestAction(action);
    const isHiddenReportPreviewWithoutPendingAction = isReportPreviewAction(action) && action.pendingAction === undefined && !action.shouldShow;
    return !isDeletedMoneyRequest && !isHiddenReportPreviewWithoutPendingAction;
}
/**
 * Helper for filtering out report actions that should not be displayed in the report view.
 * Delegates visibility logic to isVisiblePreviewOrMoneyRequest.
 */
function getFilteredReportActionsForReportView(actions) {
    // The free trial message can be duplicated due to this change https://github.com/Expensify/App/pull/68630 without the backend change
    // So we need to filter out the duplicate free trial message
    const freeTrialMessages = actions.filter((action) => {
        const html = getReportActionHtml(action);
        return Parser_1.default.htmlToMarkdown(html) === CONST_1.default.FREE_TRIAL_MARKDOWN;
    });
    const isDuplicateFreeTrialMessage = freeTrialMessages.length > 1;
    return actions.filter(isVisiblePreviewOrMoneyRequest).filter((action) => !isDuplicateFreeTrialMessage || action.reportActionID !== freeTrialMessages.at(0)?.reportActionID);
}
/**
 * This method returns the report actions that are ready for display in the ReportActionsView.
 * The report actions need to be sorted by created timestamp first, and reportActionID second
 * to ensure they will always be displayed in the same order (in case multiple actions have the same timestamp).
 * This is all handled with getSortedReportActions() which is used by several other methods to keep the code DRY.
 */
function getSortedReportActionsForDisplay(reportActions, canUserPerformWriteAction, shouldIncludeInvisibleActions = false) {
    let filteredReportActions = [];
    if (!reportActions) {
        return [];
    }
    if (shouldIncludeInvisibleActions) {
        filteredReportActions = Object.values(reportActions).filter(Boolean);
    }
    else {
        filteredReportActions = Object.entries(reportActions)
            .filter(([key, reportAction]) => shouldReportActionBeVisible(reportAction, key, canUserPerformWriteAction))
            .map(([, reportAction]) => reportAction);
    }
    const baseURLAdjustedReportActions = filteredReportActions.map((reportAction) => replaceBaseURLInPolicyChangeLogAction(reportAction));
    return getSortedReportActions(baseURLAdjustedReportActions, true);
}
/**
 * In some cases, there can be multiple closed report actions in a chat report.
 * This method returns the last closed report action so we can always show the correct archived report reason.
 * Additionally, archived #admins and #announce do not have the closed report action so we will return null if none is found.
 *
 */
function getLastClosedReportAction(reportActions) {
    // If closed report action is not present, return early
    if (!Object.values(reportActions ?? {}).some((action) => {
        return action?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CLOSED;
    })) {
        return undefined;
    }
    const filteredReportActions = filterOutDeprecatedReportActions(reportActions);
    const sortedReportActions = getSortedReportActions(filteredReportActions);
    return (0, findLast_1.default)(sortedReportActions, (action) => action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CLOSED);
}
/**
 * The first visible action is the second last action in sortedReportActions which satisfy following conditions:
 * 1. That is not pending deletion as pending deletion actions are kept in sortedReportActions in memory.
 * 2. That has at least one visible child action.
 * 3. While offline all actions in `sortedReportActions` are visible.
 * 4. We will get the second last action from filtered actions because the last
 *    action is always the created action
 */
function getFirstVisibleReportActionID(sortedReportActions = [], isOffline = false) {
    if (!Array.isArray(sortedReportActions)) {
        return '';
    }
    const sortedFilterReportActions = sortedReportActions.filter((action) => !isDeletedAction(action) || (action?.childVisibleActionCount ?? 0) > 0 || isOffline);
    return sortedFilterReportActions.length > 1 ? sortedFilterReportActions.at(sortedFilterReportActions.length - 2)?.reportActionID : undefined;
}
/**
 * @returns The latest report action in the `onyxData` or `null` if one couldn't be found
 */
function getLatestReportActionFromOnyxData(onyxData) {
    const reportActionUpdate = onyxData?.find((onyxUpdate) => onyxUpdate.key.startsWith(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS));
    if (!reportActionUpdate) {
        return null;
    }
    const reportActions = Object.values(reportActionUpdate.value ?? {});
    const sortedReportActions = getSortedReportActions(reportActions);
    return sortedReportActions.at(-1) ?? null;
}
/**
 * Find the transaction associated with this reportAction, if one exists.
 */
function getLinkedTransactionID(reportActionOrID, reportID) {
    const reportAction = typeof reportActionOrID === 'string' ? allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`]?.[reportActionOrID] : reportActionOrID;
    if (!reportAction || !isMoneyRequestAction(reportAction)) {
        return undefined;
    }
    return getOriginalMessage(reportAction)?.IOUTransactionID;
}
function getReportAction(reportID, reportActionID) {
    if (!reportID || !reportActionID) {
        return undefined;
    }
    return allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`]?.[reportActionID];
}
/**
 * @returns The report preview action or `null` if one couldn't be found
 */
function getReportPreviewAction(chatReportID, iouReportID) {
    if (!chatReportID || !iouReportID) {
        return;
    }
    return Object.values(allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReportID}`] ?? {}).find((reportAction) => reportAction && isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW) && getOriginalMessage(reportAction)?.linkedReportID === iouReportID);
}
/**
 * Get the iouReportID for a given report action.
 */
function getIOUReportIDFromReportActionPreview(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW) ? getOriginalMessage(reportAction)?.linkedReportID : undefined;
}
/**
 * A helper method to identify if the message is deleted or not.
 */
function isMessageDeleted(reportAction) {
    return getReportActionMessage(reportAction)?.isDeletedParentAction ?? false;
}
/**
 * Simple hook to check whether the PureReportActionItem should return item based on whether the ReportPreview was recently deleted and the PureReportActionItem has not yet unloaded
 */
function useTableReportViewActionRenderConditionals({ childMoneyRequestCount, childVisibleActionCount, pendingAction, actionName }) {
    const previousChildMoneyRequestCount = (0, usePrevious_1.default)(childMoneyRequestCount);
    const isActionAReportPreview = actionName === CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW;
    const isActionInUpdateState = pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE;
    const reportsCount = childMoneyRequestCount;
    const previousReportsCount = previousChildMoneyRequestCount ?? 0;
    const commentsCount = childVisibleActionCount ?? 0;
    const isEmptyPreviewWithComments = reportsCount === 0 && commentsCount > 0 && previousReportsCount > 0;
    // We only want to remove the item if the ReportPreview has comments but no reports, so we avoid having a PureReportActionItem with no ReportPreview but only comments
    return !(isActionAReportPreview && isActionInUpdateState && isEmptyPreviewWithComments);
}
/**
 * Returns the number of expenses associated with a report preview
 */
function getNumberOfMoneyRequests(reportPreviewAction) {
    return reportPreviewAction?.childMoneyRequestCount ?? 0;
}
function isSplitBillAction(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.IOU) && getOriginalMessage(reportAction)?.type === CONST_1.default.IOU.REPORT_ACTION_TYPE.SPLIT;
}
function isIOURequestReportAction(reportAction) {
    const type = isMoneyRequestAction(reportAction) && getOriginalMessage(reportAction)?.type;
    return !!type && iouRequestTypes.includes(type);
}
function isTrackExpenseAction(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.IOU) && getOriginalMessage(reportAction)?.type === CONST_1.default.IOU.REPORT_ACTION_TYPE.TRACK;
}
function isPayAction(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.IOU) && getOriginalMessage(reportAction)?.type === CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY;
}
function isTaskAction(reportAction) {
    const reportActionName = reportAction?.actionName;
    return (reportActionName === CONST_1.default.REPORT.ACTIONS.TYPE.TASK_COMPLETED ||
        reportActionName === CONST_1.default.REPORT.ACTIONS.TYPE.TASK_CANCELLED ||
        reportActionName === CONST_1.default.REPORT.ACTIONS.TYPE.TASK_REOPENED ||
        reportActionName === CONST_1.default.REPORT.ACTIONS.TYPE.TASK_EDITED);
}
/**
 * @param actionName - The name of the action
 * @returns - Whether the action is a tag modification action
 * */
function isTagModificationAction(actionName) {
    return (actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.ADD_TAG ||
        actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_TAG_ENABLED ||
        actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_TAG_NAME ||
        actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_TAG ||
        actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_MULTIPLE_TAGS ||
        actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_TAG);
}
/**
 * Used for Send Money flow, which is a special case where we have no IOU create action and only one IOU pay action.
 * In other reports, pay actions do not count as a transactions, but this is an exception to this rule.
 */
function getSendMoneyFlowAction(actions, chatReport) {
    if (!chatReport) {
        return undefined;
    }
    const iouActions = Object.values(actions ?? {}).filter(isMoneyRequestAction);
    // sendMoneyFlow has only one IOU action...
    if (iouActions.length !== 1) {
        return undefined;
    }
    // ...which is 'pay'...
    const isFirstActionPay = getOriginalMessage(iouActions.at(0))?.type === CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY;
    const { type, chatType, parentReportID, parentReportActionID } = chatReport;
    // ...and can only be triggered on DM chats
    const isDM = type === CONST_1.default.REPORT.TYPE.CHAT && !chatType && !(parentReportID && parentReportActionID);
    return isFirstActionPay && isDM ? iouActions.at(0) : undefined;
}
/** Whether action has no linked report by design */
const isIOUActionTypeExcludedFromFiltering = (type) => [CONST_1.default.IOU.REPORT_ACTION_TYPE.SPLIT, CONST_1.default.IOU.REPORT_ACTION_TYPE.TRACK, CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY].some((actionType) => actionType === type);
/**
 * Determines whether the given action is an IOU and, if a list of report transaction IDs is provided,
 * whether it corresponds to one of those transactions. This covers a rare case where IOU report actions was
 * not deleted or moved after the expense was removed from the report.
 *
 * For compatibility and to avoid using isMoneyRequest next to this function as it is checked here already:
 * - If the action is not a money request and `defaultToFalseForNonIOU` is false (default), the result is true.
 * - If no `reportTransactionIDs` are provided, the function returns true if the action is an IOU.
 * - If `reportTransactionIDs` are provided, the function checks if the IOU transaction ID from the action matches any of them.
 */
const isIOUActionMatchingTransactionList = (action, reportTransactionIDs, defaultToFalseForNonIOU = false) => {
    if (!isMoneyRequestAction(action)) {
        return !defaultToFalseForNonIOU;
    }
    if (isIOUActionTypeExcludedFromFiltering(getOriginalMessage(action)?.type) || reportTransactionIDs === undefined) {
        return true;
    }
    const { IOUTransactionID } = getOriginalMessage(action) ?? {};
    return !!IOUTransactionID && reportTransactionIDs.includes(IOUTransactionID);
};
exports.isIOUActionMatchingTransactionList = isIOUActionMatchingTransactionList;
/**
 * Gets the report action for the transaction thread associated with a report by iterating over the reportActions and identifying the IOU report actions.
 * Returns a report action if there is exactly one transaction thread for the report, and undefined otherwise.
 */
function getOneTransactionThreadReportAction(report, chatReport, reportActions, isOffline = undefined, reportTransactionIDs) {
    // If the report is not an IOU, Expense report, or Invoice, it shouldn't be treated as one-transaction report.
    if (report?.type !== CONST_1.default.REPORT.TYPE.IOU && report?.type !== CONST_1.default.REPORT.TYPE.EXPENSE && report?.type !== CONST_1.default.REPORT.TYPE.INVOICE) {
        return;
    }
    const reportActionsArray = Array.isArray(reportActions) ? reportActions : Object.values(reportActions ?? {});
    if (!reportActionsArray.length) {
        return;
    }
    const sendMoneyFlow = getSendMoneyFlowAction(reportActions, chatReport);
    if (sendMoneyFlow?.childReportID) {
        return sendMoneyFlow;
    }
    const iouRequestActions = [];
    for (const action of reportActionsArray) {
        // If the original message is a 'pay' IOU without IOUDetails, it shouldn't be added to the transaction count.
        // However, it is excluded from the matching function in order to display it properly, so we need to compare the type here.
        if (!isIOUActionMatchingTransactionList(action, reportTransactionIDs, true) ||
            (getOriginalMessage(action)?.type === CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY && !getOriginalMessage(action)?.IOUDetails)) {
            continue;
        }
        const originalMessage = getOriginalMessage(action);
        const actionType = originalMessage?.type;
        if (actionType &&
            iouRequestTypesSet.has(actionType) &&
            // Include deleted IOU reportActions if:
            // - they have an associated IOU transaction ID or
            // - the action is pending deletion and the user is offline
            (!!originalMessage?.IOUTransactionID || (action.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE && (isOffline ?? isNetworkOffline)))) {
            iouRequestActions.push(action);
        }
    }
    // If we don't have any IOU request actions, or we have more than one IOU request actions, this isn't a oneTransaction report
    if (!iouRequestActions.length || iouRequestActions.length > 1) {
        return;
    }
    const singleAction = iouRequestActions.at(0);
    const originalMessage = getOriginalMessage(singleAction);
    // If there's only one IOU request action associated with the report but it's been deleted, then we don't consider this a oneTransaction report
    // and want to display it using the standard view
    if (((originalMessage?.deleted ?? '') !== '' || isDeletedAction(singleAction)) && isMoneyRequestAction(singleAction)) {
        return;
    }
    return singleAction;
}
/**
 * Gets the reportID for the transaction thread associated with a report by iterating over the reportActions and identifying the IOU report actions.
 * Returns a reportID if there is exactly one transaction thread for the report, and undefined otherwise.
 */
function getOneTransactionThreadReportID(...args) {
    const reportAction = getOneTransactionThreadReportAction(...args);
    if (reportAction) {
        // Since we don't always create transaction thread optimistically, we return CONST.FAKE_REPORT_ID
        return reportAction.childReportID ?? CONST_1.default.FAKE_REPORT_ID;
    }
}
/**
 * When we delete certain reports, we want to check whether there are any visible actions left to display.
 * If there are no visible actions left (including system messages), we can hide the report from view entirely
 */
function doesReportHaveVisibleActions(reportID, canUserPerformWriteAction, actionsToMerge = {}) {
    const reportActions = Object.values((0, expensify_common_1.fastMerge)(allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`] ?? {}, actionsToMerge, true));
    const visibleReportActions = Object.values(reportActions ?? {}).filter((action) => shouldReportActionBeVisibleAsLastAction(action, canUserPerformWriteAction));
    // Exclude the task system message and the created message
    const visibleReportActionsWithoutTaskSystemMessage = visibleReportActions.filter((action) => !isTaskAction(action) && !isCreatedAction(action));
    return visibleReportActionsWithoutTaskSystemMessage.length > 0;
}
function getAllReportActions(reportID) {
    return allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`] ?? {};
}
/**
 * Check whether a report action is an attachment (a file, such as an image or a zip).
 *
 */
function isReportActionAttachment(reportAction) {
    const message = getReportActionMessage(reportAction);
    if (reportAction && ('isAttachmentOnly' in reportAction || 'isAttachmentWithText' in reportAction)) {
        return reportAction.isAttachmentOnly ?? reportAction.isAttachmentWithText ?? false;
    }
    if (message) {
        return (0, isReportMessageAttachment_1.isReportMessageAttachment)(message);
    }
    return false;
}
// We pass getReportName as a param to avoid cyclic dependency.
function getMemberChangeMessageElements(reportAction, getReportNameCallback) {
    const isInviteAction = isInviteMemberAction(reportAction);
    const isLeaveAction = isLeavePolicyAction(reportAction);
    if (!isMemberChangeAction(reportAction)) {
        return [];
    }
    // Currently, we only render messages when members are invited
    let verb = (0, Localize_1.translateLocal)('workspace.invite.removed');
    if (isInviteAction) {
        verb = (0, Localize_1.translateLocal)('workspace.invite.invited');
    }
    if (isLeaveAction) {
        verb = getPolicyChangeLogEmployeeLeftMessage(reportAction);
    }
    const originalMessage = getOriginalMessage(reportAction);
    const targetAccountIDs = originalMessage?.targetAccountIDs ?? [];
    const personalDetails = (0, PersonalDetailsUtils_1.getPersonalDetailsByIDs)({ accountIDs: targetAccountIDs, currentUserAccountID: 0 });
    const mentionElements = targetAccountIDs.map((accountID) => {
        const personalDetail = personalDetails.find((personal) => personal.accountID === accountID);
        const handleText = (0, PersonalDetailsUtils_1.getEffectiveDisplayName)(LocalePhoneNumber_1.formatPhoneNumber, personalDetail) ?? (0, Localize_1.translateLocal)('common.hidden');
        return {
            kind: 'userMention',
            content: `@${handleText}`,
            accountID,
        };
    });
    const buildRoomElements = () => {
        const roomName = getReportNameCallback(allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${originalMessage?.reportID}`]) || originalMessage?.roomName;
        if (roomName && originalMessage) {
            const preposition = isInviteAction ? ` ${(0, Localize_1.translateLocal)('workspace.invite.to')} ` : ` ${(0, Localize_1.translateLocal)('workspace.invite.from')} `;
            if (originalMessage.reportID) {
                return [
                    {
                        kind: 'text',
                        content: preposition,
                    },
                    {
                        kind: 'roomReference',
                        roomName,
                        roomID: originalMessage.reportID,
                        content: roomName,
                    },
                ];
            }
        }
        return [];
    };
    return [
        {
            kind: 'text',
            content: `${verb} `,
        },
        ...(0, Localize_1.formatMessageElementList)(mentionElements),
        ...buildRoomElements(),
    ];
}
function getReportActionHtml(reportAction) {
    return getReportActionMessage(reportAction)?.html ?? '';
}
function getReportActionText(reportAction) {
    const message = getReportActionMessage(reportAction);
    // Sometime html can be an empty string
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const text = (message?.html || message?.text) ?? '';
    return text ? Parser_1.default.htmlToText(text) : '';
}
function getTextFromHtml(html) {
    return html ? Parser_1.default.htmlToText(html) : '';
}
function isOldDotLegacyAction(action) {
    return [
        CONST_1.default.REPORT.ACTIONS.TYPE.DELETED_ACCOUNT,
        CONST_1.default.REPORT.ACTIONS.TYPE.DONATION,
        CONST_1.default.REPORT.ACTIONS.TYPE.EXPORTED_TO_QUICK_BOOKS,
        CONST_1.default.REPORT.ACTIONS.TYPE.REIMBURSEMENT_REQUESTED,
        CONST_1.default.REPORT.ACTIONS.TYPE.REIMBURSEMENT_SETUP,
    ].some((oldDotActionName) => oldDotActionName === action?.actionName);
}
function isOldDotReportAction(action) {
    if (!action || !action.actionName) {
        return false;
    }
    return [
        CONST_1.default.REPORT.ACTIONS.TYPE.CHANGE_FIELD,
        CONST_1.default.REPORT.ACTIONS.TYPE.CHANGE_TYPE,
        CONST_1.default.REPORT.ACTIONS.TYPE.EXPORTED_TO_CSV,
        CONST_1.default.REPORT.ACTIONS.TYPE.INTEGRATIONS_MESSAGE,
        CONST_1.default.REPORT.ACTIONS.TYPE.MANAGER_ATTACH_RECEIPT,
        CONST_1.default.REPORT.ACTIONS.TYPE.MANAGER_DETACH_RECEIPT,
        CONST_1.default.REPORT.ACTIONS.TYPE.MARKED_REIMBURSED,
        CONST_1.default.REPORT.ACTIONS.TYPE.MARK_REIMBURSED_FROM_INTEGRATION,
        CONST_1.default.REPORT.ACTIONS.TYPE.OUTDATED_BANK_ACCOUNT,
        CONST_1.default.REPORT.ACTIONS.TYPE.REIMBURSEMENT_ACH_BOUNCE,
        CONST_1.default.REPORT.ACTIONS.TYPE.REIMBURSEMENT_ACH_CANCELED,
        CONST_1.default.REPORT.ACTIONS.TYPE.REIMBURSEMENT_ACCOUNT_CHANGED,
        CONST_1.default.REPORT.ACTIONS.TYPE.REIMBURSEMENT_DELAYED,
        CONST_1.default.REPORT.ACTIONS.TYPE.SELECTED_FOR_RANDOM_AUDIT,
        CONST_1.default.REPORT.ACTIONS.TYPE.SHARE,
        CONST_1.default.REPORT.ACTIONS.TYPE.STRIPE_PAID,
        CONST_1.default.REPORT.ACTIONS.TYPE.UNSHARE,
        CONST_1.default.REPORT.ACTIONS.TYPE.DELETED_ACCOUNT,
        CONST_1.default.REPORT.ACTIONS.TYPE.DONATION,
        CONST_1.default.REPORT.ACTIONS.TYPE.EXPORTED_TO_QUICK_BOOKS,
        CONST_1.default.REPORT.ACTIONS.TYPE.REIMBURSEMENT_REQUESTED,
        CONST_1.default.REPORT.ACTIONS.TYPE.REIMBURSEMENT_SETUP,
    ].some((oldDotActionName) => oldDotActionName === action.actionName);
}
function getMessageOfOldDotLegacyAction(legacyAction) {
    if (!Array.isArray(legacyAction?.message)) {
        return getReportActionText(legacyAction);
    }
    if (legacyAction.message.length !== 0) {
        // Sometime html can be an empty string
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        return legacyAction?.message?.map((element) => getTextFromHtml(element?.html || element?.text)).join('') ?? '';
    }
    return '';
}
/**
 * Helper method to format message of OldDot Actions.
 */
function getMessageOfOldDotReportAction(oldDotAction, withMarkdown = true) {
    if (isOldDotLegacyAction(oldDotAction)) {
        return getMessageOfOldDotLegacyAction(oldDotAction);
    }
    const { originalMessage, actionName } = oldDotAction;
    switch (actionName) {
        case CONST_1.default.REPORT.ACTIONS.TYPE.CHANGE_FIELD: {
            const { oldValue, newValue, fieldName } = originalMessage;
            if (!oldValue) {
                return (0, Localize_1.translateLocal)('report.actions.type.changeFieldEmpty', { newValue, fieldName });
            }
            return (0, Localize_1.translateLocal)('report.actions.type.changeField', { oldValue, newValue, fieldName });
        }
        case CONST_1.default.REPORT.ACTIONS.TYPE.EXPORTED_TO_CSV:
            return (0, Localize_1.translateLocal)('report.actions.type.exportedToCSV');
        case CONST_1.default.REPORT.ACTIONS.TYPE.INTEGRATIONS_MESSAGE: {
            const { result, label } = originalMessage;
            const errorMessage = result?.messages?.join(', ') ?? '';
            const linkText = result?.link?.text ?? '';
            const linkURL = result?.link?.url ?? '';
            return (0, Localize_1.translateLocal)('report.actions.type.integrationsMessage', { errorMessage, label, linkText, linkURL });
        }
        case CONST_1.default.REPORT.ACTIONS.TYPE.MANAGER_ATTACH_RECEIPT:
            return (0, Localize_1.translateLocal)('report.actions.type.managerAttachReceipt');
        case CONST_1.default.REPORT.ACTIONS.TYPE.MANAGER_DETACH_RECEIPT:
            return (0, Localize_1.translateLocal)('report.actions.type.managerDetachReceipt');
        case CONST_1.default.REPORT.ACTIONS.TYPE.MARK_REIMBURSED_FROM_INTEGRATION: {
            const { amount, currency } = originalMessage;
            return (0, Localize_1.translateLocal)('report.actions.type.markedReimbursedFromIntegration', { amount, currency });
        }
        case CONST_1.default.REPORT.ACTIONS.TYPE.OUTDATED_BANK_ACCOUNT:
            return (0, Localize_1.translateLocal)('report.actions.type.outdatedBankAccount');
        case CONST_1.default.REPORT.ACTIONS.TYPE.REIMBURSEMENT_ACH_BOUNCE:
            return (0, Localize_1.translateLocal)('report.actions.type.reimbursementACHBounce');
        case CONST_1.default.REPORT.ACTIONS.TYPE.REIMBURSEMENT_ACH_CANCELED:
            return (0, Localize_1.translateLocal)('report.actions.type.reimbursementACHCancelled');
        case CONST_1.default.REPORT.ACTIONS.TYPE.REIMBURSEMENT_ACCOUNT_CHANGED:
            return (0, Localize_1.translateLocal)('report.actions.type.reimbursementAccountChanged');
        case CONST_1.default.REPORT.ACTIONS.TYPE.REIMBURSEMENT_DELAYED:
            return (0, Localize_1.translateLocal)('report.actions.type.reimbursementDelayed');
        case CONST_1.default.REPORT.ACTIONS.TYPE.SELECTED_FOR_RANDOM_AUDIT:
            return (0, Localize_1.translateLocal)(`report.actions.type.selectedForRandomAudit${withMarkdown ? 'Markdown' : ''}`);
        case CONST_1.default.REPORT.ACTIONS.TYPE.SHARE:
            return (0, Localize_1.translateLocal)('report.actions.type.share', { to: originalMessage.to });
        case CONST_1.default.REPORT.ACTIONS.TYPE.UNSHARE:
            return (0, Localize_1.translateLocal)('report.actions.type.unshare', { to: originalMessage.to });
        case CONST_1.default.REPORT.ACTIONS.TYPE.TAKE_CONTROL:
            return (0, Localize_1.translateLocal)('report.actions.type.takeControl');
        default:
            return '';
    }
}
function getTravelUpdateMessage(action, formatDate) {
    const details = getOriginalMessage(action);
    const formattedStartDate = formatDate?.(details?.start.date ?? '', false) ?? (0, date_fns_1.format)(details?.start.date ?? '', CONST_1.default.DATE.FNS_DATE_TIME_FORMAT_STRING);
    switch (details?.operation) {
        case CONST_1.default.TRAVEL.UPDATE_OPERATION_TYPE.BOOKING_TICKETED:
            return (0, Localize_1.translateLocal)('travel.updates.bookingTicketed', {
                airlineCode: details.route?.airlineCode ?? '',
                origin: details.start.shortName ?? '',
                destination: details.end?.shortName ?? '',
                startDate: formattedStartDate,
                confirmationID: details.confirmations?.at(0)?.value,
            });
        case CONST_1.default.TRAVEL.UPDATE_OPERATION_TYPE.TICKET_VOIDED:
            return (0, Localize_1.translateLocal)('travel.updates.ticketVoided', {
                airlineCode: details.route?.airlineCode ?? '',
                origin: details.start.shortName ?? '',
                destination: details.end?.shortName ?? '',
                startDate: formattedStartDate,
            });
        case CONST_1.default.TRAVEL.UPDATE_OPERATION_TYPE.TICKET_REFUNDED:
            return (0, Localize_1.translateLocal)('travel.updates.ticketRefunded', {
                airlineCode: details.route?.airlineCode ?? '',
                origin: details.start.shortName ?? '',
                destination: details.end?.shortName ?? '',
                startDate: formattedStartDate,
            });
        case CONST_1.default.TRAVEL.UPDATE_OPERATION_TYPE.FLIGHT_CANCELLED:
            return (0, Localize_1.translateLocal)('travel.updates.flightCancelled', {
                airlineCode: details.route?.airlineCode ?? '',
                origin: details.start.shortName ?? '',
                destination: details.end?.shortName ?? '',
                startDate: formattedStartDate,
            });
        case CONST_1.default.TRAVEL.UPDATE_OPERATION_TYPE.FLIGHT_SCHEDULE_CHANGE_PENDING:
            return (0, Localize_1.translateLocal)('travel.updates.flightScheduleChangePending', {
                airlineCode: details.route?.airlineCode ?? '',
            });
        case CONST_1.default.TRAVEL.UPDATE_OPERATION_TYPE.FLIGHT_SCHEDULE_CHANGE_CLOSED:
            return (0, Localize_1.translateLocal)('travel.updates.flightScheduleChangeClosed', {
                airlineCode: details.route?.airlineCode ?? '',
                startDate: formattedStartDate,
            });
        case CONST_1.default.TRAVEL.UPDATE_OPERATION_TYPE.FLIGHT_CHANGED:
            return (0, Localize_1.translateLocal)('travel.updates.flightUpdated', {
                airlineCode: details.route?.airlineCode ?? '',
                origin: details.start.shortName ?? '',
                destination: details.end?.shortName ?? '',
                startDate: formattedStartDate,
            });
        case CONST_1.default.TRAVEL.UPDATE_OPERATION_TYPE.FLIGHT_CABIN_CHANGED:
            return (0, Localize_1.translateLocal)('travel.updates.flightCabinChanged', {
                airlineCode: details.route?.airlineCode ?? '',
                cabinClass: details.route?.class ?? '',
            });
        case CONST_1.default.TRAVEL.UPDATE_OPERATION_TYPE.FLIGHT_SEAT_CONFIRMED:
            return (0, Localize_1.translateLocal)('travel.updates.flightSeatConfirmed', {
                airlineCode: details.route?.airlineCode ?? '',
            });
        case CONST_1.default.TRAVEL.UPDATE_OPERATION_TYPE.FLIGHT_SEAT_CHANGED:
            return (0, Localize_1.translateLocal)('travel.updates.flightSeatChanged', {
                airlineCode: details.route?.airlineCode ?? '',
            });
        case CONST_1.default.TRAVEL.UPDATE_OPERATION_TYPE.FLIGHT_SEAT_CANCELLED:
            return (0, Localize_1.translateLocal)('travel.updates.flightSeatCancelled', {
                airlineCode: details.route?.airlineCode ?? '',
            });
        case CONST_1.default.TRAVEL.UPDATE_OPERATION_TYPE.PAYMENT_DECLINED:
            return (0, Localize_1.translateLocal)('travel.updates.paymentDeclined');
        case CONST_1.default.TRAVEL.UPDATE_OPERATION_TYPE.BOOKING_CANCELED_BY_TRAVELER:
            return (0, Localize_1.translateLocal)('travel.updates.bookingCancelledByTraveler', {
                type: details.type,
                id: details.reservationID,
            });
        case CONST_1.default.TRAVEL.UPDATE_OPERATION_TYPE.BOOKING_CANCELED_BY_VENDOR:
            return (0, Localize_1.translateLocal)('travel.updates.bookingCancelledByVendor', {
                type: details.type,
                id: details.reservationID,
            });
        case CONST_1.default.TRAVEL.UPDATE_OPERATION_TYPE.BOOKING_REBOOKED:
            return (0, Localize_1.translateLocal)('travel.updates.bookingRebooked', {
                type: details.type,
                id: details.confirmations?.at(0)?.value,
            });
        case CONST_1.default.TRAVEL.UPDATE_OPERATION_TYPE.BOOKING_UPDATED:
            return (0, Localize_1.translateLocal)('travel.updates.bookingUpdated', {
                type: details.type,
            });
        case CONST_1.default.TRAVEL.UPDATE_OPERATION_TYPE.TRIP_UPDATED:
            if (details.type === CONST_1.default.RESERVATION_TYPE.CAR || details.type === CONST_1.default.RESERVATION_TYPE.HOTEL) {
                return (0, Localize_1.translateLocal)('travel.updates.defaultUpdate', {
                    type: details.type,
                });
            }
            if (details.type === CONST_1.default.RESERVATION_TYPE.TRAIN) {
                return (0, Localize_1.translateLocal)('travel.updates.railTicketUpdate', {
                    origin: details.start.cityName ?? details.start.shortName ?? '',
                    destination: details.end.cityName ?? details.end.shortName ?? '',
                    startDate: formattedStartDate,
                });
            }
            return (0, Localize_1.translateLocal)('travel.updates.flightUpdated', {
                airlineCode: details.route?.airlineCode ?? '',
                origin: details.start.shortName ?? '',
                destination: details.end?.shortName ?? '',
                startDate: formattedStartDate,
            });
        case CONST_1.default.TRAVEL.UPDATE_OPERATION_TYPE.BOOKING_OTHER_UPDATE:
            if (details.type === CONST_1.default.RESERVATION_TYPE.CAR || details.type === CONST_1.default.RESERVATION_TYPE.HOTEL) {
                return (0, Localize_1.translateLocal)('travel.updates.defaultUpdate', {
                    type: details.type,
                });
            }
            if (details.type === CONST_1.default.RESERVATION_TYPE.TRAIN) {
                return (0, Localize_1.translateLocal)('travel.updates.railTicketUpdate', {
                    origin: details.start.cityName ?? details.start.shortName ?? '',
                    destination: details.end.cityName ?? details.end.shortName ?? '',
                    startDate: formattedStartDate,
                });
            }
            return (0, Localize_1.translateLocal)('travel.updates.flightUpdated', {
                airlineCode: details.route?.airlineCode ?? '',
                origin: details.start.shortName ?? '',
                destination: details.end?.shortName ?? '',
                startDate: formattedStartDate,
            });
        case CONST_1.default.TRAVEL.UPDATE_OPERATION_TYPE.REFUND:
            return (0, Localize_1.translateLocal)('travel.updates.railTicketRefund', {
                origin: details.start.cityName ?? details.start.shortName ?? '',
                destination: details.end.cityName ?? details.end.shortName ?? '',
                startDate: formattedStartDate,
            });
        case CONST_1.default.TRAVEL.UPDATE_OPERATION_TYPE.EXCHANGE:
            return (0, Localize_1.translateLocal)('travel.updates.railTicketExchange', {
                origin: details.start.cityName ?? details.start.shortName ?? '',
                destination: details.end.cityName ?? details.end.shortName ?? '',
                startDate: formattedStartDate,
            });
        default:
            return (0, Localize_1.translateLocal)('travel.updates.defaultUpdate', {
                type: details?.type ?? '',
            });
    }
}
function getMemberChangeMessageFragment(reportAction, getReportNameCallback) {
    const messageElements = getMemberChangeMessageElements(reportAction, getReportNameCallback);
    const html = messageElements
        .map((messageElement) => {
        switch (messageElement.kind) {
            case 'userMention':
                return `<mention-user accountID=${messageElement.accountID}>${messageElement.content}</mention-user>`;
            case 'roomReference':
                return `<a href="${environmentURL}/r/${messageElement.roomID}" target="_blank">${messageElement.roomName}</a>`;
            default:
                return messageElement.content;
        }
    })
        .join('');
    return {
        html: `<muted-text>${html}</muted-text>`,
        text: getReportActionMessage(reportAction) ? getReportActionText(reportAction) : '',
        type: CONST_1.default.REPORT.MESSAGE.TYPE.COMMENT,
    };
}
function getLeaveRoomMessage() {
    return (0, Localize_1.translateLocal)('report.actions.type.leftTheChat');
}
function getReopenedMessage() {
    return (0, Localize_1.translateLocal)('iou.reopened');
}
function getReceiptScanFailedMessage() {
    return (0, Localize_1.translateLocal)('iou.receiptScanningFailed');
}
function getUpdateRoomDescriptionFragment(reportAction) {
    const html = getUpdateRoomDescriptionMessage(reportAction);
    return {
        html: `<muted-text>${html}</muted-text>`,
        text: getReportActionMessage(reportAction) ? getReportActionText(reportAction) : '',
        type: CONST_1.default.REPORT.MESSAGE.TYPE.COMMENT,
    };
}
function getReportActionMessageFragments(action) {
    if (isOldDotReportAction(action)) {
        const oldDotMessage = getMessageOfOldDotReportAction(action);
        const html = isActionOfType(action, CONST_1.default.REPORT.ACTIONS.TYPE.SELECTED_FOR_RANDOM_AUDIT) ? Parser_1.default.replace(oldDotMessage) : oldDotMessage;
        return [{ text: oldDotMessage, html: `<muted-text>${html}</muted-text>`, type: 'COMMENT' }];
    }
    if (isActionOfType(action, CONST_1.default.REPORT.ACTIONS.TYPE.ROOM_CHANGE_LOG.UPDATE_ROOM_DESCRIPTION)) {
        const message = getUpdateRoomDescriptionMessage(action);
        return [{ text: message, html: `<muted-text>${message}</muted-text>`, type: 'COMMENT' }];
    }
    if (isActionOfType(action, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_DESCRIPTION)) {
        const message = getWorkspaceDescriptionUpdatedMessage(action);
        return [{ text: message, html: `<muted-text>${message}</muted-text>`, type: 'COMMENT' }];
    }
    if (isActionOfType(action, CONST_1.default.REPORT.ACTIONS.TYPE.REIMBURSED)) {
        const message = getReportActionMessageText(action);
        return [{ text: message, html: `<muted-text>${message}</muted-text>`, type: 'COMMENT' }];
    }
    if (isActionOfType(action, CONST_1.default.REPORT.ACTIONS.TYPE.RETRACTED)) {
        const message = getRetractedMessage();
        return [{ text: message, html: `<muted-text>${message}</muted-text>`, type: 'COMMENT' }];
    }
    if (isActionOfType(action, CONST_1.default.REPORT.ACTIONS.TYPE.REOPENED)) {
        const message = getReopenedMessage();
        return [{ text: message, html: `<muted-text>${message}</muted-text>`, type: 'COMMENT' }];
    }
    if (isActionOfType(action, CONST_1.default.REPORT.ACTIONS.TYPE.TRAVEL_UPDATE)) {
        const message = getTravelUpdateMessage(action);
        return [{ text: message, html: `<muted-text>${message}</muted-text>`, type: 'COMMENT' }];
    }
    if (isConciergeCategoryOptions(action)) {
        const message = getReportActionMessageText(action);
        return [{ text: message, html: message, type: 'COMMENT' }];
    }
    const actionMessage = action.previousMessage ?? action.message;
    if (Array.isArray(actionMessage)) {
        return actionMessage.filter((item) => !!item);
    }
    return actionMessage ? [actionMessage] : [];
}
/**
 * Helper method to determine if the provided accountID has submitted an expense on the specified report.
 *
 * @param reportID
 * @param currentAccountID
 * @returns
 */
function hasRequestFromCurrentAccount(reportID, currentAccountID) {
    if (!reportID) {
        return false;
    }
    const reportActions = Object.values(getAllReportActions(reportID));
    if (reportActions.length === 0) {
        return false;
    }
    return reportActions.some((action) => action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.IOU && action.actorAccountID === currentAccountID && !isDeletedAction(action));
}
/**
 * Constructs a message for an actionable mention whisper report action.
 * @param reportAction
 * @returns the actionable mention whisper message.
 */
function getActionableMentionWhisperMessage(reportAction) {
    if (!reportAction) {
        return '';
    }
    const originalMessage = getOriginalMessage(reportAction);
    const targetAccountIDs = originalMessage?.inviteeAccountIDs ?? [];
    const personalDetails = (0, PersonalDetailsUtils_1.getPersonalDetailsByIDs)({ accountIDs: targetAccountIDs, currentUserAccountID: 0 });
    const mentionElements = targetAccountIDs.map((accountID) => {
        const personalDetail = personalDetails.find((personal) => personal.accountID === accountID);
        const displayName = (0, PersonalDetailsUtils_1.getEffectiveDisplayName)(LocalePhoneNumber_1.formatPhoneNumber, personalDetail);
        const handleText = (0, isEmpty_1.default)(displayName) ? (0, Localize_1.translateLocal)('common.hidden') : displayName;
        return `<mention-user accountID=${accountID}>@${handleText}</mention-user>`;
    });
    const preMentionsText = 'Heads up, ';
    const mentions = mentionElements.join(', ').replace(/, ([^,]*)$/, ' and $1');
    const postMentionsText = ` ${mentionElements.length > 1 ? "aren't members" : "isn't a member"} of this room.`;
    return `${preMentionsText}${mentions}${postMentionsText}`;
}
/**
 * Note: Prefer `ReportActionsUtils.isCurrentActionUnread` over this method, if applicable.
 * Check whether a specific report action is unread.
 */
function isReportActionUnread(reportAction, lastReadTime) {
    if (!lastReadTime) {
        return !isCreatedAction(reportAction);
    }
    return !!(reportAction && lastReadTime && reportAction.created && lastReadTime < reportAction.created);
}
/**
 * Check whether the current report action of the report is unread or not
 *
 */
function isCurrentActionUnread(report, reportAction, visibleReportActions) {
    const lastReadTime = report?.lastReadTime ?? '';
    const sortedReportActions = visibleReportActions ?? getSortedReportActions(Object.values(getAllReportActions(report?.reportID)));
    const currentActionIndex = sortedReportActions.findIndex((action) => action.reportActionID === reportAction.reportActionID);
    if (currentActionIndex === -1) {
        return false;
    }
    const prevReportAction = sortedReportActions.at(currentActionIndex - 1);
    return isReportActionUnread(reportAction, lastReadTime) && (currentActionIndex === 0 || !prevReportAction || !isReportActionUnread(prevReportAction, lastReadTime));
}
/**
 * Checks if a given report action corresponds to a join request action.
 * @param reportAction
 */
function isActionableJoinRequest(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.ACTIONABLE_JOIN_REQUEST);
}
function isActionableJoinRequestPendingReportAction(reportAction) {
    return isActionableJoinRequest(reportAction) && getOriginalMessage(reportAction)?.choice === '';
}
function isConciergeCategoryOptions(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.CONCIERGE_CATEGORY_OPTIONS);
}
function getActionableJoinRequestPendingReportAction(reportID) {
    const findPendingRequest = Object.values(getAllReportActions(reportID)).find((reportActionItem) => isActionableJoinRequestPendingReportAction(reportActionItem));
    return findPendingRequest;
}
/**
 * Checks if any report actions correspond to a join request action that is still pending.
 * @param reportID
 */
function isActionableJoinRequestPending(reportID) {
    return !!getActionableJoinRequestPendingReportAction(reportID);
}
function isApprovedOrSubmittedReportAction(action) {
    return [CONST_1.default.REPORT.ACTIONS.TYPE.APPROVED, CONST_1.default.REPORT.ACTIONS.TYPE.SUBMITTED].some((type) => type === action?.actionName);
}
/**
 * Gets the text version of the message in a report action
 */
function getReportActionMessageText(reportAction) {
    if (!Array.isArray(reportAction?.message)) {
        return getReportActionText(reportAction);
    }
    // Sometime html can be an empty string
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return reportAction?.message?.reduce((acc, curr) => `${acc}${getTextFromHtml(curr?.html || curr?.text)}`, '') ?? '';
}
function getDismissedViolationMessageText(originalMessage) {
    const reason = originalMessage?.reason;
    const violationName = originalMessage?.violationName;
    return (0, Localize_1.translateLocal)(`violationDismissal.${violationName}.${reason}`);
}
/**
 * Check if the linked transaction is on hold
 */
function isLinkedTransactionHeld(reportActionID, reportID) {
    const linkedTransactionID = getLinkedTransactionID(reportActionID, reportID);
    return linkedTransactionID ? (0, TransactionUtils_1.isOnHoldByTransactionID)(linkedTransactionID) : false;
}
function getMentionedAccountIDsFromAction(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT) ? (getOriginalMessage(reportAction)?.mentionedAccountIDs ?? []) : [];
}
function getMentionedEmailsFromMessage(message) {
    const mentionEmailRegex = /<mention-user>(.*?)<\/mention-user>/g;
    const matches = [...message.matchAll(mentionEmailRegex)];
    return matches.map((match) => expensify_common_1.Str.removeSMSDomain(match[1].substring(1)));
}
function didMessageMentionCurrentUser(reportAction) {
    const accountIDsFromMessage = getMentionedAccountIDsFromAction(reportAction);
    const message = getReportActionMessage(reportAction)?.html ?? '';
    const emailsFromMessage = getMentionedEmailsFromMessage(message);
    return accountIDsFromMessage.includes(currentUserAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID) || emailsFromMessage.includes(currentEmail) || message.includes('<mention-here>');
}
/**
 * Check if the current user is the requestor of the action
 */
function wasActionTakenByCurrentUser(reportAction) {
    return currentUserAccountID === reportAction?.actorAccountID;
}
/**
 * Get IOU action for a reportID and transactionID
 */
function getIOUActionForReportID(reportID, transactionID) {
    if (!reportID || !transactionID) {
        return undefined;
    }
    const reportActions = getAllReportActions(reportID);
    return getIOUActionForTransactionID(Object.values(reportActions ?? {}), transactionID);
}
/**
 * Get the IOU action for a transactionID from given reportActions
 */
function getIOUActionForTransactionID(reportActions, transactionID) {
    return reportActions.find((reportAction) => {
        const IOUTransactionID = isMoneyRequestAction(reportAction) ? getOriginalMessage(reportAction)?.IOUTransactionID : undefined;
        return IOUTransactionID === transactionID;
    });
}
/**
 * Get the track expense actionable whisper of the corresponding track expense
 */
function getTrackExpenseActionableWhisper(transactionID, chatReportID) {
    if (!transactionID || !chatReportID) {
        return undefined;
    }
    const chatReportActions = allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReportID}`] ?? {};
    return Object.values(chatReportActions).find((action) => isActionableTrackExpense(action) && getOriginalMessage(action)?.transactionID === transactionID);
}
/**
 * Checks if a given report action corresponds to a add payment card action.
 * @param reportAction
 */
function isActionableAddPaymentCard(reportAction) {
    return reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.ACTIONABLE_ADD_PAYMENT_CARD;
}
function getExportIntegrationLastMessageText(reportAction) {
    const fragments = getExportIntegrationActionFragments(reportAction);
    return fragments.reduce((acc, fragment) => `${acc} ${fragment.text}`, '');
}
function getExportIntegrationMessageHTML(reportAction) {
    const fragments = getExportIntegrationActionFragments(reportAction);
    const htmlFragments = fragments.map((fragment) => (fragment.url ? `<a href="${fragment.url}">${fragment.text}</a>` : fragment.text));
    return htmlFragments.join(' ');
}
function getExportIntegrationActionFragments(reportAction) {
    if (reportAction?.actionName !== CONST_1.default.REPORT.ACTIONS.TYPE.EXPORTED_TO_INTEGRATION) {
        throw Error(`received wrong action type. actionName: ${reportAction?.actionName}`);
    }
    const isPending = reportAction?.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD;
    const originalMessage = (getOriginalMessage(reportAction) ?? {});
    const { label, markedManually, automaticAction } = originalMessage;
    const reimbursableUrls = originalMessage.reimbursableUrls ?? [];
    const nonReimbursableUrls = originalMessage.nonReimbursableUrls ?? [];
    const reportID = reportAction?.reportID;
    const wasExportedAfterBase62 = (reportAction?.created ?? '') > '2022-11-14';
    const base62ReportID = (0, getBase62ReportID_1.default)(Number(reportID));
    const result = [];
    if (isPending) {
        result.push({
            text: (0, Localize_1.translateLocal)('report.actions.type.exportedToIntegration.pending', { label }),
            url: '',
        });
    }
    else if (markedManually) {
        result.push({
            text: (0, Localize_1.translateLocal)('report.actions.type.exportedToIntegration.manual', { label }),
            url: '',
        });
    }
    else if (automaticAction) {
        result.push({
            text: (0, Localize_1.translateLocal)('report.actions.type.exportedToIntegration.automaticActionOne', { label }),
            url: '',
        });
        const url = CONST_1.default.HELP_DOC_LINKS[label];
        result.push({
            text: (0, Localize_1.translateLocal)('report.actions.type.exportedToIntegration.automaticActionTwo'),
            url: url || '',
        });
    }
    else {
        result.push({
            text: (0, Localize_1.translateLocal)('report.actions.type.exportedToIntegration.automatic', { label }),
            url: '',
        });
    }
    if (reimbursableUrls.length || nonReimbursableUrls.length) {
        result.push({
            text: (0, Localize_1.translateLocal)('report.actions.type.exportedToIntegration.automaticActionThree'),
            url: '',
        });
    }
    if (reimbursableUrls.length === 1) {
        const shouldAddPeriod = nonReimbursableUrls.length === 0;
        result.push({
            text: (0, Localize_1.translateLocal)('report.actions.type.exportedToIntegration.reimburseableLink') + (shouldAddPeriod ? '.' : ''),
            url: reimbursableUrls.at(0) ?? '',
        });
    }
    if (reimbursableUrls.length === 1 && nonReimbursableUrls.length) {
        result.push({
            text: (0, Localize_1.translateLocal)('common.and'),
            url: '',
        });
    }
    if (nonReimbursableUrls.length) {
        const text = (0, Localize_1.translateLocal)('report.actions.type.exportedToIntegration.nonReimbursableLink');
        let url = '';
        if (nonReimbursableUrls.length === 1) {
            url = nonReimbursableUrls.at(0) ?? '';
        }
        else {
            switch (label) {
                case CONST_1.default.POLICY.CONNECTIONS.NAME_USER_FRIENDLY.xero:
                    url = XERO_NON_REIMBURSABLE_EXPENSES_URL;
                    break;
                case CONST_1.default.POLICY.CONNECTIONS.NAME_USER_FRIENDLY.netsuite:
                    url = NETSUITE_NON_REIMBURSABLE_EXPENSES_URL_PREFIX;
                    url += wasExportedAfterBase62 ? base62ReportID : reportID;
                    break;
                case CONST_1.default.POLICY.CONNECTIONS.NAME_USER_FRIENDLY.financialForce:
                    // The first three characters in a Salesforce ID is the expense type
                    url = nonReimbursableUrls.at(0)?.substring(0, SALESFORCE_EXPENSES_URL_PREFIX.length + 3) ?? '';
                    break;
                default:
                    url = QBO_EXPENSES_URL;
            }
        }
        result.push({ text, url });
    }
    return result;
}
function getUpdateRoomDescriptionMessage(reportAction) {
    const originalMessage = getOriginalMessage(reportAction);
    if (originalMessage?.description) {
        return `${(0, Localize_1.translateLocal)('roomChangeLog.updateRoomDescription')} ${originalMessage?.description}`;
    }
    return (0, Localize_1.translateLocal)('roomChangeLog.clearRoomDescription');
}
function getRetractedMessage() {
    return (0, Localize_1.translateLocal)('iou.retracted');
}
function isPolicyChangeLogAddEmployeeMessage(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.ADD_EMPLOYEE);
}
function getPolicyChangeLogAddEmployeeMessage(reportAction) {
    if (!isPolicyChangeLogAddEmployeeMessage(reportAction)) {
        return '';
    }
    const originalMessage = getOriginalMessage(reportAction);
    const email = originalMessage?.email ?? '';
    const role = (0, Localize_1.translateLocal)('workspace.common.roleName', { role: originalMessage?.role ?? '' }).toLowerCase();
    const formattedEmail = (0, LocalePhoneNumber_1.formatPhoneNumber)(email);
    return (0, Localize_1.translateLocal)('report.actions.type.addEmployee', { email: formattedEmail, role });
}
function isPolicyChangeLogChangeRoleMessage(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_EMPLOYEE);
}
function getPolicyChangeLogUpdateEmployee(reportAction) {
    if (!isPolicyChangeLogChangeRoleMessage(reportAction)) {
        return '';
    }
    const originalMessage = getOriginalMessage(reportAction);
    const email = originalMessage?.email ?? '';
    const field = originalMessage?.field;
    const customFieldType = Object.values(CONST_1.default.CUSTOM_FIELD_KEYS).find((value) => value === field);
    if (customFieldType) {
        const translationKey = field === CONST_1.default.CUSTOM_FIELD_KEYS.customField1 ? 'report.actions.type.updatedCustomField1' : 'report.actions.type.updatedCustomField2';
        return (0, Localize_1.translateLocal)(translationKey, {
            email,
            newValue: typeof originalMessage?.newValue === 'string' ? originalMessage?.newValue : '',
            previousValue: typeof originalMessage?.oldValue === 'string' ? originalMessage?.oldValue : '',
        });
    }
    const newRole = (0, Localize_1.translateLocal)('workspace.common.roleName', { role: typeof originalMessage?.newValue === 'string' ? originalMessage?.newValue : '' }).toLowerCase();
    const oldRole = (0, Localize_1.translateLocal)('workspace.common.roleName', { role: typeof originalMessage?.oldValue === 'string' ? originalMessage?.oldValue : '' }).toLowerCase();
    return (0, Localize_1.translateLocal)('report.actions.type.updateRole', { email, newRole, currentRole: oldRole });
}
function getPolicyChangeLogEmployeeLeftMessage(reportAction, useName = false) {
    if (!isLeavePolicyAction(reportAction)) {
        return '';
    }
    const originalMessage = getOriginalMessage(reportAction);
    const personalDetails = (0, PersonalDetailsUtils_1.getPersonalDetailsByIDs)({ accountIDs: reportAction.actorAccountID ? [reportAction.actorAccountID] : [], currentUserAccountID: 0 })?.at(0);
    if (!!originalMessage && !originalMessage.email) {
        originalMessage.email = personalDetails?.login;
    }
    const nameOrEmail = useName && !!personalDetails?.firstName ? `${personalDetails?.firstName}:` : (originalMessage?.email ?? '');
    const formattedNameOrEmail = (0, LocalePhoneNumber_1.formatPhoneNumber)(nameOrEmail);
    return (0, Localize_1.translateLocal)('report.actions.type.leftWorkspace', { nameOrEmail: formattedNameOrEmail });
}
function isPolicyChangeLogDeleteMemberMessage(reportAction) {
    return isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_EMPLOYEE);
}
function getWorkspaceDescriptionUpdatedMessage(action) {
    const { oldDescription, newDescription } = getOriginalMessage(action) ?? {};
    const message = typeof oldDescription === 'string' && newDescription ? (0, Localize_1.translateLocal)('workspaceActions.updateWorkspaceDescription', { newDescription, oldDescription }) : getReportActionText(action);
    return message;
}
function getWorkspaceCurrencyUpdateMessage(action) {
    const { oldCurrency, newCurrency } = getOriginalMessage(action) ?? {};
    const message = oldCurrency && newCurrency ? (0, Localize_1.translateLocal)('workspaceActions.updatedWorkspaceCurrencyAction', { oldCurrency, newCurrency }) : getReportActionText(action);
    return message;
}
const getAutoReportingFrequencyDisplayNames = () => ({
    [CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.MONTHLY]: (0, Localize_1.translateLocal)('workflowsPage.frequencies.monthly'),
    [CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.IMMEDIATE]: (0, Localize_1.translateLocal)('workflowsPage.frequencies.daily'),
    [CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.WEEKLY]: (0, Localize_1.translateLocal)('workflowsPage.frequencies.weekly'),
    [CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.SEMI_MONTHLY]: (0, Localize_1.translateLocal)('workflowsPage.frequencies.twiceAMonth'),
    [CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.TRIP]: (0, Localize_1.translateLocal)('workflowsPage.frequencies.byTrip'),
    [CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.MANUAL]: (0, Localize_1.translateLocal)('workflowsPage.frequencies.manually'),
    [CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.INSTANT]: (0, Localize_1.translateLocal)('workflowsPage.frequencies.instant'),
});
function getWorkspaceFrequencyUpdateMessage(action) {
    const { oldFrequency, newFrequency } = getOriginalMessage(action) ?? {};
    if (!oldFrequency || !newFrequency) {
        return getReportActionText(action);
    }
    const frequencyDisplayNames = getAutoReportingFrequencyDisplayNames();
    const oldFrequencyTranslation = frequencyDisplayNames[oldFrequency]?.toLowerCase();
    const newFrequencyTranslation = frequencyDisplayNames[newFrequency]?.toLowerCase();
    if (!oldFrequencyTranslation || !newFrequencyTranslation) {
        return getReportActionText(action);
    }
    return (0, Localize_1.translateLocal)('workspaceActions.updatedWorkspaceFrequencyAction', {
        oldFrequency: oldFrequencyTranslation,
        newFrequency: newFrequencyTranslation,
    });
}
function getWorkspaceCategoryUpdateMessage(action, policy) {
    const { categoryName, oldValue, newName, oldName, updatedField, newValue, currency } = getOriginalMessage(action) ?? {};
    if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.ADD_CATEGORY && categoryName) {
        return (0, Localize_1.translateLocal)('workspaceActions.addCategory', {
            categoryName,
        });
    }
    if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_CATEGORY && categoryName) {
        return (0, Localize_1.translateLocal)('workspaceActions.deleteCategory', {
            categoryName,
        });
    }
    if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_CATEGORY && categoryName) {
        if (updatedField === 'commentHint') {
            return (0, Localize_1.translateLocal)('workspaceActions.updatedDescriptionHint', {
                oldValue: oldValue,
                newValue: newValue,
                categoryName,
            });
        }
        if (updatedField === 'enabled') {
            return (0, Localize_1.translateLocal)('workspaceActions.updateCategory', {
                oldValue: !!oldValue,
                categoryName,
            });
        }
        if (updatedField === 'areCommentsRequired' && typeof oldValue === 'boolean') {
            return (0, Localize_1.translateLocal)('workspaceActions.updateAreCommentsRequired', {
                oldValue,
                categoryName,
            });
        }
        if (updatedField === 'Payroll Code' && typeof oldValue === 'string' && typeof newValue === 'string') {
            return (0, Localize_1.translateLocal)('workspaceActions.updateCategoryPayrollCode', {
                oldValue,
                categoryName,
                newValue,
            });
        }
        if (updatedField === 'GL Code' && typeof oldValue === 'string' && typeof newValue === 'string') {
            return (0, Localize_1.translateLocal)('workspaceActions.updateCategoryGLCode', {
                oldValue,
                categoryName,
                newValue,
            });
        }
        if (updatedField === 'maxExpenseAmount' && (typeof oldValue === 'string' || typeof oldValue === 'number')) {
            return (0, Localize_1.translateLocal)('workspaceActions.updateCategoryMaxExpenseAmount', {
                oldAmount: Number(oldValue) ? (0, CurrencyUtils_1.convertAmountToDisplayString)(Number(oldValue), currency) : undefined,
                newAmount: Number(newValue ?? 0) ? (0, CurrencyUtils_1.convertAmountToDisplayString)(Number(newValue), currency) : undefined,
                categoryName,
            });
        }
        if (updatedField === 'expenseLimitType' && typeof newValue === 'string' && typeof oldValue === 'string') {
            return (0, Localize_1.translateLocal)('workspaceActions.updateCategoryExpenseLimitType', {
                categoryName,
                oldValue: oldValue ? (0, Localize_1.translateLocal)(`workspace.rules.categoryRules.expenseLimitTypes.${oldValue}`) : undefined,
                newValue: (0, Localize_1.translateLocal)(`workspace.rules.categoryRules.expenseLimitTypes.${newValue}`),
            });
        }
        if (updatedField === 'maxAmountNoReceipt' && typeof oldValue !== 'boolean' && typeof newValue !== 'boolean') {
            const maxExpenseAmountToDisplay = policy?.maxExpenseAmountNoReceipt === CONST_1.default.DISABLED_MAX_EXPENSE_VALUE ? 0 : policy?.maxExpenseAmountNoReceipt;
            const formatAmount = () => (0, CurrencyUtils_1.convertToShortDisplayString)(maxExpenseAmountToDisplay, policy?.outputCurrency ?? CONST_1.default.CURRENCY.USD);
            const getTranslation = (value) => {
                if (value === CONST_1.default.DISABLED_MAX_EXPENSE_VALUE) {
                    return (0, Localize_1.translateLocal)('workspace.rules.categoryRules.requireReceiptsOverList.never');
                }
                if (value === 0) {
                    return (0, Localize_1.translateLocal)('workspace.rules.categoryRules.requireReceiptsOverList.always');
                }
                return (0, Localize_1.translateLocal)('workspace.rules.categoryRules.requireReceiptsOverList.default', { defaultAmount: formatAmount() });
            };
            return (0, Localize_1.translateLocal)('workspaceActions.updateCategoryMaxAmountNoReceipt', {
                categoryName,
                oldValue: getTranslation(oldValue),
                newValue: getTranslation(newValue),
            });
        }
    }
    if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.SET_CATEGORY_NAME && oldName && newName) {
        return (0, Localize_1.translateLocal)('workspaceActions.setCategoryName', {
            oldName,
            newName,
        });
    }
    return getReportActionText(action);
}
function getWorkspaceTagUpdateMessage(action) {
    const { tagListName, tagName, enabled, newName, newValue, oldName, oldValue, updatedField, count } = getOriginalMessage(action) ?? {};
    if (action?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.ADD_TAG && tagListName && tagName) {
        return (0, Localize_1.translateLocal)('workspaceActions.addTag', {
            tagListName,
            tagName,
        });
    }
    if (action?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_TAG && tagListName && tagName) {
        return (0, Localize_1.translateLocal)('workspaceActions.deleteTag', {
            tagListName,
            tagName,
        });
    }
    if (action?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_MULTIPLE_TAGS && count && tagListName) {
        return (0, Localize_1.translateLocal)('workspaceActions.deleteMultipleTags', {
            count,
            tagListName,
        });
    }
    if (action?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_TAG_ENABLED && tagListName && tagName) {
        return (0, Localize_1.translateLocal)('workspaceActions.updateTagEnabled', {
            tagListName,
            tagName,
            enabled,
        });
    }
    if (action?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_TAG_NAME && tagListName && newName && oldName) {
        return (0, Localize_1.translateLocal)('workspaceActions.updateTagName', {
            tagListName,
            newName,
            oldName,
        });
    }
    if (action?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_TAG &&
        tagListName &&
        (typeof oldValue === 'string' || typeof oldValue === 'undefined') &&
        typeof newValue === 'string' &&
        tagName &&
        updatedField) {
        return (0, Localize_1.translateLocal)('workspaceActions.updateTag', {
            tagListName,
            oldValue,
            newValue,
            tagName,
            updatedField,
        });
    }
    return getReportActionText(action);
}
function getTagListNameUpdatedMessage(action) {
    const { oldName, newName } = getOriginalMessage(action) ?? {};
    if (newName && oldName) {
        return (0, Localize_1.translateLocal)('workspaceActions.updateTagListName', {
            oldName,
            newName,
        });
    }
    return getReportActionText(action);
}
function getWorkspaceCustomUnitUpdatedMessage(action) {
    const { oldValue, newValue, customUnitName, updatedField } = getOriginalMessage(action) ?? {};
    if (customUnitName === 'Distance' && updatedField === 'taxEnabled' && typeof newValue === 'boolean') {
        return (0, Localize_1.translateLocal)('workspaceActions.updateCustomUnitTaxEnabled', {
            newValue,
        });
    }
    if (customUnitName && typeof oldValue === 'string' && typeof newValue === 'string' && updatedField) {
        return (0, Localize_1.translateLocal)('workspaceActions.updateCustomUnit', {
            customUnitName,
            newValue,
            oldValue,
            updatedField,
        });
    }
    return getReportActionText(action);
}
function getWorkspaceCustomUnitRateAddedMessage(action) {
    const { customUnitName, rateName } = getOriginalMessage(action) ?? {};
    if (customUnitName && rateName) {
        return (0, Localize_1.translateLocal)('workspaceActions.addCustomUnitRate', {
            customUnitName,
            rateName,
        });
    }
    return getReportActionText(action);
}
function getWorkspaceCustomUnitRateUpdatedMessage(action) {
    const { customUnitName, customUnitRateName, updatedField, oldValue, newValue, newTaxPercentage, oldTaxPercentage } = getOriginalMessage(action) ?? {};
    if (customUnitName && customUnitRateName && updatedField === 'rate' && typeof oldValue === 'string' && typeof newValue === 'string') {
        return (0, Localize_1.translateLocal)('workspaceActions.updatedCustomUnitRate', {
            customUnitName,
            customUnitRateName,
            updatedField,
            oldValue,
            newValue,
        });
    }
    if (customUnitRateName && updatedField === 'taxRateExternalID' && typeof newValue === 'string' && newTaxPercentage) {
        return (0, Localize_1.translateLocal)('workspaceActions.updatedCustomUnitTaxRateExternalID', {
            customUnitRateName,
            newValue,
            newTaxPercentage,
            oldTaxPercentage,
            oldValue: oldValue,
        });
    }
    if (customUnitRateName && updatedField === 'taxClaimablePercentage' && typeof newValue === 'number' && customUnitRateName) {
        return (0, Localize_1.translateLocal)('workspaceActions.updatedCustomUnitTaxClaimablePercentage', {
            customUnitRateName,
            newValue: parseFloat(parseFloat(newValue ?? 0).toFixed(2)),
            oldValue: typeof oldValue === 'number' ? parseFloat(parseFloat(oldValue ?? 0).toFixed(2)) : undefined,
        });
    }
    return getReportActionText(action);
}
function getWorkspaceCustomUnitRateDeletedMessage(action) {
    const { customUnitName, rateName } = getOriginalMessage(action) ?? {};
    if (customUnitName && rateName) {
        return (0, Localize_1.translateLocal)('workspaceActions.deleteCustomUnitRate', {
            customUnitName,
            rateName,
        });
    }
    return getReportActionText(action);
}
function getWorkspaceReportFieldAddMessage(action) {
    const { fieldName, fieldType } = getOriginalMessage(action) ?? {};
    if (fieldName && fieldType) {
        return (0, Localize_1.translateLocal)('workspaceActions.addedReportField', {
            fieldName,
            fieldType: (0, Localize_1.translateLocal)((0, WorkspaceReportFieldUtils_1.getReportFieldTypeTranslationKey)(fieldType)).toLowerCase(),
        });
    }
    return getReportActionText(action);
}
function getWorkspaceReportFieldUpdateMessage(action) {
    const { updateType, fieldName, defaultValue, optionName, allEnabled, optionEnabled, toggledOptionsCount } = getOriginalMessage(action) ?? {};
    if (updateType === 'updatedDefaultValue' && fieldName && defaultValue) {
        return (0, Localize_1.translateLocal)('workspaceActions.updateReportFieldDefaultValue', {
            fieldName,
            defaultValue,
        });
    }
    if (updateType === 'addedOption' && fieldName && optionName) {
        return (0, Localize_1.translateLocal)('workspaceActions.addedReportFieldOption', {
            fieldName,
            optionName,
        });
    }
    if (updateType === 'changedOptionDisabled' && fieldName && optionName) {
        return (0, Localize_1.translateLocal)('workspaceActions.updateReportFieldOptionDisabled', {
            fieldName,
            optionName,
            optionEnabled: !!optionEnabled,
        });
    }
    if (updateType === 'updatedAllDisabled' && fieldName && optionName) {
        return (0, Localize_1.translateLocal)('workspaceActions.updateReportFieldAllOptionsDisabled', {
            fieldName,
            optionName,
            allEnabled: !!allEnabled,
            toggledOptionsCount,
        });
    }
    if (updateType === 'removedOption' && fieldName && optionName) {
        return (0, Localize_1.translateLocal)('workspaceActions.removedReportFieldOption', {
            fieldName,
            optionName,
        });
    }
    return getReportActionText(action);
}
function getWorkspaceReportFieldDeleteMessage(action) {
    const { fieldType, fieldName } = getOriginalMessage(action) ?? {};
    if (fieldType && fieldName) {
        return (0, Localize_1.translateLocal)('workspaceActions.deleteReportField', {
            fieldName,
            fieldType: (0, Localize_1.translateLocal)((0, WorkspaceReportFieldUtils_1.getReportFieldTypeTranslationKey)(fieldType)).toLowerCase(),
        });
    }
    return getReportActionText(action);
}
function getWorkspaceUpdateFieldMessage(action) {
    const { newValue, oldValue, updatedField } = getOriginalMessage(action) ?? {};
    const newValueTranslationKey = CONST_1.default.POLICY.APPROVAL_MODE_TRANSLATION_KEYS[newValue];
    const oldValueTranslationKey = CONST_1.default.POLICY.APPROVAL_MODE_TRANSLATION_KEYS[oldValue];
    if (updatedField && updatedField === CONST_1.default.POLICY.COLLECTION_KEYS.APPROVAL_MODE && oldValueTranslationKey && newValueTranslationKey) {
        return (0, Localize_1.translateLocal)('workspaceActions.updateApprovalMode', {
            newValue: (0, Localize_1.translateLocal)(`workspaceApprovalModes.${newValueTranslationKey}`),
            oldValue: (0, Localize_1.translateLocal)(`workspaceApprovalModes.${oldValueTranslationKey}`),
            fieldName: updatedField,
        });
    }
    if (updatedField && updatedField === CONST_1.default.POLICY.EXPENSE_REPORT_RULES.PREVENT_SELF_APPROVAL && typeof oldValue === 'string' && typeof newValue === 'string') {
        return (0, Localize_1.translateLocal)('workspaceActions.preventSelfApproval', {
            oldValue,
            newValue,
        });
    }
    if (updatedField && updatedField === CONST_1.default.POLICY.EXPENSE_REPORT_RULES.MAX_EXPENSE_AGE && typeof oldValue === 'string' && typeof newValue === 'string') {
        return (0, Localize_1.translateLocal)('workspaceActions.updateMaxExpenseAge', {
            oldValue,
            newValue,
        });
    }
    if (updatedField &&
        updatedField === CONST_1.default.POLICY.COLLECTION_KEYS.AUTOREPORTING_OFFSET &&
        (typeof oldValue === 'string' || typeof oldValue === 'number') &&
        (typeof newValue === 'string' || typeof newValue === 'number')) {
        const getAutoReportingOffsetToDisplay = (autoReportingOffset) => {
            if (autoReportingOffset === CONST_1.default.POLICY.AUTO_REPORTING_OFFSET.LAST_DAY_OF_MONTH) {
                return (0, Localize_1.translateLocal)('workflowsPage.frequencies.lastDayOfMonth');
            }
            if (autoReportingOffset === CONST_1.default.POLICY.AUTO_REPORTING_OFFSET.LAST_BUSINESS_DAY_OF_MONTH) {
                return (0, Localize_1.translateLocal)('workflowsPage.frequencies.lastBusinessDayOfMonth');
            }
            if (typeof autoReportingOffset === 'number') {
                return (0, LocaleDigitUtils_1.toLocaleOrdinal)(IntlStore_1.default.getCurrentLocale(), autoReportingOffset, false);
            }
            return '';
        };
        return (0, Localize_1.translateLocal)('workspaceActions.updateMonthlyOffset', {
            newValue: getAutoReportingOffsetToDisplay(newValue),
            oldValue: getAutoReportingOffsetToDisplay(oldValue),
        });
    }
    return getReportActionText(action);
}
function getPolicyChangeLogMaxExpenseAmountNoReceiptMessage(action) {
    const { oldMaxExpenseAmountNoReceipt, newMaxExpenseAmountNoReceipt, currency } = getOriginalMessage(action) ?? {};
    if (typeof oldMaxExpenseAmountNoReceipt === 'number' && typeof newMaxExpenseAmountNoReceipt === 'number') {
        return (0, Localize_1.translateLocal)('workspaceActions.updateMaxExpenseAmountNoReceipt', {
            oldValue: (0, CurrencyUtils_1.convertToDisplayString)(oldMaxExpenseAmountNoReceipt, currency),
            newValue: (0, CurrencyUtils_1.convertToDisplayString)(newMaxExpenseAmountNoReceipt, currency),
        });
    }
    return getReportActionText(action);
}
function getPolicyChangeLogMaxExpenseAmountMessage(action) {
    const { oldMaxExpenseAmount, newMaxExpenseAmount, currency } = getOriginalMessage(action) ?? {};
    if (typeof oldMaxExpenseAmount === 'number' && typeof newMaxExpenseAmount === 'number') {
        return (0, Localize_1.translateLocal)('workspaceActions.updateMaxExpenseAmount', {
            oldValue: (0, CurrencyUtils_1.convertToDisplayString)(oldMaxExpenseAmount, currency),
            newValue: (0, CurrencyUtils_1.convertToDisplayString)(newMaxExpenseAmount, currency),
        });
    }
    return getReportActionText(action);
}
function getPolicyChangeLogDefaultBillableMessage(action) {
    const { oldDefaultBillable, newDefaultBillable } = getOriginalMessage(action) ?? {};
    if (typeof oldDefaultBillable === 'string' && typeof newDefaultBillable === 'string') {
        return (0, Localize_1.translateLocal)('workspaceActions.updateDefaultBillable', {
            oldValue: oldDefaultBillable,
            newValue: newDefaultBillable,
        });
    }
    return getReportActionText(action);
}
function getPolicyChangeLogDefaultReimbursableMessage(action) {
    const { oldDefaultReimbursable, newDefaultReimbursable } = getOriginalMessage(action) ?? {};
    if (typeof oldDefaultReimbursable === 'string' && typeof newDefaultReimbursable === 'string') {
        return (0, Localize_1.translateLocal)('workspaceActions.updateDefaultReimbursable', {
            oldValue: oldDefaultReimbursable,
            newValue: newDefaultReimbursable,
        });
    }
    return getReportActionText(action);
}
function getPolicyChangeLogDefaultTitleEnforcedMessage(action) {
    const { value } = getOriginalMessage(action) ?? {};
    if (typeof value === 'boolean') {
        return (0, Localize_1.translateLocal)('workspaceActions.updateDefaultTitleEnforced', {
            value,
        });
    }
    return getReportActionText(action);
}
function getPolicyChangeLogDeleteMemberMessage(reportAction) {
    if (!isPolicyChangeLogDeleteMemberMessage(reportAction)) {
        return '';
    }
    const originalMessage = getOriginalMessage(reportAction);
    const email = originalMessage?.email ?? '';
    const role = (0, Localize_1.translateLocal)('workspace.common.roleName', { role: originalMessage?.role ?? '' }).toLowerCase();
    return (0, Localize_1.translateLocal)('report.actions.type.removeMember', { email, role });
}
function getAddedConnectionMessage(reportAction) {
    if (!isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.ADD_INTEGRATION)) {
        return '';
    }
    const originalMessage = getOriginalMessage(reportAction);
    const connectionName = originalMessage?.connectionName;
    return connectionName ? (0, Localize_1.translateLocal)('report.actions.type.addedConnection', { connectionName }) : '';
}
function getRemovedConnectionMessage(reportAction) {
    if (!isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_INTEGRATION)) {
        return '';
    }
    const originalMessage = getOriginalMessage(reportAction);
    const connectionName = originalMessage?.connectionName;
    return connectionName ? (0, Localize_1.translateLocal)('report.actions.type.removedConnection', { connectionName }) : '';
}
function getRenamedAction(reportAction, isExpenseReport, actorName) {
    const originalMessage = getOriginalMessage(reportAction);
    return (0, Localize_1.translateLocal)('newRoomPage.renamedRoomAction', {
        actorName,
        isExpenseReport,
        oldName: originalMessage?.oldName ?? '',
        newName: originalMessage?.newName ?? '',
    });
}
function getAddedApprovalRuleMessage(reportAction) {
    const { name, approverAccountID, approverEmail, field, approverName } = getOriginalMessage(reportAction) ?? {};
    if (name && approverAccountID && approverEmail && field && approverName) {
        return (0, Localize_1.translateLocal)('workspaceActions.addApprovalRule', {
            approverEmail,
            approverName,
            field,
            name,
        });
    }
    return getReportActionText(reportAction);
}
function getDeletedApprovalRuleMessage(reportAction) {
    const { name, approverAccountID, approverEmail, field, approverName } = getOriginalMessage(reportAction) ?? {};
    if (name && approverAccountID && approverEmail && field && approverName) {
        return (0, Localize_1.translateLocal)('workspaceActions.deleteApprovalRule', {
            approverEmail,
            approverName,
            field,
            name,
        });
    }
    return getReportActionText(reportAction);
}
function getUpdatedApprovalRuleMessage(reportAction) {
    const { field, oldApproverEmail, oldApproverName, newApproverEmail, newApproverName, name } = getOriginalMessage(reportAction) ?? {};
    if (field && oldApproverEmail && newApproverEmail && name) {
        return (0, Localize_1.translateLocal)('workspaceActions.updateApprovalRule', {
            field,
            name,
            newApproverEmail,
            newApproverName,
            oldApproverEmail,
            oldApproverName,
        });
    }
    return getReportActionText(reportAction);
}
function getRemovedFromApprovalChainMessage(reportAction) {
    const originalMessage = getOriginalMessage(reportAction);
    const submittersNames = (0, PersonalDetailsUtils_1.getPersonalDetailsByIDs)({
        accountIDs: originalMessage?.submittersAccountIDs ?? [],
        currentUserAccountID: currentUserAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID,
    }).map(({ displayName, login }) => displayName ?? login ?? 'Unknown Submitter');
    return (0, Localize_1.translateLocal)('workspaceActions.removedFromApprovalWorkflow', { submittersNames, count: submittersNames.length });
}
function getDemotedFromWorkspaceMessage(reportAction) {
    const originalMessage = getOriginalMessage(reportAction);
    const policyName = originalMessage?.policyName ?? (0, Localize_1.translateLocal)('workspace.common.workspace');
    const oldRole = (0, Localize_1.translateLocal)('workspace.common.roleName', { role: originalMessage?.oldRole }).toLowerCase();
    return (0, Localize_1.translateLocal)('workspaceActions.demotedFromWorkspace', { policyName, oldRole });
}
function getUpdatedAuditRateMessage(reportAction) {
    const { oldAuditRate, newAuditRate } = getOriginalMessage(reportAction) ?? {};
    if (typeof oldAuditRate !== 'number' || typeof newAuditRate !== 'number') {
        return getReportActionText(reportAction);
    }
    return (0, Localize_1.translateLocal)('workspaceActions.updatedAuditRate', { oldAuditRate, newAuditRate });
}
function getUpdatedManualApprovalThresholdMessage(reportAction) {
    const { oldLimit, newLimit, currency = CONST_1.default.CURRENCY.USD, } = getOriginalMessage(reportAction) ?? {};
    if (typeof oldLimit !== 'number' || typeof oldLimit !== 'number') {
        return getReportActionText(reportAction);
    }
    return (0, Localize_1.translateLocal)('workspaceActions.updatedManualApprovalThreshold', { oldLimit: (0, CurrencyUtils_1.convertToDisplayString)(oldLimit, currency), newLimit: (0, CurrencyUtils_1.convertToDisplayString)(newLimit, currency) });
}
function getChangedApproverActionMessage(reportAction) {
    const { mentionedAccountIDs } = getOriginalMessage(reportAction) ?? {};
    // If mentionedAccountIDs exists and has values, use the first one
    if (mentionedAccountIDs?.length) {
        return (0, Localize_1.translateLocal)('iou.changeApprover.changedApproverMessage', { managerID: mentionedAccountIDs.at(0) ?? CONST_1.default.DEFAULT_NUMBER_ID });
    }
    // Fallback: If mentionedAccountIDs is missing (common with OldDot take control actions),
    // use the actorAccountID (who performed the take control action) as the new approver
    const actorAccountID = reportAction?.actorAccountID;
    if (!actorAccountID) {
        return '';
    }
    return (0, Localize_1.translateLocal)('iou.changeApprover.changedApproverMessage', { managerID: actorAccountID });
}
function isCardIssuedAction(reportAction) {
    return (isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.CARD_ISSUED) ||
        isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.CARD_ISSUED_VIRTUAL) ||
        isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.CARD_MISSING_ADDRESS) ||
        isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.CARD_ASSIGNED));
}
function shouldShowAddMissingDetails(actionName, card) {
    const missingDetails = !privatePersonalDetails?.legalFirstName ||
        !privatePersonalDetails?.legalLastName ||
        !privatePersonalDetails?.dob ||
        !privatePersonalDetails?.phoneNumber ||
        (0, EmptyObject_1.isEmptyObject)(privatePersonalDetails?.addresses) ||
        privatePersonalDetails.addresses.length === 0;
    return actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CARD_MISSING_ADDRESS && (card?.state === CONST_1.default.EXPENSIFY_CARD.STATE.STATE_NOT_ISSUED || missingDetails);
}
function getJoinRequestMessage(reportAction) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = (0, PolicyUtils_1.getPolicy)(getOriginalMessage(reportAction)?.policyID);
    const userDetail = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(getOriginalMessage(reportAction)?.email ?? '');
    const userName = userDetail?.firstName ? `${userDetail.displayName} (${userDetail.login})` : (userDetail?.login ?? getOriginalMessage(reportAction)?.email);
    return (0, Localize_1.translateLocal)('workspace.inviteMessage.joinRequest', { user: userName ?? '', workspaceName: policy?.name ?? '' });
}
function getCardIssuedMessage({ reportAction, shouldRenderHTML = false, policyID = '-1', expensifyCard, companyCard, }) {
    const cardIssuedActionOriginalMessage = isCardIssuedAction(reportAction) ? getOriginalMessage(reportAction) : undefined;
    const assigneeAccountID = cardIssuedActionOriginalMessage?.assigneeAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const cardID = cardIssuedActionOriginalMessage?.cardID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const isPolicyAdmin = (0, PolicyUtils_1.isPolicyAdmin)((0, PolicyUtils_1.getPolicy)(policyID));
    const assignee = shouldRenderHTML ? `<mention-user accountID="${assigneeAccountID}"/>` : Parser_1.default.htmlToText(`<mention-user accountID="${assigneeAccountID}"/>`);
    const navigateRoute = isPolicyAdmin ? ROUTES_1.default.EXPENSIFY_CARD_DETAILS.getRoute(policyID, String(cardID)) : ROUTES_1.default.SETTINGS_DOMAIN_CARD_DETAIL.getRoute(String(cardID));
    const expensifyCardLink = shouldRenderHTML && !!expensifyCard ? `<a href='${environmentURL}/${navigateRoute}'>${(0, Localize_1.translateLocal)('cardPage.expensifyCard')}</a>` : (0, Localize_1.translateLocal)('cardPage.expensifyCard');
    const isAssigneeCurrentUser = currentUserAccountID === assigneeAccountID;
    const companyCardLink = shouldRenderHTML && isAssigneeCurrentUser && companyCard
        ? `<a href='${environmentURL}/${ROUTES_1.default.SETTINGS_WALLET}'>${(0, Localize_1.translateLocal)('workspace.companyCards.companyCard')}</a>`
        : (0, Localize_1.translateLocal)('workspace.companyCards.companyCard');
    const shouldShowAddMissingDetailsMessage = !isAssigneeCurrentUser || shouldShowAddMissingDetails(reportAction?.actionName, expensifyCard);
    switch (reportAction?.actionName) {
        case CONST_1.default.REPORT.ACTIONS.TYPE.CARD_ISSUED:
            return (0, Localize_1.translateLocal)('workspace.expensifyCard.issuedCard', { assignee });
        case CONST_1.default.REPORT.ACTIONS.TYPE.CARD_ISSUED_VIRTUAL:
            return (0, Localize_1.translateLocal)('workspace.expensifyCard.issuedCardVirtual', { assignee, link: expensifyCardLink });
        case CONST_1.default.REPORT.ACTIONS.TYPE.CARD_ASSIGNED:
            return (0, Localize_1.translateLocal)('workspace.companyCards.assignedCard', { assignee, link: companyCardLink });
        case CONST_1.default.REPORT.ACTIONS.TYPE.CARD_MISSING_ADDRESS:
            return (0, Localize_1.translateLocal)(`workspace.expensifyCard.${shouldShowAddMissingDetailsMessage ? 'issuedCardNoShippingDetails' : 'addedShippingDetails'}`, { assignee });
        default:
            return '';
    }
}
function getRoomChangeLogMessage(reportAction) {
    if (!isInviteOrRemovedAction(reportAction)) {
        return '';
    }
    const originalMessage = getOriginalMessage(reportAction);
    const targetAccountIDs = originalMessage?.targetAccountIDs ?? [];
    const actionText = isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.ROOM_CHANGE_LOG.INVITE_TO_ROOM) || isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.INVITE_TO_ROOM)
        ? (0, Localize_1.translateLocal)('workspace.invite.invited')
        : (0, Localize_1.translateLocal)('workspace.invite.removed');
    const userText = (targetAccountIDs.length === 1 ? (0, Localize_1.translateLocal)('common.member') : (0, Localize_1.translateLocal)('common.members')).toLowerCase();
    return `${actionText} ${targetAccountIDs.length} ${userText}`;
}
function getReportActions(report) {
    return allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.reportID}`];
}
/**
 * @private
 */
function wasActionCreatedWhileOffline(action, isOffline, lastOfflineAt, lastOnlineAt, getLocalDateFromDatetime) {
    // The user has never gone offline or never come back online
    if (!lastOfflineAt || !lastOnlineAt) {
        return false;
    }
    const actionCreatedAt = getLocalDateFromDatetime(action.created);
    // The action was created before the user went offline.
    if (actionCreatedAt <= lastOfflineAt) {
        return false;
    }
    // The action was created while the user was offline.
    if (isOffline || actionCreatedAt < lastOnlineAt) {
        return true;
    }
    // The action was created after the user went back online.
    return false;
}
/**
 * Whether a message is NOT from the active user, and it was received while the user was offline.
 */
function wasMessageReceivedWhileOffline(action, isOffline, lastOfflineAt, lastOnlineAt, getLocalDateFromDatetime) {
    const wasByCurrentUser = wasActionTakenByCurrentUser(action);
    const wasCreatedOffline = wasActionCreatedWhileOffline(action, isOffline, lastOfflineAt, lastOnlineAt, getLocalDateFromDatetime);
    return !wasByCurrentUser && wasCreatedOffline && !(action.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD || action.isOptimisticAction);
}
function getReportActionFromExpensifyCard(cardID) {
    return Object.values(allReportActions ?? {})
        .map((reportActions) => Object.values(reportActions ?? {}))
        .flat()
        .find((reportAction) => {
        const cardIssuedActionOriginalMessage = isActionOfType(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.CARD_ISSUED_VIRTUAL) ? getOriginalMessage(reportAction) : undefined;
        return cardIssuedActionOriginalMessage?.cardID === cardID;
    });
}
function getIntegrationSyncFailedMessage(action, policyID, shouldShowOldDotLink = false) {
    const { label, errorMessage } = getOriginalMessage(action) ?? { label: '', errorMessage: '' };
    const param = encodeURIComponent(`{"policyID": "${policyID}"}`);
    const workspaceAccountingLink = shouldShowOldDotLink ? `${oldDotEnvironmentURL}/policy?param=${param}#connections` : `${environmentURL}/${ROUTES_1.default.POLICY_ACCOUNTING.getRoute(policyID)}`;
    return (0, Localize_1.translateLocal)('report.actions.type.integrationSyncFailed', {
        label,
        errorMessage,
        workspaceAccountingLink,
    });
}
function getManagerOnVacation(action) {
    if (!isApprovedAction(action)) {
        return;
    }
    return getOriginalMessage(action)?.managerOnVacation;
}
function getVacationer(action) {
    if (!isSubmittedAction(action)) {
        return;
    }
    return getOriginalMessage(action)?.vacationer;
}
function getSubmittedTo(action) {
    if (!isSubmittedAction(action)) {
        return;
    }
    return getOriginalMessage(action)?.to;
}
