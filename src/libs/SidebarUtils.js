"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_native_onyx_1 = require("react-native-onyx");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const DraftCommentUtils_1 = require("./DraftCommentUtils");
const Localize_1 = require("./Localize");
const OptionsListUtils_1 = require("./OptionsListUtils");
const Parser_1 = require("./Parser");
const Performance_1 = require("./Performance");
const PolicyUtils_1 = require("./PolicyUtils");
const ReportActionsUtils_1 = require("./ReportActionsUtils");
const ReportUtils_1 = require("./ReportUtils");
const TaskUtils_1 = require("./TaskUtils");
const TransactionUtils_1 = require("./TransactionUtils");
let allReports;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.REPORT,
    waitForCollectionCallback: true,
    callback: (value) => {
        allReports = value;
    },
});
function compareStringDates(a, b) {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}
function ensureSingleSpacing(text) {
    return text.replace(CONST_1.default.REGEX.WHITESPACE, ' ').trim();
}
function shouldDisplayReportInLHN(report, reports, currentReportId, isInFocusMode, betas, transactionViolations, isReportArchived, reportAttributes) {
    if (!report) {
        return { shouldDisplay: false };
    }
    if (Object.values(CONST_1.default.REPORT.UNSUPPORTED_TYPE).includes(report?.type ?? '')) {
        return { shouldDisplay: false };
    }
    // Get report metadata and status
    const parentReportAction = (0, ReportActionsUtils_1.getReportAction)(report?.parentReportID, report?.parentReportActionID);
    const doesReportHaveViolations = (0, ReportUtils_1.shouldDisplayViolationsRBRInLHN)(report, transactionViolations);
    const isHidden = (0, ReportUtils_1.isHiddenForCurrentUser)(report);
    const isFocused = report.reportID === currentReportId;
    const chatReport = reports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.chatReportID}`];
    const parentReport = reports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.parentReportID}`];
    const hasErrorsOtherThanFailedReceipt = (0, ReportUtils_1.hasReportErrorsOtherThanFailedReceipt)(report, chatReport, doesReportHaveViolations, transactionViolations, reportAttributes);
    const isReportInAccessible = report?.errorFields?.notFound;
    if ((0, ReportUtils_1.isOneTransactionThread)(report, parentReport, parentReportAction)) {
        return { shouldDisplay: false };
    }
    // Handle reports with errors
    if (hasErrorsOtherThanFailedReceipt && !isReportInAccessible) {
        return { shouldDisplay: true, hasErrorsOtherThanFailedReceipt: true };
    }
    // Check if report should override hidden status
    const isSystemChat = (0, ReportUtils_1.isSystemChat)(report);
    const shouldOverrideHidden = (0, DraftCommentUtils_1.hasValidDraftComment)(report.reportID) || hasErrorsOtherThanFailedReceipt || isFocused || isSystemChat || !!report.isPinned || reportAttributes?.[report?.reportID]?.requiresAttention;
    if (isHidden && !shouldOverrideHidden) {
        return { shouldDisplay: false };
    }
    // Final check for display eligibility
    const shouldDisplay = (0, ReportUtils_1.shouldReportBeInOptionList)({
        report,
        chatReport,
        currentReportId,
        isInFocusMode,
        betas,
        excludeEmptyChats: true,
        doesReportHaveViolations,
        includeSelfDM: true,
        isReportArchived,
    });
    return { shouldDisplay };
}
function getReportsToDisplayInLHN(currentReportId, reports, betas, policies, priorityMode, transactionViolations, reportNameValuePairs, reportAttributes) {
    const isInFocusMode = priorityMode === CONST_1.default.PRIORITY_MODE.GSD;
    const allReportsDictValues = reports ?? {};
    const reportsToDisplay = {};
    Object.entries(allReportsDictValues).forEach(([reportID, report]) => {
        if (!report) {
            return;
        }
        const { shouldDisplay, hasErrorsOtherThanFailedReceipt } = shouldDisplayReportInLHN(report, reports, currentReportId, isInFocusMode, betas, transactionViolations, (0, ReportUtils_1.isArchivedReport)(reportNameValuePairs?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report.reportID}`]), reportAttributes);
        if (shouldDisplay) {
            reportsToDisplay[reportID] = hasErrorsOtherThanFailedReceipt ? { ...report, hasErrorsOtherThanFailedReceipt: true } : report;
        }
    });
    return reportsToDisplay;
}
function updateReportsToDisplayInLHN(displayedReports, reports, updatedReportsKeys, currentReportId, isInFocusMode, betas, policies, transactionViolations, reportNameValuePairs, reportAttributes) {
    const displayedReportsCopy = { ...displayedReports };
    updatedReportsKeys.forEach((reportID) => {
        const report = reports?.[reportID];
        if (!report) {
            return;
        }
        const { shouldDisplay, hasErrorsOtherThanFailedReceipt } = shouldDisplayReportInLHN(report, reports, currentReportId, isInFocusMode, betas, transactionViolations, (0, ReportUtils_1.isArchivedReport)(reportNameValuePairs?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report.reportID}`]), reportAttributes);
        if (shouldDisplay) {
            displayedReportsCopy[reportID] = hasErrorsOtherThanFailedReceipt ? { ...report, hasErrorsOtherThanFailedReceipt: true } : report;
        }
        else {
            delete displayedReportsCopy[reportID];
        }
    });
    return displayedReportsCopy;
}
/**
 * Categorizes reports into their respective LHN groups
 */
function categorizeReportsForLHN(reportsToDisplay, reportNameValuePairs, reportAttributes) {
    const pinnedAndGBRReports = [];
    const errorReports = [];
    const draftReports = [];
    const nonArchivedReports = [];
    const archivedReports = [];
    // Pre-calculate report names and other properties to avoid repeated calculations
    const reportValues = Object.values(reportsToDisplay);
    const precomputedReports = [];
    // Single pass to precompute all required data
    for (const report of reportValues) {
        if (!report) {
            continue;
        }
        const reportID = report.reportID;
        const displayName = (0, ReportUtils_1.getReportName)(report);
        const miniReport = {
            reportID,
            displayName,
            lastVisibleActionCreated: report.lastVisibleActionCreated,
        };
        const isPinned = !!report.isPinned;
        const requiresAttention = !!reportAttributes?.[reportID]?.requiresAttention;
        const hasDraft = reportID ? (0, DraftCommentUtils_1.hasValidDraftComment)(reportID) : false;
        const reportNameValuePairsKey = `${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${reportID}`;
        const rNVPs = reportNameValuePairs?.[reportNameValuePairsKey];
        const isArchived = (0, ReportUtils_1.isArchivedNonExpenseReport)(report, !!rNVPs?.private_isArchived);
        const hasErrors = !!report.hasErrorsOtherThanFailedReceipt && !isArchived;
        precomputedReports.push({
            miniReport,
            isPinned,
            hasErrors,
            hasDraft,
            isArchived,
            requiresAttention,
        });
    }
    // Single pass to categorize reports
    for (const data of precomputedReports) {
        const { miniReport, isPinned, requiresAttention, hasErrors, hasDraft, isArchived } = data;
        if (isPinned || requiresAttention) {
            pinnedAndGBRReports.push(miniReport);
        }
        else if (hasErrors) {
            errorReports.push(miniReport);
        }
        else if (hasDraft) {
            draftReports.push(miniReport);
        }
        else if (isArchived) {
            archivedReports.push(miniReport);
        }
        else {
            nonArchivedReports.push(miniReport);
        }
    }
    return {
        pinnedAndGBRReports,
        errorReports,
        draftReports,
        nonArchivedReports,
        archivedReports,
    };
}
/**
 * Sorts categorized reports and returns new sorted arrays (pure function).
 * This function does not mutate the input and returns new arrays for better testability.
 */
function sortCategorizedReports(categories, isInDefaultMode, localeCompare) {
    const { pinnedAndGBRReports, errorReports, draftReports, nonArchivedReports, archivedReports } = categories;
    // Create comparison functions once to avoid recreating them in sort
    const compareDisplayNames = (a, b) => (a?.displayName && b?.displayName ? localeCompare(a.displayName, b.displayName) : 0);
    const compareDatesDesc = (a, b) => a?.lastVisibleActionCreated && b?.lastVisibleActionCreated ? compareStringDates(b.lastVisibleActionCreated, a.lastVisibleActionCreated) : 0;
    const compareNonArchivedDefault = (a, b) => {
        const compareDates = compareDatesDesc(a, b);
        return compareDates !== 0 ? compareDates : compareDisplayNames(a, b);
    };
    // Sort each group of reports accordingly
    const sortedPinnedAndGBRReports = pinnedAndGBRReports.sort(compareDisplayNames);
    const sortedErrorReports = errorReports.sort(compareDisplayNames);
    const sortedDraftReports = draftReports.sort(compareDisplayNames);
    let sortedNonArchivedReports;
    let sortedArchivedReports;
    if (isInDefaultMode) {
        sortedNonArchivedReports = nonArchivedReports.sort(compareNonArchivedDefault);
        // For archived reports ensure that most recent reports are at the top by reversing the order
        sortedArchivedReports = archivedReports.sort(compareDatesDesc);
    }
    else {
        sortedNonArchivedReports = nonArchivedReports.sort(compareDisplayNames);
        sortedArchivedReports = archivedReports.sort(compareDisplayNames);
    }
    return {
        pinnedAndGBRReports: sortedPinnedAndGBRReports,
        errorReports: sortedErrorReports,
        draftReports: sortedDraftReports,
        nonArchivedReports: sortedNonArchivedReports,
        archivedReports: sortedArchivedReports,
    };
}
/**
 * Combines sorted report categories and extracts report IDs
 */
function combineReportCategories(pinnedAndGBRReports, errorReports, draftReports, nonArchivedReports, archivedReports) {
    // Now that we have all the reports grouped and sorted, they must be flattened into an array and only return the reportID.
    // The order the arrays are concatenated in matters and will determine the order that the groups are displayed in the sidebar.
    return [...pinnedAndGBRReports, ...errorReports, ...draftReports, ...nonArchivedReports, ...archivedReports].map((report) => report?.reportID).filter(Boolean);
}
/**
 * @returns An array of reportIDs sorted in the proper order
 */
function sortReportsToDisplayInLHN(reportsToDisplay, priorityMode, localeCompare, reportNameValuePairs, reportAttributes) {
    Performance_1.default.markStart(CONST_1.default.TIMING.GET_ORDERED_REPORT_IDS);
    const isInFocusMode = priorityMode === CONST_1.default.PRIORITY_MODE.GSD;
    const isInDefaultMode = !isInFocusMode;
    // The LHN is split into five distinct groups, and each group is sorted a little differently. The groups will ALWAYS be in this order:
    // 1. Pinned/GBR - Always sorted by reportDisplayName
    // 2. Error reports - Always sorted by reportDisplayName
    // 3. Drafts - Always sorted by reportDisplayName
    // 4. Non-archived reports and settled IOUs
    //      - Sorted by lastVisibleActionCreated in default (most recent) view mode
    //      - Sorted by reportDisplayName in GSD (focus) view mode
    // 5. Archived reports
    //      - Sorted by lastVisibleActionCreated in default (most recent) view mode
    //      - Sorted by reportDisplayName in GSD (focus) view mode
    // Step 1: Categorize reports
    const categories = categorizeReportsForLHN(reportsToDisplay, reportNameValuePairs, reportAttributes);
    // Step 2: Sort each category
    const sortedCategories = sortCategorizedReports(categories, isInDefaultMode, localeCompare);
    // Step 3: Combine and extract IDs
    const result = combineReportCategories(sortedCategories.pinnedAndGBRReports, sortedCategories.errorReports, sortedCategories.draftReports, sortedCategories.nonArchivedReports, sortedCategories.archivedReports);
    Performance_1.default.markEnd(CONST_1.default.TIMING.GET_ORDERED_REPORT_IDS);
    return result;
}
function getReasonAndReportActionThatHasRedBrickRoad(report, chatReport, reportActions, hasViolations, reportErrors, transactions, transactionViolations, isReportArchived = false) {
    const { reportAction } = (0, ReportUtils_1.getAllReportActionsErrorsAndReportActionThatRequiresAttention)(report, reportActions, isReportArchived);
    const errors = reportErrors;
    const hasErrors = Object.keys(errors).length !== 0;
    if (isReportArchived) {
        return null;
    }
    if ((0, ReportUtils_1.shouldDisplayViolationsRBRInLHN)(report, transactionViolations)) {
        return {
            reason: CONST_1.default.RBR_REASONS.HAS_TRANSACTION_THREAD_VIOLATIONS,
        };
    }
    if (hasErrors) {
        return {
            reason: CONST_1.default.RBR_REASONS.HAS_ERRORS,
            reportAction,
        };
    }
    if (hasViolations) {
        return {
            reason: CONST_1.default.RBR_REASONS.HAS_VIOLATIONS,
        };
    }
    const parentReportAction = (0, ReportActionsUtils_1.getReportAction)(report?.parentReportID, report?.parentReportActionID);
    const transactionThreadReportID = (0, ReportActionsUtils_1.getOneTransactionThreadReportID)(report, chatReport, reportActions ?? []);
    if (transactionThreadReportID) {
        const transactionID = (0, TransactionUtils_1.getTransactionID)(transactionThreadReportID);
        const transaction = transactions?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`];
        if ((0, ReportUtils_1.hasReceiptError)(transaction)) {
            return {
                reason: CONST_1.default.RBR_REASONS.HAS_ERRORS,
            };
        }
    }
    const transactionID = (0, TransactionUtils_1.getTransactionID)(report.reportID);
    const transaction = transactions?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`];
    if ((0, ReportActionsUtils_1.isTransactionThread)(parentReportAction) && (0, ReportUtils_1.hasReceiptError)(transaction)) {
        return {
            reason: CONST_1.default.RBR_REASONS.HAS_ERRORS,
        };
    }
    return null;
}
function shouldShowRedBrickRoad(report, chatReport, reportActions, hasViolations, reportErrors, transactions, transactionViolations, isReportArchived = false) {
    return !!getReasonAndReportActionThatHasRedBrickRoad(report, chatReport, reportActions, hasViolations, reportErrors, transactions, transactionViolations, isReportArchived);
}
/**
 * Gets all the data necessary for rendering an OptionRowLHN component
 */
function getOptionData({ report, reportAttributes, oneTransactionThreadReport, reportNameValuePairs, personalDetails, policy, parentReportAction, lastMessageTextFromReport: lastMessageTextFromReportProp, invoiceReceiverPolicy, card, lastAction, localeCompare, isReportArchived = false, movedFromReport, movedToReport, }) {
    // When a user signs out, Onyx is cleared. Due to the lazy rendering with a virtual list, it's possible for
    // this method to be called after the Onyx data has been cleared out. In that case, it's fine to do
    // a null check here and return early.
    if (!report || !personalDetails) {
        return;
    }
    const result = {
        text: '',
        alternateText: undefined,
        allReportErrors: reportAttributes?.reportErrors,
        brickRoadIndicator: null,
        tooltipText: null,
        subtitle: undefined,
        login: undefined,
        accountID: undefined,
        reportID: '',
        phoneNumber: undefined,
        isUnread: null,
        isUnreadWithMention: null,
        hasDraftComment: false,
        keyForList: undefined,
        searchText: undefined,
        isPinned: false,
        hasOutstandingChildRequest: false,
        hasOutstandingChildTask: false,
        hasParentAccess: undefined,
        isIOUReportOwner: null,
        isChatRoom: false,
        private_isArchived: undefined,
        shouldShowSubscript: false,
        isPolicyExpenseChat: false,
        isMoneyRequestReport: false,
        isExpenseRequest: false,
        isWaitingOnBankAccount: false,
        isAllowedToComment: true,
        isDeletedParentAction: false,
        isConciergeChat: false,
    };
    const participantAccountIDs = (0, ReportUtils_1.getParticipantsAccountIDsForDisplay)(report);
    const participantAccountIDsExcludeCurrentUser = (0, ReportUtils_1.getParticipantsAccountIDsForDisplay)(report, undefined, undefined, true);
    const participantPersonalDetailListExcludeCurrentUser = Object.values((0, OptionsListUtils_1.getPersonalDetailsForAccountIDs)(participantAccountIDsExcludeCurrentUser, personalDetails));
    const visibleParticipantAccountIDs = (0, ReportUtils_1.getParticipantsAccountIDsForDisplay)(report, true);
    const participantPersonalDetailList = Object.values((0, OptionsListUtils_1.getPersonalDetailsForAccountIDs)(participantAccountIDs, personalDetails));
    const personalDetail = participantPersonalDetailList.at(0) ?? {};
    result.isThread = (0, ReportUtils_1.isChatThread)(report);
    result.isChatRoom = (0, ReportUtils_1.isChatRoom)(report);
    result.isTaskReport = (0, ReportUtils_1.isTaskReport)(report);
    result.isInvoiceReport = (0, ReportUtils_1.isInvoiceReport)(report);
    result.parentReportAction = parentReportAction;
    result.private_isArchived = reportNameValuePairs?.private_isArchived;
    result.isPolicyExpenseChat = (0, ReportUtils_1.isPolicyExpenseChat)(report);
    result.isExpenseRequest = (0, ReportUtils_1.isExpenseRequest)(report);
    result.isMoneyRequestReport = (0, ReportUtils_1.isMoneyRequestReport)(report);
    result.shouldShowSubscript = (0, ReportUtils_1.shouldReportShowSubscript)(report, isReportArchived);
    result.pendingAction = report.pendingFields?.addWorkspaceRoom ?? report.pendingFields?.createChat;
    result.brickRoadIndicator = reportAttributes?.brickRoadStatus;
    result.ownerAccountID = report.ownerAccountID;
    result.managerID = report.managerID;
    result.reportID = report.reportID;
    result.policyID = report.policyID;
    result.stateNum = report.stateNum;
    result.statusNum = report.statusNum;
    // When the only message of a report is deleted lastVisibleActionCreated is not reset leading to wrongly
    // setting it Unread so we add additional condition here to avoid empty chat LHN from being bold.
    result.isUnread = (0, ReportUtils_1.isUnread)(report, oneTransactionThreadReport, isReportArchived) && !!report.lastActorAccountID;
    result.isUnreadWithMention = (0, ReportUtils_1.isUnreadWithMention)(report);
    result.isPinned = report.isPinned;
    result.iouReportID = report.iouReportID;
    result.keyForList = String(report.reportID);
    result.hasOutstandingChildRequest = report.hasOutstandingChildRequest;
    result.parentReportID = report.parentReportID;
    result.isWaitingOnBankAccount = report.isWaitingOnBankAccount;
    result.notificationPreference = (0, ReportUtils_1.getReportNotificationPreference)(report);
    result.isAllowedToComment = (0, ReportUtils_1.canUserPerformWriteAction)(report, isReportArchived);
    result.chatType = report.chatType;
    result.isDeletedParentAction = report.isDeletedParentAction;
    result.isSelfDM = (0, ReportUtils_1.isSelfDM)(report);
    result.tooltipText = (0, ReportUtils_1.getReportParticipantsTitle)(visibleParticipantAccountIDs);
    result.hasOutstandingChildTask = report.hasOutstandingChildTask;
    result.hasParentAccess = report.hasParentAccess;
    result.isConciergeChat = (0, ReportUtils_1.isConciergeChatReport)(report);
    result.participants = report.participants;
    const isExpense = (0, ReportUtils_1.isExpenseReport)(report);
    const hasMultipleParticipants = participantPersonalDetailList.length > 1 || result.isChatRoom || result.isPolicyExpenseChat || isExpense;
    const subtitle = (0, ReportUtils_1.getChatRoomSubtitle)(report, false, isReportArchived);
    const status = personalDetail?.status ?? '';
    // We only create tooltips for the first 10 users or so since some reports have hundreds of users, causing performance to degrade.
    const displayNamesWithTooltips = (0, ReportUtils_1.getDisplayNamesWithTooltips)((participantPersonalDetailList || []).slice(0, 10), hasMultipleParticipants, localeCompare, undefined, (0, ReportUtils_1.isSelfDM)(report));
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const lastActorAccountID = lastAction?.actorAccountID || report.lastActorAccountID;
    // If the last actor's details are not currently saved in Onyx Collection,
    // then try to get that from the last report action if that action is valid
    // to get data from.
    let lastActorDetails = lastActorAccountID ? (personalDetails?.[lastActorAccountID] ?? null) : null;
    if (!lastActorDetails && lastAction) {
        const lastActorDisplayName = lastAction?.person?.[0]?.text;
        lastActorDetails = lastActorDisplayName
            ? {
                displayName: lastActorDisplayName,
                accountID: report.lastActorAccountID,
            }
            : null;
    }
    // Assign the actor account ID from the last action when it’s a REPORT_PREVIEW action.
    // to ensures that lastActorDetails.accountID is correctly set in case it's empty string
    if (lastAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW && lastActorDetails) {
        lastActorDetails.accountID = lastAction.actorAccountID;
    }
    const lastActorDisplayName = (0, OptionsListUtils_1.getLastActorDisplayName)(lastActorDetails);
    let lastMessageTextFromReport = lastMessageTextFromReportProp;
    if (!lastMessageTextFromReport) {
        lastMessageTextFromReport = (0, OptionsListUtils_1.getLastMessageTextForReport)({ report, lastActorDetails, movedFromReport, movedToReport, policy, isReportArchived });
    }
    // We need to remove sms domain in case the last message text has a phone number mention with sms domain.
    let lastMessageText = expensify_common_1.Str.removeSMSDomain(lastMessageTextFromReport);
    const isGroupChat = (0, ReportUtils_1.isGroupChat)(report) || (0, ReportUtils_1.isDeprecatedGroupDM)(report, isReportArchived);
    const isThreadMessage = (0, ReportUtils_1.isThread)(report) && lastAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT && lastAction?.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE;
    if ((result.isChatRoom || result.isPolicyExpenseChat || result.isThread || result.isTaskReport || isThreadMessage || isGroupChat) && !isReportArchived) {
        const lastActionName = lastAction?.actionName ?? report.lastActionType;
        const prefix = (0, ReportUtils_1.getReportSubtitlePrefix)(report);
        if ((0, ReportActionsUtils_1.isRenamedAction)(lastAction)) {
            result.alternateText = (0, ReportActionsUtils_1.getRenamedAction)(lastAction, isExpense, lastActorDisplayName);
        }
        else if ((0, ReportActionsUtils_1.isTaskAction)(lastAction)) {
            result.alternateText = (0, ReportUtils_1.formatReportLastMessageText)((0, TaskUtils_1.getTaskReportActionMessage)(lastAction).text);
        }
        else if (lastAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.LEAVE_ROOM) {
            const actionMessage = (0, ReportActionsUtils_1.getReportActionMessageText)(lastAction);
            result.alternateText = actionMessage ? `${lastActorDisplayName}: ${actionMessage}` : '';
        }
        else if ((0, ReportActionsUtils_1.isInviteOrRemovedAction)(lastAction)) {
            let actorDetails;
            if (lastAction.actorAccountID) {
                actorDetails = personalDetails?.[lastAction?.actorAccountID];
            }
            let actorDisplayName = lastAction?.person?.[0]?.text;
            if (!actorDetails && actorDisplayName && lastAction.actorAccountID) {
                actorDetails = {
                    displayName: actorDisplayName,
                    accountID: lastAction.actorAccountID,
                };
            }
            actorDisplayName = actorDetails ? (0, OptionsListUtils_1.getLastActorDisplayName)(actorDetails) : undefined;
            const lastActionOriginalMessage = lastAction?.actionName ? (0, ReportActionsUtils_1.getOriginalMessage)(lastAction) : null;
            const targetAccountIDs = lastActionOriginalMessage?.targetAccountIDs ?? [];
            const targetAccountIDsLength = targetAccountIDs.length !== 0 ? targetAccountIDs.length : (report.lastMessageHtml?.match(/<mention-user[^>]*><\/mention-user>/g)?.length ?? 0);
            const verb = lastActionName === CONST_1.default.REPORT.ACTIONS.TYPE.ROOM_CHANGE_LOG.INVITE_TO_ROOM || lastActionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.INVITE_TO_ROOM
                ? (0, Localize_1.translateLocal)('workspace.invite.invited')
                : (0, Localize_1.translateLocal)('workspace.invite.removed');
            const users = (0, Localize_1.translateLocal)(targetAccountIDsLength > 1 ? 'common.members' : 'common.member')?.toLocaleLowerCase();
            result.alternateText = (0, ReportUtils_1.formatReportLastMessageText)(`${actorDisplayName ?? lastActorDisplayName}: ${verb} ${targetAccountIDsLength} ${users}`);
            const roomName = (0, ReportUtils_1.getReportName)(allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${lastActionOriginalMessage?.reportID}`]) || lastActionOriginalMessage?.roomName;
            if (roomName) {
                const preposition = lastAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.ROOM_CHANGE_LOG.INVITE_TO_ROOM || lastAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.INVITE_TO_ROOM
                    ? ` ${(0, Localize_1.translateLocal)('workspace.invite.to')}`
                    : ` ${(0, Localize_1.translateLocal)('workspace.invite.from')}`;
                result.alternateText += `${preposition} ${roomName}`;
            }
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(lastAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_NAME)) {
            result.alternateText = (0, ReportUtils_1.getWorkspaceNameUpdatedMessage)(lastAction);
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(lastAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_DESCRIPTION)) {
            result.alternateText = (0, ReportActionsUtils_1.getWorkspaceDescriptionUpdatedMessage)(lastAction);
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(lastAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_CURRENCY)) {
            result.alternateText = (0, ReportActionsUtils_1.getWorkspaceCurrencyUpdateMessage)(lastAction);
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(lastAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_AUTO_REPORTING_FREQUENCY)) {
            result.alternateText = (0, ReportActionsUtils_1.getWorkspaceFrequencyUpdateMessage)(lastAction);
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(lastAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.CORPORATE_UPGRADE)) {
            result.alternateText = (0, Localize_1.translateLocal)('workspaceActions.upgradedWorkspace');
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(lastAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.TEAM_DOWNGRADE)) {
            result.alternateText = (0, Localize_1.translateLocal)('workspaceActions.downgradedWorkspace');
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(lastAction, CONST_1.default.REPORT.ACTIONS.TYPE.INTEGRATION_SYNC_FAILED)) {
            result.alternateText = (0, ReportActionsUtils_1.getIntegrationSyncFailedMessage)(lastAction, report?.policyID);
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(lastAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.ADD_CATEGORY) ||
            (0, ReportActionsUtils_1.isActionOfType)(lastAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_CATEGORY) ||
            (0, ReportActionsUtils_1.isActionOfType)(lastAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_CATEGORY) ||
            (0, ReportActionsUtils_1.isActionOfType)(lastAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.SET_CATEGORY_NAME)) {
            result.alternateText = (0, ReportActionsUtils_1.getWorkspaceCategoryUpdateMessage)(lastAction);
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(lastAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_TAG_LIST_NAME)) {
            result.alternateText = (0, PolicyUtils_1.getCleanedTagName)((0, ReportActionsUtils_1.getTagListNameUpdatedMessage)(lastAction) ?? '');
        }
        else if ((0, ReportActionsUtils_1.isTagModificationAction)(lastAction?.actionName ?? '')) {
            result.alternateText = (0, PolicyUtils_1.getCleanedTagName)((0, ReportActionsUtils_1.getWorkspaceTagUpdateMessage)(lastAction) ?? '');
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(lastAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_CUSTOM_UNIT)) {
            result.alternateText = (0, ReportActionsUtils_1.getWorkspaceCustomUnitUpdatedMessage)(lastAction);
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(lastAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.ADD_CUSTOM_UNIT_RATE)) {
            result.alternateText = (0, ReportActionsUtils_1.getWorkspaceCustomUnitRateAddedMessage)(lastAction);
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(lastAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_CUSTOM_UNIT_RATE)) {
            result.alternateText = (0, ReportActionsUtils_1.getWorkspaceCustomUnitRateUpdatedMessage)(lastAction);
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(lastAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_CUSTOM_UNIT_RATE)) {
            result.alternateText = (0, ReportActionsUtils_1.getWorkspaceCustomUnitRateDeletedMessage)(lastAction);
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(lastAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.ADD_REPORT_FIELD)) {
            result.alternateText = (0, ReportActionsUtils_1.getWorkspaceReportFieldAddMessage)(lastAction);
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(lastAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_REPORT_FIELD)) {
            result.alternateText = (0, ReportActionsUtils_1.getWorkspaceReportFieldUpdateMessage)(lastAction);
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(lastAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_REPORT_FIELD)) {
            result.alternateText = (0, ReportActionsUtils_1.getWorkspaceReportFieldDeleteMessage)(lastAction);
        }
        else if (lastAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_FIELD) {
            result.alternateText = (0, ReportActionsUtils_1.getWorkspaceUpdateFieldMessage)(lastAction);
        }
        else if (lastAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_MAX_EXPENSE_AMOUNT_NO_RECEIPT) {
            result.alternateText = (0, ReportActionsUtils_1.getPolicyChangeLogMaxExpenseAmountNoReceiptMessage)(lastAction);
        }
        else if (lastAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_MAX_EXPENSE_AMOUNT) {
            result.alternateText = (0, ReportActionsUtils_1.getPolicyChangeLogMaxExpenseAmountMessage)(lastAction);
        }
        else if (lastAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_DEFAULT_BILLABLE) {
            result.alternateText = (0, ReportActionsUtils_1.getPolicyChangeLogDefaultBillableMessage)(lastAction);
        }
        else if (lastAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_DEFAULT_REIMBURSABLE) {
            result.alternateText = (0, ReportActionsUtils_1.getPolicyChangeLogDefaultReimbursableMessage)(lastAction);
        }
        else if (lastAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_DEFAULT_TITLE_ENFORCED) {
            result.alternateText = (0, ReportActionsUtils_1.getPolicyChangeLogDefaultTitleEnforcedMessage)(lastAction);
        }
        else if (lastAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.LEAVE_POLICY) {
            result.alternateText = (0, ReportActionsUtils_1.getPolicyChangeLogEmployeeLeftMessage)(lastAction, true);
        }
        else if ((0, ReportActionsUtils_1.isCardIssuedAction)(lastAction)) {
            result.alternateText = (0, ReportActionsUtils_1.getCardIssuedMessage)({ reportAction: lastAction, expensifyCard: card });
        }
        else if (lastAction?.actionName !== CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW && lastActorDisplayName && lastMessageTextFromReport) {
            result.alternateText = (0, ReportUtils_1.formatReportLastMessageText)(Parser_1.default.htmlToText(`${lastActorDisplayName}: ${lastMessageText}`));
        }
        else if (lastAction && (0, ReportActionsUtils_1.isOldDotReportAction)(lastAction)) {
            result.alternateText = (0, ReportActionsUtils_1.getMessageOfOldDotReportAction)(lastAction);
        }
        else if (lastAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.ROOM_CHANGE_LOG.UPDATE_ROOM_DESCRIPTION) {
            result.alternateText = (0, ReportActionsUtils_1.getUpdateRoomDescriptionMessage)(lastAction);
        }
        else if (lastAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.ADD_EMPLOYEE) {
            result.alternateText = (0, ReportActionsUtils_1.getPolicyChangeLogAddEmployeeMessage)(lastAction);
        }
        else if (lastAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_EMPLOYEE) {
            result.alternateText = (0, ReportActionsUtils_1.getPolicyChangeLogUpdateEmployee)(lastAction);
        }
        else if (lastAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_EMPLOYEE) {
            result.alternateText = (0, ReportActionsUtils_1.getPolicyChangeLogDeleteMemberMessage)(lastAction);
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(lastAction, CONST_1.default.REPORT.ACTIONS.TYPE.UNREPORTED_TRANSACTION)) {
            result.alternateText = (0, ReportUtils_1.getUnreportedTransactionMessage)();
        }
        else if (lastAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_CUSTOM_UNIT_RATE) {
            result.alternateText = (0, ReportActionsUtils_1.getReportActionMessageText)(lastAction) ?? '';
        }
        else if (lastAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.ADD_INTEGRATION) {
            result.alternateText = (0, ReportActionsUtils_1.getAddedConnectionMessage)(lastAction);
        }
        else if (lastAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_INTEGRATION) {
            result.alternateText = (0, ReportActionsUtils_1.getRemovedConnectionMessage)(lastAction);
        }
        else if (lastAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_AUDIT_RATE) {
            result.alternateText = (0, ReportActionsUtils_1.getUpdatedAuditRateMessage)(lastAction);
        }
        else if (lastAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.ADD_APPROVER_RULE) {
            result.alternateText = (0, ReportActionsUtils_1.getAddedApprovalRuleMessage)(lastAction);
        }
        else if (lastAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_APPROVER_RULE) {
            result.alternateText = (0, ReportActionsUtils_1.getDeletedApprovalRuleMessage)(lastAction);
        }
        else if (lastAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_APPROVER_RULE) {
            result.alternateText = (0, ReportActionsUtils_1.getUpdatedApprovalRuleMessage)(lastAction);
        }
        else if (lastAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_MANUAL_APPROVAL_THRESHOLD) {
            result.alternateText = (0, ReportActionsUtils_1.getUpdatedManualApprovalThresholdMessage)(lastAction);
        }
        else if (lastAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.RETRACTED) {
            result.alternateText = (0, ReportActionsUtils_1.getRetractedMessage)();
        }
        else if (lastAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.REOPENED) {
            result.alternateText = (0, ReportActionsUtils_1.getReopenedMessage)();
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(lastAction, CONST_1.default.REPORT.ACTIONS.TYPE.TRAVEL_UPDATE)) {
            result.alternateText = (0, ReportActionsUtils_1.getTravelUpdateMessage)(lastAction);
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(lastAction, CONST_1.default.REPORT.ACTIONS.TYPE.TAKE_CONTROL) || (0, ReportActionsUtils_1.isActionOfType)(lastAction, CONST_1.default.REPORT.ACTIONS.TYPE.REROUTE)) {
            result.alternateText = (0, ReportActionsUtils_1.getChangedApproverActionMessage)(lastAction);
        }
        else {
            result.alternateText =
                lastMessageTextFromReport.length > 0
                    ? (0, ReportUtils_1.formatReportLastMessageText)(Parser_1.default.htmlToText(lastMessageText))
                    : (0, ReportActionsUtils_1.getLastVisibleMessage)(report.reportID, result.isAllowedToComment, {}, lastAction)?.lastMessageText;
            if (!result.alternateText) {
                result.alternateText = (0, ReportUtils_1.formatReportLastMessageText)(getWelcomeMessage(report, policy, participantPersonalDetailListExcludeCurrentUser, localeCompare, isReportArchived).messageText ?? (0, Localize_1.translateLocal)('report.noActivityYet'));
            }
        }
        result.alternateText = prefix + result.alternateText;
    }
    else {
        if (!lastMessageText) {
            lastMessageText = (0, ReportUtils_1.formatReportLastMessageText)(
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            getWelcomeMessage(report, policy, participantPersonalDetailListExcludeCurrentUser, localeCompare, isReportArchived).messageText || (0, Localize_1.translateLocal)('report.noActivityYet'));
        }
        if ((0, OptionsListUtils_1.shouldShowLastActorDisplayName)(report, lastActorDetails, lastAction) && !isReportArchived) {
            result.alternateText = `${lastActorDisplayName}: ${(0, ReportUtils_1.formatReportLastMessageText)(Parser_1.default.htmlToText(lastMessageText))}`;
        }
        else {
            result.alternateText = (0, ReportUtils_1.formatReportLastMessageText)(Parser_1.default.htmlToText(lastMessageText));
        }
    }
    result.isIOUReportOwner = (0, ReportUtils_1.isIOUOwnedByCurrentUser)(result);
    if ((0, ReportUtils_1.isJoinRequestInAdminRoom)(report)) {
        result.isUnread = true;
    }
    if (!hasMultipleParticipants) {
        result.accountID = personalDetail?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
        result.login = personalDetail?.login ?? '';
        result.phoneNumber = personalDetail?.phoneNumber ?? '';
    }
    const reportName = (0, ReportUtils_1.getReportName)(report, policy, undefined, undefined, invoiceReceiverPolicy);
    result.text = reportName;
    result.subtitle = subtitle;
    result.participantsList = participantPersonalDetailList;
    result.icons = (0, ReportUtils_1.getIcons)(report, personalDetails, personalDetail?.avatar, personalDetail?.login, personalDetail?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID, policy, invoiceReceiverPolicy, isReportArchived);
    result.displayNamesWithTooltips = displayNamesWithTooltips;
    if (status) {
        result.status = status;
    }
    result.type = report.type;
    return result;
}
function getWelcomeMessage(report, policy, participantPersonalDetailList, localeCompare, isReportArchived = false, reportDetailsLink = '') {
    const welcomeMessage = {};
    if ((0, ReportUtils_1.isChatThread)(report) || (0, ReportUtils_1.isTaskReport)(report)) {
        return welcomeMessage;
    }
    if ((0, ReportUtils_1.isChatRoom)(report)) {
        return getRoomWelcomeMessage(report, isReportArchived, reportDetailsLink);
    }
    if ((0, ReportUtils_1.isPolicyExpenseChat)(report)) {
        if (policy?.description) {
            welcomeMessage.messageHtml = policy.description;
            welcomeMessage.messageText = Parser_1.default.htmlToText(welcomeMessage.messageHtml);
        }
        else {
            welcomeMessage.messageHtml = (0, Localize_1.translateLocal)('reportActionsView.beginningOfChatHistoryPolicyExpenseChat', {
                submitterDisplayName: (0, ReportUtils_1.getDisplayNameForParticipant)({ accountID: report?.ownerAccountID }),
                workspaceName: (0, ReportUtils_1.getPolicyName)({ report }),
            });
            welcomeMessage.messageText = Parser_1.default.htmlToText(welcomeMessage.messageHtml);
        }
        return welcomeMessage;
    }
    if ((0, ReportUtils_1.isSelfDM)(report)) {
        welcomeMessage.messageText = (0, Localize_1.translateLocal)('reportActionsView.beginningOfChatHistorySelfDM');
        return welcomeMessage;
    }
    if ((0, ReportUtils_1.isSystemChat)(report)) {
        welcomeMessage.messageText = (0, Localize_1.translateLocal)('reportActionsView.beginningOfChatHistorySystemDM');
        return welcomeMessage;
    }
    welcomeMessage.phrase1 = (0, Localize_1.translateLocal)('reportActionsView.beginningOfChatHistory');
    const isMultipleParticipant = participantPersonalDetailList.length > 1;
    const displayNamesWithTooltips = (0, ReportUtils_1.getDisplayNamesWithTooltips)(participantPersonalDetailList, isMultipleParticipant, localeCompare);
    const displayNamesWithTooltipsText = displayNamesWithTooltips
        .map(({ displayName }, index) => {
        if (index === displayNamesWithTooltips.length - 1) {
            return `${displayName}.`;
        }
        if (index === displayNamesWithTooltips.length - 2) {
            return `${displayName} ${(0, Localize_1.translateLocal)('common.and')}`;
        }
        if (index < displayNamesWithTooltips.length - 2) {
            return `${displayName},`;
        }
        return '';
    })
        .join(' ');
    welcomeMessage.messageText = displayNamesWithTooltips.length ? ensureSingleSpacing(`${welcomeMessage.phrase1} ${displayNamesWithTooltipsText}`) : '';
    return welcomeMessage;
}
/**
 * Get welcome message based on room type
 */
function getRoomWelcomeMessage(report, isReportArchived = false, reportDetailsLink = '') {
    const welcomeMessage = {};
    const workspaceName = (0, ReportUtils_1.getPolicyName)({ report });
    const reportName = (0, ReportUtils_1.getReportName)(report);
    if (report?.description) {
        welcomeMessage.messageHtml = (0, ReportUtils_1.getReportDescription)(report);
        welcomeMessage.messageText = Parser_1.default.htmlToText(welcomeMessage.messageHtml);
        return welcomeMessage;
    }
    if (isReportArchived) {
        welcomeMessage.messageHtml = (0, Localize_1.translateLocal)('reportActionsView.beginningOfArchivedRoom', { reportName, reportDetailsLink });
    }
    else if ((0, ReportUtils_1.isDomainRoom)(report)) {
        welcomeMessage.messageHtml = (0, Localize_1.translateLocal)('reportActionsView.beginningOfChatHistoryDomainRoom', { domainRoom: report?.reportName ?? '' });
    }
    else if ((0, ReportUtils_1.isAdminRoom)(report)) {
        welcomeMessage.messageHtml = (0, Localize_1.translateLocal)('reportActionsView.beginningOfChatHistoryAdminRoom', { workspaceName });
    }
    else if ((0, ReportUtils_1.isAnnounceRoom)(report)) {
        welcomeMessage.messageHtml = (0, Localize_1.translateLocal)('reportActionsView.beginningOfChatHistoryAnnounceRoom', { workspaceName });
    }
    else if ((0, ReportUtils_1.isInvoiceRoom)(report)) {
        const payer = report?.invoiceReceiver?.type === CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.INDIVIDUAL
            ? (0, ReportUtils_1.getDisplayNameForParticipant)({ accountID: report?.invoiceReceiver?.accountID })
            : // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
                // eslint-disable-next-line deprecation/deprecation
                (0, PolicyUtils_1.getPolicy)(report?.invoiceReceiver?.policyID)?.name;
        const receiver = (0, ReportUtils_1.getPolicyName)({ report });
        welcomeMessage.messageHtml = (0, Localize_1.translateLocal)('reportActionsView.beginningOfChatHistoryInvoiceRoom', {
            invoicePayer: payer ?? '',
            invoiceReceiver: receiver,
        });
    }
    else {
        // Message for user created rooms or other room types.
        welcomeMessage.messageHtml = (0, Localize_1.translateLocal)('reportActionsView.beginningOfChatHistoryUserRoom', { reportName, reportDetailsLink });
    }
    welcomeMessage.messageText = Parser_1.default.htmlToText(welcomeMessage.messageHtml);
    return welcomeMessage;
}
exports.default = {
    getOptionData,
    sortReportsToDisplayInLHN,
    categorizeReportsForLHN,
    sortCategorizedReports,
    combineReportCategories,
    getWelcomeMessage,
    getReasonAndReportActionThatHasRedBrickRoad,
    shouldShowRedBrickRoad,
    getReportsToDisplayInLHN,
    updateReportsToDisplayInLHN,
};
