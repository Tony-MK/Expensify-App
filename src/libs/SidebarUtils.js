"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var expensify_common_1 = require("expensify-common");
var react_native_onyx_1 = require("react-native-onyx");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var DraftCommentUtils_1 = require("./DraftCommentUtils");
var Localize_1 = require("./Localize");
var OptionsListUtils_1 = require("./OptionsListUtils");
var Parser_1 = require("./Parser");
var Performance_1 = require("./Performance");
var PolicyUtils_1 = require("./PolicyUtils");
var ReportActionsUtils_1 = require("./ReportActionsUtils");
var ReportUtils_1 = require("./ReportUtils");
var TaskUtils_1 = require("./TaskUtils");
var TransactionUtils_1 = require("./TransactionUtils");
var allReports;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.REPORT,
    waitForCollectionCallback: true,
    callback: function (value) {
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
    var _a, _b, _c;
    if (!report) {
        return { shouldDisplay: false };
    }
    if (Object.values(CONST_1.default.REPORT.UNSUPPORTED_TYPE).includes((_a = report === null || report === void 0 ? void 0 : report.type) !== null && _a !== void 0 ? _a : '')) {
        return { shouldDisplay: false };
    }
    // Get report metadata and status
    var parentReportAction = (0, ReportActionsUtils_1.getReportAction)(report === null || report === void 0 ? void 0 : report.parentReportID, report === null || report === void 0 ? void 0 : report.parentReportActionID);
    var doesReportHaveViolations = (0, ReportUtils_1.shouldDisplayViolationsRBRInLHN)(report, transactionViolations);
    var isHidden = (0, ReportUtils_1.isHiddenForCurrentUser)(report);
    var isFocused = report.reportID === currentReportId;
    var chatReport = reports === null || reports === void 0 ? void 0 : reports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(report === null || report === void 0 ? void 0 : report.chatReportID)];
    var parentReport = reports === null || reports === void 0 ? void 0 : reports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(report.parentReportID)];
    var hasErrorsOtherThanFailedReceipt = (0, ReportUtils_1.hasReportErrorsOtherThanFailedReceipt)(report, chatReport, doesReportHaveViolations, transactionViolations, reportAttributes);
    var isReportInAccessible = (_b = report === null || report === void 0 ? void 0 : report.errorFields) === null || _b === void 0 ? void 0 : _b.notFound;
    if ((0, ReportUtils_1.isOneTransactionThread)(report, parentReport, parentReportAction)) {
        return { shouldDisplay: false };
    }
    // Handle reports with errors
    if (hasErrorsOtherThanFailedReceipt && !isReportInAccessible) {
        return { shouldDisplay: true, hasErrorsOtherThanFailedReceipt: true };
    }
    // Check if report should override hidden status
    var isSystemChat = (0, ReportUtils_1.isSystemChat)(report);
    var shouldOverrideHidden = (0, DraftCommentUtils_1.hasValidDraftComment)(report.reportID) || hasErrorsOtherThanFailedReceipt || isFocused || isSystemChat || !!report.isPinned || ((_c = reportAttributes === null || reportAttributes === void 0 ? void 0 : reportAttributes[report === null || report === void 0 ? void 0 : report.reportID]) === null || _c === void 0 ? void 0 : _c.requiresAttention);
    if (isHidden && !shouldOverrideHidden) {
        return { shouldDisplay: false };
    }
    // Final check for display eligibility
    var shouldDisplay = (0, ReportUtils_1.shouldReportBeInOptionList)({
        report: report,
        chatReport: chatReport,
        currentReportId: currentReportId,
        isInFocusMode: isInFocusMode,
        betas: betas,
        excludeEmptyChats: true,
        doesReportHaveViolations: doesReportHaveViolations,
        includeSelfDM: true,
        isReportArchived: isReportArchived,
    });
    return { shouldDisplay: shouldDisplay };
}
function getReportsToDisplayInLHN(currentReportId, reports, betas, policies, priorityMode, transactionViolations, reportNameValuePairs, reportAttributes) {
    var isInFocusMode = priorityMode === CONST_1.default.PRIORITY_MODE.GSD;
    var allReportsDictValues = reports !== null && reports !== void 0 ? reports : {};
    var reportsToDisplay = {};
    Object.entries(allReportsDictValues).forEach(function (_a) {
        var reportID = _a[0], report = _a[1];
        if (!report) {
            return;
        }
        var _b = shouldDisplayReportInLHN(report, reports, currentReportId, isInFocusMode, betas, transactionViolations, (0, ReportUtils_1.isArchivedReport)(reportNameValuePairs === null || reportNameValuePairs === void 0 ? void 0 : reportNameValuePairs["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS).concat(report.reportID)]), reportAttributes), shouldDisplay = _b.shouldDisplay, hasErrorsOtherThanFailedReceipt = _b.hasErrorsOtherThanFailedReceipt;
        if (shouldDisplay) {
            reportsToDisplay[reportID] = hasErrorsOtherThanFailedReceipt ? __assign(__assign({}, report), { hasErrorsOtherThanFailedReceipt: true }) : report;
        }
    });
    return reportsToDisplay;
}
function updateReportsToDisplayInLHN(displayedReports, reports, updatedReportsKeys, currentReportId, isInFocusMode, betas, policies, transactionViolations, reportNameValuePairs, reportAttributes) {
    var displayedReportsCopy = __assign({}, displayedReports);
    updatedReportsKeys.forEach(function (reportID) {
        var report = reports === null || reports === void 0 ? void 0 : reports[reportID];
        if (!report) {
            return;
        }
        var _a = shouldDisplayReportInLHN(report, reports, currentReportId, isInFocusMode, betas, transactionViolations, (0, ReportUtils_1.isArchivedReport)(reportNameValuePairs === null || reportNameValuePairs === void 0 ? void 0 : reportNameValuePairs["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS).concat(report.reportID)]), reportAttributes), shouldDisplay = _a.shouldDisplay, hasErrorsOtherThanFailedReceipt = _a.hasErrorsOtherThanFailedReceipt;
        if (shouldDisplay) {
            displayedReportsCopy[reportID] = hasErrorsOtherThanFailedReceipt ? __assign(__assign({}, report), { hasErrorsOtherThanFailedReceipt: true }) : report;
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
    var _a;
    var pinnedAndGBRReports = [];
    var errorReports = [];
    var draftReports = [];
    var nonArchivedReports = [];
    var archivedReports = [];
    // Pre-calculate report names and other properties to avoid repeated calculations
    var reportValues = Object.values(reportsToDisplay);
    var precomputedReports = [];
    // Single pass to precompute all required data
    for (var _i = 0, reportValues_1 = reportValues; _i < reportValues_1.length; _i++) {
        var report = reportValues_1[_i];
        if (!report) {
            continue;
        }
        var reportID = report.reportID;
        var displayName = (0, ReportUtils_1.getReportName)(report);
        var miniReport = {
            reportID: reportID,
            displayName: displayName,
            lastVisibleActionCreated: report.lastVisibleActionCreated,
        };
        var isPinned = !!report.isPinned;
        var requiresAttention = !!((_a = reportAttributes === null || reportAttributes === void 0 ? void 0 : reportAttributes[reportID]) === null || _a === void 0 ? void 0 : _a.requiresAttention);
        var hasDraft = reportID ? (0, DraftCommentUtils_1.hasValidDraftComment)(reportID) : false;
        var reportNameValuePairsKey = "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS).concat(reportID);
        var rNVPs = reportNameValuePairs === null || reportNameValuePairs === void 0 ? void 0 : reportNameValuePairs[reportNameValuePairsKey];
        var isArchived = (0, ReportUtils_1.isArchivedNonExpenseReport)(report, !!(rNVPs === null || rNVPs === void 0 ? void 0 : rNVPs.private_isArchived));
        var hasErrors = !!report.hasErrorsOtherThanFailedReceipt && !isArchived;
        precomputedReports.push({
            miniReport: miniReport,
            isPinned: isPinned,
            hasErrors: hasErrors,
            hasDraft: hasDraft,
            isArchived: isArchived,
            requiresAttention: requiresAttention,
        });
    }
    // Single pass to categorize reports
    for (var _b = 0, precomputedReports_1 = precomputedReports; _b < precomputedReports_1.length; _b++) {
        var data = precomputedReports_1[_b];
        var miniReport = data.miniReport, isPinned = data.isPinned, requiresAttention = data.requiresAttention, hasErrors = data.hasErrors, hasDraft = data.hasDraft, isArchived = data.isArchived;
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
        pinnedAndGBRReports: pinnedAndGBRReports,
        errorReports: errorReports,
        draftReports: draftReports,
        nonArchivedReports: nonArchivedReports,
        archivedReports: archivedReports,
    };
}
/**
 * Sorts categorized reports and returns new sorted arrays (pure function).
 * This function does not mutate the input and returns new arrays for better testability.
 */
function sortCategorizedReports(categories, isInDefaultMode, localeCompare) {
    var pinnedAndGBRReports = categories.pinnedAndGBRReports, errorReports = categories.errorReports, draftReports = categories.draftReports, nonArchivedReports = categories.nonArchivedReports, archivedReports = categories.archivedReports;
    // Create comparison functions once to avoid recreating them in sort
    var compareDisplayNames = function (a, b) { return ((a === null || a === void 0 ? void 0 : a.displayName) && (b === null || b === void 0 ? void 0 : b.displayName) ? localeCompare(a.displayName, b.displayName) : 0); };
    var compareDatesDesc = function (a, b) {
        return (a === null || a === void 0 ? void 0 : a.lastVisibleActionCreated) && (b === null || b === void 0 ? void 0 : b.lastVisibleActionCreated) ? compareStringDates(b.lastVisibleActionCreated, a.lastVisibleActionCreated) : 0;
    };
    var compareNonArchivedDefault = function (a, b) {
        var compareDates = compareDatesDesc(a, b);
        return compareDates !== 0 ? compareDates : compareDisplayNames(a, b);
    };
    // Sort each group of reports accordingly
    var sortedPinnedAndGBRReports = pinnedAndGBRReports.sort(compareDisplayNames);
    var sortedErrorReports = errorReports.sort(compareDisplayNames);
    var sortedDraftReports = draftReports.sort(compareDisplayNames);
    var sortedNonArchivedReports;
    var sortedArchivedReports;
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
    return __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], pinnedAndGBRReports, true), errorReports, true), draftReports, true), nonArchivedReports, true), archivedReports, true).map(function (report) { return report === null || report === void 0 ? void 0 : report.reportID; }).filter(Boolean);
}
/**
 * @returns An array of reportIDs sorted in the proper order
 */
function sortReportsToDisplayInLHN(reportsToDisplay, priorityMode, localeCompare, reportNameValuePairs, reportAttributes) {
    Performance_1.default.markStart(CONST_1.default.TIMING.GET_ORDERED_REPORT_IDS);
    var isInFocusMode = priorityMode === CONST_1.default.PRIORITY_MODE.GSD;
    var isInDefaultMode = !isInFocusMode;
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
    var categories = categorizeReportsForLHN(reportsToDisplay, reportNameValuePairs, reportAttributes);
    // Step 2: Sort each category
    var sortedCategories = sortCategorizedReports(categories, isInDefaultMode, localeCompare);
    // Step 3: Combine and extract IDs
    var result = combineReportCategories(sortedCategories.pinnedAndGBRReports, sortedCategories.errorReports, sortedCategories.draftReports, sortedCategories.nonArchivedReports, sortedCategories.archivedReports);
    Performance_1.default.markEnd(CONST_1.default.TIMING.GET_ORDERED_REPORT_IDS);
    return result;
}
function getReasonAndReportActionThatHasRedBrickRoad(report, chatReport, reportActions, hasViolations, reportErrors, transactions, transactionViolations, isReportArchived) {
    if (isReportArchived === void 0) { isReportArchived = false; }
    var reportAction = (0, ReportUtils_1.getAllReportActionsErrorsAndReportActionThatRequiresAttention)(report, reportActions, isReportArchived).reportAction;
    var errors = reportErrors;
    var hasErrors = Object.keys(errors).length !== 0;
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
            reportAction: reportAction,
        };
    }
    if (hasViolations) {
        return {
            reason: CONST_1.default.RBR_REASONS.HAS_VIOLATIONS,
        };
    }
    var parentReportAction = (0, ReportActionsUtils_1.getReportAction)(report === null || report === void 0 ? void 0 : report.parentReportID, report === null || report === void 0 ? void 0 : report.parentReportActionID);
    var transactionThreadReportID = (0, ReportActionsUtils_1.getOneTransactionThreadReportID)(report, chatReport, reportActions !== null && reportActions !== void 0 ? reportActions : []);
    if (transactionThreadReportID) {
        var transactionID_1 = (0, TransactionUtils_1.getTransactionID)(transactionThreadReportID);
        var transaction_1 = transactions === null || transactions === void 0 ? void 0 : transactions["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID_1)];
        if ((0, ReportUtils_1.hasReceiptError)(transaction_1)) {
            return {
                reason: CONST_1.default.RBR_REASONS.HAS_ERRORS,
            };
        }
    }
    var transactionID = (0, TransactionUtils_1.getTransactionID)(report.reportID);
    var transaction = transactions === null || transactions === void 0 ? void 0 : transactions["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID)];
    if ((0, ReportActionsUtils_1.isTransactionThread)(parentReportAction) && (0, ReportUtils_1.hasReceiptError)(transaction)) {
        return {
            reason: CONST_1.default.RBR_REASONS.HAS_ERRORS,
        };
    }
    return null;
}
function shouldShowRedBrickRoad(report, chatReport, reportActions, hasViolations, reportErrors, transactions, transactionViolations, isReportArchived) {
    if (isReportArchived === void 0) { isReportArchived = false; }
    return !!getReasonAndReportActionThatHasRedBrickRoad(report, chatReport, reportActions, hasViolations, reportErrors, transactions, transactionViolations, isReportArchived);
}
/**
 * Gets all the data necessary for rendering an OptionRowLHN component
 */
function getOptionData(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
    var report = _a.report, reportAttributes = _a.reportAttributes, oneTransactionThreadReport = _a.oneTransactionThreadReport, reportNameValuePairs = _a.reportNameValuePairs, personalDetails = _a.personalDetails, policy = _a.policy, parentReportAction = _a.parentReportAction, lastMessageTextFromReportProp = _a.lastMessageTextFromReport, invoiceReceiverPolicy = _a.invoiceReceiverPolicy, card = _a.card, lastAction = _a.lastAction, localeCompare = _a.localeCompare, _3 = _a.isReportArchived, isReportArchived = _3 === void 0 ? false : _3, movedFromReport = _a.movedFromReport, movedToReport = _a.movedToReport;
    // When a user signs out, Onyx is cleared. Due to the lazy rendering with a virtual list, it's possible for
    // this method to be called after the Onyx data has been cleared out. In that case, it's fine to do
    // a null check here and return early.
    if (!report || !personalDetails) {
        return;
    }
    var result = {
        text: '',
        alternateText: undefined,
        allReportErrors: reportAttributes === null || reportAttributes === void 0 ? void 0 : reportAttributes.reportErrors,
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
    var participantAccountIDs = (0, ReportUtils_1.getParticipantsAccountIDsForDisplay)(report);
    var participantAccountIDsExcludeCurrentUser = (0, ReportUtils_1.getParticipantsAccountIDsForDisplay)(report, undefined, undefined, true);
    var participantPersonalDetailListExcludeCurrentUser = Object.values((0, OptionsListUtils_1.getPersonalDetailsForAccountIDs)(participantAccountIDsExcludeCurrentUser, personalDetails));
    var visibleParticipantAccountIDs = (0, ReportUtils_1.getParticipantsAccountIDsForDisplay)(report, true);
    var participantPersonalDetailList = Object.values((0, OptionsListUtils_1.getPersonalDetailsForAccountIDs)(participantAccountIDs, personalDetails));
    var personalDetail = (_b = participantPersonalDetailList.at(0)) !== null && _b !== void 0 ? _b : {};
    result.isThread = (0, ReportUtils_1.isChatThread)(report);
    result.isChatRoom = (0, ReportUtils_1.isChatRoom)(report);
    result.isTaskReport = (0, ReportUtils_1.isTaskReport)(report);
    result.isInvoiceReport = (0, ReportUtils_1.isInvoiceReport)(report);
    result.parentReportAction = parentReportAction;
    result.private_isArchived = reportNameValuePairs === null || reportNameValuePairs === void 0 ? void 0 : reportNameValuePairs.private_isArchived;
    result.isPolicyExpenseChat = (0, ReportUtils_1.isPolicyExpenseChat)(report);
    result.isExpenseRequest = (0, ReportUtils_1.isExpenseRequest)(report);
    result.isMoneyRequestReport = (0, ReportUtils_1.isMoneyRequestReport)(report);
    result.shouldShowSubscript = (0, ReportUtils_1.shouldReportShowSubscript)(report, isReportArchived);
    result.pendingAction = (_d = (_c = report.pendingFields) === null || _c === void 0 ? void 0 : _c.addWorkspaceRoom) !== null && _d !== void 0 ? _d : (_e = report.pendingFields) === null || _e === void 0 ? void 0 : _e.createChat;
    result.brickRoadIndicator = reportAttributes === null || reportAttributes === void 0 ? void 0 : reportAttributes.brickRoadStatus;
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
    var isExpense = (0, ReportUtils_1.isExpenseReport)(report);
    var hasMultipleParticipants = participantPersonalDetailList.length > 1 || result.isChatRoom || result.isPolicyExpenseChat || isExpense;
    var subtitle = (0, ReportUtils_1.getChatRoomSubtitle)(report, false, isReportArchived);
    var status = (_f = personalDetail === null || personalDetail === void 0 ? void 0 : personalDetail.status) !== null && _f !== void 0 ? _f : '';
    // We only create tooltips for the first 10 users or so since some reports have hundreds of users, causing performance to degrade.
    var displayNamesWithTooltips = (0, ReportUtils_1.getDisplayNamesWithTooltips)((participantPersonalDetailList || []).slice(0, 10), hasMultipleParticipants, localeCompare, undefined, (0, ReportUtils_1.isSelfDM)(report));
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    var lastActorAccountID = (lastAction === null || lastAction === void 0 ? void 0 : lastAction.actorAccountID) || report.lastActorAccountID;
    // If the last actor's details are not currently saved in Onyx Collection,
    // then try to get that from the last report action if that action is valid
    // to get data from.
    var lastActorDetails = lastActorAccountID ? ((_g = personalDetails === null || personalDetails === void 0 ? void 0 : personalDetails[lastActorAccountID]) !== null && _g !== void 0 ? _g : null) : null;
    if (!lastActorDetails && lastAction) {
        var lastActorDisplayName_1 = (_j = (_h = lastAction === null || lastAction === void 0 ? void 0 : lastAction.person) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.text;
        lastActorDetails = lastActorDisplayName_1
            ? {
                displayName: lastActorDisplayName_1,
                accountID: report.lastActorAccountID,
            }
            : null;
    }
    // Assign the actor account ID from the last action when it’s a REPORT_PREVIEW action.
    // to ensures that lastActorDetails.accountID is correctly set in case it's empty string
    if ((lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW && lastActorDetails) {
        lastActorDetails.accountID = lastAction.actorAccountID;
    }
    var lastActorDisplayName = (0, OptionsListUtils_1.getLastActorDisplayName)(lastActorDetails);
    var lastMessageTextFromReport = lastMessageTextFromReportProp;
    if (!lastMessageTextFromReport) {
        lastMessageTextFromReport = (0, OptionsListUtils_1.getLastMessageTextForReport)({ report: report, lastActorDetails: lastActorDetails, movedFromReport: movedFromReport, movedToReport: movedToReport, policy: policy, isReportArchived: isReportArchived });
    }
    // We need to remove sms domain in case the last message text has a phone number mention with sms domain.
    var lastMessageText = expensify_common_1.Str.removeSMSDomain(lastMessageTextFromReport);
    var isGroupChat = (0, ReportUtils_1.isGroupChat)(report) || (0, ReportUtils_1.isDeprecatedGroupDM)(report, isReportArchived);
    var isThreadMessage = (0, ReportUtils_1.isThread)(report) && (lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT && (lastAction === null || lastAction === void 0 ? void 0 : lastAction.pendingAction) !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE;
    if ((result.isChatRoom || result.isPolicyExpenseChat || result.isThread || result.isTaskReport || isThreadMessage || isGroupChat) && !isReportArchived) {
        var lastActionName = (_k = lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName) !== null && _k !== void 0 ? _k : report.lastActionType;
        var prefix = (0, ReportUtils_1.getReportSubtitlePrefix)(report);
        if ((0, ReportActionsUtils_1.isRenamedAction)(lastAction)) {
            result.alternateText = (0, ReportActionsUtils_1.getRenamedAction)(lastAction, isExpense, lastActorDisplayName);
        }
        else if ((0, ReportActionsUtils_1.isTaskAction)(lastAction)) {
            result.alternateText = (0, ReportUtils_1.formatReportLastMessageText)((0, TaskUtils_1.getTaskReportActionMessage)(lastAction).text);
        }
        else if ((lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.LEAVE_ROOM) {
            var actionMessage = (0, ReportActionsUtils_1.getReportActionMessageText)(lastAction);
            result.alternateText = actionMessage ? "".concat(lastActorDisplayName, ": ").concat(actionMessage) : '';
        }
        else if ((0, ReportActionsUtils_1.isInviteOrRemovedAction)(lastAction)) {
            var actorDetails = void 0;
            if (lastAction.actorAccountID) {
                actorDetails = personalDetails === null || personalDetails === void 0 ? void 0 : personalDetails[lastAction === null || lastAction === void 0 ? void 0 : lastAction.actorAccountID];
            }
            var actorDisplayName = (_m = (_l = lastAction === null || lastAction === void 0 ? void 0 : lastAction.person) === null || _l === void 0 ? void 0 : _l[0]) === null || _m === void 0 ? void 0 : _m.text;
            if (!actorDetails && actorDisplayName && lastAction.actorAccountID) {
                actorDetails = {
                    displayName: actorDisplayName,
                    accountID: lastAction.actorAccountID,
                };
            }
            actorDisplayName = actorDetails ? (0, OptionsListUtils_1.getLastActorDisplayName)(actorDetails) : undefined;
            var lastActionOriginalMessage = (lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName) ? (0, ReportActionsUtils_1.getOriginalMessage)(lastAction) : null;
            var targetAccountIDs = (_o = lastActionOriginalMessage === null || lastActionOriginalMessage === void 0 ? void 0 : lastActionOriginalMessage.targetAccountIDs) !== null && _o !== void 0 ? _o : [];
            var targetAccountIDsLength = targetAccountIDs.length !== 0 ? targetAccountIDs.length : ((_r = (_q = (_p = report.lastMessageHtml) === null || _p === void 0 ? void 0 : _p.match(/<mention-user[^>]*><\/mention-user>/g)) === null || _q === void 0 ? void 0 : _q.length) !== null && _r !== void 0 ? _r : 0);
            var verb = lastActionName === CONST_1.default.REPORT.ACTIONS.TYPE.ROOM_CHANGE_LOG.INVITE_TO_ROOM || lastActionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.INVITE_TO_ROOM
                ? (0, Localize_1.translateLocal)('workspace.invite.invited')
                : (0, Localize_1.translateLocal)('workspace.invite.removed');
            var users = (_s = (0, Localize_1.translateLocal)(targetAccountIDsLength > 1 ? 'common.members' : 'common.member')) === null || _s === void 0 ? void 0 : _s.toLocaleLowerCase();
            result.alternateText = (0, ReportUtils_1.formatReportLastMessageText)("".concat(actorDisplayName !== null && actorDisplayName !== void 0 ? actorDisplayName : lastActorDisplayName, ": ").concat(verb, " ").concat(targetAccountIDsLength, " ").concat(users));
            var roomName = (0, ReportUtils_1.getReportName)(allReports === null || allReports === void 0 ? void 0 : allReports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(lastActionOriginalMessage === null || lastActionOriginalMessage === void 0 ? void 0 : lastActionOriginalMessage.reportID)]) || (lastActionOriginalMessage === null || lastActionOriginalMessage === void 0 ? void 0 : lastActionOriginalMessage.roomName);
            if (roomName) {
                var preposition = lastAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.ROOM_CHANGE_LOG.INVITE_TO_ROOM || lastAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.INVITE_TO_ROOM
                    ? " ".concat((0, Localize_1.translateLocal)('workspace.invite.to'))
                    : " ".concat((0, Localize_1.translateLocal)('workspace.invite.from'));
                result.alternateText += "".concat(preposition, " ").concat(roomName);
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
            result.alternateText = (0, ReportActionsUtils_1.getIntegrationSyncFailedMessage)(lastAction, report === null || report === void 0 ? void 0 : report.policyID);
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(lastAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.ADD_CATEGORY) ||
            (0, ReportActionsUtils_1.isActionOfType)(lastAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_CATEGORY) ||
            (0, ReportActionsUtils_1.isActionOfType)(lastAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_CATEGORY) ||
            (0, ReportActionsUtils_1.isActionOfType)(lastAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.SET_CATEGORY_NAME)) {
            result.alternateText = (0, ReportActionsUtils_1.getWorkspaceCategoryUpdateMessage)(lastAction);
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(lastAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_TAG_LIST_NAME)) {
            result.alternateText = (0, PolicyUtils_1.getCleanedTagName)((_t = (0, ReportActionsUtils_1.getTagListNameUpdatedMessage)(lastAction)) !== null && _t !== void 0 ? _t : '');
        }
        else if ((0, ReportActionsUtils_1.isTagModificationAction)((_u = lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName) !== null && _u !== void 0 ? _u : '')) {
            result.alternateText = (0, PolicyUtils_1.getCleanedTagName)((_v = (0, ReportActionsUtils_1.getWorkspaceTagUpdateMessage)(lastAction)) !== null && _v !== void 0 ? _v : '');
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
        else if ((lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_FIELD) {
            result.alternateText = (0, ReportActionsUtils_1.getWorkspaceUpdateFieldMessage)(lastAction);
        }
        else if ((lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_MAX_EXPENSE_AMOUNT_NO_RECEIPT) {
            result.alternateText = (0, ReportActionsUtils_1.getPolicyChangeLogMaxExpenseAmountNoReceiptMessage)(lastAction);
        }
        else if ((lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_MAX_EXPENSE_AMOUNT) {
            result.alternateText = (0, ReportActionsUtils_1.getPolicyChangeLogMaxExpenseAmountMessage)(lastAction);
        }
        else if ((lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_DEFAULT_BILLABLE) {
            result.alternateText = (0, ReportActionsUtils_1.getPolicyChangeLogDefaultBillableMessage)(lastAction);
        }
        else if ((lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_DEFAULT_REIMBURSABLE) {
            result.alternateText = (0, ReportActionsUtils_1.getPolicyChangeLogDefaultReimbursableMessage)(lastAction);
        }
        else if ((lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_DEFAULT_TITLE_ENFORCED) {
            result.alternateText = (0, ReportActionsUtils_1.getPolicyChangeLogDefaultTitleEnforcedMessage)(lastAction);
        }
        else if ((lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.LEAVE_POLICY) {
            result.alternateText = (0, ReportActionsUtils_1.getPolicyChangeLogEmployeeLeftMessage)(lastAction, true);
        }
        else if ((0, ReportActionsUtils_1.isCardIssuedAction)(lastAction)) {
            result.alternateText = (0, ReportActionsUtils_1.getCardIssuedMessage)({ reportAction: lastAction, expensifyCard: card });
        }
        else if ((lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName) !== CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW && lastActorDisplayName && lastMessageTextFromReport) {
            result.alternateText = (0, ReportUtils_1.formatReportLastMessageText)(Parser_1.default.htmlToText("".concat(lastActorDisplayName, ": ").concat(lastMessageText)));
        }
        else if (lastAction && (0, ReportActionsUtils_1.isOldDotReportAction)(lastAction)) {
            result.alternateText = (0, ReportActionsUtils_1.getMessageOfOldDotReportAction)(lastAction);
        }
        else if ((lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.ROOM_CHANGE_LOG.UPDATE_ROOM_DESCRIPTION) {
            result.alternateText = (0, ReportActionsUtils_1.getUpdateRoomDescriptionMessage)(lastAction);
        }
        else if ((lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.ADD_EMPLOYEE) {
            result.alternateText = (0, ReportActionsUtils_1.getPolicyChangeLogAddEmployeeMessage)(lastAction);
        }
        else if ((lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_EMPLOYEE) {
            result.alternateText = (0, ReportActionsUtils_1.getPolicyChangeLogUpdateEmployee)(lastAction);
        }
        else if ((lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_EMPLOYEE) {
            result.alternateText = (0, ReportActionsUtils_1.getPolicyChangeLogDeleteMemberMessage)(lastAction);
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(lastAction, CONST_1.default.REPORT.ACTIONS.TYPE.UNREPORTED_TRANSACTION)) {
            result.alternateText = (0, ReportUtils_1.getUnreportedTransactionMessage)();
        }
        else if ((lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_CUSTOM_UNIT_RATE) {
            result.alternateText = (_w = (0, ReportActionsUtils_1.getReportActionMessageText)(lastAction)) !== null && _w !== void 0 ? _w : '';
        }
        else if ((lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.ADD_INTEGRATION) {
            result.alternateText = (0, ReportActionsUtils_1.getAddedConnectionMessage)(lastAction);
        }
        else if ((lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_INTEGRATION) {
            result.alternateText = (0, ReportActionsUtils_1.getRemovedConnectionMessage)(lastAction);
        }
        else if ((lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_AUDIT_RATE) {
            result.alternateText = (0, ReportActionsUtils_1.getUpdatedAuditRateMessage)(lastAction);
        }
        else if ((lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.ADD_APPROVER_RULE) {
            result.alternateText = (0, ReportActionsUtils_1.getAddedApprovalRuleMessage)(lastAction);
        }
        else if ((lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_APPROVER_RULE) {
            result.alternateText = (0, ReportActionsUtils_1.getDeletedApprovalRuleMessage)(lastAction);
        }
        else if ((lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_APPROVER_RULE) {
            result.alternateText = (0, ReportActionsUtils_1.getUpdatedApprovalRuleMessage)(lastAction);
        }
        else if ((lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_MANUAL_APPROVAL_THRESHOLD) {
            result.alternateText = (0, ReportActionsUtils_1.getUpdatedManualApprovalThresholdMessage)(lastAction);
        }
        else if ((lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.RETRACTED) {
            result.alternateText = (0, ReportActionsUtils_1.getRetractedMessage)();
        }
        else if ((lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.REOPENED) {
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
                    : (_x = (0, ReportActionsUtils_1.getLastVisibleMessage)(report.reportID, result.isAllowedToComment, {}, lastAction)) === null || _x === void 0 ? void 0 : _x.lastMessageText;
            if (!result.alternateText) {
                result.alternateText = (0, ReportUtils_1.formatReportLastMessageText)((_y = getWelcomeMessage(report, policy, participantPersonalDetailListExcludeCurrentUser, localeCompare, isReportArchived).messageText) !== null && _y !== void 0 ? _y : (0, Localize_1.translateLocal)('report.noActivityYet'));
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
            result.alternateText = "".concat(lastActorDisplayName, ": ").concat((0, ReportUtils_1.formatReportLastMessageText)(Parser_1.default.htmlToText(lastMessageText)));
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
        result.accountID = (_z = personalDetail === null || personalDetail === void 0 ? void 0 : personalDetail.accountID) !== null && _z !== void 0 ? _z : CONST_1.default.DEFAULT_NUMBER_ID;
        result.login = (_0 = personalDetail === null || personalDetail === void 0 ? void 0 : personalDetail.login) !== null && _0 !== void 0 ? _0 : '';
        result.phoneNumber = (_1 = personalDetail === null || personalDetail === void 0 ? void 0 : personalDetail.phoneNumber) !== null && _1 !== void 0 ? _1 : '';
    }
    var reportName = (0, ReportUtils_1.getReportName)(report, policy, undefined, undefined, invoiceReceiverPolicy);
    result.text = reportName;
    result.subtitle = subtitle;
    result.participantsList = participantPersonalDetailList;
    result.icons = (0, ReportUtils_1.getIcons)(report, personalDetails, personalDetail === null || personalDetail === void 0 ? void 0 : personalDetail.avatar, personalDetail === null || personalDetail === void 0 ? void 0 : personalDetail.login, (_2 = personalDetail === null || personalDetail === void 0 ? void 0 : personalDetail.accountID) !== null && _2 !== void 0 ? _2 : CONST_1.default.DEFAULT_NUMBER_ID, policy, invoiceReceiverPolicy, isReportArchived);
    result.displayNamesWithTooltips = displayNamesWithTooltips;
    if (status) {
        result.status = status;
    }
    result.type = report.type;
    return result;
}
function getWelcomeMessage(report, policy, participantPersonalDetailList, localeCompare, isReportArchived, reportDetailsLink) {
    if (isReportArchived === void 0) { isReportArchived = false; }
    if (reportDetailsLink === void 0) { reportDetailsLink = ''; }
    var welcomeMessage = {};
    if ((0, ReportUtils_1.isChatThread)(report) || (0, ReportUtils_1.isTaskReport)(report)) {
        return welcomeMessage;
    }
    if ((0, ReportUtils_1.isChatRoom)(report)) {
        return getRoomWelcomeMessage(report, isReportArchived, reportDetailsLink);
    }
    if ((0, ReportUtils_1.isPolicyExpenseChat)(report)) {
        if (policy === null || policy === void 0 ? void 0 : policy.description) {
            welcomeMessage.messageHtml = policy.description;
            welcomeMessage.messageText = Parser_1.default.htmlToText(welcomeMessage.messageHtml);
        }
        else {
            welcomeMessage.messageHtml = (0, Localize_1.translateLocal)('reportActionsView.beginningOfChatHistoryPolicyExpenseChat', {
                submitterDisplayName: (0, ReportUtils_1.getDisplayNameForParticipant)({ accountID: report === null || report === void 0 ? void 0 : report.ownerAccountID }),
                workspaceName: (0, ReportUtils_1.getPolicyName)({ report: report }),
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
    var isMultipleParticipant = participantPersonalDetailList.length > 1;
    var displayNamesWithTooltips = (0, ReportUtils_1.getDisplayNamesWithTooltips)(participantPersonalDetailList, isMultipleParticipant, localeCompare);
    var displayNamesWithTooltipsText = displayNamesWithTooltips
        .map(function (_a, index) {
        var displayName = _a.displayName;
        if (index === displayNamesWithTooltips.length - 1) {
            return "".concat(displayName, ".");
        }
        if (index === displayNamesWithTooltips.length - 2) {
            return "".concat(displayName, " ").concat((0, Localize_1.translateLocal)('common.and'));
        }
        if (index < displayNamesWithTooltips.length - 2) {
            return "".concat(displayName, ",");
        }
        return '';
    })
        .join(' ');
    welcomeMessage.messageText = displayNamesWithTooltips.length ? ensureSingleSpacing("".concat(welcomeMessage.phrase1, " ").concat(displayNamesWithTooltipsText)) : '';
    return welcomeMessage;
}
/**
 * Get welcome message based on room type
 */
function getRoomWelcomeMessage(report, isReportArchived, reportDetailsLink) {
    var _a, _b, _c, _d, _e;
    if (isReportArchived === void 0) { isReportArchived = false; }
    if (reportDetailsLink === void 0) { reportDetailsLink = ''; }
    var welcomeMessage = {};
    var workspaceName = (0, ReportUtils_1.getPolicyName)({ report: report });
    var reportName = (0, ReportUtils_1.getReportName)(report);
    if (report === null || report === void 0 ? void 0 : report.description) {
        welcomeMessage.messageHtml = (0, ReportUtils_1.getReportDescription)(report);
        welcomeMessage.messageText = Parser_1.default.htmlToText(welcomeMessage.messageHtml);
        return welcomeMessage;
    }
    if (isReportArchived) {
        welcomeMessage.messageHtml = (0, Localize_1.translateLocal)('reportActionsView.beginningOfArchivedRoom', { reportName: reportName, reportDetailsLink: reportDetailsLink });
    }
    else if ((0, ReportUtils_1.isDomainRoom)(report)) {
        welcomeMessage.messageHtml = (0, Localize_1.translateLocal)('reportActionsView.beginningOfChatHistoryDomainRoom', { domainRoom: (_a = report === null || report === void 0 ? void 0 : report.reportName) !== null && _a !== void 0 ? _a : '' });
    }
    else if ((0, ReportUtils_1.isAdminRoom)(report)) {
        welcomeMessage.messageHtml = (0, Localize_1.translateLocal)('reportActionsView.beginningOfChatHistoryAdminRoom', { workspaceName: workspaceName });
    }
    else if ((0, ReportUtils_1.isAnnounceRoom)(report)) {
        welcomeMessage.messageHtml = (0, Localize_1.translateLocal)('reportActionsView.beginningOfChatHistoryAnnounceRoom', { workspaceName: workspaceName });
    }
    else if ((0, ReportUtils_1.isInvoiceRoom)(report)) {
        var payer = ((_b = report === null || report === void 0 ? void 0 : report.invoiceReceiver) === null || _b === void 0 ? void 0 : _b.type) === CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.INDIVIDUAL
            ? (0, ReportUtils_1.getDisplayNameForParticipant)({ accountID: (_c = report === null || report === void 0 ? void 0 : report.invoiceReceiver) === null || _c === void 0 ? void 0 : _c.accountID })
            : // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
                // eslint-disable-next-line deprecation/deprecation
                (_e = (0, PolicyUtils_1.getPolicy)((_d = report === null || report === void 0 ? void 0 : report.invoiceReceiver) === null || _d === void 0 ? void 0 : _d.policyID)) === null || _e === void 0 ? void 0 : _e.name;
        var receiver = (0, ReportUtils_1.getPolicyName)({ report: report });
        welcomeMessage.messageHtml = (0, Localize_1.translateLocal)('reportActionsView.beginningOfChatHistoryInvoiceRoom', {
            invoicePayer: payer !== null && payer !== void 0 ? payer : '',
            invoiceReceiver: receiver,
        });
    }
    else {
        // Message for user created rooms or other room types.
        welcomeMessage.messageHtml = (0, Localize_1.translateLocal)('reportActionsView.beginningOfChatHistoryUserRoom', { reportName: reportName, reportDetailsLink: reportDetailsLink });
    }
    welcomeMessage.messageText = Parser_1.default.htmlToText(welcomeMessage.messageHtml);
    return welcomeMessage;
}
exports.default = {
    getOptionData: getOptionData,
    sortReportsToDisplayInLHN: sortReportsToDisplayInLHN,
    categorizeReportsForLHN: categorizeReportsForLHN,
    sortCategorizedReports: sortCategorizedReports,
    combineReportCategories: combineReportCategories,
    getWelcomeMessage: getWelcomeMessage,
    getReasonAndReportActionThatHasRedBrickRoad: getReasonAndReportActionThatHasRedBrickRoad,
    shouldShowRedBrickRoad: shouldShowRedBrickRoad,
    getReportsToDisplayInLHN: getReportsToDisplayInLHN,
    updateReportsToDisplayInLHN: updateReportsToDisplayInLHN,
};
