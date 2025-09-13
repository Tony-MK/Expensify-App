"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recentReportComparator = void 0;
exports.canCreateOptimisticPersonalDetailOption = canCreateOptimisticPersonalDetailOption;
exports.combineOrderingOfReportsAndPersonalDetails = combineOrderingOfReportsAndPersonalDetails;
exports.createOptionFromReport = createOptionFromReport;
exports.createOptionList = createOptionList;
exports.filterAndOrderOptions = filterAndOrderOptions;
exports.filterOptions = filterOptions;
exports.filterReports = filterReports;
exports.filterSelectedOptions = filterSelectedOptions;
exports.filterSelfDMChat = filterSelfDMChat;
exports.filterUserToInvite = filterUserToInvite;
exports.filterWorkspaceChats = filterWorkspaceChats;
exports.filteredPersonalDetailsOfRecentReports = filteredPersonalDetailsOfRecentReports;
exports.formatMemberForList = formatMemberForList;
exports.formatSectionsFromSearchTerm = formatSectionsFromSearchTerm;
exports.getAlternateText = getAlternateText;
exports.getAttendeeOptions = getAttendeeOptions;
exports.getCurrentUserSearchTerms = getCurrentUserSearchTerms;
exports.getEmptyOptions = getEmptyOptions;
exports.getFirstKeyForList = getFirstKeyForList;
exports.getHeaderMessage = getHeaderMessage;
exports.getHeaderMessageForNonUserList = getHeaderMessageForNonUserList;
exports.getIOUConfirmationOptionsFromPayeePersonalDetail = getIOUConfirmationOptionsFromPayeePersonalDetail;
exports.getIOUReportIDOfLastAction = getIOUReportIDOfLastAction;
exports.getIsUserSubmittedExpenseOrScannedReceipt = getIsUserSubmittedExpenseOrScannedReceipt;
exports.getLastActorDisplayName = getLastActorDisplayName;
exports.getLastMessageTextForReport = getLastMessageTextForReport;
exports.getManagerMcTestParticipant = getManagerMcTestParticipant;
exports.getMemberInviteOptions = getMemberInviteOptions;
exports.getParticipantsOption = getParticipantsOption;
exports.getPersonalDetailSearchTerms = getPersonalDetailSearchTerms;
exports.getPersonalDetailsForAccountIDs = getPersonalDetailsForAccountIDs;
exports.getPolicyExpenseReportOption = getPolicyExpenseReportOption;
exports.getReportDisplayOption = getReportDisplayOption;
exports.getReportOption = getReportOption;
exports.getSearchOptions = getSearchOptions;
exports.getSearchValueForPhoneOrEmail = getSearchValueForPhoneOrEmail;
exports.getShareDestinationOptions = getShareDestinationOptions;
exports.getShareLogOptions = getShareLogOptions;
exports.getUserToInviteContactOption = getUserToInviteContactOption;
exports.getUserToInviteOption = getUserToInviteOption;
exports.getValidOptions = getValidOptions;
exports.hasEnabledOptions = hasEnabledOptions;
exports.isCurrentUser = isCurrentUser;
exports.isDisablingOrDeletingLastEnabledCategory = isDisablingOrDeletingLastEnabledCategory;
exports.isDisablingOrDeletingLastEnabledTag = isDisablingOrDeletingLastEnabledTag;
exports.isMakingLastRequiredTagListOptional = isMakingLastRequiredTagListOptional;
exports.isPersonalDetailsReady = isPersonalDetailsReady;
exports.isSearchStringMatch = isSearchStringMatch;
exports.isSearchStringMatchUserDetails = isSearchStringMatchUserDetails;
exports.optionsOrderBy = optionsOrderBy;
exports.orderOptions = orderOptions;
exports.orderPersonalDetailsOptions = orderPersonalDetailsOptions;
exports.orderReportOptions = orderReportOptions;
exports.orderReportOptionsWithSearch = orderReportOptionsWithSearch;
exports.orderWorkspaceOptions = orderWorkspaceOptions;
exports.processReport = processReport;
exports.shallowOptionsListCompare = shallowOptionsListCompare;
exports.shouldOptionShowTooltip = shouldOptionShowTooltip;
exports.shouldShowLastActorDisplayName = shouldShowLastActorDisplayName;
exports.shouldUseBoldText = shouldUseBoldText;
exports.sortAlphabetically = sortAlphabetically;
/* eslint-disable @typescript-eslint/prefer-for-of */
const expensify_common_1 = require("expensify-common");
const deburr_1 = require("lodash/deburr");
const keyBy_1 = require("lodash/keyBy");
const orderBy_1 = require("lodash/orderBy");
const react_native_onyx_1 = require("react-native-onyx");
const Expensicons_1 = require("@components/Icon/Expensicons");
const CategoryUtils_1 = require("@libs/CategoryUtils");
const filterArrayByMatch_1 = require("@libs/filterArrayByMatch");
const isReportMessageAttachment_1 = require("@libs/isReportMessageAttachment");
const LocalePhoneNumber_1 = require("@libs/LocalePhoneNumber");
const Localize_1 = require("@libs/Localize");
const LoginUtils_1 = require("@libs/LoginUtils");
const MaxHeap_1 = require("@libs/MaxHeap");
const MinHeap_1 = require("@libs/MinHeap");
const ModifiedExpenseMessage_1 = require("@libs/ModifiedExpenseMessage");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Parser_1 = require("@libs/Parser");
const Performance_1 = require("@libs/Performance");
const Permissions_1 = require("@libs/Permissions");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const PhoneNumber_1 = require("@libs/PhoneNumber");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const StringUtils_1 = require("@libs/StringUtils");
const TaskUtils_1 = require("@libs/TaskUtils");
const UserUtils_1 = require("@libs/UserUtils");
const Timing_1 = require("@userActions/Timing");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
/**
 * OptionsListUtils is used to build a list options passed to the OptionsList component. Several different UI views can
 * be configured to display different results based on the options passed to the private getOptions() method. Public
 * methods should be named for the views they build options for and then exported for use in a component.
 */
let currentUserLogin;
let currentUserAccountID;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.SESSION,
    callback: (value) => {
        currentUserLogin = value?.email;
        currentUserAccountID = value?.accountID;
    },
});
let loginList;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.LOGIN_LIST,
    callback: (value) => (loginList = (0, EmptyObject_1.isEmptyObject)(value) ? {} : value),
});
let allPersonalDetails;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
    callback: (value) => (allPersonalDetails = (0, EmptyObject_1.isEmptyObject)(value) ? {} : value),
});
const policies = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.POLICY,
    callback: (policy, key) => {
        if (!policy || !key || !policy.name) {
            return;
        }
        policies[key] = policy;
    },
});
let allPolicies = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.POLICY,
    waitForCollectionCallback: true,
    callback: (val) => (allPolicies = val),
});
let allReports;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.REPORT,
    waitForCollectionCallback: true,
    callback: (value) => {
        allReports = value;
    },
});
let allReportNameValuePairs;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS,
    waitForCollectionCallback: true,
    callback: (value) => {
        allReportNameValuePairs = value;
    },
});
const lastReportActions = {};
const allSortedReportActions = {};
let allReportActions;
const lastVisibleReportActions = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
    waitForCollectionCallback: true,
    callback: (actions) => {
        if (!actions) {
            return;
        }
        allReportActions = actions ?? {};
        // Iterate over the report actions to build the sorted and lastVisible report actions objects
        Object.entries(allReportActions).forEach((reportActions) => {
            const reportID = reportActions[0].split('_').at(1);
            if (!reportID) {
                return;
            }
            const reportActionsArray = Object.values(reportActions[1] ?? {});
            let sortedReportActions = (0, ReportActionsUtils_1.getSortedReportActions)(reportActionsArray, true);
            allSortedReportActions[reportID] = sortedReportActions;
            const report = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
            const chatReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.chatReportID}`];
            // If the report is a one-transaction report and has , we need to return the combined reportActions so that the LHN can display modifications
            // to the transaction thread or the report itself
            const transactionThreadReportID = (0, ReportActionsUtils_1.getOneTransactionThreadReportID)(report, chatReport, actions[reportActions[0]]);
            if (transactionThreadReportID) {
                const transactionThreadReportActionsArray = Object.values(actions[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReportID}`] ?? {});
                sortedReportActions = (0, ReportActionsUtils_1.getCombinedReportActions)(sortedReportActions, transactionThreadReportID, transactionThreadReportActionsArray, reportID);
            }
            const firstReportAction = sortedReportActions.at(0);
            if (!firstReportAction) {
                delete lastReportActions[reportID];
            }
            else {
                lastReportActions[reportID] = firstReportAction;
            }
            const isWriteActionAllowed = (0, ReportUtils_1.canUserPerformWriteAction)(report);
            // The report is only visible if it is the last action not deleted that
            // does not match a closed or created state.
            const reportActionsForDisplay = sortedReportActions.filter((reportAction, actionKey) => (0, ReportActionsUtils_1.shouldReportActionBeVisible)(reportAction, actionKey, isWriteActionAllowed) &&
                reportAction.actionName !== CONST_1.default.REPORT.ACTIONS.TYPE.CREATED &&
                reportAction.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
            const reportActionForDisplay = reportActionsForDisplay.at(0);
            if (!reportActionForDisplay) {
                delete lastVisibleReportActions[reportID];
                return;
            }
            lastVisibleReportActions[reportID] = reportActionForDisplay;
        });
    },
});
let activePolicyID;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID,
    callback: (value) => (activePolicyID = value),
});
let nvpDismissedProductTraining;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.NVP_DISMISSED_PRODUCT_TRAINING,
    callback: (value) => (nvpDismissedProductTraining = value),
});
/**
 * Returns the personal details for an array of accountIDs
 * @returns keys of the object are emails, values are PersonalDetails objects.
 */
function getPersonalDetailsForAccountIDs(accountIDs, personalDetails) {
    const personalDetailsForAccountIDs = {};
    if (!personalDetails) {
        return personalDetailsForAccountIDs;
    }
    accountIDs?.forEach((accountID) => {
        const cleanAccountID = Number(accountID);
        if (!cleanAccountID) {
            return;
        }
        let personalDetail = personalDetails[accountID] ?? undefined;
        if (!personalDetail) {
            personalDetail = {};
        }
        if (cleanAccountID === CONST_1.default.ACCOUNT_ID.CONCIERGE) {
            personalDetail.avatar = CONST_1.default.CONCIERGE_ICON_URL;
        }
        personalDetail.accountID = cleanAccountID;
        personalDetailsForAccountIDs[cleanAccountID] = personalDetail;
    });
    return personalDetailsForAccountIDs;
}
/**
 * Return true if personal details data is ready, i.e. report list options can be created.
 */
function isPersonalDetailsReady(personalDetails) {
    const personalDetailsKeys = Object.keys(personalDetails ?? {});
    return personalDetailsKeys.some((key) => personalDetails?.[key]?.accountID);
}
/**
 * Get the participant option for a report.
 */
function getParticipantsOption(participant, personalDetails) {
    const detail = participant.accountID ? getPersonalDetailsForAccountIDs([participant.accountID], personalDetails)[participant.accountID] : undefined;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const login = detail?.login || participant.login || '';
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const displayName = participant?.displayName || (0, LocalePhoneNumber_1.formatPhoneNumber)((0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(detail, login || participant.text));
    return {
        keyForList: String(detail?.accountID ?? login),
        login,
        accountID: detail?.accountID,
        text: displayName,
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        firstName: (detail?.firstName || participant.firstName) ?? '',
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        lastName: (detail?.lastName || participant.lastName) ?? '',
        alternateText: (0, LocalePhoneNumber_1.formatPhoneNumber)(login) || displayName,
        icons: [
            {
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                source: (participant.avatar || detail?.avatar) ?? Expensicons_1.FallbackAvatar,
                name: login,
                type: CONST_1.default.ICON_TYPE_AVATAR,
                id: detail?.accountID,
            },
        ],
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        phoneNumber: (detail?.phoneNumber || participant?.phoneNumber) ?? '',
        isSelected: participant.selected,
        selected: participant.selected, // Keep for backwards compatibility
        searchText: participant.searchText ?? undefined,
    };
}
/**
 * A very optimized method to remove duplicates from an array.
 * Taken from https://stackoverflow.com/a/9229821/9114791
 */
function uniqFast(items) {
    const seenItems = {};
    const result = [];
    let j = 0;
    for (const item of items) {
        if (seenItems[item] !== 1) {
            seenItems[item] = 1;
            result[j++] = item;
        }
    }
    return result;
}
/**
 * Get the last actor display name from last actor details.
 */
function getLastActorDisplayName(lastActorDetails) {
    if (!lastActorDetails) {
        return '';
    }
    return lastActorDetails.accountID !== currentUserAccountID
        ? // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            lastActorDetails.firstName || (0, LocalePhoneNumber_1.formatPhoneNumber)((0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(lastActorDetails))
        : (0, Localize_1.translateLocal)('common.you');
}
/**
 * Should show the last actor display name from last actor details.
 */
function shouldShowLastActorDisplayName(report, lastActorDetails, lastAction) {
    if (!lastActorDetails ||
        (0, ReportUtils_1.isSelfDM)(report) ||
        ((0, ReportUtils_1.isDM)(report) && lastActorDetails.accountID !== currentUserAccountID) ||
        lastAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.IOU ||
        (lastAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW &&
            Object.keys(report?.participants ?? {})?.some((participantID) => participantID === CONST_1.default.ACCOUNT_ID.MANAGER_MCTEST.toString()))) {
        return false;
    }
    const lastActorDisplayName = getLastActorDisplayName(lastActorDetails);
    if (!lastActorDisplayName) {
        return false;
    }
    return true;
}
/**
 * Update alternate text for the option when applicable
 */
function getAlternateText(option, { showChatPreviewLine = false, forcePolicyNamePreview = false }) {
    const report = (0, ReportUtils_1.getReportOrDraftReport)(option.reportID);
    const isAdminRoom = (0, ReportUtils_1.isAdminRoom)(report);
    const isAnnounceRoom = (0, ReportUtils_1.isAnnounceRoom)(report);
    const isGroupChat = (0, ReportUtils_1.isGroupChat)(report);
    const isExpenseThread = (0, ReportUtils_1.isMoneyRequest)(report);
    const formattedLastMessageText = (0, ReportUtils_1.formatReportLastMessageText)(Parser_1.default.htmlToText(option.lastMessageText ?? ''));
    const reportPrefix = (0, ReportUtils_1.getReportSubtitlePrefix)(report);
    const formattedLastMessageTextWithPrefix = reportPrefix + formattedLastMessageText;
    if (isExpenseThread || option.isMoneyRequestReport) {
        return showChatPreviewLine && formattedLastMessageText ? formattedLastMessageTextWithPrefix : (0, Localize_1.translateLocal)('iou.expense');
    }
    if (option.isThread) {
        return showChatPreviewLine && formattedLastMessageText ? formattedLastMessageTextWithPrefix : (0, Localize_1.translateLocal)('threads.thread');
    }
    if (option.isChatRoom && !isAdminRoom && !isAnnounceRoom) {
        return showChatPreviewLine && formattedLastMessageText ? formattedLastMessageTextWithPrefix : option.subtitle;
    }
    if ((option.isPolicyExpenseChat ?? false) || isAdminRoom || isAnnounceRoom) {
        return showChatPreviewLine && !forcePolicyNamePreview && formattedLastMessageText ? formattedLastMessageTextWithPrefix : option.subtitle;
    }
    if (option.isTaskReport) {
        return showChatPreviewLine && formattedLastMessageText ? formattedLastMessageTextWithPrefix : (0, Localize_1.translateLocal)('task.task');
    }
    if (isGroupChat) {
        return showChatPreviewLine && formattedLastMessageText ? formattedLastMessageTextWithPrefix : (0, Localize_1.translateLocal)('common.group');
    }
    return showChatPreviewLine && formattedLastMessageText
        ? formattedLastMessageTextWithPrefix
        : (0, LocalePhoneNumber_1.formatPhoneNumber)(option.participantsList && option.participantsList.length > 0 ? (option.participantsList.at(0)?.login ?? '') : '');
}
/**
 * Searches for a match when provided with a value
 */
function isSearchStringMatch(searchValue, searchText, participantNames = new Set(), isReportChatRoom = false) {
    const searchWords = new Set(searchValue.replace(/,/g, ' ').split(/\s+/));
    const valueToSearch = searchText?.replace(new RegExp(/&nbsp;/g), '');
    let matching = true;
    searchWords.forEach((word) => {
        // if one of the word is not matching, we don't need to check further
        if (!matching) {
            return;
        }
        const matchRegex = new RegExp(expensify_common_1.Str.escapeForRegExp(word), 'i');
        matching = matchRegex.test(valueToSearch ?? '') || (!isReportChatRoom && participantNames.has(word));
    });
    return matching;
}
function isSearchStringMatchUserDetails(personalDetail, searchValue) {
    let memberDetails = '';
    if (personalDetail.login) {
        memberDetails += ` ${personalDetail.login}`;
    }
    if (personalDetail.firstName) {
        memberDetails += ` ${personalDetail.firstName}`;
    }
    if (personalDetail.lastName) {
        memberDetails += ` ${personalDetail.lastName}`;
    }
    if (personalDetail.displayName) {
        memberDetails += ` ${(0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(personalDetail)}`;
    }
    if (personalDetail.phoneNumber) {
        memberDetails += ` ${personalDetail.phoneNumber}`;
    }
    return isSearchStringMatch(searchValue.trim(), memberDetails.toLowerCase());
}
/**
 * Get IOU report ID of report last action if the action is report action preview
 */
function getIOUReportIDOfLastAction(report) {
    if (!report?.reportID) {
        return;
    }
    const lastAction = lastVisibleReportActions[report.reportID];
    if (!(0, ReportActionsUtils_1.isReportPreviewAction)(lastAction)) {
        return;
    }
    return (0, ReportUtils_1.getReportOrDraftReport)((0, ReportActionsUtils_1.getIOUReportIDFromReportActionPreview)(lastAction))?.reportID;
}
function hasHiddenDisplayNames(accountIDs) {
    return (0, PersonalDetailsUtils_1.getPersonalDetailsByIDs)({ accountIDs, currentUserAccountID: 0 }).some((personalDetail) => !(0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(personalDetail, undefined, false));
}
/**
 * Get the last message text from the report directly or from other sources for special cases.
 */
function getLastMessageTextForReport({ report, lastActorDetails, movedFromReport, movedToReport, policy, isReportArchived = false, }) {
    const reportID = report?.reportID;
    const lastReportAction = reportID ? lastVisibleReportActions[reportID] : undefined;
    const lastVisibleMessage = (0, ReportActionsUtils_1.getLastVisibleMessage)(report?.reportID);
    // some types of actions are filtered out for lastReportAction, in some cases we need to check the actual last action
    const lastOriginalReportAction = reportID ? lastReportActions[reportID] : undefined;
    let lastMessageTextFromReport = '';
    if ((0, ReportUtils_1.isArchivedNonExpenseReport)(report, isReportArchived)) {
        const archiveReason = 
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        ((0, ReportActionsUtils_1.isClosedAction)(lastOriginalReportAction) && (0, ReportActionsUtils_1.getOriginalMessage)(lastOriginalReportAction)?.reason) || CONST_1.default.REPORT.ARCHIVE_REASON.DEFAULT;
        switch (archiveReason) {
            case CONST_1.default.REPORT.ARCHIVE_REASON.ACCOUNT_CLOSED:
            case CONST_1.default.REPORT.ARCHIVE_REASON.REMOVED_FROM_POLICY:
            case CONST_1.default.REPORT.ARCHIVE_REASON.POLICY_DELETED: {
                lastMessageTextFromReport = (0, Localize_1.translateLocal)(`reportArchiveReasons.${archiveReason}`, {
                    displayName: (0, LocalePhoneNumber_1.formatPhoneNumber)((0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(lastActorDetails)),
                    policyName: (0, ReportUtils_1.getPolicyName)({ report, policy }),
                });
                break;
            }
            case CONST_1.default.REPORT.ARCHIVE_REASON.BOOKING_END_DATE_HAS_PASSED: {
                lastMessageTextFromReport = (0, Localize_1.translateLocal)(`reportArchiveReasons.${archiveReason}`);
                break;
            }
            default: {
                lastMessageTextFromReport = (0, Localize_1.translateLocal)(`reportArchiveReasons.default`);
            }
        }
    }
    else if ((0, ReportActionsUtils_1.isMoneyRequestAction)(lastReportAction)) {
        const properSchemaForMoneyRequestMessage = (0, ReportUtils_1.getReportPreviewMessage)(report, lastReportAction, true, false, null, true);
        lastMessageTextFromReport = (0, ReportUtils_1.formatReportLastMessageText)(properSchemaForMoneyRequestMessage);
    }
    else if ((0, ReportActionsUtils_1.isReportPreviewAction)(lastReportAction)) {
        const iouReport = (0, ReportUtils_1.getReportOrDraftReport)((0, ReportActionsUtils_1.getIOUReportIDFromReportActionPreview)(lastReportAction));
        const lastIOUMoneyReportAction = iouReport?.reportID
            ? allSortedReportActions[iouReport.reportID]?.find((reportAction, key) => (0, ReportActionsUtils_1.shouldReportActionBeVisible)(reportAction, key, (0, ReportUtils_1.canUserPerformWriteAction)(report, isReportArchived)) &&
                reportAction.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE &&
                (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction))
            : undefined;
        const reportPreviewMessage = (0, ReportUtils_1.getReportPreviewMessage)(!(0, EmptyObject_1.isEmptyObject)(iouReport) ? iouReport : null, lastIOUMoneyReportAction ?? lastReportAction, true, (0, ReportUtils_1.isChatReport)(report), null, true, lastReportAction);
        lastMessageTextFromReport = (0, ReportUtils_1.formatReportLastMessageText)(reportPreviewMessage);
    }
    else if ((0, ReportActionsUtils_1.isReimbursementQueuedAction)(lastReportAction)) {
        lastMessageTextFromReport = (0, ReportUtils_1.getReimbursementQueuedActionMessage)({ reportAction: lastReportAction, reportOrID: report });
    }
    else if ((0, ReportActionsUtils_1.isReimbursementDeQueuedOrCanceledAction)(lastReportAction)) {
        lastMessageTextFromReport = (0, ReportUtils_1.getReimbursementDeQueuedOrCanceledActionMessage)(lastReportAction, report, true);
    }
    else if ((0, ReportActionsUtils_1.isDeletedParentAction)(lastReportAction) && (0, ReportUtils_1.isChatReport)(report)) {
        lastMessageTextFromReport = (0, ReportUtils_1.getDeletedParentActionMessageForChatReport)(lastReportAction);
    }
    else if ((0, ReportActionsUtils_1.isPendingRemove)(lastReportAction) && report?.reportID && (0, ReportActionsUtils_1.isThreadParentMessage)(lastReportAction, report.reportID)) {
        lastMessageTextFromReport = (0, Localize_1.translateLocal)('parentReportAction.hiddenMessage');
    }
    else if ((0, isReportMessageAttachment_1.isReportMessageAttachment)({ text: report?.lastMessageText ?? '', html: report?.lastMessageHtml, type: '' })) {
        lastMessageTextFromReport = `[${(0, Localize_1.translateLocal)('common.attachment')}]`;
    }
    else if ((0, ReportActionsUtils_1.isModifiedExpenseAction)(lastReportAction)) {
        const properSchemaForModifiedExpenseMessage = (0, ModifiedExpenseMessage_1.getForReportAction)({
            reportAction: lastReportAction,
            policyID: report?.policyID,
            movedFromReport,
            movedToReport,
        });
        lastMessageTextFromReport = (0, ReportUtils_1.formatReportLastMessageText)(properSchemaForModifiedExpenseMessage, true);
    }
    else if ((0, ReportActionsUtils_1.isMovedTransactionAction)(lastReportAction)) {
        const movedTransactionOriginalMessage = (0, ReportActionsUtils_1.getOriginalMessage)(lastReportAction) ?? {};
        const { toReportID } = movedTransactionOriginalMessage;
        const toReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${toReportID}`];
        lastMessageTextFromReport = (0, ReportUtils_1.getMovedTransactionMessage)(toReport);
    }
    else if ((0, ReportActionsUtils_1.isTaskAction)(lastReportAction)) {
        lastMessageTextFromReport = (0, ReportUtils_1.formatReportLastMessageText)((0, TaskUtils_1.getTaskReportActionMessage)(lastReportAction).text);
    }
    else if ((0, ReportActionsUtils_1.isCreatedTaskReportAction)(lastReportAction)) {
        lastMessageTextFromReport = (0, TaskUtils_1.getTaskCreatedMessage)(lastReportAction);
    }
    else if ((0, ReportActionsUtils_1.isActionOfType)(lastReportAction, CONST_1.default.REPORT.ACTIONS.TYPE.SUBMITTED) ||
        (0, ReportActionsUtils_1.isActionOfType)(lastReportAction, CONST_1.default.REPORT.ACTIONS.TYPE.SUBMITTED_AND_CLOSED) ||
        (0, ReportActionsUtils_1.isMarkAsClosedAction)(lastReportAction)) {
        const wasSubmittedViaHarvesting = !(0, ReportActionsUtils_1.isMarkAsClosedAction)(lastReportAction) ? ((0, ReportActionsUtils_1.getOriginalMessage)(lastReportAction)?.harvesting ?? false) : false;
        if (wasSubmittedViaHarvesting) {
            lastMessageTextFromReport = (0, Localize_1.translateLocal)('iou.automaticallySubmitted');
        }
        else {
            lastMessageTextFromReport = (0, Localize_1.translateLocal)('iou.submitted', { memo: (0, ReportActionsUtils_1.getOriginalMessage)(lastReportAction)?.message });
        }
    }
    else if ((0, ReportActionsUtils_1.isActionOfType)(lastReportAction, CONST_1.default.REPORT.ACTIONS.TYPE.APPROVED)) {
        const { automaticAction } = (0, ReportActionsUtils_1.getOriginalMessage)(lastReportAction) ?? {};
        if (automaticAction) {
            lastMessageTextFromReport = (0, Localize_1.translateLocal)('iou.automaticallyApproved');
        }
        else {
            lastMessageTextFromReport = (0, Localize_1.translateLocal)('iou.approvedMessage');
        }
    }
    else if ((0, ReportActionsUtils_1.isUnapprovedAction)(lastReportAction)) {
        lastMessageTextFromReport = (0, Localize_1.translateLocal)('iou.unapproved');
    }
    else if ((0, ReportActionsUtils_1.isActionOfType)(lastReportAction, CONST_1.default.REPORT.ACTIONS.TYPE.FORWARDED)) {
        const { automaticAction } = (0, ReportActionsUtils_1.getOriginalMessage)(lastReportAction) ?? {};
        if (automaticAction) {
            lastMessageTextFromReport = (0, Localize_1.translateLocal)('iou.automaticallyForwarded');
        }
        else {
            lastMessageTextFromReport = (0, Localize_1.translateLocal)('iou.forwarded');
        }
    }
    else if (lastReportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.REJECTED) {
        lastMessageTextFromReport = (0, ReportUtils_1.getRejectedReportMessage)();
    }
    else if (lastReportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.CORPORATE_UPGRADE) {
        lastMessageTextFromReport = (0, ReportUtils_1.getUpgradeWorkspaceMessage)();
    }
    else if (lastReportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.TEAM_DOWNGRADE) {
        lastMessageTextFromReport = (0, ReportUtils_1.getDowngradeWorkspaceMessage)();
    }
    else if ((0, ReportActionsUtils_1.isActionableAddPaymentCard)(lastReportAction)) {
        lastMessageTextFromReport = (0, ReportActionsUtils_1.getReportActionMessageText)(lastReportAction);
    }
    else if (lastReportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.EXPORTED_TO_INTEGRATION) {
        lastMessageTextFromReport = (0, ReportActionsUtils_1.getExportIntegrationLastMessageText)(lastReportAction);
    }
    else if (lastReportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.RECEIPT_SCAN_FAILED) {
        lastMessageTextFromReport = (0, ReportActionsUtils_1.getReceiptScanFailedMessage)();
    }
    else if (lastReportAction?.actionName && (0, ReportActionsUtils_1.isOldDotReportAction)(lastReportAction)) {
        lastMessageTextFromReport = (0, ReportActionsUtils_1.getMessageOfOldDotReportAction)(lastReportAction, false);
    }
    else if ((0, ReportActionsUtils_1.isActionableJoinRequest)(lastReportAction)) {
        lastMessageTextFromReport = (0, ReportActionsUtils_1.getJoinRequestMessage)(lastReportAction);
    }
    else if (lastReportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.ROOM_CHANGE_LOG.LEAVE_ROOM) {
        lastMessageTextFromReport = (0, ReportActionsUtils_1.getLeaveRoomMessage)();
    }
    else if (lastReportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.RESOLVED_DUPLICATES) {
        lastMessageTextFromReport = (0, Localize_1.translateLocal)('violations.resolvedDuplicates');
    }
    else if ((0, ReportActionsUtils_1.isActionOfType)(lastReportAction, CONST_1.default.REPORT.ACTIONS.TYPE.ROOM_CHANGE_LOG.UPDATE_ROOM_DESCRIPTION)) {
        lastMessageTextFromReport = (0, ReportActionsUtils_1.getUpdateRoomDescriptionMessage)(lastReportAction);
    }
    else if ((0, ReportActionsUtils_1.isActionOfType)(lastReportAction, CONST_1.default.REPORT.ACTIONS.TYPE.RETRACTED)) {
        lastMessageTextFromReport = (0, ReportActionsUtils_1.getRetractedMessage)();
    }
    else if ((0, ReportActionsUtils_1.isActionOfType)(lastReportAction, CONST_1.default.REPORT.ACTIONS.TYPE.REOPENED)) {
        lastMessageTextFromReport = (0, ReportActionsUtils_1.getReopenedMessage)();
    }
    else if ((0, ReportActionsUtils_1.isActionOfType)(lastReportAction, CONST_1.default.REPORT.ACTIONS.TYPE.CHANGE_POLICY)) {
        lastMessageTextFromReport = (0, ReportUtils_1.getPolicyChangeMessage)(lastReportAction);
    }
    else if ((0, ReportActionsUtils_1.isActionOfType)(lastReportAction, CONST_1.default.REPORT.ACTIONS.TYPE.TRAVEL_UPDATE)) {
        lastMessageTextFromReport = (0, ReportActionsUtils_1.getTravelUpdateMessage)(lastReportAction);
    }
    else if ((0, ReportActionsUtils_1.isInviteOrRemovedAction)(lastReportAction)) {
        lastMessageTextFromReport = (0, ReportActionsUtils_1.getRoomChangeLogMessage)(lastReportAction);
    }
    else if ((0, ReportActionsUtils_1.isRenamedAction)(lastReportAction)) {
        lastMessageTextFromReport = (0, ReportActionsUtils_1.getRenamedAction)(lastReportAction, (0, ReportUtils_1.isExpenseReport)(report));
    }
    else if ((0, ReportActionsUtils_1.isActionOfType)(lastReportAction, CONST_1.default.REPORT.ACTIONS.TYPE.DELETED_TRANSACTION)) {
        lastMessageTextFromReport = (0, ReportUtils_1.getDeletedTransactionMessage)(lastReportAction);
    }
    else if ((0, ReportActionsUtils_1.isActionOfType)(lastReportAction, CONST_1.default.REPORT.ACTIONS.TYPE.TAKE_CONTROL) || (0, ReportActionsUtils_1.isActionOfType)(lastReportAction, CONST_1.default.REPORT.ACTIONS.TYPE.REROUTE)) {
        lastMessageTextFromReport = (0, ReportActionsUtils_1.getChangedApproverActionMessage)(lastReportAction);
    }
    else if ((0, ReportActionsUtils_1.isMovedAction)(lastReportAction)) {
        lastMessageTextFromReport = (0, ReportUtils_1.getMovedActionMessage)(lastReportAction, report);
    }
    // we do not want to show report closed in LHN for non archived report so use getReportLastMessage as fallback instead of lastMessageText from report
    if (reportID &&
        !isReportArchived &&
        (report.lastActionType === CONST_1.default.REPORT.ACTIONS.TYPE.CLOSED || (lastOriginalReportAction?.reportActionID && (0, ReportActionsUtils_1.isDeletedAction)(lastOriginalReportAction)))) {
        return lastMessageTextFromReport || ((0, ReportUtils_1.getReportLastMessage)(reportID, undefined, isReportArchived).lastMessageText ?? '');
    }
    // When the last report action has unknown mentions (@Hidden), we want to consistently show @Hidden in LHN and report screen
    // so we reconstruct the last message text of the report from the last report action.
    if (!lastMessageTextFromReport && lastReportAction && hasHiddenDisplayNames((0, ReportActionsUtils_1.getMentionedAccountIDsFromAction)(lastReportAction))) {
        lastMessageTextFromReport = Parser_1.default.htmlToText((0, ReportActionsUtils_1.getReportActionHtml)(lastReportAction));
    }
    // If the last report action is a pending moderation action, get the last message text from the last visible report action
    if (reportID && !lastMessageTextFromReport && (0, ReportActionsUtils_1.isPendingRemove)(lastOriginalReportAction)) {
        lastMessageTextFromReport = (0, ReportActionsUtils_1.getReportActionMessageText)(lastReportAction);
    }
    if (reportID && !lastMessageTextFromReport && lastReportAction) {
        const chatReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.chatReportID}`];
        // If the report is a one-transaction report, get the last message text from combined report actions so the LHN can display modifications to the transaction thread or the report itself
        const transactionThreadReportID = (0, ReportActionsUtils_1.getOneTransactionThreadReportID)(report, chatReport, allSortedReportActions[reportID]);
        if (transactionThreadReportID) {
            lastMessageTextFromReport = (0, ReportActionsUtils_1.getReportActionMessageText)(lastReportAction);
        }
    }
    // If the last action is AddComment and no last message text was determined yet, use getLastVisibleMessage to get the preview text
    if (reportID && !lastMessageTextFromReport && (0, ReportActionsUtils_1.isAddCommentAction)(lastReportAction)) {
        lastMessageTextFromReport = lastVisibleMessage?.lastMessageText;
    }
    return lastMessageTextFromReport || (report?.lastMessageText ?? '');
}
/**
 * Creates a report list option - optimized for SearchOption context
 */
function createOption(accountIDs, personalDetails, report, config, reportAttributesDerived, transactions) {
    const { showChatPreviewLine = false, forcePolicyNamePreview = false, showPersonalDetails = false, selected, isSelected, isDisabled } = config ?? {};
    // Initialize only the properties that are actually used in SearchOption context
    const result = {
        // Core identification - used in SearchOption context
        // We use empty string as a default for reportID as in many places the application uses conditional checks that test for reportID existence with truthiness operators
        // eslint-disable-next-line rulesdir/no-default-id-values
        reportID: report?.reportID ?? '',
        accountID: 0, // Set conditionally below
        login: undefined, // Set conditionally below
        policyID: report?.policyID,
        ownerAccountID: report?.ownerAccountID,
        // Display properties - used in SearchOption context
        text: undefined, // Set below
        alternateText: undefined, // Set below
        participantsList: undefined, // Set below
        // State properties - used in SearchOption context
        isSelected: isSelected ?? selected ?? false, // Use isSelected preferentially, fallback to selected for compatibility
        isDisabled,
        brickRoadIndicator: null,
        // Type/category flags - used in SearchOption context
        isPolicyExpenseChat: report ? (0, ReportUtils_1.isPolicyExpenseChat)(report) : false,
        isMoneyRequestReport: report ? (0, ReportUtils_1.isMoneyRequestReport)(report) : false,
        isThread: report ? (0, ReportUtils_1.isChatThread)(report) : false,
        isTaskReport: report ? (0, ReportUtils_1.isTaskReport)(report) : false,
        isSelfDM: report ? (0, ReportUtils_1.isSelfDM)(report) : false,
        isChatRoom: report ? (0, ReportUtils_1.isChatRoom)(report) : false,
        isInvoiceRoom: report ? (0, ReportUtils_1.isInvoiceRoom)(report) : false,
        // Status properties - used in SearchOption context
        private_isArchived: undefined, // Set from reportNameValuePairs below
        lastVisibleActionCreated: report?.lastVisibleActionCreated,
        notificationPreference: report ? (0, ReportUtils_1.getReportNotificationPreference)(report) : undefined,
        lastMessageText: report?.lastMessageText ?? '',
        // Display properties needed for UI rendering
        icons: undefined, // Set below - needed for avatars
        subtitle: undefined, // Set below - needed for display
        keyForList: undefined, // Set below - needed for React keys
        // Legacy property kept for backwards compatibility
        selected: isSelected ?? selected ?? false, // Duplicate of isSelected for backwards compatibility
    };
    const personalDetailMap = getPersonalDetailsForAccountIDs(accountIDs, personalDetails);
    const personalDetailList = Object.values(personalDetailMap).filter((details) => !!details);
    const personalDetail = personalDetailList.at(0);
    let hasMultipleParticipants = personalDetailList.length > 1;
    let subtitle;
    let reportName;
    result.participantsList = personalDetailList;
    if (report) {
        const reportNameValuePairs = allReportNameValuePairs?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report.reportID}`];
        // Set properties that are used in SearchOption context
        result.private_isArchived = reportNameValuePairs?.private_isArchived;
        result.keyForList = String(report.reportID);
        // Set lastMessageText - use archived message if report is archived, otherwise use report's lastMessageText
        if (result.private_isArchived) {
            result.lastMessageText = (0, Localize_1.translateLocal)('reportArchiveReasons.default');
        }
        else {
            result.lastMessageText = report.lastMessageText ?? '';
        }
        // Type/category flags already set in initialization above, but update brickRoadIndicator
        const reportAttribute = reportAttributesDerived?.[report.reportID];
        result.allReportErrors = reportAttribute?.reportErrors ?? {};
        result.brickRoadIndicator = !(0, EmptyObject_1.isEmptyObject)(result.allReportErrors) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : (reportAttribute?.brickRoadStatus ?? '');
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- below is a boolean expression
        hasMultipleParticipants = personalDetailList.length > 1 || result.isChatRoom || result.isPolicyExpenseChat || (0, ReportUtils_1.isGroupChat)(report);
        subtitle = (0, ReportUtils_1.getChatRoomSubtitle)(report, true, !!result.private_isArchived);
        // If displaying chat preview line is needed, let's overwrite the default alternate text
        result.alternateText = showPersonalDetails && personalDetail?.login ? personalDetail.login : getAlternateText(result, { showChatPreviewLine, forcePolicyNamePreview });
        reportName = showPersonalDetails
            ? (0, ReportUtils_1.getDisplayNameForParticipant)({ accountID: accountIDs.at(0) }) || (0, LocalePhoneNumber_1.formatPhoneNumber)(personalDetail?.login ?? '')
            : (0, ReportUtils_1.getReportName)(report, undefined, undefined, undefined, undefined, undefined, transactions);
    }
    else {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        reportName = (0, ReportUtils_1.getDisplayNameForParticipant)({ accountID: accountIDs.at(0) }) || (0, LocalePhoneNumber_1.formatPhoneNumber)(personalDetail?.login ?? '');
        result.keyForList = String(accountIDs.at(0));
        result.alternateText = (0, LocalePhoneNumber_1.formatPhoneNumber)(personalDetails?.[accountIDs[0]]?.login ?? '');
    }
    // Set core display properties that are used in SearchOption context
    result.text = reportName;
    result.icons = (0, ReportUtils_1.getIcons)(report, personalDetails, personalDetail?.avatar, personalDetail?.login, personalDetail?.accountID, null, undefined, !!result?.private_isArchived);
    result.subtitle = subtitle;
    // Set login and accountID only for single participant cases (used in SearchOption context)
    if (!hasMultipleParticipants && (!report || (report && !(0, ReportUtils_1.isGroupChat)(report) && !(0, ReportUtils_1.isChatRoom)(report)))) {
        result.login = personalDetail?.login;
        result.accountID = Number(personalDetail?.accountID);
    }
    return result;
}
/**
 * Get the option for a given report.
 */
function getReportOption(participant, reportAttributesDerived) {
    const report = (0, ReportUtils_1.getReportOrDraftReport)(participant.reportID);
    const visibleParticipantAccountIDs = (0, ReportUtils_1.getParticipantsAccountIDsForDisplay)(report, true);
    const option = createOption(visibleParticipantAccountIDs, allPersonalDetails ?? {}, !(0, EmptyObject_1.isEmptyObject)(report) ? report : undefined, {
        showChatPreviewLine: false,
        forcePolicyNamePreview: false,
    }, reportAttributesDerived);
    // Update text & alternateText because createOption returns workspace name only if report is owned by the user
    if (option.isSelfDM) {
        option.alternateText = (0, Localize_1.translateLocal)('reportActionsView.yourSpace');
    }
    else if (option.isInvoiceRoom) {
        option.text = (0, ReportUtils_1.getReportName)(report);
        option.alternateText = (0, Localize_1.translateLocal)('workspace.common.invoices');
    }
    else {
        option.text = (0, ReportUtils_1.getPolicyName)({ report });
        option.alternateText = (0, Localize_1.translateLocal)('workspace.common.workspace');
        if (report?.policyID) {
            const policy = allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${report.policyID}`];
            const submitToAccountID = (0, PolicyUtils_1.getSubmitToAccountID)(policy, report);
            const submitsToAccountDetails = allPersonalDetails?.[submitToAccountID];
            const subtitle = submitsToAccountDetails?.displayName ?? submitsToAccountDetails?.login;
            if (subtitle) {
                option.alternateText = (0, Localize_1.translateLocal)('iou.submitsTo', { name: subtitle ?? '' });
            }
        }
    }
    option.isDisabled = (0, ReportUtils_1.isDraftReport)(participant.reportID);
    option.isSelected = participant.selected;
    option.selected = participant.selected; // Keep for backwards compatibility
    option.brickRoadIndicator = null;
    return option;
}
/**
 * Get the display option for a given report.
 */
function getReportDisplayOption(report, unknownUserDetails, reportAttributesDerived) {
    const visibleParticipantAccountIDs = (0, ReportUtils_1.getParticipantsAccountIDsForDisplay)(report, true);
    const option = createOption(visibleParticipantAccountIDs, allPersonalDetails ?? {}, !(0, EmptyObject_1.isEmptyObject)(report) ? report : undefined, {
        showChatPreviewLine: false,
        forcePolicyNamePreview: false,
    }, reportAttributesDerived);
    // Update text & alternateText because createOption returns workspace name only if report is owned by the user
    if (option.isSelfDM) {
        option.alternateText = (0, Localize_1.translateLocal)('reportActionsView.yourSpace');
    }
    else if (option.isInvoiceRoom) {
        option.text = (0, ReportUtils_1.getReportName)(report);
        option.alternateText = (0, Localize_1.translateLocal)('workspace.common.invoices');
    }
    else if (unknownUserDetails) {
        option.text = unknownUserDetails.text ?? unknownUserDetails.login;
        option.alternateText = unknownUserDetails.login;
        option.participantsList = [{ ...unknownUserDetails, displayName: unknownUserDetails.login, accountID: unknownUserDetails.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID }];
    }
    else if (report?.ownerAccountID !== 0 || !option.text) {
        option.text = (0, ReportUtils_1.getPolicyName)({ report });
        option.alternateText = (0, Localize_1.translateLocal)('workspace.common.workspace');
    }
    option.isDisabled = true;
    option.isSelected = false;
    option.selected = false; // Keep for backwards compatibility
    return option;
}
/**
 * Get the option for a policy expense report.
 */
function getPolicyExpenseReportOption(participant, reportAttributesDerived) {
    const expenseReport = (0, ReportUtils_1.isPolicyExpenseChat)(participant) ? (0, ReportUtils_1.getReportOrDraftReport)(participant.reportID) : null;
    const visibleParticipantAccountIDs = Object.entries(expenseReport?.participants ?? {})
        .filter(([, reportParticipant]) => reportParticipant && !(0, ReportUtils_1.isHiddenForCurrentUser)(reportParticipant.notificationPreference))
        .map(([accountID]) => Number(accountID));
    const option = createOption(visibleParticipantAccountIDs, allPersonalDetails ?? {}, !(0, EmptyObject_1.isEmptyObject)(expenseReport) ? expenseReport : null, {
        showChatPreviewLine: false,
        forcePolicyNamePreview: false,
    }, reportAttributesDerived);
    // Update text & alternateText because createOption returns workspace name only if report is owned by the user
    option.text = (0, ReportUtils_1.getPolicyName)({ report: expenseReport });
    option.alternateText = (0, Localize_1.translateLocal)('workspace.common.workspace');
    option.isSelected = participant.selected;
    option.selected = participant.selected; // Keep for backwards compatibility
    return option;
}
/**
 * Checks if the given userDetails is currentUser or not.
 * Note: We can't migrate this off of using logins because this is used to check if you're trying to start a chat with
 * yourself or a different user, and people won't be starting new chats via accountID usually.
 */
function isCurrentUser(userDetails) {
    if (!userDetails) {
        return false;
    }
    // If user login is a mobile number, append sms domain if not appended already.
    const userDetailsLogin = (0, PhoneNumber_1.addSMSDomainIfPhoneNumber)(userDetails.login ?? '');
    if (currentUserLogin?.toLowerCase() === userDetailsLogin.toLowerCase()) {
        return true;
    }
    // Check if userDetails login exists in loginList
    return Object.keys(loginList ?? {}).some((login) => login.toLowerCase() === userDetailsLogin.toLowerCase());
}
function isDisablingOrDeletingLastEnabledCategory(policy, policyCategories, selectedCategories) {
    const enabledCategoriesCount = (0, CategoryUtils_1.getEnabledCategoriesCount)(policyCategories);
    if (!enabledCategoriesCount) {
        return false;
    }
    if (policy?.requiresCategory && selectedCategories.filter((selectedCategory) => selectedCategory?.enabled).length === enabledCategoriesCount) {
        return true;
    }
    return false;
}
function isDisablingOrDeletingLastEnabledTag(policyTagList, selectedTags) {
    const enabledTagsCount = (0, PolicyUtils_1.getCountOfEnabledTagsOfList)(policyTagList?.tags);
    if (!enabledTagsCount) {
        return false;
    }
    if (policyTagList?.required && selectedTags.filter((selectedTag) => selectedTag?.enabled).length === enabledTagsCount) {
        return true;
    }
    return false;
}
function isMakingLastRequiredTagListOptional(policy, policyTags, selectedTagLists) {
    const requiredTagsCount = (0, PolicyUtils_1.getCountOfRequiredTagLists)(policyTags);
    if (!requiredTagsCount) {
        return false;
    }
    if (policy?.requiresTag && selectedTagLists.filter((selectedTagList) => selectedTagList?.required).length === requiredTagsCount) {
        return true;
    }
    return false;
}
function getSearchValueForPhoneOrEmail(searchTerm, countryCode) {
    const parsedPhoneNumber = (0, PhoneNumber_1.parsePhoneNumber)((0, LoginUtils_1.appendCountryCodeWithCountryCode)(expensify_common_1.Str.removeSMSDomain(searchTerm), countryCode ?? 1));
    return parsedPhoneNumber.possible ? (parsedPhoneNumber.number?.e164 ?? '') : searchTerm.toLowerCase();
}
/**
 * Verifies that there is at least one enabled option
 */
function hasEnabledOptions(options) {
    return Object.values(options).some((option) => option.enabled && option.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
}
/**
 * Checks if a report option is selected based on matching accountID or reportID.
 *
 * @param reportOption - The report option to be checked.
 * @param selectedOptions - Array of selected options to compare with.
 * @returns true if the report option matches any of the selected options by accountID or reportID, false otherwise.
 */
function isReportSelected(reportOption, selectedOptions) {
    if (!selectedOptions || selectedOptions.length === 0) {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return selectedOptions.some((option) => (option.accountID && option.accountID === reportOption.accountID) || (option.reportID && option.reportID === reportOption.reportID));
}
function processReport(report, personalDetails, reportAttributesDerived, transactions) {
    if (!report) {
        return { reportOption: null };
    }
    const isOneOnOneChat = (0, ReportUtils_1.isOneOnOneChat)(report);
    const accountIDs = (0, ReportUtils_1.getParticipantsAccountIDsForDisplay)(report);
    const isChatRoom = (0, ReportUtils_1.isChatRoom)(report);
    if ((!accountIDs || accountIDs.length === 0) && !isChatRoom) {
        return { reportOption: null };
    }
    // Determine if this report should be mapped to a personal detail
    const reportMapEntry = accountIDs.length <= 1 && isOneOnOneChat ? [accountIDs.at(0), report] : undefined;
    return {
        reportMapEntry,
        reportOption: {
            item: report,
            ...createOption(accountIDs, personalDetails, report, undefined, reportAttributesDerived, transactions),
        },
    };
}
function createOptionList(personalDetails, reports, reportAttributesDerived) {
    const reportMapForAccountIDs = {};
    const allReportOptions = [];
    if (reports) {
        Object.values(reports).forEach((report) => {
            const { reportMapEntry, reportOption } = processReport(report, personalDetails, reportAttributesDerived);
            if (reportMapEntry) {
                const [accountID, reportValue] = reportMapEntry;
                reportMapForAccountIDs[accountID] = reportValue;
            }
            if (reportOption) {
                allReportOptions.push(reportOption);
            }
        });
    }
    const allPersonalDetailsOptions = Object.values(personalDetails ?? {}).map((personalDetail) => ({
        item: personalDetail,
        ...createOption([personalDetail?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID], personalDetails, reportMapForAccountIDs[personalDetail?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID], {
            showPersonalDetails: true,
        }, reportAttributesDerived),
    }));
    return {
        reports: allReportOptions,
        personalDetails: allPersonalDetailsOptions,
    };
}
function createOptionFromReport(report, personalDetails, reportAttributesDerived) {
    const accountIDs = (0, ReportUtils_1.getParticipantsAccountIDsForDisplay)(report);
    return {
        item: report,
        ...createOption(accountIDs, personalDetails, report, undefined, reportAttributesDerived),
    };
}
function orderPersonalDetailsOptions(options) {
    // PersonalDetails should be ordered Alphabetically by default - https://github.com/Expensify/App/issues/8220#issuecomment-1104009435
    return (0, orderBy_1.default)(options, [(personalDetail) => personalDetail.text?.toLowerCase()], 'asc');
}
/**
 * Orders report options without grouping them by kind.
 * Usually used when there is no search value
 */
function orderReportOptions(options) {
    return (0, orderBy_1.default)(options, [sortComparatorReportOptionByArchivedStatus, sortComparatorReportOptionByDate], ['asc', 'desc']);
}
/**
 * Sort personal details by displayName or login in alphabetical order
 */
const personalDetailsComparator = (personalDetail) => {
    const name = personalDetail.text ?? personalDetail.alternateText ?? personalDetail.login ?? '';
    return name.toLowerCase();
};
/**
 * Sort reports by archived status and last visible action
 */
const recentReportComparator = (option) => {
    return `${option.private_isArchived ? 0 : 1}_${option.lastVisibleActionCreated ?? ''}`;
};
exports.recentReportComparator = recentReportComparator;
/**
 * Sort options by a given comparator and return first sorted options.
 * Function uses a min heap to efficiently get the first sorted options.
 */
function optionsOrderBy(options, comparator, limit, filter, reversed = false) {
    Timing_1.default.start(CONST_1.default.TIMING.SEARCH_MOST_RECENT_OPTIONS);
    const heap = reversed ? new MaxHeap_1.MaxHeap(comparator) : new MinHeap_1.MinHeap(comparator);
    options.forEach((option) => {
        if (filter && !filter(option)) {
            return;
        }
        if (limit && heap.size() >= limit) {
            const peekedValue = heap.peek();
            if (!peekedValue) {
                throw new Error('Heap is empty, cannot peek value');
            }
            if (comparator(option) > comparator(peekedValue)) {
                heap.pop();
                heap.push(option);
            }
        }
        else {
            heap.push(option);
        }
    });
    Timing_1.default.end(CONST_1.default.TIMING.SEARCH_MOST_RECENT_OPTIONS);
    return [...heap].reverse();
}
/**
 * Ordering for report options when you have a search value, will order them by kind additionally.
 * @param options - list of options to be sorted
 * @param searchValue - search string
 * @returns a sorted list of options
 */
function orderReportOptionsWithSearch(options, searchValue, { preferChatRoomsOverThreads = false, preferPolicyExpenseChat = false, preferRecentExpenseReports = false } = {}) {
    const orderedByDate = orderReportOptions(options);
    return (0, orderBy_1.default)(orderedByDate, [
        // Sorting by kind:
        (option) => {
            if (option.isPolicyExpenseChat && preferPolicyExpenseChat && option.policyID === activePolicyID) {
                return 0;
            }
            if (option.isSelfDM) {
                return -1;
            }
            if (preferRecentExpenseReports && !!option?.lastIOUCreationDate) {
                return 1;
            }
            if (preferRecentExpenseReports && option.isPolicyExpenseChat) {
                return 1;
            }
            if (preferChatRoomsOverThreads && option.isThread) {
                return 4;
            }
            if (!!option.isChatRoom || option.private_isArchived) {
                return 3;
            }
            if (!option.login) {
                return 2;
            }
            if (option.login.toLowerCase() !== searchValue?.toLowerCase()) {
                return 1;
            }
            // When option.login is an exact match with the search value, returning 0 puts it at the top of the option list
            return 0;
        },
        // For Submit Expense flow, prioritize the most recent expense reports and then policy expense chats (without expense requests)
        preferRecentExpenseReports ? (option) => option?.lastIOUCreationDate ?? '' : '',
        preferRecentExpenseReports ? (option) => option?.isPolicyExpenseChat : 0,
    ], ['asc', 'desc', 'desc']);
}
function orderWorkspaceOptions(options) {
    return options.sort((a, b) => {
        // Check if `a` is the default workspace
        if (a.isPolicyExpenseChat && a.policyID === activePolicyID) {
            return -1;
        }
        // Check if `b` is the default workspace
        if (b.isPolicyExpenseChat && b.policyID === activePolicyID) {
            return 1;
        }
        return 0;
    });
}
function sortComparatorReportOptionByArchivedStatus(option) {
    return option.private_isArchived ? 1 : 0;
}
function sortComparatorReportOptionByDate(options) {
    // If there is no date (ie. a personal detail option), the option will be sorted to the bottom
    // (comparing a dateString > '' returns true, and we are sorting descending, so the dateString will come before '')
    return options.lastVisibleActionCreated ?? '';
}
function orderOptions(options, searchValue, config) {
    let orderedReportOptions;
    if (searchValue) {
        orderedReportOptions = orderReportOptionsWithSearch(options.recentReports, searchValue, config);
    }
    else {
        orderedReportOptions = orderReportOptions(options.recentReports);
    }
    const orderedPersonalDetailsOptions = orderPersonalDetailsOptions(options.personalDetails);
    const orderedWorkspaceChats = orderWorkspaceOptions(options?.workspaceChats ?? []);
    return {
        recentReports: orderedReportOptions,
        personalDetails: orderedPersonalDetailsOptions,
        workspaceChats: orderedWorkspaceChats,
    };
}
function canCreateOptimisticPersonalDetailOption({ recentReportOptions, personalDetailsOptions, currentUserOption, searchValue, }) {
    if (recentReportOptions.length + personalDetailsOptions.length > 0) {
        return false;
    }
    if (!currentUserOption) {
        return true;
    }
    return currentUserOption.login !== (0, PhoneNumber_1.addSMSDomainIfPhoneNumber)(searchValue ?? '').toLowerCase() && currentUserOption.login !== searchValue?.toLowerCase();
}
/**
 * We create a new user option if the following conditions are satisfied:
 * - There's no matching recent report and personal detail option
 * - The searchValue is a valid email or phone number
 * - If prop shouldAcceptName = true, the searchValue can be also a normal string
 * - The searchValue isn't the current personal detail login
 */
function getUserToInviteOption({ searchValue, loginsToExclude = {}, selectedOptions = [], showChatPreviewLine = false, shouldAcceptName = false, }) {
    if (!searchValue) {
        return null;
    }
    const parsedPhoneNumber = (0, PhoneNumber_1.parsePhoneNumber)((0, LoginUtils_1.appendCountryCode)(expensify_common_1.Str.removeSMSDomain(searchValue)));
    const isCurrentUserLogin = isCurrentUser({ login: searchValue });
    const isInSelectedOption = selectedOptions.some((option) => 'login' in option && option.login === searchValue);
    const isValidEmail = expensify_common_1.Str.isValidEmail(searchValue) && !expensify_common_1.Str.isDomainEmail(searchValue) && !expensify_common_1.Str.endsWith(searchValue, CONST_1.default.SMS.DOMAIN);
    const isValidPhoneNumber = parsedPhoneNumber.possible && expensify_common_1.Str.isValidE164Phone((0, LoginUtils_1.getPhoneNumberWithoutSpecialChars)(parsedPhoneNumber.number?.input ?? ''));
    const isInOptionToExclude = loginsToExclude[(0, PhoneNumber_1.addSMSDomainIfPhoneNumber)(searchValue).toLowerCase()];
    if (isCurrentUserLogin || isInSelectedOption || (!isValidEmail && !isValidPhoneNumber && !shouldAcceptName) || isInOptionToExclude) {
        return null;
    }
    // Generates an optimistic account ID for new users not yet saved in Onyx
    const optimisticAccountID = (0, UserUtils_1.generateAccountID)(searchValue);
    const personalDetailsExtended = {
        ...allPersonalDetails,
        [optimisticAccountID]: {
            accountID: optimisticAccountID,
            login: searchValue,
        },
    };
    const userToInvite = createOption([optimisticAccountID], personalDetailsExtended, null, {
        showChatPreviewLine,
    });
    userToInvite.isOptimisticAccount = true;
    userToInvite.login = isValidEmail || isValidPhoneNumber ? searchValue : '';
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    userToInvite.text = userToInvite.text || searchValue;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    userToInvite.alternateText = userToInvite.alternateText || searchValue;
    // If user doesn't exist, use a fallback avatar
    userToInvite.icons = [
        {
            source: Expensicons_1.FallbackAvatar,
            id: optimisticAccountID,
            name: searchValue,
            type: CONST_1.default.ICON_TYPE_AVATAR,
        },
    ];
    return userToInvite;
}
function getUserToInviteContactOption({ searchValue = '', optionsToExclude = [], selectedOptions = [], firstName = '', lastName = '', email = '', phone = '', avatar = '', }) {
    // If email is provided, use it as the primary identifier
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const effectiveSearchValue = email || searchValue;
    // Handle phone number parsing for either provided phone or searchValue
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const phoneToCheck = phone || searchValue;
    const parsedPhoneNumber = (0, PhoneNumber_1.parsePhoneNumber)((0, LoginUtils_1.appendCountryCode)(expensify_common_1.Str.removeSMSDomain(phoneToCheck)));
    const isCurrentUserLogin = isCurrentUser({ login: effectiveSearchValue });
    const isInSelectedOption = selectedOptions.some((option) => 'login' in option && option.login === effectiveSearchValue);
    // Validate email (either provided email or searchValue)
    const isValidEmail = expensify_common_1.Str.isValidEmail(effectiveSearchValue) && !expensify_common_1.Str.isDomainEmail(effectiveSearchValue) && !expensify_common_1.Str.endsWith(effectiveSearchValue, CONST_1.default.SMS.DOMAIN);
    const isValidPhoneNumber = parsedPhoneNumber.possible && expensify_common_1.Str.isValidE164Phone((0, LoginUtils_1.getPhoneNumberWithoutSpecialChars)(parsedPhoneNumber.number?.input ?? ''));
    const isInOptionToExclude = optionsToExclude.findIndex((optionToExclude) => 'login' in optionToExclude && optionToExclude.login === (0, PhoneNumber_1.addSMSDomainIfPhoneNumber)(effectiveSearchValue).toLowerCase()) !== -1;
    if (!effectiveSearchValue || isCurrentUserLogin || isInSelectedOption || (!isValidEmail && !isValidPhoneNumber) || isInOptionToExclude) {
        return null;
    }
    // Generates an optimistic account ID for new users not yet saved in Onyx
    const optimisticAccountID = (0, UserUtils_1.generateAccountID)(effectiveSearchValue);
    // Construct display name if firstName/lastName are provided
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const displayName = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || effectiveSearchValue;
    // Create the base user details that will be used in both item and participantsList
    const userDetails = {
        accountID: optimisticAccountID,
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        avatar: avatar || Expensicons_1.FallbackAvatar,
        firstName: firstName ?? '',
        lastName: lastName ?? '',
        displayName,
        login: effectiveSearchValue,
        pronouns: '',
        phoneNumber: phone ?? '',
        validated: true,
    };
    const userToInvite = {
        item: userDetails,
        text: displayName,
        displayName,
        firstName,
        lastName,
        alternateText: displayName !== effectiveSearchValue ? effectiveSearchValue : undefined,
        brickRoadIndicator: null,
        icons: [
            {
                source: userDetails.avatar,
                type: CONST_1.default.ICON_TYPE_AVATAR,
                name: effectiveSearchValue,
                id: optimisticAccountID,
            },
        ],
        tooltipText: null,
        participantsList: [userDetails],
        accountID: optimisticAccountID,
        login: effectiveSearchValue,
        reportID: '',
        phoneNumber: phone ?? '',
        hasDraftComment: false,
        keyForList: optimisticAccountID.toString(),
        isDefaultRoom: false,
        isPinned: false,
        isWaitingOnBankAccount: false,
        isIOUReportOwner: false,
        iouReportAmount: 0,
        isChatRoom: false,
        shouldShowSubscript: false,
        isPolicyExpenseChat: false,
        isExpenseReport: false,
        lastMessageText: '',
        isBold: true,
        isOptimisticAccount: true,
    };
    return userToInvite;
}
function isValidReport(option, config) {
    const { betas = [], includeMultipleParticipantReports = false, includeOwnedWorkspaceChats = false, includeThreads = false, includeTasks = false, includeMoneyRequests = false, includeReadOnly = true, transactionViolations = {}, includeSelfDM = false, includeInvoiceRooms = false, action, includeP2P = true, includeDomainEmail = false, loginsToExclude = {}, excludeNonAdminWorkspaces, } = config;
    const topmostReportId = Navigation_1.default.getTopmostReportId();
    const chatReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${option.item.chatReportID}`];
    const doesReportHaveViolations = (0, ReportUtils_1.shouldDisplayViolationsRBRInLHN)(option.item, transactionViolations);
    const shouldBeInOptionList = (0, ReportUtils_1.shouldReportBeInOptionList)({
        report: option.item,
        chatReport,
        currentReportId: topmostReportId,
        betas,
        doesReportHaveViolations,
        isInFocusMode: false,
        excludeEmptyChats: false,
        includeSelfDM,
        login: option.login,
        includeDomainEmail,
        isReportArchived: !!option.private_isArchived,
    });
    if (!shouldBeInOptionList) {
        return false;
    }
    const isThread = option.isThread;
    const isTaskReport = option.isTaskReport;
    const isPolicyExpenseChat = option.isPolicyExpenseChat;
    const isMoneyRequestReport = option.isMoneyRequestReport;
    const isSelfDM = option.isSelfDM;
    const isChatRoom = option.isChatRoom;
    const accountIDs = (0, ReportUtils_1.getParticipantsAccountIDsForDisplay)(option.item);
    if (excludeNonAdminWorkspaces && !(0, ReportUtils_1.isPolicyAdmin)(option.policyID, policies)) {
        return false;
    }
    if (isPolicyExpenseChat && !includeOwnedWorkspaceChats) {
        return false;
    }
    // When passing includeP2P false we are trying to hide features from users that are not ready for P2P and limited to expense chats only.
    if (!includeP2P && !isPolicyExpenseChat) {
        return false;
    }
    if (isSelfDM && !includeSelfDM) {
        return false;
    }
    if (isThread && !includeThreads) {
        return false;
    }
    if (isTaskReport && !includeTasks) {
        return false;
    }
    if (isMoneyRequestReport && !includeMoneyRequests) {
        return false;
    }
    if (!(0, ReportUtils_1.canUserPerformWriteAction)(option.item, !!option.private_isArchived) && !includeReadOnly) {
        return false;
    }
    // In case user needs to add credit bank account, don't allow them to submit an expense from the workspace.
    if (includeOwnedWorkspaceChats && (0, ReportUtils_1.hasIOUWaitingOnCurrentUserBankAccount)(option.item)) {
        return false;
    }
    if ((!accountIDs || accountIDs.length === 0) && !isChatRoom) {
        return false;
    }
    if (option.login === CONST_1.default.EMAIL.NOTIFICATIONS) {
        return false;
    }
    const isCurrentUserOwnedPolicyExpenseChatThatCouldShow = option.isPolicyExpenseChat && option.ownerAccountID === currentUserAccountID && includeOwnedWorkspaceChats && !option.private_isArchived;
    const shouldShowInvoiceRoom = includeInvoiceRooms && (0, ReportUtils_1.isInvoiceRoom)(option.item) && (0, ReportUtils_1.isPolicyAdmin)(option.policyID, policies) && !option.private_isArchived && (0, PolicyUtils_1.canSendInvoiceFromWorkspace)(option.policyID);
    /*
    Exclude the report option if it doesn't meet any of the following conditions:
    - It is not an owned policy expense chat that could be shown
    - Multiple participant reports are not included
    - It doesn't have a login
    - It is not an invoice room that should be shown
    */
    if (!isCurrentUserOwnedPolicyExpenseChatThatCouldShow && !includeMultipleParticipantReports && !option.login && !shouldShowInvoiceRoom) {
        return false;
    }
    // If we're excluding threads, check the report to see if it has a single participant and if the participant is already selected
    if (!includeThreads && ((!!option.login && loginsToExclude[option.login]) || loginsToExclude[option.reportID])) {
        return false;
    }
    if (action === CONST_1.default.IOU.ACTION.CATEGORIZE) {
        const reportPolicy = allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${option.policyID}`];
        if (!reportPolicy?.areCategoriesEnabled) {
            return false;
        }
    }
    return true;
}
function getValidReports(reports, config) {
    const { showChatPreviewLine = false, forcePolicyNamePreview = false, action, selectedOptions = [], shouldBoldTitleByDefault = true, shouldSeparateSelfDMChat, shouldSeparateWorkspaceChat, isPerDiemRequest = false, showRBR = true, shouldShowGBR = false, } = config;
    const validReportOptions = [];
    const workspaceChats = [];
    let selfDMChat;
    const preferRecentExpenseReports = action === CONST_1.default.IOU.ACTION.CREATE;
    for (let i = 0; i < reports.length; i++) {
        // eslint-disable-next-line rulesdir/prefer-at
        const option = reports[i];
        const report = option.item;
        /**
         * By default, generated options does not have the chat preview line enabled.
         * If showChatPreviewLine or forcePolicyNamePreview are true, let's generate and overwrite the alternate text.
         */
        const alternateText = getAlternateText(option, { showChatPreviewLine, forcePolicyNamePreview });
        const isSelected = isReportSelected(option, selectedOptions);
        const isBold = shouldBoldTitleByDefault || shouldUseBoldText(option);
        let lastIOUCreationDate;
        // Add a field to sort the recent reports by the time of last IOU request for create actions
        if (preferRecentExpenseReports) {
            const reportPreviewAction = allSortedReportActions[option.reportID]?.find((reportAction) => (0, ReportActionsUtils_1.isActionOfType)(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW));
            if (reportPreviewAction) {
                const iouReportID = (0, ReportActionsUtils_1.getIOUReportIDFromReportActionPreview)(reportPreviewAction);
                const iouReportActions = iouReportID ? (allSortedReportActions[iouReportID] ?? []) : [];
                const lastIOUAction = iouReportActions.find((iouAction) => iouAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.IOU);
                if (lastIOUAction) {
                    lastIOUCreationDate = lastIOUAction.lastModified;
                }
            }
        }
        const newReportOption = {
            ...option,
            alternateText,
            isSelected,
            isBold,
            lastIOUCreationDate,
            brickRoadIndicator: showRBR ? option.brickRoadIndicator : null,
        };
        if (newReportOption.brickRoadIndicator === CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.INFO) {
            newReportOption.brickRoadIndicator = shouldShowGBR ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.INFO : null;
        }
        if (shouldSeparateWorkspaceChat && newReportOption.isPolicyExpenseChat && !newReportOption.private_isArchived) {
            newReportOption.text = (0, ReportUtils_1.getPolicyName)({ report });
            newReportOption.alternateText = (0, Localize_1.translateLocal)('workspace.common.workspace');
            if (report?.policyID) {
                const policy = allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${report.policyID}`];
                const submitToAccountID = (0, PolicyUtils_1.getSubmitToAccountID)(policy, report);
                const submitsToAccountDetails = allPersonalDetails?.[submitToAccountID];
                const subtitle = submitsToAccountDetails?.displayName ?? submitsToAccountDetails?.login;
                if (subtitle) {
                    newReportOption.alternateText = (0, Localize_1.translateLocal)('iou.submitsTo', { name: subtitle ?? '' });
                }
                const canSubmitPerDiemExpense = (0, PolicyUtils_1.canSubmitPerDiemExpenseFromWorkspace)(policy);
                if (!canSubmitPerDiemExpense && isPerDiemRequest) {
                    continue;
                }
            }
            workspaceChats.push(newReportOption);
        }
        else if (shouldSeparateSelfDMChat && newReportOption.isSelfDM) {
            selfDMChat = newReportOption;
        }
        else {
            validReportOptions.push(newReportOption);
        }
    }
    return {
        recentReports: validReportOptions,
        workspaceOptions: workspaceChats,
        selfDMOption: selfDMChat,
    };
}
/**
 * Whether user submitted already an expense or scanned receipt
 */
function getIsUserSubmittedExpenseOrScannedReceipt() {
    return !!nvpDismissedProductTraining?.[CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.SCAN_TEST_TOOLTIP];
}
/**
 * Whether the report is a Manager McTest report
 */
function isManagerMcTestReport(report) {
    return report.participantsList?.some((participant) => participant.accountID === CONST_1.default.ACCOUNT_ID.MANAGER_MCTEST) ?? false;
}
/**
 * Returns a list of logins that should be restricted (i.e., hidden or excluded in the UI)
 * based on dynamic business logic and feature flags.
 * Centralizes restriction logic to avoid scattering conditions across the codebase.
 */
function getRestrictedLogins(config, options, canShowManagerMcTest) {
    const userHasReportWithManagerMcTest = Object.values(options.reports).some((report) => isManagerMcTestReport(report));
    return {
        [CONST_1.default.EMAIL.MANAGER_MCTEST]: !canShowManagerMcTest ||
            (getIsUserSubmittedExpenseOrScannedReceipt() && !userHasReportWithManagerMcTest) ||
            !Permissions_1.default.isBetaEnabled(CONST_1.default.BETAS.NEWDOT_MANAGER_MCTEST, config.betas) ||
            (0, PolicyUtils_1.isCurrentUserMemberOfAnyPolicy)(),
    };
}
/**
 * Options are reports and personal details. This function filters out the options that are not valid to be displayed.
 */
function getValidOptions(options, { excludeLogins = {}, includeSelectedOptions = false, includeRecentReports = true, recentAttendees, selectedOptions = [], shouldSeparateSelfDMChat = false, shouldSeparateWorkspaceChat = false, excludeHiddenThreads = false, canShowManagerMcTest = false, searchString, maxElements, includeUserToInvite = false, ...config } = {}) {
    const restrictedLogins = getRestrictedLogins(config, options, canShowManagerMcTest);
    // Gather shared configs:
    const loginsToExclude = {
        [CONST_1.default.EMAIL.NOTIFICATIONS]: true,
        ...excludeLogins,
        ...restrictedLogins,
    };
    // If we're including selected options from the search results, we only want to exclude them if the search input is empty
    // This is because on certain pages, we show the selected options at the top when the search input is empty
    // This prevents the issue of seeing the selected option twice if you have them as a recent chat and select them
    if (!includeSelectedOptions) {
        selectedOptions.forEach((option) => {
            if (!option.login) {
                return;
            }
            loginsToExclude[option.login] = true;
        });
    }
    const { includeP2P = true, shouldBoldTitleByDefault = true, includeDomainEmail = false, shouldShowGBR = false, ...getValidReportsConfig } = config;
    let filteredReports = options.reports;
    // Get valid recent reports:
    let recentReportOptions = [];
    let workspaceChats = [];
    let selfDMChat;
    if (includeRecentReports) {
        // if maxElements is passed, filter the recent reports by searchString and return only most recent reports (@see recentReportsComparator)
        const searchTerms = processSearchString(searchString);
        const filteringFunction = (report) => {
            let searchText = `${report.text ?? ''}${report.login ?? ''}`;
            if (report.isThread) {
                searchText += report.alternateText ?? '';
            }
            else if (report.isChatRoom) {
                searchText += report.subtitle ?? '';
            }
            else if (report.isPolicyExpenseChat) {
                searchText += `${report.subtitle ?? ''}${report.item.policyName ?? ''}`;
            }
            searchText = (0, deburr_1.default)(searchText.toLocaleLowerCase());
            const searchTermsFound = searchTerms.every((term) => searchText.includes(term));
            if (!searchTermsFound) {
                return false;
            }
            return isValidReport(report, {
                ...getValidReportsConfig,
                includeP2P,
                includeDomainEmail,
                selectedOptions,
                loginsToExclude,
                shouldBoldTitleByDefault,
                shouldSeparateSelfDMChat,
                shouldSeparateWorkspaceChat,
            });
        };
        filteredReports = optionsOrderBy(options.reports, recentReportComparator, maxElements, filteringFunction);
        const { recentReports, workspaceOptions, selfDMOption } = getValidReports(filteredReports, {
            ...getValidReportsConfig,
            selectedOptions,
            loginsToExclude,
            shouldBoldTitleByDefault,
            shouldSeparateSelfDMChat,
            shouldSeparateWorkspaceChat,
            shouldShowGBR,
        });
        recentReportOptions = recentReports;
        workspaceChats = workspaceOptions;
        selfDMChat = selfDMOption;
    }
    else if (recentAttendees && recentAttendees?.length > 0) {
        recentAttendees.filter((attendee) => {
            const login = attendee.login ?? attendee.displayName;
            if (login) {
                loginsToExclude[login] = true;
                return true;
            }
            return false;
        });
        recentReportOptions = recentAttendees;
    }
    // Get valid personal details and check if we can find the current user:
    let personalDetailsOptions = [];
    const currentUserRef = {
        current: undefined,
    };
    if (includeP2P) {
        let personalDetailLoginsToExclude = loginsToExclude;
        if (currentUserLogin) {
            personalDetailLoginsToExclude = {
                ...loginsToExclude,
                [currentUserLogin]: !config.includeCurrentUser,
            };
        }
        const searchTerms = processSearchString(searchString);
        const filteringFunction = (personalDetail) => {
            if (!personalDetail?.login ||
                !personalDetail.accountID ||
                !!personalDetail?.isOptimisticPersonalDetail ||
                (!includeDomainEmail && expensify_common_1.Str.isDomainEmail(personalDetail.login)) ||
                // Exclude the setup specialist from the list of personal details as it's a fallback if guide is not assigned
                personalDetail?.login === CONST_1.default.SETUP_SPECIALIST_LOGIN) {
                return false;
            }
            if (personalDetailLoginsToExclude[personalDetail.login]) {
                return false;
            }
            const searchText = (0, deburr_1.default)(`${personalDetail.text ?? ''} ${personalDetail.login ?? ''}`.toLocaleLowerCase());
            return searchTerms.every((term) => searchText.includes(term));
        };
        personalDetailsOptions = optionsOrderBy(options.personalDetails, personalDetailsComparator, maxElements, filteringFunction, true);
        for (let i = 0; i < personalDetailsOptions.length; i++) {
            const personalDetail = personalDetailsOptions.at(i);
            if (!personalDetail) {
                continue;
            }
            if (!!currentUserLogin && personalDetail?.login === currentUserLogin) {
                currentUserRef.current = personalDetail;
            }
            personalDetail.isBold = shouldBoldTitleByDefault;
            if (personalDetail.brickRoadIndicator === CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.INFO) {
                personalDetail.brickRoadIndicator = shouldShowGBR ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.INFO : '';
            }
        }
    }
    if (excludeHiddenThreads) {
        recentReportOptions = recentReportOptions.filter((option) => !option.isThread || option.notificationPreference !== CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN);
    }
    let userToInvite = null;
    if (includeUserToInvite) {
        userToInvite = filterUserToInvite({ currentUserOption: currentUserRef.current, recentReports: recentReportOptions, personalDetails: personalDetailsOptions }, searchString ?? '');
    }
    return {
        personalDetails: personalDetailsOptions,
        recentReports: recentReportOptions,
        currentUserOption: currentUserRef.current,
        userToInvite,
        workspaceChats,
        selfDMChat,
    };
}
/**
 * Build the options for the Search view
 */
function getSearchOptions(options, betas = [], isUsedInChatFinder = true, includeReadOnly = true, searchQuery = '', maxResults, includeUserToInvite, includeRecentReports = true, includeCurrentUser = false, shouldShowGBR = false) {
    Timing_1.default.start(CONST_1.default.TIMING.LOAD_SEARCH_OPTIONS);
    Performance_1.default.markStart(CONST_1.default.TIMING.LOAD_SEARCH_OPTIONS);
    const optionList = getValidOptions(options, {
        betas,
        includeRecentReports,
        includeMultipleParticipantReports: true,
        showChatPreviewLine: isUsedInChatFinder,
        includeP2P: true,
        includeOwnedWorkspaceChats: true,
        includeThreads: true,
        includeMoneyRequests: true,
        includeTasks: true,
        includeReadOnly,
        includeSelfDM: true,
        shouldBoldTitleByDefault: !isUsedInChatFinder,
        excludeHiddenThreads: true,
        maxElements: maxResults,
        includeCurrentUser,
        searchString: searchQuery,
        includeUserToInvite,
        shouldShowGBR,
    });
    Timing_1.default.end(CONST_1.default.TIMING.LOAD_SEARCH_OPTIONS);
    Performance_1.default.markEnd(CONST_1.default.TIMING.LOAD_SEARCH_OPTIONS);
    return optionList;
}
function getShareLogOptions(options, betas = []) {
    return getValidOptions(options, {
        betas,
        includeMultipleParticipantReports: true,
        includeP2P: true,
        forcePolicyNamePreview: true,
        includeOwnedWorkspaceChats: true,
        includeSelfDM: true,
        includeThreads: true,
        includeReadOnly: false,
    });
}
/**
 * Build the IOUConfirmation options for showing the payee personalDetail
 */
function getIOUConfirmationOptionsFromPayeePersonalDetail(personalDetail, amountText) {
    const login = personalDetail?.login ?? '';
    return {
        text: (0, LocalePhoneNumber_1.formatPhoneNumber)((0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(personalDetail, login)),
        alternateText: (0, LocalePhoneNumber_1.formatPhoneNumber)(login || (0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(personalDetail, '', false)),
        icons: [
            {
                source: personalDetail?.avatar ?? Expensicons_1.FallbackAvatar,
                name: personalDetail?.login ?? '',
                type: CONST_1.default.ICON_TYPE_AVATAR,
                id: personalDetail?.accountID,
            },
        ],
        descriptiveText: amountText ?? '',
        login: personalDetail?.login ?? '',
        accountID: personalDetail?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID,
        keyForList: String(personalDetail?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID),
        isInteractive: false,
    };
}
function getAttendeeOptions(reports, personalDetails, betas, attendees, recentAttendees, includeOwnedWorkspaceChats = false, includeP2P = true, includeInvoiceRooms = false, action = undefined) {
    const personalDetailList = (0, keyBy_1.default)(personalDetails.map(({ item }) => item), 'accountID');
    const recentAttendeeHasCurrentUser = recentAttendees.find((attendee) => attendee.email === currentUserLogin || attendee.login === currentUserLogin);
    if (!recentAttendeeHasCurrentUser && currentUserLogin) {
        const details = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(currentUserLogin);
        recentAttendees.push({
            email: currentUserLogin,
            login: currentUserLogin,
            displayName: details?.displayName ?? currentUserLogin,
            accountID: currentUserAccountID,
            text: details?.displayName ?? currentUserLogin,
            searchText: details?.displayName ?? currentUserLogin,
            avatarUrl: details?.avatarThumbnail ?? '',
        });
    }
    const filteredRecentAttendees = recentAttendees
        .filter((attendee) => !attendees.find(({ email, displayName }) => (attendee.email ? email === attendee.email : displayName === attendee.displayName)))
        .map((attendee) => ({
        ...attendee,
        login: attendee.email ?? attendee.displayName,
        ...(0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(attendee.email),
    }))
        .map((attendee) => getParticipantsOption(attendee, personalDetailList));
    return getValidOptions({ reports, personalDetails }, {
        betas,
        selectedOptions: attendees.map((attendee) => ({ ...attendee, login: attendee.email })),
        excludeLogins: CONST_1.default.EXPENSIFY_EMAILS_OBJECT,
        includeOwnedWorkspaceChats,
        includeRecentReports: false,
        includeP2P,
        includeSelectedOptions: false,
        includeSelfDM: false,
        includeInvoiceRooms,
        action,
        recentAttendees: filteredRecentAttendees,
    });
}
/**
 * Build the options for the Share Destination for a Task
 */
function getShareDestinationOptions(reports = [], personalDetails = [], betas = [], selectedOptions = [], excludeLogins = {}, includeOwnedWorkspaceChats = true) {
    return getValidOptions({ reports, personalDetails }, {
        betas,
        selectedOptions,
        includeMultipleParticipantReports: true,
        showChatPreviewLine: true,
        forcePolicyNamePreview: true,
        includeThreads: true,
        includeMoneyRequests: true,
        includeTasks: true,
        excludeLogins,
        includeOwnedWorkspaceChats,
        includeSelfDM: true,
    });
}
/**
 * Format personalDetails or userToInvite to be shown in the list
 *
 * @param member - personalDetails or userToInvite
 * @param config - keys to overwrite the default values
 */
function formatMemberForList(member) {
    const accountID = member.accountID;
    return {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        text: member.text || member.displayName || '',
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        alternateText: member.alternateText || member.login || '',
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        keyForList: member.keyForList || String(accountID ?? CONST_1.default.DEFAULT_NUMBER_ID) || '',
        isSelected: member.isSelected ?? false,
        isDisabled: member.isDisabled ?? false,
        accountID,
        login: member.login ?? '',
        icons: member.icons,
        pendingAction: member.pendingAction,
        reportID: member.reportID,
    };
}
/**
 * Build the options for the Workspace Member Invite view
 */
function getMemberInviteOptions(personalDetails, betas = [], excludeLogins = {}, includeSelectedOptions = false, reports = [], includeRecentReports = false) {
    const options = getValidOptions({ reports, personalDetails }, {
        betas,
        includeP2P: true,
        excludeLogins,
        includeSelectedOptions,
        includeRecentReports,
    });
    const orderedOptions = orderOptions(options);
    return {
        ...options,
        personalDetails: orderedOptions.personalDetails,
        recentReports: orderedOptions.recentReports,
    };
}
/**
 * Helper method that returns the text to be used for the header's message and title (if any)
 */
function getHeaderMessage(hasSelectableOptions, hasUserToInvite, searchValue, hasMatchedParticipant = false) {
    const isValidPhone = (0, PhoneNumber_1.parsePhoneNumber)((0, LoginUtils_1.appendCountryCode)(searchValue)).possible;
    const isValidEmail = expensify_common_1.Str.isValidEmail(searchValue);
    if (searchValue && CONST_1.default.REGEX.DIGITS_AND_PLUS.test(searchValue) && !isValidPhone && !hasSelectableOptions) {
        return (0, Localize_1.translateLocal)('messages.errorMessageInvalidPhone');
    }
    // Without a search value, it would be very confusing to see a search validation message.
    // Therefore, this skips the validation when there is no search value.
    if (searchValue && !hasSelectableOptions && !hasUserToInvite) {
        if (/^\d+$/.test(searchValue) && !isValidPhone) {
            return (0, Localize_1.translateLocal)('messages.errorMessageInvalidPhone');
        }
        if (/@/.test(searchValue) && !isValidEmail) {
            return (0, Localize_1.translateLocal)('messages.errorMessageInvalidEmail');
        }
        if (hasMatchedParticipant && (isValidEmail || isValidPhone)) {
            return '';
        }
        return (0, Localize_1.translateLocal)('common.noResultsFound');
    }
    return '';
}
/**
 * Helper method for non-user lists (eg. categories and tags) that returns the text to be used for the header's message and title (if any)
 */
function getHeaderMessageForNonUserList(hasSelectableOptions, searchValue) {
    if (searchValue && !hasSelectableOptions) {
        return (0, Localize_1.translateLocal)('common.noResultsFound');
    }
    return '';
}
/**
 * Helper method to check whether an option can show tooltip or not
 */
function shouldOptionShowTooltip(option) {
    return !option.private_isArchived;
}
/**
 * Handles the logic for displaying selected participants from the search term
 */
function formatSectionsFromSearchTerm(searchTerm, selectedOptions, filteredRecentReports, filteredPersonalDetails, personalDetails = {}, shouldGetOptionDetails = false, filteredWorkspaceChats = [], reportAttributesDerived) {
    // We show the selected participants at the top of the list when there is no search term or maximum number of participants has already been selected
    // However, if there is a search term we remove the selected participants from the top of the list unless they are part of the search results
    // This clears up space on mobile views, where if you create a group with 4+ people you can't see the selected participants and the search results at the same time
    if (searchTerm === '') {
        return {
            section: {
                title: undefined,
                data: shouldGetOptionDetails
                    ? selectedOptions.map((participant) => {
                        const isReportPolicyExpenseChat = participant.isPolicyExpenseChat ?? false;
                        return isReportPolicyExpenseChat ? getPolicyExpenseReportOption(participant, reportAttributesDerived) : getParticipantsOption(participant, personalDetails);
                    })
                    : selectedOptions,
                shouldShow: selectedOptions.length > 0,
            },
        };
    }
    const cleanSearchTerm = searchTerm.trim().toLowerCase();
    // If you select a new user you don't have a contact for, they won't get returned as part of a recent report or personal details
    // This will add them to the list of options, deduping them if they already exist in the other lists
    const selectedParticipantsWithoutDetails = selectedOptions.filter((participant) => {
        const accountID = participant.accountID ?? null;
        const isPartOfSearchTerm = getPersonalDetailSearchTerms(participant).join(' ').toLowerCase().includes(cleanSearchTerm);
        const isReportInRecentReports = filteredRecentReports.some((report) => report.accountID === accountID) || filteredWorkspaceChats.some((report) => report.accountID === accountID);
        const isReportInPersonalDetails = filteredPersonalDetails.some((personalDetail) => personalDetail.accountID === accountID);
        return isPartOfSearchTerm && !isReportInRecentReports && !isReportInPersonalDetails;
    });
    return {
        section: {
            title: undefined,
            data: shouldGetOptionDetails
                ? selectedParticipantsWithoutDetails.map((participant) => {
                    const isReportPolicyExpenseChat = participant.isPolicyExpenseChat ?? false;
                    return isReportPolicyExpenseChat ? getPolicyExpenseReportOption(participant, reportAttributesDerived) : getParticipantsOption(participant, personalDetails);
                })
                : selectedParticipantsWithoutDetails,
            shouldShow: selectedParticipantsWithoutDetails.length > 0,
        },
    };
}
/**
 * Helper method to get the `keyForList` for the first option in the OptionsList
 */
function getFirstKeyForList(data) {
    if (!data?.length) {
        return '';
    }
    const firstNonEmptyDataObj = data.at(0);
    return firstNonEmptyDataObj?.keyForList ? firstNonEmptyDataObj?.keyForList : '';
}
function getPersonalDetailSearchTerms(item) {
    if (item.accountID === currentUserAccountID) {
        return getCurrentUserSearchTerms(item);
    }
    return [item.participantsList?.[0]?.displayName ?? '', item.login ?? '', item.login?.replace(CONST_1.default.EMAIL_SEARCH_REGEX, '') ?? ''];
}
function getCurrentUserSearchTerms(item) {
    return [item.text ?? '', item.login ?? '', item.login?.replace(CONST_1.default.EMAIL_SEARCH_REGEX, '') ?? '', (0, Localize_1.translateLocal)('common.you'), (0, Localize_1.translateLocal)('common.me')];
}
/**
 * Remove the personal details for the DMs that are already in the recent reports so that we don't show duplicates.
 */
function filteredPersonalDetailsOfRecentReports(recentReports, personalDetails) {
    const excludedLogins = new Set(recentReports.map((report) => report.login));
    return personalDetails.filter((personalDetail) => !excludedLogins.has(personalDetail.login));
}
/**
 * Filters options based on the search input value
 */
function filterReports(reports, searchTerms) {
    const normalizedSearchTerms = searchTerms.map((term) => StringUtils_1.default.normalizeAccents(term));
    // We search eventually for multiple whitespace separated search terms.
    // We start with the search term at the end, and then narrow down those filtered search results with the next search term.
    // We repeat (reduce) this until all search terms have been used:
    const filteredReports = normalizedSearchTerms.reduceRight((items, term) => (0, filterArrayByMatch_1.default)(items, term, (item) => {
        const values = [];
        if (item.text) {
            values.push(StringUtils_1.default.normalizeAccents(item.text));
            values.push(StringUtils_1.default.normalizeAccents(item.text).replace(/['-]/g, ''));
        }
        if (item.login) {
            values.push(StringUtils_1.default.normalizeAccents(item.login));
            values.push(StringUtils_1.default.normalizeAccents(item.login.replace(CONST_1.default.EMAIL_SEARCH_REGEX, '')));
        }
        if (item.isThread) {
            if (item.alternateText) {
                values.push(StringUtils_1.default.normalizeAccents(item.alternateText));
            }
        }
        else if (!!item.isChatRoom || !!item.isPolicyExpenseChat) {
            if (item.subtitle) {
                values.push(StringUtils_1.default.normalizeAccents(item.subtitle));
            }
        }
        return uniqFast(values);
    }), 
    // We start from all unfiltered reports:
    reports);
    return filteredReports;
}
function filterWorkspaceChats(reports, searchTerms) {
    const filteredReports = searchTerms.reduceRight((items, term) => (0, filterArrayByMatch_1.default)(items, term, (item) => {
        const values = [];
        if (item.text) {
            values.push(item.text);
        }
        return uniqFast(values);
    }), 
    // We start from all unfiltered reports:
    reports);
    return filteredReports;
}
function filterPersonalDetails(personalDetails, searchTerms) {
    return searchTerms.reduceRight((items, term) => (0, filterArrayByMatch_1.default)(items, term, (item) => {
        const values = getPersonalDetailSearchTerms(item);
        return uniqFast(values);
    }), personalDetails);
}
function filterCurrentUserOption(currentUserOption, searchTerms) {
    return searchTerms.reduceRight((item, term) => {
        if (!item) {
            return null;
        }
        const currentUserOptionSearchText = uniqFast(getCurrentUserSearchTerms(item)).join(' ');
        return isSearchStringMatch(term, currentUserOptionSearchText) ? item : null;
    }, currentUserOption);
}
function filterUserToInvite(options, searchValue, config) {
    const { canInviteUser = true, excludeLogins = {} } = config ?? {};
    if (!canInviteUser) {
        return null;
    }
    const canCreateOptimisticDetail = canCreateOptimisticPersonalDetailOption({
        recentReportOptions: options.recentReports,
        personalDetailsOptions: options.personalDetails,
        currentUserOption: options.currentUserOption,
        searchValue,
    });
    if (!canCreateOptimisticDetail) {
        return null;
    }
    const loginsToExclude = {
        [CONST_1.default.EMAIL.NOTIFICATIONS]: true,
        ...excludeLogins,
    };
    return getUserToInviteOption({
        searchValue,
        loginsToExclude,
        ...config,
    });
}
function filterSelfDMChat(report, searchTerms) {
    const isMatch = searchTerms.every((term) => {
        const values = [];
        if (report.text) {
            values.push(report.text);
        }
        if (report.login) {
            values.push(report.login);
            values.push(report.login.replace(CONST_1.default.EMAIL_SEARCH_REGEX, ''));
        }
        if (report.isThread) {
            if (report.alternateText) {
                values.push(report.alternateText);
            }
        }
        else if (!!report.isChatRoom || !!report.isPolicyExpenseChat) {
            if (report.subtitle) {
                values.push(report.subtitle);
            }
        }
        // Remove duplicate values and check if the term matches any value
        return uniqFast(values).some((value) => value.includes(term));
    });
    return isMatch ? report : undefined;
}
function filterOptions(options, searchInputValue, countryCode, config) {
    const parsedPhoneNumber = (0, PhoneNumber_1.parsePhoneNumber)((0, LoginUtils_1.appendCountryCodeWithCountryCode)(expensify_common_1.Str.removeSMSDomain(searchInputValue), countryCode ?? 1));
    const searchValue = parsedPhoneNumber.possible && parsedPhoneNumber.number?.e164 ? parsedPhoneNumber.number.e164 : searchInputValue.toLowerCase();
    const searchTerms = searchValue ? searchValue.split(' ') : [];
    const recentReports = filterReports(options.recentReports, searchTerms);
    const personalDetails = filterPersonalDetails(options.personalDetails, searchTerms);
    const currentUserOption = filterCurrentUserOption(options.currentUserOption, searchTerms);
    const userToInvite = filterUserToInvite({
        recentReports,
        personalDetails,
        currentUserOption,
    }, searchValue, config);
    const workspaceChats = filterWorkspaceChats(options.workspaceChats ?? [], searchTerms);
    const selfDMChat = options.selfDMChat ? filterSelfDMChat(options.selfDMChat, searchTerms) : undefined;
    return {
        personalDetails,
        recentReports,
        userToInvite,
        currentUserOption,
        workspaceChats,
        selfDMChat,
    };
}
/**
 * Orders the reports and personal details based on the search input value.
 * Personal details will be filtered out if they are part of the recent reports.
 * Additional configs can be applied.
 */
function combineOrderingOfReportsAndPersonalDetails(options, searchInputValue, { maxRecentReportsToShow, sortByReportTypeInSearch, ...orderReportOptionsConfig } = {}) {
    // sortByReportTypeInSearch will show the personal details as part of the recent reports
    if (sortByReportTypeInSearch) {
        const personalDetailsWithoutDMs = filteredPersonalDetailsOfRecentReports(options.recentReports, options.personalDetails);
        const reportsAndPersonalDetails = options.recentReports.concat(personalDetailsWithoutDMs);
        return orderOptions({ recentReports: reportsAndPersonalDetails, personalDetails: [] }, searchInputValue, orderReportOptionsConfig);
    }
    let orderedReports = orderReportOptionsWithSearch(options.recentReports, searchInputValue, orderReportOptionsConfig);
    if (typeof maxRecentReportsToShow === 'number') {
        orderedReports = orderedReports.slice(0, maxRecentReportsToShow);
    }
    const personalDetailsWithoutDMs = filteredPersonalDetailsOfRecentReports(orderedReports, options.personalDetails);
    const orderedPersonalDetails = orderPersonalDetailsOptions(personalDetailsWithoutDMs);
    return {
        recentReports: orderedReports,
        personalDetails: orderedPersonalDetails,
    };
}
/**
 * Filters and orders the options based on the search input value.
 * Note that personal details that are part of the recent reports will always be shown as part of the recent reports (ie. DMs).
 */
function filterAndOrderOptions(options, searchInputValue, countryCode, config = {}) {
    let filterResult = options;
    if (searchInputValue.trim().length > 0) {
        filterResult = filterOptions(options, searchInputValue, countryCode, config);
    }
    const orderedOptions = combineOrderingOfReportsAndPersonalDetails(filterResult, searchInputValue, config);
    // on staging server, in specific cases (see issue) BE returns duplicated personalDetails entries
    const uniqueLogins = new Set();
    orderedOptions.personalDetails = orderedOptions.personalDetails.filter((detail) => {
        const login = detail.login ?? '';
        if (uniqueLogins.has(login)) {
            return false;
        }
        uniqueLogins.add(login);
        return true;
    });
    return {
        ...filterResult,
        ...orderedOptions,
    };
}
/**
 * Filter out selected options from personal details and recent reports
 * @param options - The options to filter
 * @param selectedOptions - The selected options to filter out.
 * @returns The filtered options
 */
function filterSelectedOptions(options, selectedOptions) {
    const filteredOptions = {
        ...options,
        personalDetails: options.personalDetails.filter(({ accountID }) => !selectedOptions.has(accountID)),
        recentReports: options.recentReports.filter(({ accountID }) => !selectedOptions.has(accountID)),
    };
    return filteredOptions;
}
function sortAlphabetically(items, key, localeCompare) {
    return items.sort((a, b) => localeCompare(a[key]?.toLowerCase() ?? '', b[key]?.toLowerCase() ?? ''));
}
function getEmptyOptions() {
    return {
        recentReports: [],
        personalDetails: [],
        userToInvite: null,
        currentUserOption: null,
    };
}
function shouldUseBoldText(report) {
    const notificationPreference = report.notificationPreference ?? (0, ReportUtils_1.getReportNotificationPreference)(report);
    return report.isUnread === true && notificationPreference !== CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.MUTE && !(0, ReportUtils_1.isHiddenForCurrentUser)(notificationPreference);
}
function getManagerMcTestParticipant() {
    const managerMcTestPersonalDetails = Object.values(allPersonalDetails ?? {}).find((personalDetails) => personalDetails?.login === CONST_1.default.EMAIL.MANAGER_MCTEST);
    const managerMcTestReport = managerMcTestPersonalDetails?.accountID && currentUserAccountID ? (0, ReportUtils_1.getChatByParticipants)([managerMcTestPersonalDetails?.accountID, currentUserAccountID]) : undefined;
    return managerMcTestPersonalDetails ? { ...getParticipantsOption(managerMcTestPersonalDetails, allPersonalDetails), reportID: managerMcTestReport?.reportID } : undefined;
}
function shallowOptionsListCompare(a, b) {
    if (!a || !b) {
        return false;
    }
    if (a.reports.length !== b.reports.length || a.personalDetails.length !== b.personalDetails.length) {
        return false;
    }
    for (let i = 0; i < a.reports.length; i++) {
        const aReport = a.reports.at(i);
        const bReport = b.reports.at(i);
        if (aReport?.reportID !== bReport?.reportID || aReport?.text !== bReport?.text) {
            return false;
        }
    }
    for (let i = 0; i < a.personalDetails.length; i++) {
        if (a.personalDetails.at(i)?.login !== b.personalDetails.at(i)?.login) {
            return false;
        }
    }
    return true;
}
/**
 * Process a search string into normalized search terms
 * @param searchString - The raw search string to process
 * @returns Array of normalized search terms
 */
function processSearchString(searchString) {
    return (0, deburr_1.default)(searchString ?? '')
        .toLowerCase()
        .split(' ')
        .filter((term) => term.length > 0);
}
