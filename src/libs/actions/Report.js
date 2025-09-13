"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePrivateNotes = void 0;
exports.addAttachment = addAttachment;
exports.addComment = addComment;
exports.addPolicyReport = addPolicyReport;
exports.broadcastUserIsLeavingRoom = broadcastUserIsLeavingRoom;
exports.broadcastUserIsTyping = broadcastUserIsTyping;
exports.buildOptimisticChangePolicyData = buildOptimisticChangePolicyData;
exports.clearAddRoomMemberError = clearAddRoomMemberError;
exports.clearAvatarErrors = clearAvatarErrors;
exports.clearDeleteTransactionNavigateBackUrl = clearDeleteTransactionNavigateBackUrl;
exports.clearGroupChat = clearGroupChat;
exports.clearIOUError = clearIOUError;
exports.clearNewRoomFormError = clearNewRoomFormError;
exports.setNewRoomFormLoading = setNewRoomFormLoading;
exports.clearPolicyRoomNameErrors = clearPolicyRoomNameErrors;
exports.clearPrivateNotesError = clearPrivateNotesError;
exports.clearReportFieldKeyErrors = clearReportFieldKeyErrors;
exports.completeOnboarding = completeOnboarding;
exports.createNewReport = createNewReport;
exports.deleteReport = deleteReport;
exports.deleteReportActionDraft = deleteReportActionDraft;
exports.deleteReportComment = deleteReportComment;
exports.deleteReportField = deleteReportField;
exports.dismissTrackExpenseActionableWhisper = dismissTrackExpenseActionableWhisper;
exports.doneCheckingPublicRoom = doneCheckingPublicRoom;
exports.downloadReportPDF = downloadReportPDF;
exports.editReportComment = editReportComment;
exports.expandURLPreview = expandURLPreview;
exports.exportReportToCSV = exportReportToCSV;
exports.exportReportToPDF = exportReportToPDF;
exports.exportToIntegration = exportToIntegration;
exports.flagComment = flagComment;
exports.getCurrentUserAccountID = getCurrentUserAccountID;
exports.getCurrentUserEmail = getCurrentUserEmail;
exports.getDraftPrivateNote = getDraftPrivateNote;
exports.getMostRecentReportID = getMostRecentReportID;
exports.getNewerActions = getNewerActions;
exports.getOlderActions = getOlderActions;
exports.getReportPrivateNote = getReportPrivateNote;
exports.handleReportChanged = handleReportChanged;
exports.handleUserDeletedLinksInHtml = handleUserDeletedLinksInHtml;
exports.hasErrorInPrivateNotes = hasErrorInPrivateNotes;
exports.inviteToGroupChat = inviteToGroupChat;
exports.buildInviteToRoomOnyxData = buildInviteToRoomOnyxData;
exports.inviteToRoom = inviteToRoom;
exports.joinRoom = joinRoom;
exports.leaveGroupChat = leaveGroupChat;
exports.leaveRoom = leaveRoom;
exports.markAsManuallyExported = markAsManuallyExported;
exports.markCommentAsUnread = markCommentAsUnread;
exports.navigateToAndOpenChildReport = navigateToAndOpenChildReport;
exports.navigateToAndOpenReport = navigateToAndOpenReport;
exports.navigateToAndOpenReportWithAccountIDs = navigateToAndOpenReportWithAccountIDs;
exports.navigateToConciergeChat = navigateToConciergeChat;
exports.navigateToConciergeChatAndDeleteReport = navigateToConciergeChatAndDeleteReport;
exports.clearCreateChatError = clearCreateChatError;
exports.notifyNewAction = notifyNewAction;
exports.openLastOpenedPublicRoom = openLastOpenedPublicRoom;
exports.openReport = openReport;
exports.openReportFromDeepLink = openReportFromDeepLink;
exports.openRoomMembersPage = openRoomMembersPage;
exports.readNewestAction = readNewestAction;
exports.markAllMessagesAsRead = markAllMessagesAsRead;
exports.removeFromGroupChat = removeFromGroupChat;
exports.removeFromRoom = removeFromRoom;
exports.resolveActionableMentionWhisper = resolveActionableMentionWhisper;
exports.resolveActionableMentionConfirmWhisper = resolveActionableMentionConfirmWhisper;
exports.resolveActionableReportMentionWhisper = resolveActionableReportMentionWhisper;
exports.resolveConciergeCategoryOptions = resolveConciergeCategoryOptions;
exports.savePrivateNotesDraft = savePrivateNotesDraft;
exports.saveReportActionDraft = saveReportActionDraft;
exports.saveReportDraftComment = saveReportDraftComment;
exports.searchInServer = searchInServer;
exports.setDeleteTransactionNavigateBackUrl = setDeleteTransactionNavigateBackUrl;
exports.setGroupDraft = setGroupDraft;
exports.setIsComposerFullSize = setIsComposerFullSize;
exports.setLastOpenedPublicRoom = setLastOpenedPublicRoom;
exports.shouldShowReportActionNotification = shouldShowReportActionNotification;
exports.showReportActionNotification = showReportActionNotification;
exports.startNewChat = startNewChat;
exports.subscribeToNewActionEvent = subscribeToNewActionEvent;
exports.subscribeToReportLeavingEvents = subscribeToReportLeavingEvents;
exports.subscribeToReportTypingEvents = subscribeToReportTypingEvents;
exports.toggleEmojiReaction = toggleEmojiReaction;
exports.togglePinnedState = togglePinnedState;
exports.toggleSubscribeToChildReport = toggleSubscribeToChildReport;
exports.unsubscribeFromLeavingRoomReportChannel = unsubscribeFromLeavingRoomReportChannel;
exports.unsubscribeFromReportChannel = unsubscribeFromReportChannel;
exports.updateDescription = updateDescription;
exports.updateGroupChatAvatar = updateGroupChatAvatar;
exports.updateGroupChatMemberRoles = updateGroupChatMemberRoles;
exports.updateChatName = updateChatName;
exports.updateLastVisitTime = updateLastVisitTime;
exports.updateLoadingInitialReportAction = updateLoadingInitialReportAction;
exports.updateNotificationPreference = updateNotificationPreference;
exports.updatePolicyRoomName = updatePolicyRoomName;
exports.updateReportField = updateReportField;
exports.updateReportName = updateReportName;
exports.updateRoomVisibility = updateRoomVisibility;
exports.updateWriteCapability = updateWriteCapability;
exports.deleteAppReport = deleteAppReport;
exports.getOptimisticChatReport = getOptimisticChatReport;
exports.saveReportDraft = saveReportDraft;
exports.moveIOUReportToPolicy = moveIOUReportToPolicy;
exports.moveIOUReportToPolicyAndInviteSubmitter = moveIOUReportToPolicyAndInviteSubmitter;
exports.dismissChangePolicyModal = dismissChangePolicyModal;
exports.changeReportPolicy = changeReportPolicy;
exports.changeReportPolicyAndInviteSubmitter = changeReportPolicyAndInviteSubmitter;
exports.removeFailedReport = removeFailedReport;
exports.createTransactionThreadReport = createTransactionThreadReport;
exports.openUnreportedExpense = openUnreportedExpense;
const native_1 = require("@react-navigation/native");
const date_fns_tz_1 = require("date-fns-tz");
const expensify_common_1 = require("expensify-common");
const isEmpty_1 = require("lodash/isEmpty");
const react_native_1 = require("react-native");
const react_native_onyx_1 = require("react-native-onyx");
const ActiveClientManager = require("@libs/ActiveClientManager");
const addEncryptedAuthTokenToURL_1 = require("@libs/addEncryptedAuthTokenToURL");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const ApiUtils = require("@libs/ApiUtils");
const CollectionUtils = require("@libs/CollectionUtils");
const DateUtils_1 = require("@libs/DateUtils");
const DraftCommentUtils_1 = require("@libs/DraftCommentUtils");
const EmojiUtils = require("@libs/EmojiUtils");
const Environment = require("@libs/Environment/Environment");
const Environment_1 = require("@libs/Environment/Environment");
const getEnvironment_1 = require("@libs/Environment/getEnvironment");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const fileDownload_1 = require("@libs/fileDownload");
const HttpUtils_1 = require("@libs/HttpUtils");
const isPublicScreenRoute_1 = require("@libs/isPublicScreenRoute");
const Localize = require("@libs/Localize");
const Log_1 = require("@libs/Log");
const LoginUtils_1 = require("@libs/LoginUtils");
const Pagination_1 = require("@libs/Middleware/Pagination");
const ModifiedExpenseMessage_1 = require("@libs/ModifiedExpenseMessage");
const isNavigatorName_1 = require("@libs/Navigation/helpers/isNavigatorName");
const normalizePath_1 = require("@libs/Navigation/helpers/normalizePath");
const shouldOpenOnAdminRoom_1 = require("@libs/Navigation/helpers/shouldOpenOnAdminRoom");
const Navigation_1 = require("@libs/Navigation/Navigation");
const enhanceParameters_1 = require("@libs/Network/enhanceParameters");
const NextStepUtils_1 = require("@libs/NextStepUtils");
const LocalNotification_1 = require("@libs/Notification/LocalNotification");
const NumberUtils_1 = require("@libs/NumberUtils");
const OnboardingUtils_1 = require("@libs/OnboardingUtils");
const Parser_1 = require("@libs/Parser");
const ParsingUtils_1 = require("@libs/ParsingUtils");
const PersonalDetailsUtils = require("@libs/PersonalDetailsUtils");
const PhoneNumber = require("@libs/PhoneNumber");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const processReportIDDeeplink_1 = require("@libs/processReportIDDeeplink");
const Pusher_1 = require("@libs/Pusher");
const ReportActionsUtils = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const shouldSkipDeepLinkNavigation_1 = require("@libs/shouldSkipDeepLinkNavigation");
const Sound_1 = require("@libs/Sound");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const UrlUtils_1 = require("@libs/UrlUtils");
const Visibility_1 = require("@libs/Visibility");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const NewRoomForm_1 = require("@src/types/form/NewRoomForm");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const CachedPDFPaths_1 = require("./CachedPDFPaths");
const Download_1 = require("./Download");
const Modal_1 = require("./Modal");
const navigateFromNotification_1 = require("./navigateFromNotification");
const PersistedRequests_1 = require("./PersistedRequests");
const Member_1 = require("./Policy/Member");
const Policy_1 = require("./Policy/Policy");
const RequestConflictUtils_1 = require("./RequestConflictUtils");
const Session_1 = require("./Session");
const Welcome_1 = require("./Welcome");
const OnboardingFlow_1 = require("./Welcome/OnboardingFlow");
const addNewMessageWithText = new Set([types_1.WRITE_COMMANDS.ADD_COMMENT, types_1.WRITE_COMMANDS.ADD_TEXT_AND_ATTACHMENT]);
let conciergeReportID;
let currentUserAccountID = -1;
let currentUserEmail;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.SESSION,
    callback: (value) => {
        // When signed out, val is undefined
        if (!value?.accountID) {
            conciergeReportID = undefined;
            return;
        }
        currentUserEmail = value.email;
        currentUserAccountID = value.accountID;
    },
});
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.CONCIERGE_REPORT_ID,
    callback: (value) => (conciergeReportID = value),
});
let preferredSkinTone = CONST_1.default.EMOJI_DEFAULT_SKIN_TONE;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.PREFERRED_EMOJI_SKIN_TONE,
    callback: (value) => {
        preferredSkinTone = EmojiUtils.getPreferredSkinToneIndex(value);
    },
});
// map of reportID to all reportActions for that report
const allReportActions = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
    callback: (actions, key) => {
        if (!key || !actions) {
            return;
        }
        const reportID = CollectionUtils.extractCollectionItemID(key);
        allReportActions[reportID] = actions;
    },
});
let allTransactionViolations = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS,
    waitForCollectionCallback: true,
    callback: (value) => (allTransactionViolations = value),
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
let networkStatus;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.NETWORK,
    callback: (value) => {
        isNetworkOffline = value?.isOffline ?? false;
        networkStatus = value?.networkStatus ?? CONST_1.default.NETWORK.NETWORK_STATUS.UNKNOWN;
    },
});
let allPersonalDetails = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
    callback: (value) => {
        allPersonalDetails = value ?? {};
    },
});
let account = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.ACCOUNT,
    callback: (value) => {
        account = value ?? {};
    },
});
const draftNoteMap = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.PRIVATE_NOTES_DRAFT,
    callback: (value, key) => {
        if (!key) {
            return;
        }
        const reportID = key.replace(ONYXKEYS_1.default.COLLECTION.PRIVATE_NOTES_DRAFT, '');
        draftNoteMap[reportID] = value;
    },
});
const typingWatchTimers = {};
let reportIDDeeplinkedFromOldDot;
react_native_1.Linking.getInitialURL().then((url) => {
    reportIDDeeplinkedFromOldDot = (0, processReportIDDeeplink_1.default)(url ?? '');
});
let allRecentlyUsedReportFields = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.RECENTLY_USED_REPORT_FIELDS,
    callback: (val) => (allRecentlyUsedReportFields = val),
});
let quickAction = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.NVP_QUICK_ACTION_GLOBAL_CREATE,
    callback: (val) => (quickAction = val),
});
let onboarding;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.NVP_ONBOARDING,
    callback: (val) => {
        if (Array.isArray(val)) {
            return;
        }
        onboarding = val;
    },
});
let introSelected = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.NVP_INTRO_SELECTED,
    callback: (val) => (introSelected = val),
});
let allReportDraftComments = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT_COMMENT,
    waitForCollectionCallback: true,
    callback: (value) => (allReportDraftComments = value),
});
let nvpDismissedProductTraining;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.NVP_DISMISSED_PRODUCT_TRAINING,
    callback: (value) => (nvpDismissedProductTraining = value),
});
const allPolicies = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.POLICY,
    callback: (val, key) => {
        if (!key) {
            return;
        }
        if (val === null || val === undefined) {
            // If we are deleting a policy, we have to check every report linked to that policy
            // and unset the draft indicator (pencil icon) alongside removing any draft comments. Clearing these values will keep the newly archived chats from being displayed in the LHN.
            // More info: https://github.com/Expensify/App/issues/14260
            const policyID = key.replace(ONYXKEYS_1.default.COLLECTION.POLICY, '');
            const policyReports = (0, ReportUtils_1.getAllPolicyReports)(policyID);
            const cleanUpSetQueries = {};
            policyReports.forEach((policyReport) => {
                if (!policyReport) {
                    return;
                }
                const { reportID } = policyReport;
                cleanUpSetQueries[`${ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT_COMMENT}${reportID}`] = null;
                cleanUpSetQueries[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS}${reportID}`] = null;
            });
            react_native_onyx_1.default.multiSet(cleanUpSetQueries);
            delete allPolicies[key];
            return;
        }
        allPolicies[key] = val;
    },
});
let allTransactions = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
    waitForCollectionCallback: true,
    callback: (value) => {
        if (!value) {
            allTransactions = {};
            return;
        }
        allTransactions = value;
    },
});
let environment;
(0, getEnvironment_1.default)().then((env) => {
    environment = env;
});
(0, Pagination_1.registerPaginationConfig)({
    initialCommand: types_1.WRITE_COMMANDS.OPEN_REPORT,
    previousCommand: types_1.READ_COMMANDS.GET_OLDER_ACTIONS,
    nextCommand: types_1.READ_COMMANDS.GET_NEWER_ACTIONS,
    resourceCollectionKey: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
    pageCollectionKey: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_PAGES,
    sortItems: (reportActions, reportID) => {
        const report = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
        const canUserPerformWriteAction = (0, ReportUtils_1.canUserPerformWriteAction)(report);
        return ReportActionsUtils.getSortedReportActionsForDisplay(reportActions, canUserPerformWriteAction, true);
    },
    getItemID: (reportAction) => reportAction.reportActionID,
});
function clearGroupChat() {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.NEW_GROUP_CHAT_DRAFT, null);
}
function startNewChat() {
    clearGroupChat();
    Navigation_1.default.navigate(ROUTES_1.default.NEW);
}
/** Get the private pusher channel name for a Report. */
function getReportChannelName(reportID) {
    return `${CONST_1.default.PUSHER.PRIVATE_REPORT_CHANNEL_PREFIX}${reportID}${CONFIG_1.default.PUSHER.SUFFIX}`;
}
function openUnreportedExpense(reportID, backToReport) {
    if (!reportID) {
        return;
    }
    Navigation_1.default.navigate(ROUTES_1.default.ADD_UNREPORTED_EXPENSE.getRoute(reportID, backToReport));
}
/**
 * There are 2 possibilities that we can receive via pusher for a user's typing/leaving status:
 * 1. The "new" way from New Expensify is passed as {[login]: Boolean} (e.g. {yuwen@expensify.com: true}), where the value
 * is whether the user with that login is typing/leaving on the report or not.
 * 2. The "old" way from e.com which is passed as {userLogin: login} (e.g. {userLogin: bstites@expensify.com})
 *
 * This method makes sure that no matter which we get, we return the "new" format
 */
function getNormalizedStatus(typingStatus) {
    let normalizedStatus;
    if (typingStatus.userLogin) {
        normalizedStatus = { [typingStatus.userLogin]: true };
    }
    else {
        normalizedStatus = typingStatus;
    }
    return normalizedStatus;
}
/** Initialize our pusher subscriptions to listen for someone typing in a report. */
function subscribeToReportTypingEvents(reportID) {
    if (!reportID) {
        return;
    }
    // Make sure we have a clean Typing indicator before subscribing to typing events
    react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_USER_IS_TYPING}${reportID}`, {});
    const pusherChannelName = getReportChannelName(reportID);
    Pusher_1.default.subscribe(pusherChannelName, Pusher_1.default.TYPE.USER_IS_TYPING, (typingStatus) => {
        // If the pusher message comes from OldDot, we expect the typing status to be keyed by user
        // login OR by 'Concierge'. If the pusher message comes from NewDot, it is keyed by accountID
        // since personal details are keyed by accountID.
        const normalizedTypingStatus = getNormalizedStatus(typingStatus);
        const accountIDOrLogin = Object.keys(normalizedTypingStatus).at(0);
        if (!accountIDOrLogin) {
            return;
        }
        // Don't show the typing indicator if the user is typing on another platform
        if (Number(accountIDOrLogin) === currentUserAccountID) {
            return;
        }
        // Use a combo of the reportID and the accountID or login as a key for holding our timers.
        const reportUserIdentifier = `${reportID}-${accountIDOrLogin}`;
        clearTimeout(typingWatchTimers[reportUserIdentifier]);
        react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_USER_IS_TYPING}${reportID}`, normalizedTypingStatus);
        // Regular user typing indicators: time out after 1.5s of inactivity.
        // Concierge (AgentZero-initiated): use a longer 10s timeout. AgentZero sends a single typing event for Concierge, not a stream, so client holds the indicator longer.
        const isCurrentlyTyping = normalizedTypingStatus[accountIDOrLogin];
        if (isCurrentlyTyping) {
            // While the accountIDOrLogin could be 'Concierge' from OldDot, we only want the longer timeout for events queued from AgentZero (which will only send the accountID)
            const isConciergeUser = Number(accountIDOrLogin) === CONST_1.default.ACCOUNT_ID.CONCIERGE;
            const timeoutDuration = isConciergeUser ? 10000 : 1500;
            typingWatchTimers[reportUserIdentifier] = setTimeout(() => {
                const typingStoppedStatus = {};
                typingStoppedStatus[accountIDOrLogin] = false;
                react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_USER_IS_TYPING}${reportID}`, typingStoppedStatus);
                delete typingWatchTimers[reportUserIdentifier];
            }, timeoutDuration);
        }
    }).catch((error) => {
        Log_1.default.hmmm('[Report] Failed to initially subscribe to Pusher channel', { errorType: error.type, pusherChannelName });
    });
}
/** Initialize our pusher subscriptions to listen for someone leaving a room. */
function subscribeToReportLeavingEvents(reportID) {
    if (!reportID) {
        return;
    }
    // Make sure we have a clean Leaving indicator before subscribing to leaving events
    react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_USER_IS_LEAVING_ROOM}${reportID}`, false);
    const pusherChannelName = getReportChannelName(reportID);
    Pusher_1.default.subscribe(pusherChannelName, Pusher_1.default.TYPE.USER_IS_LEAVING_ROOM, (leavingStatus) => {
        // If the pusher message comes from OldDot, we expect the leaving status to be keyed by user
        // login OR by 'Concierge'. If the pusher message comes from NewDot, it is keyed by accountID
        // since personal details are keyed by accountID.
        const normalizedLeavingStatus = getNormalizedStatus(leavingStatus);
        const accountIDOrLogin = Object.keys(normalizedLeavingStatus).at(0);
        if (!accountIDOrLogin) {
            return;
        }
        if (Number(accountIDOrLogin) !== currentUserAccountID) {
            return;
        }
        react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_USER_IS_LEAVING_ROOM}${reportID}`, true);
    }).catch((error) => {
        Log_1.default.hmmm('[Report] Failed to initially subscribe to Pusher channel', { errorType: error.type, pusherChannelName });
    });
}
/**
 * Remove our pusher subscriptions to listen for someone typing in a report.
 */
function unsubscribeFromReportChannel(reportID) {
    if (!reportID) {
        return;
    }
    const pusherChannelName = getReportChannelName(reportID);
    react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_USER_IS_TYPING}${reportID}`, {});
    Pusher_1.default.unsubscribe(pusherChannelName, Pusher_1.default.TYPE.USER_IS_TYPING);
}
/**
 * Remove our pusher subscriptions to listen for someone leaving a report.
 */
function unsubscribeFromLeavingRoomReportChannel(reportID) {
    if (!reportID) {
        return;
    }
    const pusherChannelName = getReportChannelName(reportID);
    react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_USER_IS_LEAVING_ROOM}${reportID}`, false);
    Pusher_1.default.unsubscribe(pusherChannelName, Pusher_1.default.TYPE.USER_IS_LEAVING_ROOM);
}
// New action subscriber array for report pages
let newActionSubscribers = [];
/**
 * Enables the Report actions file to let the ReportActionsView know that a new comment has arrived in realtime for the current report
 * Add subscriber for report id
 * @returns Remove subscriber for report id
 */
function subscribeToNewActionEvent(reportID, callback) {
    newActionSubscribers.push({ callback, reportID });
    return () => {
        newActionSubscribers = newActionSubscribers.filter((subscriber) => subscriber.reportID !== reportID);
    };
}
/** Notify the ReportActionsView that a new comment has arrived */
function notifyNewAction(reportID, accountID, reportAction) {
    const actionSubscriber = newActionSubscribers.find((subscriber) => subscriber.reportID === reportID);
    if (!actionSubscriber) {
        return;
    }
    const isFromCurrentUser = accountID === currentUserAccountID;
    actionSubscriber.callback(isFromCurrentUser, reportAction);
}
/**
 * Add up to two report actions to a report. This method can be called for the following situations:
 *
 * - Adding one comment
 * - Adding one attachment
 * - Add both a comment and attachment simultaneously
 */
function addActions(reportID, timezoneParam, text = '', file) {
    let reportCommentText = '';
    let reportCommentAction;
    let attachmentAction;
    let commandName = types_1.WRITE_COMMANDS.ADD_COMMENT;
    if (text && !file) {
        const reportComment = (0, ReportUtils_1.buildOptimisticAddCommentReportAction)(text, undefined, undefined, undefined, undefined, reportID);
        reportCommentAction = reportComment.reportAction;
        reportCommentText = reportComment.commentText;
    }
    if (file) {
        // When we are adding an attachment we will call AddAttachment.
        // It supports sending an attachment with an optional comment and AddComment supports adding a single text comment only.
        commandName = types_1.WRITE_COMMANDS.ADD_ATTACHMENT;
        const attachment = (0, ReportUtils_1.buildOptimisticAddCommentReportAction)(text, file, undefined, undefined, undefined, reportID);
        attachmentAction = attachment.reportAction;
    }
    if (text && file) {
        // When there is both text and a file, the text for the report comment needs to be parsed)
        reportCommentText = (0, ReportUtils_1.getParsedComment)(text ?? '', { reportID });
        // And the API command needs to go to the new API which supports combining both text and attachments in a single report action
        commandName = types_1.WRITE_COMMANDS.ADD_TEXT_AND_ATTACHMENT;
    }
    // Always prefer the file as the last action over text
    const lastAction = attachmentAction ?? reportCommentAction;
    const currentTime = DateUtils_1.default.getDBTimeWithSkew();
    const lastComment = ReportActionsUtils.getReportActionMessage(lastAction);
    const lastCommentText = (0, ReportUtils_1.formatReportLastMessageText)(lastComment?.text ?? '');
    const optimisticReport = {
        lastVisibleActionCreated: lastAction?.created,
        lastMessageText: lastCommentText,
        lastMessageHtml: lastCommentText,
        lastActorAccountID: currentUserAccountID,
        lastReadTime: currentTime,
    };
    const report = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
    const shouldUpdateNotificationPreference = !(0, EmptyObject_1.isEmptyObject)(report) && (0, ReportUtils_1.isHiddenForCurrentUser)(report);
    if (shouldUpdateNotificationPreference) {
        optimisticReport.participants = {
            [currentUserAccountID]: { notificationPreference: (0, ReportUtils_1.getDefaultNotificationPreferenceForReport)(report) },
        };
    }
    // Optimistically add the new actions to the store before waiting to save them to the server
    const optimisticReportActions = {};
    // Only add the reportCommentAction when there is no file attachment. If there is both a file attachment and text, that will all be contained in the attachmentAction.
    if (text && reportCommentAction?.reportActionID && !file) {
        optimisticReportActions[reportCommentAction.reportActionID] = reportCommentAction;
    }
    if (file && attachmentAction?.reportActionID) {
        optimisticReportActions[attachmentAction.reportActionID] = attachmentAction;
    }
    const parameters = {
        reportID,
        reportActionID: file ? attachmentAction?.reportActionID : reportCommentAction?.reportActionID,
        commentReportActionID: file && reportCommentAction ? reportCommentAction.reportActionID : null,
        reportComment: reportCommentText,
        file,
        clientCreatedTime: file ? attachmentAction?.created : reportCommentAction?.created,
        idempotencyKey: expensify_common_1.Str.guid(),
    };
    if (reportIDDeeplinkedFromOldDot === reportID && (0, ReportUtils_1.isConciergeChatReport)(report)) {
        parameters.isOldDotConciergeChat = true;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: optimisticReport,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: optimisticReportActions,
        },
    ];
    const successReportActions = {};
    Object.entries(optimisticReportActions).forEach(([actionKey]) => {
        successReportActions[actionKey] = { pendingAction: null, isOptimisticAction: null };
    });
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: successReportActions,
        },
    ];
    let failureReport = {
        lastMessageText: '',
        lastVisibleActionCreated: '',
    };
    const { lastMessageText = '' } = ReportActionsUtils.getLastVisibleMessage(reportID);
    if (lastMessageText) {
        const lastVisibleAction = ReportActionsUtils.getLastVisibleAction(reportID);
        const lastVisibleActionCreated = lastVisibleAction?.created;
        const lastActorAccountID = lastVisibleAction?.actorAccountID;
        failureReport = {
            lastMessageText,
            lastVisibleActionCreated,
            lastActorAccountID,
        };
    }
    const failureReportActions = {};
    Object.entries(optimisticReportActions).forEach(([actionKey, action]) => {
        failureReportActions[actionKey] = {
            // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
            ...action,
            errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('report.genericAddCommentFailureMessage'),
        };
    });
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: failureReport,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: failureReportActions,
        },
    ];
    // Update optimistic data for parent report action if the report is a child report
    const optimisticParentReportData = (0, ReportUtils_1.getOptimisticDataForParentReportAction)(report, currentTime, CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
    optimisticParentReportData.forEach((parentReportData) => {
        if ((0, EmptyObject_1.isEmptyObject)(parentReportData)) {
            return;
        }
        optimisticData.push(parentReportData);
    });
    // Update the timezone if it's been 5 minutes from the last time the user added a comment
    if (DateUtils_1.default.canUpdateTimezone() && currentUserAccountID) {
        const timezone = DateUtils_1.default.getCurrentTimezone(timezoneParam);
        parameters.timezone = JSON.stringify(timezone);
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
            value: { [currentUserAccountID]: { timezone } },
        });
        DateUtils_1.default.setTimezoneUpdated();
    }
    API.write(commandName, parameters, {
        optimisticData,
        successData,
        failureData,
    });
    notifyNewAction(reportID, lastAction?.actorAccountID, lastAction);
}
/** Add an attachment and optional comment. */
function addAttachment(reportID, file, timezoneParam, text = '', shouldPlaySound) {
    if (shouldPlaySound) {
        (0, Sound_1.default)(Sound_1.SOUNDS.DONE);
    }
    addActions(reportID, timezoneParam, text, file);
}
/** Add a single comment to a report */
function addComment(reportID, text, timezoneParam, shouldPlaySound) {
    if (shouldPlaySound) {
        (0, Sound_1.default)(Sound_1.SOUNDS.DONE);
    }
    addActions(reportID, timezoneParam, text);
}
function reportActionsExist(reportID) {
    return allReportActions?.[reportID] !== undefined;
}
function updateChatName(reportID, reportName, type) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                reportName,
                pendingFields: {
                    reportName: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                },
                errorFields: {
                    reportName: null,
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                pendingFields: {
                    reportName: null,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                reportName: allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`]?.reportName ?? null,
                pendingFields: {
                    reportName: null,
                },
            },
        },
    ];
    const command = type === CONST_1.default.REPORT.CHAT_TYPE.GROUP ? types_1.WRITE_COMMANDS.UPDATE_GROUP_CHAT_NAME : types_1.WRITE_COMMANDS.UPDATE_TRIP_ROOM_NAME;
    const parameters = { reportName, reportID };
    API.write(command, parameters, { optimisticData, successData, failureData });
}
function updateGroupChatAvatar(reportID, file) {
    // If we have no file that means we are removing the avatar.
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                avatarUrl: file ? (file?.uri ?? '') : null,
                pendingFields: {
                    avatar: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                },
                errorFields: {
                    avatar: null,
                },
            },
        },
    ];
    const fetchedReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                avatarUrl: fetchedReport?.avatarUrl ?? null,
                pendingFields: {
                    avatar: null,
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                pendingFields: {
                    avatar: null,
                },
            },
        },
    ];
    const parameters = { file, reportID };
    API.write(types_1.WRITE_COMMANDS.UPDATE_GROUP_CHAT_AVATAR, parameters, { optimisticData, failureData, successData });
}
/**
 * Clear error and pending fields for the report avatar
 */
function clearAvatarErrors(reportID) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, {
        errorFields: {
            avatar: null,
        },
    });
}
/**
 * Gets the latest page of report actions and updates the last read message
 * If a chat with the passed reportID is not found, we will create a chat based on the passed participantList
 *
 * @param reportID The ID of the report to open
 * @param reportActionID The ID used to fetch a specific range of report actions related to the current reportActionID when opening a chat.
 * @param participantLoginList The list of users that are included in a new chat, not including the user creating it
 * @param newReportObject The optimistic report object created when making a new chat, saved as optimistic data
 * @param parentReportActionID The parent report action that a thread was created from (only passed for new threads)
 * @param isFromDeepLink Whether or not this report is being opened from a deep link
 * @param participantAccountIDList The list of accountIDs that are included in a new chat, not including the user creating it
 */
function openReport(reportID, reportActionID, participantLoginList = [], newReportObject, parentReportActionID, isFromDeepLink = false, participantAccountIDList = [], avatar, transactionID) {
    if (!reportID) {
        return;
    }
    const optimisticReport = reportActionsExist(reportID)
        ? {}
        : {
            reportName: allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`]?.reportName ?? CONST_1.default.REPORT.DEFAULT_REPORT_NAME,
        };
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: optimisticReport,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`,
            value: {
                isLoadingInitialReportActions: true,
                isLoadingOlderReportActions: false,
                hasLoadingOlderReportActionsError: false,
                isLoadingNewerReportActions: false,
                hasLoadingNewerReportActionsError: false,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                errorFields: {
                    notFound: null,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`,
            value: {
                hasOnceLoadedReportActions: true,
                isLoadingInitialReportActions: false,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`,
            value: {
                isLoadingInitialReportActions: false,
            },
        },
    ];
    const finallyData = [];
    const parameters = {
        reportID,
        reportActionID,
        emailList: participantLoginList ? participantLoginList.join(',') : '',
        accountIDList: participantAccountIDList ? participantAccountIDList.join(',') : '',
        parentReportActionID,
        transactionID,
    };
    // This is a legacy transactions that doesn't have either a transaction thread or a money request preview
    if (transactionID && !parentReportActionID) {
        const transaction = allTransactions?.[transactionID];
        if (transaction) {
            const selfDMReportID = (0, ReportUtils_1.findSelfDMReportID)();
            if (selfDMReportID) {
                const generatedReportActionID = (0, NumberUtils_1.rand64)();
                const optimisticParentAction = (0, ReportUtils_1.buildOptimisticIOUReportAction)({
                    type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                    amount: Math.abs(transaction.amount),
                    currency: transaction.currency,
                    comment: transaction.comment?.comment ?? '',
                    participants: [{ accountID: currentUserAccountID, login: currentUserEmail ?? '' }],
                    transactionID,
                    isOwnPolicyExpenseChat: true,
                });
                optimisticData.push({
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
                    value: {
                        parentReportID: selfDMReportID,
                        parentReportActionID: generatedReportActionID,
                    },
                });
                optimisticData.push({
                    onyxMethod: react_native_onyx_1.default.METHOD.SET,
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${selfDMReportID}${generatedReportActionID}`,
                    value: {
                        ...optimisticParentAction,
                        reportActionID: generatedReportActionID,
                        childReportID: reportID,
                    },
                });
                parameters.moneyRequestPreviewReportActionID = generatedReportActionID;
            }
        }
    }
    const isInviteOnboardingComplete = introSelected?.isInviteOnboardingComplete ?? false;
    const isOnboardingCompleted = onboarding?.hasCompletedGuidedSetupFlow ?? false;
    // Some cases we can have two open report requests with guide setup data because isInviteOnboardingComplete is not updated completely.
    // Then we need to check the list request and prevent the guided setup data from being duplicated.
    const allPersistedRequests = (0, PersistedRequests_1.getAll)();
    const hasOpenReportWithGuidedSetupData = allPersistedRequests.some((request) => request.command === types_1.WRITE_COMMANDS.OPEN_REPORT && request.data?.guidedSetupData);
    // Prepare guided setup data only when nvp_introSelected is set and onboarding is not completed
    // OldDot users will never have nvp_introSelected set, so they will not see guided setup messages
    if (introSelected && !isOnboardingCompleted && !isInviteOnboardingComplete && !hasOpenReportWithGuidedSetupData) {
        const { choice, inviteType } = introSelected;
        const isInviteIOUorInvoice = inviteType === CONST_1.default.ONBOARDING_INVITE_TYPES.IOU || inviteType === CONST_1.default.ONBOARDING_INVITE_TYPES.INVOICE;
        const isInviteChoiceCorrect = choice === CONST_1.default.ONBOARDING_CHOICES.ADMIN || choice === CONST_1.default.ONBOARDING_CHOICES.SUBMIT || choice === CONST_1.default.ONBOARDING_CHOICES.CHAT_SPLIT;
        if (isInviteChoiceCorrect && !isInviteIOUorInvoice) {
            const onboardingMessage = (0, OnboardingFlow_1.getOnboardingMessages)(true).onboardingMessages[choice];
            if (choice === CONST_1.default.ONBOARDING_CHOICES.CHAT_SPLIT) {
                const updatedTasks = onboardingMessage.tasks.map((task) => (task.type === 'startChat' ? { ...task, autoCompleted: true } : task));
                onboardingMessage.tasks = updatedTasks;
            }
            const onboardingData = (0, ReportUtils_1.prepareOnboardingOnyxData)(introSelected, choice, onboardingMessage);
            if (onboardingData) {
                optimisticData.push(...onboardingData.optimisticData, {
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: ONYXKEYS_1.default.NVP_INTRO_SELECTED,
                    value: {
                        isInviteOnboardingComplete: true,
                    },
                });
                successData.push(...onboardingData.successData);
                failureData.push(...onboardingData.failureData);
                parameters.guidedSetupData = JSON.stringify(onboardingData.guidedSetupData);
            }
        }
    }
    const isGroupChat = (0, ReportUtils_1.isGroupChat)(newReportObject);
    if (isGroupChat) {
        parameters.chatType = CONST_1.default.REPORT.CHAT_TYPE.GROUP;
        parameters.groupChatAdminLogins = currentUserEmail;
        parameters.optimisticAccountIDList = Object.keys(newReportObject?.participants ?? {}).join(',');
        parameters.reportName = newReportObject?.reportName ?? '';
        // If we have an avatar then include it with the parameters
        if (avatar) {
            parameters.file = avatar;
        }
        react_native_1.InteractionManager.runAfterInteractions(() => {
            clearGroupChat();
        });
    }
    if (isFromDeepLink) {
        parameters.shouldRetry = false;
    }
    // If we are creating a new report, we need to add the optimistic report data and a report action
    const isCreatingNewReport = !(0, EmptyObject_1.isEmptyObject)(newReportObject);
    if (isCreatingNewReport) {
        // Change the method to set for new reports because it doesn't exist yet, is faster,
        // and we need the data to be available when we navigate to the chat page
        const optimisticDataItem = optimisticData.at(0);
        if (optimisticDataItem) {
            optimisticDataItem.onyxMethod = react_native_onyx_1.default.METHOD.SET;
            optimisticDataItem.value = {
                ...optimisticReport,
                reportName: CONST_1.default.REPORT.DEFAULT_REPORT_NAME,
                ...newReportObject,
                pendingFields: {
                    createChat: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    ...(isGroupChat && { reportName: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD }),
                },
            };
        }
        let emailCreatingAction = CONST_1.default.REPORT.OWNER_EMAIL_FAKE;
        if (newReportObject.ownerAccountID && newReportObject.ownerAccountID !== CONST_1.default.REPORT.OWNER_ACCOUNT_ID_FAKE) {
            emailCreatingAction = allPersonalDetails?.[newReportObject.ownerAccountID]?.login ?? '';
        }
        const optimisticCreatedAction = (0, ReportUtils_1.buildOptimisticCreatedReportAction)(emailCreatingAction);
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: { [optimisticCreatedAction.reportActionID]: optimisticCreatedAction },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`,
            value: {
                isOptimisticReport: true,
            },
        });
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: { [optimisticCreatedAction.reportActionID]: { pendingAction: null } },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`,
            value: {
                isOptimisticReport: false,
            },
        });
        // Add optimistic personal details for new participants
        const optimisticPersonalDetails = {};
        const settledPersonalDetails = {};
        const redundantParticipants = {};
        const participantAccountIDs = PersonalDetailsUtils.getAccountIDsByLogins(participantLoginList);
        participantLoginList.forEach((login, index) => {
            const accountID = participantAccountIDs.at(index) ?? -1;
            const isOptimisticAccount = !allPersonalDetails?.[accountID];
            if (!isOptimisticAccount) {
                return;
            }
            optimisticPersonalDetails[accountID] = {
                login,
                accountID,
                displayName: login,
                isOptimisticPersonalDetail: true,
            };
            settledPersonalDetails[accountID] = null;
            // BE will send different participants. We clear the optimistic ones to avoid duplicated entries
            redundantParticipants[accountID] = null;
        });
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                participants: redundantParticipants,
                pendingFields: {
                    createChat: null,
                    reportName: null,
                },
                errorFields: {
                    createChat: null,
                },
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`,
            value: {
                isOptimisticReport: false,
            },
        });
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
            value: optimisticPersonalDetails,
        });
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
            value: settledPersonalDetails,
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
            value: settledPersonalDetails,
        });
        // Add the createdReportActionID parameter to the API call
        parameters.createdReportActionID = optimisticCreatedAction.reportActionID;
        // If we are creating a thread, ensure the report action has childReportID property added
        if (newReportObject.parentReportID && parentReportActionID) {
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${newReportObject.parentReportID}`,
                value: { [parentReportActionID]: { childReportID: reportID, childType: CONST_1.default.REPORT.TYPE.CHAT } },
            });
            failureData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${newReportObject.parentReportID}`,
                value: { [parentReportActionID]: { childType: '' } },
            });
        }
    }
    parameters.clientLastReadTime = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`]?.lastReadTime ?? '';
    const paginationConfig = {
        resourceID: reportID,
        cursorID: reportActionID,
    };
    if (isFromDeepLink) {
        finallyData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.IS_CHECKING_PUBLIC_ROOM,
            value: false,
        });
        API.paginate(CONST_1.default.API_REQUEST_TYPE.WRITE, types_1.WRITE_COMMANDS.OPEN_REPORT, parameters, { optimisticData, successData, failureData, finallyData }, paginationConfig);
    }
    else {
        // eslint-disable-next-line rulesdir/no-multiple-api-calls
        API.paginate(CONST_1.default.API_REQUEST_TYPE.WRITE, types_1.WRITE_COMMANDS.OPEN_REPORT, parameters, { optimisticData, successData, failureData, finallyData }, paginationConfig, {
            checkAndFixConflictingRequest: (persistedRequests) => (0, RequestConflictUtils_1.resolveOpenReportDuplicationConflictAction)(persistedRequests, parameters),
        });
    }
}
/**
 * This will return an optimistic report object for a given user we want to create a chat with without saving it, when the only thing we know about recipient is his accountID. *
 * @param accountID accountID of the user that the optimistic chat report is created with.
 */
function getOptimisticChatReport(accountID) {
    return (0, ReportUtils_1.buildOptimisticChatReport)({
        participantList: [accountID, currentUserAccountID],
        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
    });
}
function createTransactionThreadReport(iouReport, iouReportAction) {
    if (!iouReport || !iouReportAction) {
        Log_1.default.warn('Cannot build transaction thread report without iouReport and iouReportAction parameters');
        return;
    }
    const optimisticTransactionThreadReportID = (0, ReportUtils_1.generateReportID)();
    const optimisticTransactionThread = (0, ReportUtils_1.buildTransactionThread)(iouReportAction, iouReport, undefined, optimisticTransactionThreadReportID);
    openReport(optimisticTransactionThreadReportID, undefined, currentUserEmail ? [currentUserEmail] : [], optimisticTransactionThread, iouReportAction?.reportActionID);
    return optimisticTransactionThread;
}
/**
 * This will find an existing chat, or create a new one if none exists, for the given user or set of users. It will then navigate to this chat.
 *
 * @param userLogins list of user logins to start a chat report with.
 * @param shouldDismissModal a flag to determine if we should dismiss modal before navigate to report or navigate to report directly.
 */
function navigateToAndOpenReport(userLogins, shouldDismissModal = true, reportName, avatarUri, avatarFile, optimisticReportID, isGroupChat = false) {
    let newChat;
    let chat;
    const participantAccountIDs = PersonalDetailsUtils.getAccountIDsByLogins(userLogins);
    // If we are not creating a new Group Chat then we are creating a 1:1 DM and will look for an existing chat
    if (!isGroupChat) {
        chat = (0, ReportUtils_1.getChatByParticipants)([...participantAccountIDs, currentUserAccountID]);
    }
    if ((0, EmptyObject_1.isEmptyObject)(chat)) {
        if (isGroupChat) {
            // If we are creating a group chat then participantAccountIDs is expected to contain currentUserAccountID
            newChat = (0, ReportUtils_1.buildOptimisticGroupChatReport)(participantAccountIDs, reportName ?? '', avatarUri ?? '', optimisticReportID, CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN);
        }
        else {
            newChat = (0, ReportUtils_1.buildOptimisticChatReport)({
                participantList: [...participantAccountIDs, currentUserAccountID],
                notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN,
            });
        }
        // We want to pass newChat here because if anything is passed in that param (even an existing chat), we will try to create a chat on the server
        openReport(newChat?.reportID, '', userLogins, newChat, undefined, undefined, undefined, avatarFile);
    }
    const report = (0, EmptyObject_1.isEmptyObject)(chat) ? newChat : chat;
    if (shouldDismissModal) {
        Navigation_1.default.onModalDismissedOnce(() => {
            Navigation_1.default.onModalDismissedOnce(() => {
                if (!report?.reportID) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(report.reportID));
            });
        });
        Navigation_1.default.dismissModal();
    }
    else if (report?.reportID) {
        Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(report.reportID));
    }
    // In some cases when RHP modal gets hidden and then we navigate to report Composer focus breaks, wrapping navigation in setTimeout fixes this
    setTimeout(() => {
        Navigation_1.default.isNavigationReady().then(() => Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(report?.reportID)));
    }, 0);
}
/**
 * This will find an existing chat, or create a new one if none exists, for the given accountID or set of accountIDs. It will then navigate to this chat.
 *
 * @param participantAccountIDs of user logins to start a chat report with.
 */
function navigateToAndOpenReportWithAccountIDs(participantAccountIDs) {
    let newChat;
    const chat = (0, ReportUtils_1.getChatByParticipants)([...participantAccountIDs, currentUserAccountID]);
    if (!chat) {
        newChat = (0, ReportUtils_1.buildOptimisticChatReport)({
            participantList: [...participantAccountIDs, currentUserAccountID],
        });
        // We want to pass newChat here because if anything is passed in that param (even an existing chat), we will try to create a chat on the server
        openReport(newChat?.reportID, '', [], newChat, '0', false, participantAccountIDs);
    }
    const report = chat ?? newChat;
    Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(report?.reportID));
}
/**
 * This will navigate to an existing thread, or create a new one if necessary
 *
 * @param childReportID The reportID we are trying to open
 * @param parentReportAction the parent comment of a thread
 * @param parentReportID The reportID of the parent
 */
function navigateToAndOpenChildReport(childReportID, parentReportAction = {}, parentReportID) {
    const childReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${childReportID}`];
    if (childReport?.reportID) {
        Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(childReportID, undefined, undefined, Navigation_1.default.getActiveRoute()));
    }
    else {
        const participantAccountIDs = [...new Set([currentUserAccountID, Number(parentReportAction.actorAccountID)])];
        const parentReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReportID}`];
        // Threads from DMs and selfDMs don't have a chatType. All other threads inherit the chatType from their parent
        const childReportChatType = parentReport && (0, ReportUtils_1.isSelfDM)(parentReport) ? undefined : parentReport?.chatType;
        const newChat = (0, ReportUtils_1.buildOptimisticChatReport)({
            participantList: participantAccountIDs,
            reportName: ReportActionsUtils.getReportActionText(parentReportAction),
            chatType: childReportChatType,
            policyID: parentReport?.policyID ?? CONST_1.default.POLICY.OWNER_EMAIL_FAKE,
            ownerAccountID: CONST_1.default.POLICY.OWNER_ACCOUNT_ID_FAKE,
            oldPolicyName: parentReport?.policyName ?? '',
            notificationPreference: (0, ReportUtils_1.getChildReportNotificationPreference)(parentReportAction),
            parentReportActionID: parentReportAction.reportActionID,
            parentReportID,
            optimisticReportID: childReportID,
        });
        if (!childReportID) {
            const participantLogins = PersonalDetailsUtils.getLoginsByAccountIDs(Object.keys(newChat.participants ?? {}).map(Number));
            openReport(newChat.reportID, '', participantLogins, newChat, parentReportAction.reportActionID);
        }
        else {
            react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${childReportID}`, newChat);
        }
        Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(newChat.reportID, undefined, undefined, Navigation_1.default.getActiveRoute()));
    }
}
/**
 * Gets the older actions that have not been read yet.
 * Normally happens when you scroll up on a chat, and the actions have not been read yet.
 */
function getOlderActions(reportID, reportActionID) {
    if (!reportID || !reportActionID) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`,
            value: {
                isLoadingOlderReportActions: true,
                hasLoadingOlderReportActionsError: false,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`,
            value: {
                isLoadingOlderReportActions: false,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`,
            value: {
                isLoadingOlderReportActions: false,
                hasLoadingOlderReportActionsError: true,
            },
        },
    ];
    const parameters = {
        reportID,
        reportActionID,
    };
    API.paginate(CONST_1.default.API_REQUEST_TYPE.READ, types_1.READ_COMMANDS.GET_OLDER_ACTIONS, parameters, { optimisticData, successData, failureData }, {
        resourceID: reportID,
        cursorID: reportActionID,
    });
}
/**
 * Gets the newer actions that have not been read yet.
 * Normally happens when you are not located at the bottom of the list and scroll down on a chat.
 */
function getNewerActions(reportID, reportActionID) {
    if (!reportID || !reportActionID) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`,
            value: {
                isLoadingNewerReportActions: true,
                hasLoadingNewerReportActionsError: false,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`,
            value: {
                isLoadingNewerReportActions: false,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`,
            value: {
                isLoadingNewerReportActions: false,
                hasLoadingNewerReportActionsError: true,
            },
        },
    ];
    const parameters = {
        reportID,
        reportActionID,
    };
    API.paginate(CONST_1.default.API_REQUEST_TYPE.READ, types_1.READ_COMMANDS.GET_NEWER_ACTIONS, parameters, { optimisticData, successData, failureData }, {
        resourceID: reportID,
        cursorID: reportActionID,
    });
}
/**
 * Gets metadata info about links in the provided report action
 */
function expandURLPreview(reportID, reportActionID) {
    if (!reportID) {
        return;
    }
    const parameters = {
        reportID,
        reportActionID,
    };
    API.read(types_1.READ_COMMANDS.EXPAND_URL_PREVIEW, parameters);
}
/** Marks the new report actions as read
 * @param shouldResetUnreadMarker Indicates whether the unread indicator should be reset.
 * Currently, the unread indicator needs to be reset only when users mark a report as read.
 */
function readNewestAction(reportID, shouldResetUnreadMarker = false) {
    if (!reportID) {
        return;
    }
    const lastReadTime = DateUtils_1.default.getDBTimeWithSkew();
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                lastReadTime,
            },
        },
    ];
    const parameters = {
        reportID,
        lastReadTime,
    };
    API.writeWithNoDuplicatesConflictAction(types_1.WRITE_COMMANDS.READ_NEWEST_ACTION, parameters, { optimisticData }, (request) => request.command === types_1.WRITE_COMMANDS.READ_NEWEST_ACTION && request.data?.reportID === parameters.reportID);
    if (shouldResetUnreadMarker) {
        react_native_1.DeviceEventEmitter.emit(`readNewestAction_${reportID}`, lastReadTime);
    }
}
function markAllMessagesAsRead() {
    if ((0, Session_1.isAnonymousUser)()) {
        return;
    }
    const newLastReadTime = DateUtils_1.default.getDBTimeWithSkew();
    const optimisticReports = {};
    const failureReports = {};
    const reportIDList = [];
    Object.values(allReports ?? {}).forEach((report) => {
        if (!report) {
            return;
        }
        const chatReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.chatReportID}`];
        const oneTransactionThreadReportID = ReportActionsUtils.getOneTransactionThreadReportID(report, chatReport, allReportActions?.[report.reportID]);
        const oneTransactionThreadReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${oneTransactionThreadReportID}`];
        if (!(0, ReportUtils_1.isUnread)(report, oneTransactionThreadReport)) {
            return;
        }
        const reportKey = `${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`;
        optimisticReports[reportKey] = { lastReadTime: newLastReadTime };
        failureReports[reportKey] = { lastReadTime: report.lastReadTime ?? null };
        reportIDList.push(report.reportID);
    });
    if (reportIDList.length === 0) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE_COLLECTION,
            key: ONYXKEYS_1.default.COLLECTION.REPORT,
            value: optimisticReports,
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE_COLLECTION,
            key: ONYXKEYS_1.default.COLLECTION.REPORT,
            value: failureReports,
        },
    ];
    const parameters = {
        reportIDList,
    };
    API.write(types_1.WRITE_COMMANDS.MARK_ALL_MESSAGES_AS_READ, parameters, { optimisticData, failureData });
}
/**
 * Sets the last read time on a report
 */
function markCommentAsUnread(reportID, reportAction) {
    if (!reportID) {
        Log_1.default.warn('7339cd6c-3263-4f89-98e5-730f0be15784 Invalid report passed to MarkCommentAsUnread. Not calling the API because it wil fail.');
        return;
    }
    const reportActions = allReportActions?.[reportID];
    // Find the latest report actions from other users
    const latestReportActionFromOtherUsers = Object.values(reportActions ?? {}).reduce((latest, current) => {
        if (!ReportActionsUtils.isDeletedAction(current) &&
            current.actorAccountID !== currentUserAccountID &&
            (!latest || current.created > latest.created) &&
            // Whisper action doesn't affect lastVisibleActionCreated, so skip whisper action except actionable mention whisper
            (!ReportActionsUtils.isWhisperAction(current) || current.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.ACTIONABLE_MENTION_WHISPER)) {
            return current;
        }
        return latest;
    }, null);
    const report = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
    const chatReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.chatReportID}`];
    const transactionThreadReportID = ReportActionsUtils.getOneTransactionThreadReportID(report, chatReport, reportActions ?? []);
    const transactionThreadReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReportID}`];
    // If no action created date is provided, use the last action's from other user
    const actionCreationTime = reportAction?.created || (latestReportActionFromOtherUsers?.created ?? (0, ReportUtils_1.getReportLastVisibleActionCreated)(report, transactionThreadReport) ?? DateUtils_1.default.getDBTime(0));
    // We subtract 1 millisecond so that the lastReadTime is updated to just before a given reportAction's created date
    // For example, if we want to mark a report action with ID 100 and created date '2014-04-01 16:07:02.999' unread, we set the lastReadTime to '2014-04-01 16:07:02.998'
    // Since the report action with ID 100 will be the first with a timestamp above '2014-04-01 16:07:02.998', it's the first one that will be shown as unread
    const lastReadTime = DateUtils_1.default.subtractMillisecondsFromDateTime(actionCreationTime, 1);
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                lastReadTime,
            },
        },
    ];
    const parameters = {
        reportID,
        lastReadTime,
        reportActionID: reportAction?.reportActionID,
    };
    API.write(types_1.WRITE_COMMANDS.MARK_AS_UNREAD, parameters, { optimisticData });
    react_native_1.DeviceEventEmitter.emit(`unreadAction_${reportID}`, lastReadTime);
}
/** Toggles the pinned state of the report. */
function togglePinnedState(reportID, isPinnedChat) {
    if (!reportID) {
        return;
    }
    const pinnedValue = !isPinnedChat;
    // Optimistically pin/unpin the report before we send out the command
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: { isPinned: pinnedValue },
        },
    ];
    const parameters = {
        reportID,
        pinnedValue,
    };
    API.write(types_1.WRITE_COMMANDS.TOGGLE_PINNED_CHAT, parameters, { optimisticData });
}
/** Saves the report draft to Onyx */
function saveReportDraft(reportID, report) {
    return react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT}${reportID}`, report);
}
/**
 * Saves the comment left by the user as they are typing. By saving this data the user can switch between chats, close
 * tab, refresh etc without worrying about loosing what they typed out.
 * When empty string or null is passed, it will delete the draft comment from Onyx store.
 */
function saveReportDraftComment(reportID, comment, callback = () => { }) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT_COMMENT}${reportID}`, (0, DraftCommentUtils_1.prepareDraftComment)(comment)).then(callback);
}
/** Broadcasts whether or not a user is typing on a report over the report's private pusher channel. */
function broadcastUserIsTyping(reportID) {
    const privateReportChannelName = getReportChannelName(reportID);
    const typingStatus = {
        [currentUserAccountID]: true,
    };
    Pusher_1.default.sendEvent(privateReportChannelName, Pusher_1.default.TYPE.USER_IS_TYPING, typingStatus);
}
/** Broadcasts to the report's private pusher channel whether a user is leaving a report */
function broadcastUserIsLeavingRoom(reportID) {
    const privateReportChannelName = getReportChannelName(reportID);
    const leavingStatus = {
        [currentUserAccountID]: true,
    };
    Pusher_1.default.sendEvent(privateReportChannelName, Pusher_1.default.TYPE.USER_IS_LEAVING_ROOM, leavingStatus);
}
/** When a report changes in Onyx, this fetches the report from the API if the report doesn't have a name */
function handleReportChanged(report) {
    if (!report) {
        return;
    }
    const { reportID, preexistingReportID, parentReportID, parentReportActionID } = report;
    // Handle cleanup of stale optimistic IOU report and its report preview separately
    if (reportID && preexistingReportID && (0, ReportUtils_1.isMoneyRequestReport)(report) && parentReportActionID) {
        react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${parentReportID}`, {
            [parentReportActionID]: null,
        });
        react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, null);
        return;
    }
    // It is possible that we optimistically created a DM/group-DM for a set of users for which a report already exists.
    // In this case, the API will let us know by returning a preexistingReportID.
    // We should clear out the optimistically created report and re-route the user to the preexisting report.
    if (reportID && preexistingReportID) {
        let callback = () => {
            const existingReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${preexistingReportID}`];
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, null);
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${preexistingReportID}`, {
                ...report,
                reportID: preexistingReportID,
                preexistingReportID: null,
                // Replacing the existing report's participants to avoid duplicates
                participants: existingReport?.participants ?? report.participants,
            });
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT_COMMENT}${reportID}`, null);
        };
        // Only re-route them if they are still looking at the optimistically created report
        if (Navigation_1.default.getActiveRoute().includes(`/r/${reportID}`)) {
            const currCallback = callback;
            callback = () => {
                currCallback();
                Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(preexistingReportID), { forceReplace: true });
            };
            // The report screen will listen to this event and transfer the draft comment to the existing report
            // This will allow the newest draft comment to be transferred to the existing report
            react_native_1.DeviceEventEmitter.emit(`switchToPreExistingReport_${reportID}`, {
                preexistingReportID,
                callback,
            });
            return;
        }
        // In case the user is not on the report screen, we will transfer the report draft comment directly to the existing report
        // after that clear the optimistically created report
        const draftReportComment = allReportDraftComments?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT_COMMENT}${reportID}`];
        if (!draftReportComment) {
            callback();
            return;
        }
        saveReportDraftComment(preexistingReportID, draftReportComment, callback);
    }
}
/** Deletes a comment from the report, basically sets it as empty string */
function deleteReportComment(reportID, reportAction, isReportArchived = false) {
    const originalReportID = (0, ReportUtils_1.getOriginalReportID)(reportID, reportAction);
    const reportActionID = reportAction.reportActionID;
    if (!reportActionID || !originalReportID || !reportID) {
        return;
    }
    const isDeletedParentAction = ReportActionsUtils.isThreadParentMessage(reportAction, reportID);
    const deletedMessage = [
        {
            translationKey: '',
            type: 'COMMENT',
            html: '',
            text: '',
            isEdited: true,
            isDeletedParentAction,
        },
    ];
    const optimisticReportActions = {
        [reportActionID]: {
            pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
            previousMessage: reportAction.message,
            message: deletedMessage,
            errors: null,
            linkMetadata: [],
        },
    };
    // If we are deleting the last visible message, let's find the previous visible one (or set an empty one if there are none) and update the lastMessageText in the LHN.
    // Similarly, if we are deleting the last read comment we will want to update the lastVisibleActionCreated to use the previous visible message.
    let optimisticReport = {
        lastMessageText: '',
        lastVisibleActionCreated: '',
    };
    const { lastMessageText = '' } = (0, ReportUtils_1.getLastVisibleMessage)(originalReportID, optimisticReportActions, isReportArchived);
    const report = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
    const canUserPerformWriteAction = (0, ReportUtils_1.canUserPerformWriteAction)(report);
    if (lastMessageText) {
        const lastVisibleAction = ReportActionsUtils.getLastVisibleAction(originalReportID, canUserPerformWriteAction, optimisticReportActions);
        const lastVisibleActionCreated = lastVisibleAction?.created;
        const lastActorAccountID = lastVisibleAction?.actorAccountID;
        optimisticReport = {
            lastMessageText,
            lastVisibleActionCreated,
            lastActorAccountID,
        };
    }
    const didCommentMentionCurrentUser = ReportActionsUtils.didMessageMentionCurrentUser(reportAction);
    if (didCommentMentionCurrentUser && reportAction.created === report?.lastMentionedTime) {
        const reportActionsForReport = allReportActions?.[reportID];
        const latestMentionedReportAction = Object.values(reportActionsForReport ?? {}).find((action) => action.reportActionID !== reportAction.reportActionID &&
            ReportActionsUtils.didMessageMentionCurrentUser(action) &&
            ReportActionsUtils.shouldReportActionBeVisible(action, action.reportActionID));
        optimisticReport.lastMentionedTime = latestMentionedReportAction?.created ?? null;
    }
    // If the API call fails we must show the original message again, so we revert the message content back to how it was
    // and and remove the pendingAction so the strike-through clears
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${originalReportID}`,
            value: {
                [reportActionID]: {
                    message: reportAction.message,
                    pendingAction: null,
                    previousMessage: null,
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${originalReportID}`,
            value: {
                [reportActionID]: {
                    pendingAction: null,
                    previousMessage: null,
                },
            },
        },
    ];
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${originalReportID}`,
            value: optimisticReportActions,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${originalReportID}`,
            value: optimisticReport,
        },
    ];
    // Update optimistic data for parent report action if the report is a child report and the reportAction has no visible child
    const childVisibleActionCount = reportAction.childVisibleActionCount ?? 0;
    if (childVisibleActionCount === 0) {
        const originalReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${originalReportID}`];
        const optimisticParentReportData = (0, ReportUtils_1.getOptimisticDataForParentReportAction)(originalReport, optimisticReport?.lastVisibleActionCreated ?? '', CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
        optimisticParentReportData.forEach((parentReportData) => {
            if ((0, EmptyObject_1.isEmptyObject)(parentReportData)) {
                return;
            }
            optimisticData.push(parentReportData);
        });
    }
    const parameters = {
        reportID: originalReportID,
        reportActionID,
    };
    (0, CachedPDFPaths_1.clearByKey)(reportActionID);
    API.write(types_1.WRITE_COMMANDS.DELETE_COMMENT, parameters, { optimisticData, successData, failureData }, {
        checkAndFixConflictingRequest: (persistedRequests) => (0, RequestConflictUtils_1.resolveCommentDeletionConflicts)(persistedRequests, reportActionID, originalReportID),
    });
    // if we are linking to the report action, and we are deleting it, and it's not a deleted parent action,
    // we should navigate to its report in order to not show not found page
    if (Navigation_1.default.isActiveRoute(ROUTES_1.default.REPORT_WITH_ID.getRoute(reportID, reportActionID)) && !isDeletedParentAction) {
        Navigation_1.default.goBack(ROUTES_1.default.REPORT_WITH_ID.getRoute(reportID));
    }
    else if (Navigation_1.default.isActiveRoute(ROUTES_1.default.REPORT_WITH_ID.getRoute(reportAction.childReportID)) && !isDeletedParentAction) {
        Navigation_1.default.goBack(undefined);
    }
}
/**
 * Removes the links in html of a comment.
 * example:
 *      html="test <a href="https://www.google.com" target="_blank" rel="noreferrer noopener">https://www.google.com</a> test"
 *      links=["https://www.google.com"]
 * returns: "test https://www.google.com test"
 */
function removeLinksFromHtml(html, links) {
    let htmlCopy = html.slice();
    links.forEach((link) => {
        // We want to match the anchor tag of the link and replace the whole anchor tag with the text of the anchor tag
        const regex = new RegExp(`<(a)[^><]*href\\s*=\\s*(['"])(${expensify_common_1.Str.escapeForRegExp(link)})\\2(?:".*?"|'.*?'|[^'"><])*>([\\s\\S]*?)<\\/\\1>(?![^<]*(<\\/pre>|<\\/code>))`, 'g');
        htmlCopy = htmlCopy.replace(regex, '$4');
    });
    return htmlCopy;
}
/**
 * This function will handle removing only links that were purposely removed by the user while editing.
 *
 * @param newCommentText text of the comment after editing.
 * @param originalCommentMarkdown original markdown of the comment before editing.
 * @param videoAttributeCache cache of video attributes ([videoSource]: videoAttributes)
 */
function handleUserDeletedLinksInHtml(newCommentText, originalCommentMarkdown, videoAttributeCache) {
    if (newCommentText.length > CONST_1.default.MAX_MARKUP_LENGTH) {
        return newCommentText;
    }
    const userEmailDomain = (0, LoginUtils_1.isEmailPublicDomain)(currentUserEmail ?? '') ? '' : expensify_common_1.Str.extractEmailDomain(currentUserEmail ?? '');
    const allPersonalDetailLogins = Object.values(allPersonalDetails ?? {}).map((personalDetail) => personalDetail?.login ?? '');
    const htmlForNewComment = (0, ParsingUtils_1.getParsedMessageWithShortMentions)({
        text: newCommentText,
        userEmailDomain,
        availableMentionLogins: allPersonalDetailLogins,
        parserOptions: {
            extras: { videoAttributeCache },
        },
    });
    const removedLinks = Parser_1.default.getRemovedMarkdownLinks(originalCommentMarkdown, newCommentText);
    return removeLinksFromHtml(htmlForNewComment, removedLinks);
}
/** Saves a new message for a comment. Marks the comment as edited, which will be reflected in the UI. */
function editReportComment(reportID, originalReportAction, textForNewComment, videoAttributeCache) {
    const originalReportID = (0, ReportUtils_1.getOriginalReportID)(reportID, originalReportAction);
    if (!originalReportID || !originalReportAction) {
        return;
    }
    const report = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${originalReportID}`];
    const canUserPerformWriteAction = (0, ReportUtils_1.canUserPerformWriteAction)(report);
    // Do not autolink if someone explicitly tries to remove a link from message.
    // https://github.com/Expensify/App/issues/9090
    // https://github.com/Expensify/App/issues/13221
    const originalCommentHTML = ReportActionsUtils.getReportActionHtml(originalReportAction);
    const originalCommentMarkdown = Parser_1.default.htmlToMarkdown(originalCommentHTML ?? '').trim();
    // Skip the Edit if draft is not changed
    if (originalCommentMarkdown === textForNewComment) {
        return;
    }
    const htmlForNewComment = handleUserDeletedLinksInHtml(textForNewComment, originalCommentMarkdown, videoAttributeCache);
    const reportComment = Parser_1.default.htmlToText(htmlForNewComment);
    // For comments shorter than or equal to 10k chars, convert the comment from MD into HTML because that's how it is stored in the database
    // For longer comments, skip parsing and display plaintext for performance reasons. It takes over 40s to parse a 100k long string!!
    let parsedOriginalCommentHTML = originalCommentHTML;
    if (textForNewComment.length <= CONST_1.default.MAX_MARKUP_LENGTH) {
        const autolinkFilter = { filterRules: Parser_1.default.rules.map((rule) => rule.name).filter((name) => name !== 'autolink') };
        parsedOriginalCommentHTML = Parser_1.default.replace(originalCommentMarkdown, autolinkFilter);
    }
    //  Delete the comment if it's empty
    if (!htmlForNewComment) {
        deleteReportComment(originalReportID, originalReportAction);
        return;
    }
    // Skip the Edit if message is not changed
    if (parsedOriginalCommentHTML === htmlForNewComment.trim() || originalCommentHTML === htmlForNewComment.trim()) {
        return;
    }
    // Optimistically update the reportAction with the new message
    const reportActionID = originalReportAction.reportActionID;
    const originalMessage = ReportActionsUtils.getReportActionMessage(originalReportAction);
    const optimisticReportActions = {
        [reportActionID]: {
            pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
            message: [
                {
                    ...originalMessage,
                    type: CONST_1.default.REPORT.MESSAGE.TYPE.COMMENT,
                    isEdited: true,
                    html: htmlForNewComment,
                    text: reportComment,
                },
            ],
            lastModified: DateUtils_1.default.getDBTime(),
        },
    };
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${originalReportID}`,
            value: optimisticReportActions,
        },
    ];
    const lastVisibleAction = ReportActionsUtils.getLastVisibleAction(originalReportID, canUserPerformWriteAction, optimisticReportActions);
    if (reportActionID === lastVisibleAction?.reportActionID) {
        const lastMessageText = (0, ReportUtils_1.formatReportLastMessageText)(reportComment);
        const optimisticReport = {
            lastMessageText,
        };
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${originalReportID}`,
            value: optimisticReport,
        });
    }
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${originalReportID}`,
            value: {
                [reportActionID]: {
                    ...originalReportAction,
                    pendingAction: null,
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${originalReportID}`,
            value: {
                [reportActionID]: {
                    pendingAction: null,
                },
            },
        },
    ];
    const parameters = {
        reportID: originalReportID,
        reportComment: htmlForNewComment,
        reportActionID,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_COMMENT, parameters, { optimisticData, successData, failureData }, {
        checkAndFixConflictingRequest: (persistedRequests) => {
            const addCommentIndex = persistedRequests.findIndex((request) => addNewMessageWithText.has(request.command) && request.data?.reportActionID === reportActionID);
            if (addCommentIndex > -1) {
                return (0, RequestConflictUtils_1.resolveEditCommentWithNewAddCommentRequest)(persistedRequests, parameters, reportActionID, addCommentIndex);
            }
            return (0, RequestConflictUtils_1.resolveDuplicationConflictAction)(persistedRequests, (0, RequestConflictUtils_1.createUpdateCommentMatcher)(reportActionID));
        },
    });
}
/** Deletes the draft for a comment report action. */
function deleteReportActionDraft(reportID, reportAction) {
    const originalReportID = (0, ReportUtils_1.getOriginalReportID)(reportID, reportAction);
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS}${originalReportID}`, { [reportAction.reportActionID]: null });
}
/** Saves the draft for a comment report action. This will put the comment into "edit mode" */
function saveReportActionDraft(reportID, reportAction, draftMessage) {
    const originalReportID = (0, ReportUtils_1.getOriginalReportID)(reportID, reportAction);
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS}${originalReportID}`, { [reportAction.reportActionID]: { message: draftMessage } });
}
function updateNotificationPreference(reportID, previousValue, newValue, parentReportID, parentReportActionID) {
    // No change needed
    if (previousValue === newValue) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                participants: {
                    [currentUserAccountID]: {
                        notificationPreference: newValue,
                    },
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                participants: {
                    [currentUserAccountID]: {
                        notificationPreference: previousValue,
                    },
                },
            },
        },
    ];
    if (parentReportID && parentReportActionID) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${parentReportID}`,
            value: { [parentReportActionID]: { childReportNotificationPreference: newValue } },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${parentReportID}`,
            value: { [parentReportActionID]: { childReportNotificationPreference: previousValue } },
        });
    }
    const parameters = { reportID, notificationPreference: newValue };
    API.write(types_1.WRITE_COMMANDS.UPDATE_REPORT_NOTIFICATION_PREFERENCE, parameters, { optimisticData, failureData });
}
function updateRoomVisibility(reportID, previousValue, newValue) {
    if (previousValue === newValue) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: { visibility: newValue },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: { visibility: previousValue },
        },
    ];
    const parameters = { reportID, visibility: newValue };
    API.write(types_1.WRITE_COMMANDS.UPDATE_ROOM_VISIBILITY, parameters, { optimisticData, failureData });
}
/**
 * This will subscribe to an existing thread, or create a new one and then subscribe to it if necessary
 *
 * @param childReportID The reportID we are trying to open
 * @param parentReportAction the parent comment of a thread
 * @param parentReportID The reportID of the parent
 * @param prevNotificationPreference The previous notification preference for the child report
 */
function toggleSubscribeToChildReport(childReportID, parentReportAction = {}, parentReportID, prevNotificationPreference) {
    if (childReportID) {
        openReport(childReportID);
        const parentReportActionID = parentReportAction?.reportActionID;
        if (!prevNotificationPreference || (0, ReportUtils_1.isHiddenForCurrentUser)(prevNotificationPreference)) {
            updateNotificationPreference(childReportID, prevNotificationPreference, CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS, parentReportID, parentReportActionID);
        }
        else {
            updateNotificationPreference(childReportID, prevNotificationPreference, CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN, parentReportID, parentReportActionID);
        }
    }
    else {
        const participantAccountIDs = [...new Set([currentUserAccountID, Number(parentReportAction?.actorAccountID)])];
        const parentReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReportID}`];
        const newChat = (0, ReportUtils_1.buildOptimisticChatReport)({
            participantList: participantAccountIDs,
            reportName: ReportActionsUtils.getReportActionText(parentReportAction),
            chatType: parentReport?.chatType,
            policyID: parentReport?.policyID ?? CONST_1.default.POLICY.OWNER_EMAIL_FAKE,
            ownerAccountID: CONST_1.default.POLICY.OWNER_ACCOUNT_ID_FAKE,
            notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
            parentReportActionID: parentReportAction.reportActionID,
            parentReportID,
        });
        const participantLogins = PersonalDetailsUtils.getLoginsByAccountIDs(participantAccountIDs);
        openReport(newChat.reportID, '', participantLogins, newChat, parentReportAction.reportActionID);
        const notificationPreference = (0, ReportUtils_1.isHiddenForCurrentUser)(prevNotificationPreference) ? CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS : CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN;
        updateNotificationPreference(newChat.reportID, prevNotificationPreference, notificationPreference, parentReportID, parentReportAction?.reportActionID);
    }
}
function updateReportName(reportID, value, previousValue) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                reportName: value,
                pendingFields: {
                    reportName: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                reportName: previousValue,
                pendingFields: {
                    reportName: null,
                },
                errorFields: {
                    reportName: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('report.genericUpdateReportNameEditFailureMessage'),
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                pendingFields: {
                    reportName: null,
                },
                errorFields: {
                    reportName: null,
                },
            },
        },
    ];
    const parameters = {
        reportID,
        reportName: value,
    };
    API.write(types_1.WRITE_COMMANDS.SET_REPORT_NAME, parameters, { optimisticData, failureData, successData });
}
function clearReportFieldKeyErrors(reportID, fieldKey) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, {
        pendingFields: {
            [fieldKey]: null,
        },
        errorFields: {
            [fieldKey]: null,
        },
    });
}
function updateReportField(report, reportField, previousReportField, policy, shouldFixViolations = false) {
    const reportID = report.reportID;
    const fieldKey = (0, ReportUtils_1.getReportFieldKey)(reportField.fieldID);
    const reportViolations = (0, ReportUtils_1.getReportViolations)(reportID);
    const fieldViolation = (0, ReportUtils_1.getFieldViolation)(reportViolations, reportField);
    const recentlyUsedValues = allRecentlyUsedReportFields?.[fieldKey] ?? [];
    const optimisticChangeFieldAction = (0, ReportUtils_1.buildOptimisticChangeFieldAction)(reportField, previousReportField);
    const predictedNextStatus = policy?.reimbursementChoice === CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_NO ? CONST_1.default.REPORT.STATUS_NUM.CLOSED : CONST_1.default.REPORT.STATUS_NUM.OPEN;
    const optimisticNextStep = (0, NextStepUtils_1.buildNextStep)(report, predictedNextStatus, shouldFixViolations);
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                fieldList: {
                    [fieldKey]: reportField,
                },
                pendingFields: {
                    [fieldKey]: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${reportID}`,
            value: optimisticNextStep,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [optimisticChangeFieldAction.reportActionID]: optimisticChangeFieldAction,
            },
        },
    ];
    if (fieldViolation) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_VIOLATIONS}${reportID}`,
            value: {
                [fieldViolation]: {
                    [reportField.fieldID]: null,
                },
            },
        });
    }
    if (reportField.type === 'dropdown' && reportField.value) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.RECENTLY_USED_REPORT_FIELDS,
            value: {
                [fieldKey]: [...new Set([...recentlyUsedValues, reportField.value])],
            },
        });
    }
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                fieldList: {
                    [fieldKey]: previousReportField,
                },
                pendingFields: {
                    [fieldKey]: null,
                },
                errorFields: {
                    [fieldKey]: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('report.genericUpdateReportFieldFailureMessage'),
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [optimisticChangeFieldAction.reportActionID]: {
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('report.genericUpdateReportFieldFailureMessage'),
                },
            },
        },
    ];
    if (reportField.type === 'dropdown') {
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.RECENTLY_USED_REPORT_FIELDS,
            value: {
                [fieldKey]: recentlyUsedValues,
            },
        });
    }
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                pendingFields: {
                    [fieldKey]: null,
                },
                errorFields: {
                    [fieldKey]: null,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [optimisticChangeFieldAction.reportActionID]: {
                    pendingAction: null,
                },
            },
        },
    ];
    const parameters = {
        reportID,
        reportFields: JSON.stringify({ [fieldKey]: reportField }),
        reportFieldsActionIDs: JSON.stringify({ [fieldKey]: optimisticChangeFieldAction.reportActionID }),
    };
    API.write(types_1.WRITE_COMMANDS.SET_REPORT_FIELD, parameters, { optimisticData, failureData, successData });
}
function deleteReportField(reportID, reportField) {
    const fieldKey = (0, ReportUtils_1.getReportFieldKey)(reportField.fieldID);
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                fieldList: {
                    [fieldKey]: null,
                },
                pendingFields: {
                    [fieldKey]: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                fieldList: {
                    [fieldKey]: reportField,
                },
                pendingFields: {
                    [fieldKey]: null,
                },
                errorFields: {
                    [fieldKey]: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('report.genericUpdateReportFieldFailureMessage'),
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                pendingFields: {
                    [fieldKey]: null,
                },
                errorFields: {
                    [fieldKey]: null,
                },
            },
        },
    ];
    const parameters = {
        reportID,
        fieldID: fieldKey,
    };
    API.write(types_1.WRITE_COMMANDS.DELETE_REPORT_FIELD, parameters, { optimisticData, failureData, successData });
}
function updateDescription(reportID, currentDescription, newMarkdownValue) {
    // No change needed
    if (Parser_1.default.htmlToMarkdown(currentDescription) === newMarkdownValue) {
        return;
    }
    const parsedDescription = (0, ReportUtils_1.getParsedComment)(newMarkdownValue, { reportID });
    const optimisticDescriptionUpdatedReportAction = (0, ReportUtils_1.buildOptimisticRoomDescriptionUpdatedReportAction)(parsedDescription);
    const report = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                description: parsedDescription,
                pendingFields: { description: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
                lastActorAccountID: currentUserAccountID,
                lastVisibleActionCreated: optimisticDescriptionUpdatedReportAction.created,
                lastMessageText: optimisticDescriptionUpdatedReportAction?.message?.at(0)?.text,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [optimisticDescriptionUpdatedReportAction.reportActionID]: optimisticDescriptionUpdatedReportAction,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                description: currentDescription,
                pendingFields: { description: null },
                lastActorAccountID: report?.lastActorAccountID,
                lastVisibleActionCreated: report?.lastVisibleActionCreated,
                lastMessageText: report?.lastMessageText,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [optimisticDescriptionUpdatedReportAction.reportActionID]: null,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: { pendingFields: { description: null } },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [optimisticDescriptionUpdatedReportAction.reportActionID]: { pendingAction: null },
            },
        },
    ];
    const parameters = { reportID, description: parsedDescription, reportActionID: optimisticDescriptionUpdatedReportAction.reportActionID };
    API.write(types_1.WRITE_COMMANDS.UPDATE_ROOM_DESCRIPTION, parameters, { optimisticData, failureData, successData });
}
function updateWriteCapability(report, newValue) {
    // No change needed
    if (report.writeCapability === newValue) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`,
            value: { writeCapability: newValue },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`,
            value: { writeCapability: report.writeCapability },
        },
    ];
    const parameters = { reportID: report.reportID, writeCapability: newValue };
    API.write(types_1.WRITE_COMMANDS.UPDATE_REPORT_WRITE_CAPABILITY, parameters, { optimisticData, failureData });
}
/**
 * Navigates to the 1:1 report with Concierge
 */
function navigateToConciergeChat(shouldDismissModal = false, checkIfCurrentPageActive = () => true, linkToOptions, reportActionID) {
    // If conciergeReportID contains a concierge report ID, we navigate to the concierge chat using the stored report ID.
    // Otherwise, we would find the concierge chat and navigate to it.
    if (!conciergeReportID) {
        // In order to avoid creating concierge repeatedly,
        // we need to ensure that the server data has been successfully pulled
        (0, Welcome_1.onServerDataReady)().then(() => {
            // If we don't have a chat with Concierge then create it
            if (!checkIfCurrentPageActive()) {
                return;
            }
            navigateToAndOpenReport([CONST_1.default.EMAIL.CONCIERGE], shouldDismissModal);
        });
    }
    else if (shouldDismissModal) {
        Navigation_1.default.dismissModalWithReport({ reportID: conciergeReportID, reportActionID });
    }
    else {
        Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(conciergeReportID), linkToOptions);
    }
}
function buildNewReportOptimisticData(policy, reportID, reportActionID, creatorPersonalDetails, reportPreviewReportActionID) {
    const { accountID, login } = creatorPersonalDetails;
    const timeOfCreation = DateUtils_1.default.getDBTime();
    const parentReport = (0, ReportUtils_1.getPolicyExpenseChat)(accountID, policy?.id);
    const optimisticReportData = (0, ReportUtils_1.buildOptimisticEmptyReport)(reportID, accountID, parentReport, reportPreviewReportActionID, policy, timeOfCreation);
    const optimisticCreateAction = {
        action: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
        accountEmail: login,
        accountID,
        created: timeOfCreation,
        message: {
            isNewDot: true,
            lastModified: timeOfCreation,
        },
        reportActionID,
        reportID,
        sequenceNumber: 0,
        pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
    };
    const message = (0, ReportUtils_1.getReportPreviewMessage)(optimisticReportData);
    const createReportActionMessage = [
        {
            html: message,
            text: message,
            type: CONST_1.default.REPORT.MESSAGE.TYPE.COMMENT,
        },
    ];
    const optimisticReportPreview = {
        action: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW,
        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW,
        childReportName: optimisticReportData.reportName,
        childReportID: reportID,
        childType: CONST_1.default.REPORT.TYPE.EXPENSE,
        created: timeOfCreation,
        shouldShow: true,
        childOwnerAccountID: accountID,
        automatic: false,
        avatar: creatorPersonalDetails.avatar,
        isAttachmentOnly: false,
        reportActionID: reportPreviewReportActionID,
        message: createReportActionMessage,
        originalMessage: {
            linkedReportID: reportID,
        },
        pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
        actorAccountID: accountID,
    };
    const optimisticNextStep = (0, NextStepUtils_1.buildNextStep)(optimisticReportData, CONST_1.default.REPORT.STATUS_NUM.OPEN);
    const outstandingChildRequest = (0, ReportUtils_1.getOutstandingChildRequest)(optimisticReportData);
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: optimisticReportData,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`,
            value: {
                hasOnceLoadedReportActions: true,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: { [reportActionID]: optimisticCreateAction },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${parentReport?.reportID}`,
            value: { [reportPreviewReportActionID]: optimisticReportPreview },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReport?.reportID}`,
            value: { lastVisibleActionCreated: optimisticReportPreview.created, ...outstandingChildRequest },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${reportID}`,
            value: optimisticNextStep,
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: { errorFields: { createReport: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('report.genericCreateReportFailureMessage') } },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: { [reportActionID]: { errorFields: { createReport: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('report.genericCreateReportFailureMessage') } } },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReport?.reportID}`,
            value: { lastVisibleActionCreated: parentReport?.lastVisibleActionCreated, hasOutstandingChildRequest: parentReport?.hasOutstandingChildRequest },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                pendingFields: {
                    createReport: null,
                },
                errorFields: {
                    createReport: null,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [reportActionID]: {
                    pendingAction: null,
                    errorFields: null,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${parentReport?.reportID}`,
            value: {
                [reportPreviewReportActionID]: {
                    pendingAction: null,
                    errorFields: null,
                },
            },
        },
    ];
    return {
        optimisticReportName: optimisticReportData.reportName,
        reportPreviewAction: optimisticReportPreview,
        parentReportID: parentReport?.reportID,
        optimisticData,
        successData,
        failureData,
    };
}
function createNewReport(creatorPersonalDetails, policyID, shouldNotifyNewAction = false) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = (0, PolicyUtils_1.getPolicy)(policyID);
    const optimisticReportID = (0, ReportUtils_1.generateReportID)();
    const reportActionID = (0, NumberUtils_1.rand64)();
    const reportPreviewReportActionID = (0, NumberUtils_1.rand64)();
    const { optimisticReportName, parentReportID, reportPreviewAction, optimisticData, successData, failureData } = buildNewReportOptimisticData(policy, optimisticReportID, reportActionID, creatorPersonalDetails, reportPreviewReportActionID);
    API.write(types_1.WRITE_COMMANDS.CREATE_APP_REPORT, { reportName: optimisticReportName, type: CONST_1.default.REPORT.TYPE.EXPENSE, policyID, reportID: optimisticReportID, reportActionID, reportPreviewReportActionID }, { optimisticData, successData, failureData });
    if (shouldNotifyNewAction) {
        notifyNewAction(parentReportID, creatorPersonalDetails.accountID, reportPreviewAction);
    }
    return optimisticReportID;
}
/**
 * Removes the report after failure to create. Also removes it's related report actions and next step from Onyx.
 */
function removeFailedReport(reportID) {
    react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, null);
    react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${reportID}`, null);
    react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`, null);
}
/** Add a policy report (workspace room) optimistically and navigate to it. */
function addPolicyReport(policyReport) {
    const createdReportAction = (0, ReportUtils_1.buildOptimisticCreatedReportAction)(CONST_1.default.POLICY.OWNER_EMAIL_FAKE);
    // Onyx.set is used on the optimistic data so that it is present before navigating to the workspace room. With Onyx.merge the workspace room reportID is not present when
    // fetchReportIfNeeded is called on the ReportScreen, so openReport is called which is unnecessary since the optimistic data will be stored in Onyx.
    // Therefore, Onyx.set is used instead of Onyx.merge.
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${policyReport.reportID}`,
            value: {
                pendingFields: {
                    addWorkspaceRoom: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                },
                ...policyReport,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${policyReport.reportID}`,
            value: { [createdReportAction.reportActionID]: createdReportAction },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.FORMS.NEW_ROOM_FORM,
            value: { isLoading: true },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${policyReport.reportID}`,
            value: {
                isOptimisticReport: true,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${policyReport.reportID}`,
            value: {
                pendingFields: {
                    addWorkspaceRoom: null,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${policyReport.reportID}`,
            value: {
                isOptimisticReport: false,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${policyReport.reportID}`,
            value: {
                [createdReportAction.reportActionID]: {
                    pendingAction: null,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.FORMS.NEW_ROOM_FORM,
            value: { isLoading: false },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${policyReport.reportID}`,
            value: {
                errorFields: {
                    addWorkspaceRoom: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('report.genericCreateReportFailureMessage'),
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.FORMS.NEW_ROOM_FORM,
            value: { isLoading: false },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${policyReport.reportID}`,
            value: {
                isOptimisticReport: false,
            },
        },
    ];
    const parameters = {
        policyID: policyReport.policyID,
        reportName: policyReport.reportName,
        visibility: policyReport.visibility,
        reportID: policyReport.reportID,
        createdReportActionID: createdReportAction.reportActionID,
        writeCapability: policyReport.writeCapability,
        description: policyReport.description,
    };
    API.write(types_1.WRITE_COMMANDS.ADD_WORKSPACE_ROOM, parameters, { optimisticData, successData, failureData });
    Navigation_1.default.dismissModalWithReport({ reportID: policyReport.reportID });
}
/** Deletes a report, along with its reportActions, any linked reports, and any linked IOU report. */
function deleteReport(reportID, shouldDeleteChildReports = false) {
    if (!reportID) {
        Log_1.default.warn('[Report] deleteReport called with no reportID');
        return;
    }
    const report = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
    const onyxData = {
        [`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`]: null,
        [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`]: null,
    };
    // Delete linked transactions
    const reportActionsForReport = allReportActions?.[reportID];
    const transactionIDs = Object.values(reportActionsForReport ?? {})
        .filter((reportAction) => ReportActionsUtils.isMoneyRequestAction(reportAction))
        .map((reportAction) => ReportActionsUtils.getOriginalMessage(reportAction)?.IOUTransactionID);
    [...new Set(transactionIDs)].forEach((transactionID) => {
        onyxData[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`] = null;
    });
    react_native_onyx_1.default.multiSet(onyxData);
    if (shouldDeleteChildReports) {
        Object.values(reportActionsForReport ?? {}).forEach((reportAction) => {
            if (!reportAction.childReportID) {
                return;
            }
            deleteReport(reportAction.childReportID, shouldDeleteChildReports);
        });
    }
    // Delete linked IOU report
    if (report?.iouReportID) {
        deleteReport(report.iouReportID, shouldDeleteChildReports);
    }
}
/**
 * @param reportID The reportID of the policy report (workspace room)
 */
function navigateToConciergeChatAndDeleteReport(reportID, shouldPopToTop = false, shouldDeleteChildReports = false) {
    // Dismiss the current report screen and replace it with Concierge Chat
    if (shouldPopToTop) {
        Navigation_1.default.popToSidebar();
    }
    else {
        Navigation_1.default.goBack();
    }
    navigateToConciergeChat();
    react_native_1.InteractionManager.runAfterInteractions(() => {
        deleteReport(reportID, shouldDeleteChildReports);
    });
}
function clearCreateChatError(report) {
    const metaData = (0, ReportUtils_1.getReportMetadata)(report?.reportID);
    const isOptimisticReport = metaData?.isOptimisticReport;
    if (report?.errorFields?.createChat && !isOptimisticReport) {
        clearReportFieldKeyErrors(report.reportID, 'createChat');
        return;
    }
    navigateToConciergeChatAndDeleteReport(report?.reportID, undefined, true);
}
/**
 * @param policyRoomReport The policy room report
 * @param policyRoomName The updated name for the policy room
 */
function updatePolicyRoomName(policyRoomReport, policyRoomName) {
    const reportID = policyRoomReport.reportID;
    const previousName = policyRoomReport.reportName;
    // No change needed
    if (previousName === policyRoomName) {
        return;
    }
    const optimisticRenamedAction = (0, ReportUtils_1.buildOptimisticRenamedRoomReportAction)(policyRoomName, previousName ?? '');
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                reportName: policyRoomName,
                pendingFields: {
                    reportName: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                },
                errorFields: {
                    reportName: null,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [optimisticRenamedAction.reportActionID]: optimisticRenamedAction,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                pendingFields: {
                    reportName: null,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: { [optimisticRenamedAction.reportActionID]: { pendingAction: null } },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                reportName: previousName,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: { [optimisticRenamedAction.reportActionID]: null },
        },
    ];
    const parameters = {
        reportID,
        policyRoomName,
        renamedRoomReportActionID: optimisticRenamedAction.reportActionID,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_POLICY_ROOM_NAME, parameters, { optimisticData, successData, failureData });
}
/**
 * @param reportID The reportID of the policy room.
 */
function clearPolicyRoomNameErrors(reportID) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, {
        errorFields: {
            reportName: null,
        },
        pendingFields: {
            reportName: null,
        },
    });
}
function setIsComposerFullSize(reportID, isComposerFullSize) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_IS_COMPOSER_FULL_SIZE}${reportID}`, isComposerFullSize);
}
/**
 * @param action the associated report action (optional)
 * @param isRemote whether or not this notification is a remote push notification
 */
function shouldShowReportActionNotification(reportID, action = null, isRemote = false) {
    const tag = isRemote ? '[PushNotification]' : '[LocalNotification]';
    const topmostReportID = Navigation_1.default.getTopmostReportId();
    // Due to payload size constraints, some push notifications may have their report action stripped
    // so we must double check that we were provided an action before using it in these checks.
    if (action && ReportActionsUtils.isDeletedAction(action)) {
        Log_1.default.info(`${tag} Skipping notification because the action was deleted`, false, { reportID, action });
        return false;
    }
    if (!ActiveClientManager.isClientTheLeader()) {
        Log_1.default.info(`${tag} Skipping notification because this client is not the leader`);
        return false;
    }
    // We don't want to send a local notification if the user preference is daily, mute or hidden.
    const notificationPreference = (0, ReportUtils_1.getReportNotificationPreference)(allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`]);
    if (notificationPreference !== CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS) {
        Log_1.default.info(`${tag} No notification because user preference is to be notified: ${notificationPreference}`);
        return false;
    }
    // If this comment is from the current user we don't want to parrot whatever they wrote back to them.
    if (action && action.actorAccountID === currentUserAccountID) {
        Log_1.default.info(`${tag} No notification because comment is from the currently logged in user`);
        return false;
    }
    // If we are currently viewing this report do not show a notification.
    if (reportID === topmostReportID && Visibility_1.default.isVisible() && Visibility_1.default.hasFocus()) {
        Log_1.default.info(`${tag} No notification because it was a comment for the current report`);
        return false;
    }
    // If the report is a transaction thread and we are currently viewing the associated one-transaction report do no show a notification.
    const topmostReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${topmostReportID}`];
    const topmostReportActions = allReportActions?.[`${topmostReport?.reportID}`];
    const chatTopmostReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${topmostReport?.chatReportID}`];
    if (reportID === ReportActionsUtils.getOneTransactionThreadReportID(topmostReport, chatTopmostReport, topmostReportActions) && Visibility_1.default.isVisible() && Visibility_1.default.hasFocus()) {
        Log_1.default.info(`${tag} No notification because the report is a transaction thread associated with the current one-transaction report`);
        return false;
    }
    const report = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
    if (!report || (report && report.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE)) {
        Log_1.default.info(`${tag} No notification because the report does not exist or is pending deleted`, false);
        return false;
    }
    // If this notification was delayed and the user saw the message already, don't show it
    if (action && report?.lastReadTime && report.lastReadTime >= action.created) {
        Log_1.default.info(`${tag} No notification because the comment was already read`, false, { created: action.created, lastReadTime: report.lastReadTime });
        return false;
    }
    // If this is a whisper targeted to someone else, don't show it
    if (action && ReportActionsUtils.isWhisperActionTargetedToOthers(action)) {
        Log_1.default.info(`${tag} No notification because the action is whispered to someone else`, false);
        return false;
    }
    return true;
}
function showReportActionNotification(reportID, reportAction) {
    if (!shouldShowReportActionNotification(reportID, reportAction)) {
        return;
    }
    Log_1.default.info('[LocalNotification] Creating notification');
    const localReportID = `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`;
    const report = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
    if (!report) {
        Log_1.default.hmmm("[LocalNotification] couldn't show report action notification because the report wasn't found", { localReportID, reportActionID: reportAction.reportActionID });
        return;
    }
    const onClick = () => (0, Modal_1.close)(() => (0, navigateFromNotification_1.default)(reportID));
    if (reportAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.MODIFIED_EXPENSE) {
        const movedFromReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${(0, ModifiedExpenseMessage_1.getMovedReportID)(reportAction, CONST_1.default.REPORT.MOVE_TYPE.FROM)}`];
        const movedToReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${(0, ModifiedExpenseMessage_1.getMovedReportID)(reportAction, CONST_1.default.REPORT.MOVE_TYPE.TO)}`];
        LocalNotification_1.default.showModifiedExpenseNotification({ report, reportAction, onClick, movedFromReport, movedToReport });
    }
    else {
        LocalNotification_1.default.showCommentNotification(report, reportAction, onClick);
    }
    notifyNewAction(reportID, reportAction.actorAccountID);
}
/** Clear the errors associated with the IOUs of a given report. */
function clearIOUError(reportID) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, { errorFields: { iou: null } });
}
/**
 * Adds a reaction to the report action.
 * Uses the NEW FORMAT for "emojiReactions"
 */
function addEmojiReaction(reportID, reportActionID, emoji, skinTone = preferredSkinTone) {
    const createdAt = (0, date_fns_tz_1.format)((0, date_fns_tz_1.toZonedTime)(new Date(), 'UTC'), CONST_1.default.DATE.FNS_DB_FORMAT_STRING);
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS}${reportActionID}`,
            value: {
                [emoji.name]: {
                    createdAt,
                    pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    users: {
                        [currentUserAccountID]: {
                            skinTones: {
                                [skinTone ?? CONST_1.default.EMOJI_DEFAULT_SKIN_TONE]: createdAt,
                            },
                        },
                    },
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS}${reportActionID}`,
            value: {
                [emoji.name]: {
                    pendingAction: null,
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS}${reportActionID}`,
            value: {
                [emoji.name]: {
                    pendingAction: null,
                },
            },
        },
    ];
    const parameters = {
        reportID,
        skinTone,
        emojiCode: emoji.name,
        reportActionID,
        createdAt,
    };
    API.write(types_1.WRITE_COMMANDS.ADD_EMOJI_REACTION, parameters, { optimisticData, successData, failureData });
}
/**
 * Removes a reaction to the report action.
 * Uses the NEW FORMAT for "emojiReactions"
 */
function removeEmojiReaction(reportID, reportActionID, emoji) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS}${reportActionID}`,
            value: {
                [emoji.name]: {
                    users: {
                        [currentUserAccountID]: null,
                    },
                },
            },
        },
    ];
    const parameters = {
        reportID,
        reportActionID,
        emojiCode: emoji.name,
    };
    API.write(types_1.WRITE_COMMANDS.REMOVE_EMOJI_REACTION, parameters, { optimisticData });
}
/**
 * Calls either addEmojiReaction or removeEmojiReaction depending on if the current user has reacted to the report action.
 * Uses the NEW FORMAT for "emojiReactions"
 */
function toggleEmojiReaction(reportID, reportAction, reactionObject, existingReactions, paramSkinTone = preferredSkinTone, ignoreSkinToneOnCompare = false) {
    const originalReportID = (0, ReportUtils_1.getOriginalReportID)(reportID, reportAction);
    if (!originalReportID) {
        return;
    }
    const originalReportAction = ReportActionsUtils.getReportAction(originalReportID, reportAction.reportActionID);
    if ((0, EmptyObject_1.isEmptyObject)(originalReportAction)) {
        return;
    }
    // This will get cleaned up as part of https://github.com/Expensify/App/issues/16506 once the old emoji
    // format is no longer being used
    const emoji = EmojiUtils.findEmojiByCode(reactionObject.code);
    const existingReactionObject = existingReactions?.[emoji.name];
    // Only use skin tone if emoji supports it
    const skinTone = emoji.types === undefined ? -1 : paramSkinTone;
    if (existingReactionObject && EmojiUtils.hasAccountIDEmojiReacted(currentUserAccountID, existingReactionObject.users, ignoreSkinToneOnCompare ? undefined : skinTone)) {
        removeEmojiReaction(originalReportID, reportAction.reportActionID, emoji);
        return;
    }
    addEmojiReaction(originalReportID, reportAction.reportActionID, emoji, skinTone);
}
function doneCheckingPublicRoom() {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.IS_CHECKING_PUBLIC_ROOM, false);
}
function openReportFromDeepLink(url, currentOnboardingPurposeSelected, currentOnboardingCompanySize, onboardingInitialPath, reports) {
    const reportID = (0, ReportUtils_1.getReportIDFromLink)(url);
    const isAuthenticated = (0, Session_1.hasAuthToken)();
    if (reportID && !isAuthenticated) {
        // Call the OpenReport command to check in the server if it's a public room. If so, we'll open it as an anonymous user
        openReport(reportID, '', [], undefined, '0', true);
        // Show the sign-in page if the app is offline
        if (networkStatus === CONST_1.default.NETWORK.NETWORK_STATUS.OFFLINE) {
            doneCheckingPublicRoom();
        }
    }
    else {
        // If we're not opening a public room (no reportID) or the user is authenticated, we unblock the UI (hide splash screen)
        doneCheckingPublicRoom();
    }
    let route = (0, ReportUtils_1.getRouteFromLink)(url);
    // Bing search results still link to /signin when searching for “Expensify”, but the /signin route no longer exists in our repo, so we redirect it to the home page to avoid showing a Not Found page.
    if ((0, normalizePath_1.default)(route) === CONST_1.default.SIGNIN_ROUTE) {
        route = '';
    }
    // If we are not authenticated and are navigating to a public screen, we don't want to navigate again to the screen after sign-in/sign-up
    if (!isAuthenticated && (0, isPublicScreenRoute_1.default)(route)) {
        return;
    }
    // If the route is the transition route, we don't want to navigate and start the onboarding flow
    if (route?.includes(ROUTES_1.default.TRANSITION_BETWEEN_APPS)) {
        return;
    }
    // Navigate to the report after sign-in/sign-up.
    react_native_1.InteractionManager.runAfterInteractions(() => {
        (0, Session_1.waitForUserSignIn)().then(() => {
            const connection = react_native_onyx_1.default.connect({
                key: ONYXKEYS_1.default.NVP_ONBOARDING,
                callback: (val) => {
                    if (!val && !(0, Session_1.isAnonymousUser)()) {
                        return;
                    }
                    Navigation_1.default.waitForProtectedRoutes().then(() => {
                        if (route && (0, Session_1.isAnonymousUser)() && !(0, Session_1.canAnonymousUserAccessRoute)(route)) {
                            (0, Session_1.signOutAndRedirectToSignIn)(true);
                            return;
                        }
                        // We don't want to navigate to the exitTo route when creating a new workspace from a deep link,
                        // because we already handle creating the optimistic policy and navigating to it in App.setUpPoliciesAndNavigate,
                        // which is already called when AuthScreens mounts.
                        if (!CONFIG_1.default.IS_HYBRID_APP && url && new URL(url).searchParams.get('exitTo') === ROUTES_1.default.WORKSPACE_NEW) {
                            return;
                        }
                        const handleDeeplinkNavigation = () => {
                            // We want to disconnect the connection so it won't trigger the deeplink again
                            // every time the data is changed, for example, when re-login.
                            react_native_onyx_1.default.disconnect(connection);
                            const state = Navigation_1.navigationRef.getRootState();
                            const currentFocusedRoute = (0, native_1.findFocusedRoute)(state);
                            if ((0, isNavigatorName_1.isOnboardingFlowName)(currentFocusedRoute?.name)) {
                                (0, Welcome_1.setOnboardingErrorMessage)(Localize.translateLocal('onboarding.purpose.errorBackButton'));
                                return;
                            }
                            if ((0, shouldSkipDeepLinkNavigation_1.default)(route)) {
                                return;
                            }
                            // Navigation for signed users is handled by react-navigation.
                            if (isAuthenticated) {
                                return;
                            }
                            const navigateHandler = (reportParam) => {
                                // Check if the report exists in the collection
                                const report = reportParam ?? reports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
                                // If the report does not exist, navigate to the last accessed report or Concierge chat
                                if (reportID && (!report?.reportID || report.errorFields?.notFound)) {
                                    const lastAccessedReportID = (0, ReportUtils_1.findLastAccessedReport)(false, (0, shouldOpenOnAdminRoom_1.default)(), undefined, reportID)?.reportID;
                                    if (lastAccessedReportID) {
                                        const lastAccessedReportRoute = ROUTES_1.default.REPORT_WITH_ID.getRoute(lastAccessedReportID);
                                        Navigation_1.default.navigate(lastAccessedReportRoute);
                                        return;
                                    }
                                    navigateToConciergeChat(false, () => true);
                                    return;
                                }
                                // If the last route is an RHP, we want to replace it so it won't be covered by the full-screen navigator.
                                const forceReplace = Navigation_1.navigationRef.getRootState().routes.at(-1)?.name === NAVIGATORS_1.default.RIGHT_MODAL_NAVIGATOR;
                                Navigation_1.default.navigate(route, { forceReplace });
                            };
                            // If we log with deeplink with reportID and data for this report is not available yet,
                            // then we will wait for Onyx to completely merge data from OpenReport API with OpenApp API in AuthScreens
                            if (reportID &&
                                !isAuthenticated &&
                                (!reports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`] || !reports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`]?.reportID)) {
                                const reportConnection = react_native_onyx_1.default.connect({
                                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
                                    // eslint-disable-next-line rulesdir/prefer-early-return
                                    callback: (report) => {
                                        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                                        if (report?.errorFields?.notFound || report?.reportID) {
                                            react_native_onyx_1.default.disconnect(reportConnection);
                                            navigateHandler(report);
                                        }
                                    },
                                });
                            }
                            else {
                                navigateHandler();
                            }
                        };
                        if ((0, Session_1.isAnonymousUser)()) {
                            handleDeeplinkNavigation();
                            return;
                        }
                        // We need skip deeplinking if the user hasn't completed the guided setup flow.
                        (0, Welcome_1.isOnboardingFlowCompleted)({
                            onNotCompleted: () => (0, OnboardingFlow_1.startOnboardingFlow)({
                                onboardingValuesParam: val,
                                hasAccessiblePolicies: !!account?.hasAccessibleDomainPolicies,
                                isUserFromPublicDomain: !!account?.isFromPublicDomain,
                                currentOnboardingPurposeSelected,
                                currentOnboardingCompanySize,
                                onboardingInitialPath,
                            }),
                            onCompleted: handleDeeplinkNavigation,
                            onCanceled: handleDeeplinkNavigation,
                        });
                    });
                },
            });
        });
    });
}
function getCurrentUserAccountID() {
    return currentUserAccountID;
}
function getCurrentUserEmail() {
    return currentUserEmail;
}
function navigateToMostRecentReport(currentReport) {
    const lastAccessedReportID = (0, ReportUtils_1.findLastAccessedReport)(false, false, undefined, currentReport?.reportID)?.reportID;
    if (lastAccessedReportID) {
        const lastAccessedReportRoute = ROUTES_1.default.REPORT_WITH_ID.getRoute(lastAccessedReportID);
        Navigation_1.default.goBack(lastAccessedReportRoute);
    }
    else {
        const isChatThread = (0, ReportUtils_1.isChatThread)(currentReport);
        // If it is not a chat thread we should call Navigation.goBack to pop the current route first before navigating to Concierge.
        if (!isChatThread) {
            Navigation_1.default.goBack();
        }
        navigateToConciergeChat(false, () => true, { forceReplace: true });
    }
}
function getMostRecentReportID(currentReport) {
    const lastAccessedReportID = (0, ReportUtils_1.findLastAccessedReport)(false, false, undefined, currentReport?.reportID)?.reportID;
    return lastAccessedReportID ?? conciergeReportID;
}
function joinRoom(report) {
    if (!report) {
        return;
    }
    updateNotificationPreference(report.reportID, (0, ReportUtils_1.getReportNotificationPreference)(report), (0, ReportUtils_1.getDefaultNotificationPreferenceForReport)(report), report.parentReportID, report.parentReportActionID);
}
function leaveGroupChat(reportID) {
    const report = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
    if (!report) {
        Log_1.default.warn('Attempting to leave Group Chat that does not existing locally');
        return;
    }
    // Use merge instead of set to avoid deleting the report too quickly, which could cause a brief "not found" page to appear.
    // The remaining parts of the report object will be removed after the API call is successful.
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                reportID: null,
                stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.CLOSED,
                participants: {
                    [currentUserAccountID]: {
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN,
                    },
                },
            },
        },
    ];
    // Clean up any quick actions for the report we're leaving from
    if (quickAction?.chatReportID?.toString() === reportID) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.NVP_QUICK_ACTION_GLOBAL_CREATE,
            value: null,
        });
    }
    // Ensure that any remaining data is removed upon successful completion, even if the server sends a report removal response.
    // This is done to prevent the removal update from lingering in the applyHTTPSOnyxUpdates function.
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: null,
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: report,
        },
    ];
    navigateToMostRecentReport(report);
    API.write(types_1.WRITE_COMMANDS.LEAVE_GROUP_CHAT, { reportID }, { optimisticData, successData, failureData });
}
/** Leave a report by setting the state to submitted and closed */
function leaveRoom(reportID, isWorkspaceMemberLeavingWorkspaceRoom = false) {
    const report = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
    if (!report) {
        return;
    }
    const isChatThread = (0, ReportUtils_1.isChatThread)(report);
    // Pusher's leavingStatus should be sent earlier.
    // Place the broadcast before calling the LeaveRoom API to prevent a race condition
    // between Onyx report being null and Pusher's leavingStatus becoming true.
    broadcastUserIsLeavingRoom(reportID);
    // If a workspace member is leaving a workspace room, they don't actually lose the room from Onyx.
    // Instead, their notification preference just gets set to "hidden".
    // Same applies for chat threads too
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: isWorkspaceMemberLeavingWorkspaceRoom || isChatThread
                ? {
                    participants: {
                        [currentUserAccountID]: {
                            notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN,
                        },
                    },
                }
                : {
                    reportID: null,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.CLOSED,
                    participants: {
                        [currentUserAccountID]: {
                            notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN,
                        },
                    },
                },
        },
    ];
    const successData = [];
    if (isWorkspaceMemberLeavingWorkspaceRoom || isChatThread) {
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                participants: {
                    [currentUserAccountID]: {
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN,
                    },
                },
            },
        });
    }
    else {
        // Use the Onyx.set method to remove all other key values except reportName to prevent showing the room name as random numbers after leaving it.
        // See https://github.com/Expensify/App/issues/55676 for more information.
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: { reportName: report.reportName },
        });
    }
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: report,
        },
    ];
    if (report.parentReportID && report.parentReportActionID) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.parentReportID}`,
            value: { [report.parentReportActionID]: { childReportNotificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN } },
        });
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.parentReportID}`,
            value: { [report.parentReportActionID]: { childReportNotificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN } },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.parentReportID}`,
            value: {
                [report.parentReportActionID]: {
                    childReportNotificationPreference: report?.participants?.[currentUserAccountID]?.notificationPreference ?? (0, ReportUtils_1.getDefaultNotificationPreferenceForReport)(report),
                },
            },
        });
    }
    const parameters = {
        reportID,
    };
    API.write(types_1.WRITE_COMMANDS.LEAVE_ROOM, parameters, { optimisticData, successData, failureData });
    // If this is the leave action from a workspace room, simply dismiss the modal, i.e., allow the user to view the room and join again immediately.
    // If this is the leave action from a chat thread (even if the chat thread is in a room), do not allow the user to stay in the thread after leaving.
    if (isWorkspaceMemberLeavingWorkspaceRoom && !isChatThread) {
        return;
    }
    // In other cases, the report is deleted and we should move the user to another report.
    navigateToMostRecentReport(report);
}
function buildInviteToRoomOnyxData(reportID, inviteeEmailsToAccountIDs, formatPhoneNumber) {
    const report = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
    const reportMetadata = (0, ReportUtils_1.getReportMetadata)(reportID);
    const isGroupChat = (0, ReportUtils_1.isGroupChat)(report);
    const defaultNotificationPreference = (0, ReportUtils_1.getDefaultNotificationPreferenceForReport)(report);
    const inviteeEmails = Object.keys(inviteeEmailsToAccountIDs);
    const inviteeAccountIDs = Object.values(inviteeEmailsToAccountIDs);
    const logins = inviteeEmails.map((memberLogin) => PhoneNumber.addSMSDomainIfPhoneNumber(memberLogin));
    const { newAccountIDs, newLogins } = PersonalDetailsUtils.getNewAccountIDsAndLogins(logins, inviteeAccountIDs);
    const participantsAfterInvitation = inviteeAccountIDs.reduce((reportParticipants, accountID) => {
        const participant = {
            notificationPreference: defaultNotificationPreference,
            role: CONST_1.default.REPORT.ROLE.MEMBER,
        };
        // eslint-disable-next-line no-param-reassign
        reportParticipants[accountID] = participant;
        return reportParticipants;
    }, { ...report?.participants });
    const newPersonalDetailsOnyxData = PersonalDetailsUtils.getPersonalDetailsOnyxDataForOptimisticUsers(newLogins, newAccountIDs, formatPhoneNumber);
    const pendingChatMembers = (0, ReportUtils_1.getPendingChatMembers)(inviteeAccountIDs, reportMetadata?.pendingChatMembers ?? [], CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
    const newParticipantAccountCleanUp = newAccountIDs.reduce((participantCleanUp, newAccountID) => {
        // eslint-disable-next-line no-param-reassign
        participantCleanUp[newAccountID] = null;
        return participantCleanUp;
    }, {});
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                participants: participantsAfterInvitation,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`,
            value: {
                pendingChatMembers,
            },
        },
    ];
    optimisticData.push(...newPersonalDetailsOnyxData.optimisticData);
    const successPendingChatMembers = reportMetadata?.pendingChatMembers
        ? reportMetadata?.pendingChatMembers?.filter((pendingMember) => !(inviteeAccountIDs.includes(Number(pendingMember.accountID)) && pendingMember.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE))
        : null;
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                participants: newParticipantAccountCleanUp,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`,
            value: {
                pendingChatMembers: successPendingChatMembers,
            },
        },
    ];
    successData.push(...newPersonalDetailsOnyxData.finallyData);
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`,
            value: {
                pendingChatMembers: pendingChatMembers.map((pendingChatMember) => {
                    if (!inviteeAccountIDs.includes(Number(pendingChatMember.accountID))) {
                        return pendingChatMember;
                    }
                    return {
                        ...pendingChatMember,
                        errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('roomMembersPage.error.genericAdd'),
                    };
                }) ?? null,
            },
        },
    ];
    return { optimisticData, successData, failureData, isGroupChat, inviteeEmails, newAccountIDs };
}
/** Invites people to a room */
function inviteToRoom(reportID, inviteeEmailsToAccountIDs, formatPhoneNumber) {
    const { optimisticData, successData, failureData, isGroupChat, inviteeEmails, newAccountIDs } = buildInviteToRoomOnyxData(reportID, inviteeEmailsToAccountIDs, formatPhoneNumber);
    if (isGroupChat) {
        const parameters = {
            reportID,
            inviteeEmails,
            accountIDList: newAccountIDs.join(),
        };
        API.write(types_1.WRITE_COMMANDS.INVITE_TO_GROUP_CHAT, parameters, { optimisticData, successData, failureData });
        return;
    }
    const parameters = {
        reportID,
        inviteeEmails,
        accountIDList: newAccountIDs.join(),
    };
    // eslint-disable-next-line rulesdir/no-multiple-api-calls
    API.write(types_1.WRITE_COMMANDS.INVITE_TO_ROOM, parameters, { optimisticData, successData, failureData });
}
function clearAddRoomMemberError(reportID, invitedAccountID) {
    const reportMetadata = (0, ReportUtils_1.getReportMetadata)(reportID);
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, {
        participants: {
            [invitedAccountID]: null,
        },
    });
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`, {
        pendingChatMembers: reportMetadata?.pendingChatMembers?.filter((pendingChatMember) => pendingChatMember.accountID !== invitedAccountID),
    });
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, {
        [invitedAccountID]: null,
    });
}
function updateGroupChatMemberRoles(reportID, accountIDList, role) {
    const memberRoles = {};
    const optimisticParticipants = {};
    const successParticipants = {};
    accountIDList.forEach((accountID) => {
        memberRoles[accountID] = role;
        optimisticParticipants[accountID] = {
            role,
            pendingFields: {
                role: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
            },
            pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
        };
        successParticipants[accountID] = {
            pendingFields: {
                role: null,
            },
            pendingAction: null,
        };
    });
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: { participants: optimisticParticipants },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: { participants: successParticipants },
        },
    ];
    const parameters = { reportID, memberRoles: JSON.stringify(memberRoles) };
    API.write(types_1.WRITE_COMMANDS.UPDATE_GROUP_CHAT_MEMBER_ROLES, parameters, { optimisticData, successData });
}
/** Invites people to a group chat */
function inviteToGroupChat(reportID, inviteeEmailsToAccountIDs, formatPhoneNumber) {
    inviteToRoom(reportID, inviteeEmailsToAccountIDs, formatPhoneNumber);
}
/** Removes people from a room
 *  Please see https://github.com/Expensify/App/blob/main/README.md#Security for more details
 */
function removeFromRoom(reportID, targetAccountIDs) {
    const report = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
    const reportMetadata = (0, ReportUtils_1.getReportMetadata)(reportID);
    if (!report) {
        return;
    }
    const removeParticipantsData = {};
    targetAccountIDs.forEach((accountID) => {
        removeParticipantsData[accountID] = null;
    });
    const pendingChatMembers = (0, ReportUtils_1.getPendingChatMembers)(targetAccountIDs, reportMetadata?.pendingChatMembers ?? [], CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`,
            value: {
                pendingChatMembers,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`,
            value: {
                pendingChatMembers: reportMetadata?.pendingChatMembers ?? null,
            },
        },
    ];
    // We need to add success data here since in high latency situations,
    // the OpenRoomMembersPage call has the chance of overwriting the optimistic data we set above.
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                participants: removeParticipantsData,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`,
            value: {
                pendingChatMembers: reportMetadata?.pendingChatMembers ?? null,
            },
        },
    ];
    if ((0, ReportUtils_1.isGroupChat)(report)) {
        const parameters = {
            reportID,
            accountIDList: targetAccountIDs.join(),
        };
        API.write(types_1.WRITE_COMMANDS.REMOVE_FROM_GROUP_CHAT, parameters, { optimisticData, failureData, successData });
        return;
    }
    const parameters = {
        reportID,
        targetAccountIDs,
    };
    // eslint-disable-next-line rulesdir/no-multiple-api-calls
    API.write(types_1.WRITE_COMMANDS.REMOVE_FROM_ROOM, parameters, { optimisticData, failureData, successData });
}
function removeFromGroupChat(reportID, accountIDList) {
    removeFromRoom(reportID, accountIDList);
}
function setLastOpenedPublicRoom(reportID) {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.LAST_OPENED_PUBLIC_ROOM_ID, reportID);
}
/** Navigates to the last opened public room */
function openLastOpenedPublicRoom(lastOpenedPublicRoomID) {
    Navigation_1.default.isNavigationReady().then(() => {
        setLastOpenedPublicRoom('');
        Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(lastOpenedPublicRoomID));
    });
}
/** Flag a comment as offensive */
function flagComment(reportID, reportAction, severity) {
    const originalReportID = (0, ReportUtils_1.getOriginalReportID)(reportID, reportAction);
    const message = ReportActionsUtils.getReportActionMessage(reportAction);
    if (!message || !reportAction) {
        return;
    }
    let updatedDecision;
    if (severity === CONST_1.default.MODERATION.FLAG_SEVERITY_SPAM || severity === CONST_1.default.MODERATION.FLAG_SEVERITY_INCONSIDERATE) {
        if (!message?.moderationDecision) {
            updatedDecision = {
                decision: CONST_1.default.MODERATION.MODERATOR_DECISION_PENDING,
            };
        }
        else {
            updatedDecision = message.moderationDecision;
        }
    }
    else if (severity === CONST_1.default.MODERATION.FLAG_SEVERITY_ASSAULT || severity === CONST_1.default.MODERATION.FLAG_SEVERITY_HARASSMENT) {
        updatedDecision = {
            decision: CONST_1.default.MODERATION.MODERATOR_DECISION_PENDING_REMOVE,
        };
    }
    else {
        updatedDecision = {
            decision: CONST_1.default.MODERATION.MODERATOR_DECISION_PENDING_HIDE,
        };
    }
    const reportActionID = reportAction.reportActionID;
    const shouldHideMessage = [CONST_1.default.MODERATION.FLAG_SEVERITY_HARASSMENT, CONST_1.default.MODERATION.FLAG_SEVERITY_ASSAULT, CONST_1.default.MODERATION.FLAG_SEVERITY_INTIMIDATION, CONST_1.default.MODERATION.FLAG_SEVERITY_BULLYING].includes(severity);
    const updatedMessage = {
        ...message,
        moderationDecision: updatedDecision,
        ...(shouldHideMessage ? { translationKey: '', type: 'COMMENT', html: '', text: '', isEdited: true } : {}),
    };
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${originalReportID}`,
            value: {
                [reportActionID]: {
                    pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    message: [updatedMessage],
                },
            },
        },
    ];
    let optimisticReport = {
        lastMessageText: '',
        lastVisibleActionCreated: '',
    };
    const { lastMessageText = '' } = (0, ReportUtils_1.getLastVisibleMessage)(originalReportID, {
        [reportActionID]: { ...reportAction, message: [updatedMessage], pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
    });
    const report = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${originalReportID}`];
    const canUserPerformWriteAction = (0, ReportUtils_1.canUserPerformWriteAction)(report);
    if (lastMessageText) {
        const lastVisibleAction = ReportActionsUtils.getLastVisibleAction(originalReportID, canUserPerformWriteAction, {
            [reportActionID]: { ...reportAction, message: [updatedMessage], pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
        });
        const lastVisibleActionCreated = lastVisibleAction?.created;
        const lastActorAccountID = lastVisibleAction?.actorAccountID;
        optimisticReport = {
            lastMessageText,
            lastVisibleActionCreated,
            lastActorAccountID,
        };
    }
    if (shouldHideMessage) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${originalReportID}`,
            value: optimisticReport,
        });
    }
    const originalReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${originalReportID}`];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${originalReportID}`,
            value: {
                [reportActionID]: {
                    ...reportAction,
                    pendingAction: null,
                },
            },
        },
    ];
    if (shouldHideMessage) {
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${originalReportID}`,
            value: originalReport,
        });
    }
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${originalReportID}`,
            value: {
                [reportActionID]: {
                    pendingAction: null,
                },
            },
        },
    ];
    const parameters = {
        severity,
        reportActionID,
        // This check is to prevent flooding Concierge with test flags
        // If you need to test moderation responses from Concierge on dev, set this to false!
        isDevRequest: Environment.isDevelopment(),
    };
    API.write(types_1.WRITE_COMMANDS.FLAG_COMMENT, parameters, { optimisticData, successData, failureData });
}
/** Updates a given user's private notes on a report */
const updatePrivateNotes = (reportID, accountID, note) => {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                privateNotes: {
                    [accountID]: {
                        pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                        errors: null,
                        note,
                    },
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                privateNotes: {
                    [accountID]: {
                        pendingAction: null,
                        errors: null,
                    },
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                privateNotes: {
                    [accountID]: {
                        errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('privateNotes.error.genericFailureMessage'),
                    },
                },
            },
        },
    ];
    const parameters = { reportID, privateNotes: note };
    API.write(types_1.WRITE_COMMANDS.UPDATE_REPORT_PRIVATE_NOTE, parameters, { optimisticData, successData, failureData });
};
exports.updatePrivateNotes = updatePrivateNotes;
/** Fetches all the private notes for a given report */
function getReportPrivateNote(reportID) {
    if ((0, Session_1.isAnonymousUser)()) {
        return;
    }
    if (!reportID) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`,
            value: {
                isLoadingPrivateNotes: true,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`,
            value: {
                isLoadingPrivateNotes: false,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`,
            value: {
                isLoadingPrivateNotes: false,
            },
        },
    ];
    const parameters = { reportID };
    API.read(types_1.READ_COMMANDS.GET_REPORT_PRIVATE_NOTE, parameters, { optimisticData, successData, failureData });
}
function completeOnboarding({ engagementChoice, onboardingMessage, firstName = '', lastName = '', adminsChatReportID, onboardingPolicyID, paymentSelected, companySize, userReportedIntegration, wasInvited, selectedInterestedFeatures = [], }) {
    const onboardingData = (0, ReportUtils_1.prepareOnboardingOnyxData)(introSelected, engagementChoice, onboardingMessage, adminsChatReportID, onboardingPolicyID, userReportedIntegration, wasInvited, companySize, selectedInterestedFeatures);
    if (!onboardingData) {
        return;
    }
    const { optimisticData, successData, failureData, guidedSetupData, actorAccountID, selfDMParameters } = onboardingData;
    const parameters = {
        engagementChoice,
        firstName,
        lastName,
        actorAccountID,
        guidedSetupData: JSON.stringify(guidedSetupData),
        paymentSelected,
        companySize,
        userReportedIntegration,
        policyID: onboardingPolicyID,
        selfDMReportID: selfDMParameters.reportID,
        selfDMCreatedReportActionID: selfDMParameters.createdReportActionID,
    };
    if ((0, OnboardingUtils_1.shouldOnboardingRedirectToOldDot)(companySize, userReportedIntegration)) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_ONBOARDING,
            value: { isLoading: true },
        });
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_ONBOARDING,
            value: { isLoading: false },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_ONBOARDING,
            value: { isLoading: false },
        });
    }
    API.write(types_1.WRITE_COMMANDS.COMPLETE_GUIDED_SETUP, parameters, { optimisticData, successData, failureData });
}
/** Loads necessary data for rendering the RoomMembersPage */
function openRoomMembersPage(reportID) {
    const parameters = { reportID };
    API.read(types_1.READ_COMMANDS.OPEN_ROOM_MEMBERS_PAGE, parameters);
}
/**
 * Checks if there are any errors in the private notes for a given report
 *
 * @returns Returns true if there are errors in any of the private notes on the report
 */
function hasErrorInPrivateNotes(report) {
    const privateNotes = report?.privateNotes ?? {};
    return Object.values(privateNotes).some((privateNote) => !(0, isEmpty_1.default)(privateNote.errors));
}
/** Clears all errors associated with a given private note */
function clearPrivateNotesError(reportID, accountID) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, { privateNotes: { [accountID]: { errors: null } } });
}
function getDraftPrivateNote(reportID) {
    return draftNoteMap?.[reportID] ?? '';
}
/**
 * Saves the private notes left by the user as they are typing. By saving this data the user can switch between chats, close
 * tab, refresh etc without worrying about loosing what they typed out.
 */
function savePrivateNotesDraft(reportID, note) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.PRIVATE_NOTES_DRAFT}${reportID}`, note);
}
function searchForReports(searchInput, policyID) {
    // We do not try to make this request while offline because it sets a loading indicator optimistically
    if (isNetworkOffline) {
        react_native_onyx_1.default.set(ONYXKEYS_1.default.IS_SEARCHING_FOR_REPORTS, false);
        return;
    }
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.IS_SEARCHING_FOR_REPORTS,
            value: false,
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.IS_SEARCHING_FOR_REPORTS,
            value: false,
        },
    ];
    const searchForRoomToMentionParams = { query: searchInput.toLowerCase(), policyID };
    const searchForReportsParams = { searchInput: searchInput.toLowerCase(), canCancel: true };
    // We want to cancel all pending SearchForReports API calls before making another one
    if (!policyID) {
        HttpUtils_1.default.cancelPendingRequests(types_1.READ_COMMANDS.SEARCH_FOR_REPORTS);
    }
    API.read(policyID ? types_1.READ_COMMANDS.SEARCH_FOR_ROOMS_TO_MENTION : types_1.READ_COMMANDS.SEARCH_FOR_REPORTS, policyID ? searchForRoomToMentionParams : searchForReportsParams, {
        successData,
        failureData,
    });
}
function searchInServer(searchInput, policyID) {
    if (isNetworkOffline || !searchInput.trim().length) {
        react_native_onyx_1.default.set(ONYXKEYS_1.default.IS_SEARCHING_FOR_REPORTS, false);
        return;
    }
    // Why not set this in optimistic data? It won't run until the API request happens and while the API request is debounced
    // we want to show the loading state right away. Otherwise, we will see a flashing UI where the client options are sorted and
    // tell the user there are no options, then we start searching, and tell them there are no options again.
    react_native_onyx_1.default.set(ONYXKEYS_1.default.IS_SEARCHING_FOR_REPORTS, true);
    searchForReports(searchInput, policyID);
}
function updateLastVisitTime(reportID) {
    if (!(0, ReportUtils_1.isValidReportIDFromPath)(reportID)) {
        return;
    }
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`, { lastVisitTime: DateUtils_1.default.getDBTime() });
}
function updateLoadingInitialReportAction(reportID) {
    if (!(0, ReportUtils_1.isValidReportIDFromPath)(reportID)) {
        return;
    }
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`, { isLoadingInitialReportActions: false });
}
function setNewRoomFormLoading(isLoading = true) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.FORMS.NEW_ROOM_FORM}`, { isLoading });
}
function clearNewRoomFormError() {
    return react_native_onyx_1.default.set(ONYXKEYS_1.default.FORMS.NEW_ROOM_FORM, {
        isLoading: false,
        errorFields: null,
        errors: null,
        [NewRoomForm_1.default.ROOM_NAME]: '',
        [NewRoomForm_1.default.REPORT_DESCRIPTION]: '',
        [NewRoomForm_1.default.POLICY_ID]: '',
        [NewRoomForm_1.default.WRITE_CAPABILITY]: '',
        [NewRoomForm_1.default.VISIBILITY]: '',
    });
}
function resolveActionableMentionWhisper(reportID, reportAction, resolution, formatPhoneNumber, policy, isReportArchived = false) {
    if (!reportAction || !reportID) {
        return;
    }
    if (ReportActionsUtils.isActionableMentionWhisper(reportAction) && resolution === CONST_1.default.REPORT.ACTIONABLE_MENTION_WHISPER_RESOLUTION.INVITE_TO_SUBMIT_EXPENSE) {
        const actionOriginalMessage = ReportActionsUtils.getOriginalMessage(reportAction);
        const policyID = policy?.id;
        if (actionOriginalMessage && policyID) {
            const currentUserDetails = allPersonalDetails?.[getCurrentUserAccountID()];
            const welcomeNoteSubject = `# ${currentUserDetails?.displayName ?? ''} invited you to ${policy?.name ?? 'a workspace'}`;
            const welcomeNote = Localize.translateLocal('workspace.common.welcomeNote');
            const policyMemberAccountIDs = Object.values((0, PolicyUtils_1.getMemberAccountIDsForWorkspace)(policy?.employeeList, false, false));
            const invitees = {};
            actionOriginalMessage.inviteeEmails?.forEach((email, index) => {
                if (!email) {
                    return;
                }
                invitees[email] = actionOriginalMessage.inviteeAccountIDs?.at(index) ?? CONST_1.default.DEFAULT_NUMBER_ID;
            });
            (0, Member_1.addMembersToWorkspace)(invitees, `${welcomeNoteSubject}\n\n${welcomeNote}`, policyID, policyMemberAccountIDs, CONST_1.default.POLICY.ROLE.USER, formatPhoneNumber);
        }
    }
    const message = ReportActionsUtils.getReportActionMessage(reportAction);
    if (!message) {
        return;
    }
    const updatedMessage = {
        ...message,
        resolution,
    };
    const optimisticReportActions = {
        [reportAction.reportActionID]: {
            originalMessage: {
                resolution,
            },
        },
    };
    const report = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
    const reportUpdateDataWithPreviousLastMessage = (0, ReportUtils_1.getReportLastMessage)(reportID, optimisticReportActions, isReportArchived);
    const reportUpdateDataWithCurrentLastMessage = {
        lastMessageText: report?.lastMessageText,
        lastVisibleActionCreated: report?.lastVisibleActionCreated,
        lastActorAccountID: report?.lastActorAccountID,
    };
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [reportAction.reportActionID]: {
                    message: [updatedMessage],
                    originalMessage: {
                        resolution,
                    },
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: reportUpdateDataWithPreviousLastMessage,
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [reportAction.reportActionID]: {
                    message: [message],
                    originalMessage: {
                        resolution: null,
                    },
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: reportUpdateDataWithCurrentLastMessage, // revert back to the current report last message data in case of failure
        },
    ];
    const parameters = {
        reportActionID: reportAction.reportActionID,
        resolution,
    };
    API.write(types_1.WRITE_COMMANDS.RESOLVE_ACTIONABLE_MENTION_WHISPER, parameters, { optimisticData, failureData });
}
function resolveActionableMentionConfirmWhisper(reportID, reportAction, resolution, formatPhoneNumber, isReportArchived) {
    resolveActionableMentionWhisper(reportID, reportAction, resolution, formatPhoneNumber, undefined, isReportArchived);
}
function resolveActionableReportMentionWhisper(reportId, reportAction, resolution) {
    if (!reportAction || !reportId) {
        return;
    }
    const optimisticReportActions = {
        [reportAction.reportActionID]: {
            originalMessage: {
                resolution,
            },
        },
    };
    const report = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportId}`];
    const reportUpdateDataWithPreviousLastMessage = (0, ReportUtils_1.getReportLastMessage)(reportId, optimisticReportActions);
    const reportUpdateDataWithCurrentLastMessage = {
        lastMessageText: report?.lastMessageText,
        lastVisibleActionCreated: report?.lastVisibleActionCreated,
        lastActorAccountID: report?.lastActorAccountID,
    };
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportId}`,
            value: {
                [reportAction.reportActionID]: {
                    originalMessage: {
                        resolution,
                    },
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportId}`,
            value: reportUpdateDataWithPreviousLastMessage,
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportId}`,
            value: {
                [reportAction.reportActionID]: {
                    originalMessage: {
                        resolution: null,
                    },
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportId}`,
            value: reportUpdateDataWithCurrentLastMessage, // revert back to the current report last message data in case of failure
        },
    ];
    const parameters = {
        reportActionID: reportAction.reportActionID,
        resolution,
    };
    API.write(types_1.WRITE_COMMANDS.RESOLVE_ACTIONABLE_REPORT_MENTION_WHISPER, parameters, { optimisticData, failureData });
}
function dismissTrackExpenseActionableWhisper(reportID, reportAction) {
    const isArrayMessage = Array.isArray(reportAction?.message);
    const message = ReportActionsUtils.getReportActionMessage(reportAction);
    if (!message || !reportAction || !reportID) {
        return;
    }
    const updatedMessage = {
        ...message,
        resolution: CONST_1.default.REPORT.ACTIONABLE_TRACK_EXPENSE_WHISPER_RESOLUTION.NOTHING,
    };
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [reportAction.reportActionID]: {
                    message: isArrayMessage ? [updatedMessage] : updatedMessage,
                    originalMessage: {
                        resolution: CONST_1.default.REPORT.ACTIONABLE_TRACK_EXPENSE_WHISPER_RESOLUTION.NOTHING,
                    },
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [reportAction.reportActionID]: {
                    message: [message],
                    originalMessage: {
                        resolution: null,
                    },
                },
            },
        },
    ];
    const params = {
        reportActionID: reportAction.reportActionID,
    };
    API.write(types_1.WRITE_COMMANDS.DISMISS_TRACK_EXPENSE_ACTIONABLE_WHISPER, params, { optimisticData, failureData });
}
function setGroupDraft(newGroupDraft) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.NEW_GROUP_CHAT_DRAFT, newGroupDraft);
}
function exportToIntegration(reportID, connectionName) {
    const action = (0, ReportUtils_1.buildOptimisticExportIntegrationAction)(connectionName);
    const optimisticReportActionID = action.reportActionID;
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [optimisticReportActionID]: action,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [optimisticReportActionID]: {
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('common.genericErrorMessage'),
                },
            },
        },
    ];
    const params = {
        reportIDList: reportID,
        connectionName,
        type: 'MANUAL',
        optimisticReportActions: JSON.stringify({
            [reportID]: optimisticReportActionID,
        }),
    };
    API.write(types_1.WRITE_COMMANDS.REPORT_EXPORT, params, { optimisticData, failureData });
}
function markAsManuallyExported(reportID, connectionName) {
    const action = (0, ReportUtils_1.buildOptimisticExportIntegrationAction)(connectionName, true);
    const label = CONST_1.default.POLICY.CONNECTIONS.NAME_USER_FRIENDLY[connectionName];
    const optimisticReportActionID = action.reportActionID;
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [optimisticReportActionID]: action,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [optimisticReportActionID]: {
                    pendingAction: null,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [optimisticReportActionID]: {
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('common.genericErrorMessage'),
                },
            },
        },
    ];
    const params = {
        markedManually: true,
        data: JSON.stringify([
            {
                reportID,
                label,
                optimisticReportActionID,
            },
        ]),
    };
    API.write(types_1.WRITE_COMMANDS.MARK_AS_EXPORTED, params, { optimisticData, successData, failureData });
}
function exportReportToCSV({ reportID, transactionIDList }, onDownloadFailed) {
    const finalParameters = (0, enhanceParameters_1.default)(types_1.WRITE_COMMANDS.EXPORT_REPORT_TO_CSV, {
        reportID,
        transactionIDList,
    });
    const formData = new FormData();
    Object.entries(finalParameters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            formData.append(key, value.join(','));
        }
        else {
            formData.append(key, String(value));
        }
    });
    (0, fileDownload_1.default)(ApiUtils.getCommandURL({ command: types_1.WRITE_COMMANDS.EXPORT_REPORT_TO_CSV }), 'Expensify.csv', '', false, formData, CONST_1.default.NETWORK.METHOD.POST, onDownloadFailed);
}
function exportReportToPDF({ reportID }) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.NVP_EXPENSIFY_REPORT_PDF_FILENAME}${reportID}`,
            value: null,
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.NVP_EXPENSIFY_REPORT_PDF_FILENAME}${reportID}`,
            value: 'error',
        },
    ];
    const params = {
        reportID,
    };
    API.write(types_1.WRITE_COMMANDS.EXPORT_REPORT_TO_PDF, params, { optimisticData, failureData });
}
function downloadReportPDF(fileName, reportName) {
    const baseURL = (0, UrlUtils_1.default)((0, Environment_1.getOldDotURLFromEnvironment)(environment));
    const downloadFileName = `${reportName}.pdf`;
    (0, Download_1.setDownload)(fileName, true);
    const pdfURL = `${baseURL}secure?secureType=pdfreport&filename=${encodeURIComponent(fileName)}&downloadName=${encodeURIComponent(downloadFileName)}&email=${encodeURIComponent(currentUserEmail ?? '')}`;
    // The shouldOpenExternalLink parameter must always be set to
    // true to avoid CORS errors for as long as we use the OD URL.
    // See https://github.com/Expensify/App/issues/61937
    (0, fileDownload_1.default)((0, addEncryptedAuthTokenToURL_1.default)(pdfURL, true), downloadFileName, '', true).then(() => (0, Download_1.setDownload)(fileName, false));
}
function setDeleteTransactionNavigateBackUrl(url) {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_DELETE_TRANSACTION_NAVIGATE_BACK_URL, url);
}
function clearDeleteTransactionNavigateBackUrl() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_DELETE_TRANSACTION_NAVIGATE_BACK_URL, null);
}
/** Deletes a report and un-reports all transactions on the report along with its reportActions, any linked reports and any linked IOU report actions. */
function deleteAppReport(reportID) {
    if (!reportID) {
        Log_1.default.warn('[Report] deleteReport called with no reportID');
        return;
    }
    const optimisticData = [];
    const successData = [];
    const failureData = [];
    const report = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
    let selfDMReportID = (0, ReportUtils_1.findSelfDMReportID)();
    let selfDMReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${selfDMReportID}`];
    let createdAction;
    let selfDMParameters = {};
    if (!selfDMReport) {
        const currentTime = DateUtils_1.default.getDBTime();
        selfDMReport = (0, ReportUtils_1.buildOptimisticSelfDMReport)(currentTime);
        selfDMReportID = selfDMReport.reportID;
        createdAction = (0, ReportUtils_1.buildOptimisticCreatedReportAction)(currentUserEmail ?? '', currentTime);
        selfDMParameters = { reportID: selfDMReport.reportID, createdReportActionID: createdAction.reportActionID };
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${selfDMReport.reportID}`,
            value: {
                ...selfDMReport,
                pendingFields: {
                    createChat: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                },
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${selfDMReport.reportID}`,
            value: {
                isOptimisticReport: true,
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${selfDMReport.reportID}`,
            value: {
                [createdAction.reportActionID]: createdAction,
            },
        });
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${selfDMReport.reportID}`,
            value: {
                pendingFields: {
                    createChat: null,
                },
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${selfDMReport.reportID}`,
            value: {
                isOptimisticReport: false,
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${selfDMReport.reportID}`,
            value: {
                [createdAction.reportActionID]: {
                    pendingAction: null,
                },
            },
        });
    }
    // 1. Get all report transactions
    const reportActionsForReport = allReportActions?.[reportID];
    const transactionIDToReportActionAndThreadData = {};
    Object.values(reportActionsForReport ?? {}).forEach((reportAction) => {
        if (!ReportActionsUtils.isMoneyRequestAction(reportAction)) {
            return;
        }
        if (ReportActionsUtils.isDeletedAction(reportAction)) {
            return;
        }
        const originalMessage = ReportActionsUtils.getOriginalMessage(reportAction);
        if (originalMessage?.type !== CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE && originalMessage?.type !== CONST_1.default.IOU.REPORT_ACTION_TYPE.TRACK) {
            return;
        }
        const transactionID = ReportActionsUtils.getOriginalMessage(reportAction)?.IOUTransactionID;
        const childReportID = reportAction.childReportID;
        const newReportActionID = (0, NumberUtils_1.rand64)();
        // 1. Update the transaction and its violations
        if (transactionID) {
            const transaction = allTransactions?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`];
            const transactionViolations = allTransactionViolations?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`];
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
                value: { reportID: CONST_1.default.REPORT.UNREPORTED_REPORT_ID, comment: { hold: null } },
            }, {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`,
                value: null,
            });
            failureData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`,
                value: { reportID: transaction?.reportID, comment: { hold: transaction?.comment?.hold } },
            }, {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`,
                value: transactionViolations,
            });
            if ((0, TransactionUtils_1.isOnHold)(transaction)) {
                const unHoldAction = (0, ReportUtils_1.buildOptimisticUnHoldReportAction)();
                optimisticData.push({
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${childReportID}`,
                    value: { [unHoldAction.reportActionID]: unHoldAction },
                });
                successData.push({
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${childReportID}`,
                    value: { [unHoldAction.reportActionID]: { pendingAction: null } },
                });
                failureData.push({
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${childReportID}`,
                    value: { [unHoldAction.reportActionID]: null },
                });
                transactionIDToReportActionAndThreadData[transactionID] = {
                    ...transactionIDToReportActionAndThreadData[transactionID],
                    unholdReportActionID: unHoldAction.reportActionID,
                };
            }
        }
        // 2. Move the report action to self DM
        const updatedReportAction = {
            ...reportAction,
            originalMessage: {
                // eslint-disable-next-line deprecation/deprecation
                ...reportAction.originalMessage,
                IOUReportID: CONST_1.default.REPORT.UNREPORTED_REPORT_ID,
                type: CONST_1.default.IOU.TYPE.TRACK,
            },
            reportActionID: newReportActionID,
            pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
        };
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${selfDMReportID}`,
            value: { [newReportActionID]: updatedReportAction },
        });
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${selfDMReportID}`,
            value: { [newReportActionID]: { pendingAction: null } },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${selfDMReportID}`,
            value: { [newReportActionID]: null },
        });
        // 3. Update transaction thread
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${childReportID}`,
            value: {
                parentReportActionID: newReportActionID,
                parentReportID: selfDMReportID,
                chatReportID: selfDMReportID,
                policyID: CONST_1.default.POLICY.ID_FAKE,
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${childReportID}`,
            value: {
                [newReportActionID]: {
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                    originalMessage: {
                        IOUTransactionID: transactionID,
                        movedToReportID: selfDMReportID,
                    },
                },
            },
        });
        // 4. Add UNREPORTED_TRANSACTION report action
        const unreportedAction = (0, ReportUtils_1.buildOptimisticUnreportedTransactionAction)(childReportID, reportID);
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${childReportID}`,
            value: { [unreportedAction.reportActionID]: unreportedAction },
        });
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${childReportID}`,
            value: { [unreportedAction.reportActionID]: { pendingAction: null } },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${childReportID}`,
            value: { [unreportedAction.reportActionID]: null },
        });
        if (transactionID) {
            transactionIDToReportActionAndThreadData[transactionID] = {
                ...transactionIDToReportActionAndThreadData[transactionID],
                moneyRequestPreviewReportActionID: newReportActionID,
                movedReportActionID: unreportedAction?.reportActionID,
            };
        }
    });
    // 6. Delete report actions on the report
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
        value: null,
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
        value: reportActionsForReport,
    });
    // 7. Delete the report
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
        value: null,
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
        value: report,
    });
    // 8. Delete chat report preview
    const reportActionID = report?.parentReportActionID;
    const reportAction = allReportActions?.[reportID];
    const parentReportID = report?.parentReportID;
    if (reportActionID) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${parentReportID}`,
            value: {
                [reportActionID]: null,
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${parentReportID}`,
            value: {
                [reportActionID]: reportAction,
            },
        });
    }
    const chatReport = (0, ReportUtils_1.getReportOrDraftReport)(report?.parentReportID);
    if (chatReport) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.parentReportID}`,
            value: { hasOutstandingChildRequest: (0, ReportUtils_1.hasOutstandingChildRequest)(chatReport, report?.reportID) },
        });
    }
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.parentReportID}`,
        value: { hasOutstandingChildRequest: report?.hasOutstandingChildRequest },
    });
    const parameters = {
        reportID,
        transactionIDToReportActionAndThreadData: JSON.stringify(transactionIDToReportActionAndThreadData),
        selfDMReportID: selfDMParameters.reportID,
        selfDMCreatedReportActionID: selfDMParameters.createdReportActionID,
    };
    API.write(types_1.WRITE_COMMANDS.DELETE_APP_REPORT, parameters, { optimisticData, successData, failureData });
}
/**
 * Moves an IOU report to a policy by converting it to an expense report
 * @param reportID - The ID of the IOU report to move
 * @param policyID - The ID of the policy to move the report to
 * @param isFromSettlementButton - Whether the action is from report preview
 */
function moveIOUReportToPolicy(reportID, policyID, isFromSettlementButton) {
    const iouReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = (0, PolicyUtils_1.getPolicy)(policyID);
    // This flow only works for IOU reports
    if (!policy || !iouReport || !(0, ReportUtils_1.isIOUReportUsingReport)(iouReport)) {
        return;
    }
    const isReimbursed = (0, ReportUtils_1.isReportManuallyReimbursed)(iouReport);
    // We do not want to create negative amount expenses
    if (!isReimbursed && ReportActionsUtils.hasRequestFromCurrentAccount(reportID, iouReport.managerID ?? CONST_1.default.DEFAULT_NUMBER_ID) && !isFromSettlementButton) {
        return;
    }
    // Generate new variables for the policy
    const policyName = policy.name ?? '';
    const iouReportID = iouReport.reportID;
    const employeeAccountID = iouReport.ownerAccountID;
    const expenseChatReportId = (0, ReportUtils_1.getPolicyExpenseChat)(employeeAccountID, policyID)?.reportID;
    if (!expenseChatReportId) {
        return;
    }
    const optimisticData = [];
    const successData = [];
    const failureData = [];
    // Next we need to convert the IOU report to Expense report.
    // We need to change:
    // - report type
    // - change the sign of the report total
    // - update its policyID and policyName
    // - update the chatReportID to point to the expense chat if the policy has policy expense chat enabled
    const expenseReport = {
        ...iouReport,
        chatReportID: policy.isPolicyExpenseChatEnabled ? expenseChatReportId : undefined,
        policyID,
        policyName,
        parentReportID: iouReport.parentReportID,
        type: CONST_1.default.REPORT.TYPE.EXPENSE,
        total: -(iouReport?.total ?? 0),
    };
    const titleReportField = (0, ReportUtils_1.getTitleReportField)((0, ReportUtils_1.getReportFieldsByPolicyID)(policyID) ?? {});
    if (!!titleReportField && (0, PolicyUtils_1.isPaidGroupPolicy)(policy)) {
        expenseReport.reportName = (0, ReportUtils_1.populateOptimisticReportFormula)(titleReportField.defaultValue, expenseReport, policy);
    }
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReportID}`,
        value: expenseReport,
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReportID}`,
        value: iouReport,
    });
    // The expense report transactions need to have the amount reversed to negative values
    const reportTransactions = (0, ReportUtils_1.getReportTransactions)(iouReportID);
    // For performance reasons, we are going to compose a merge collection data for transactions
    const transactionsOptimisticData = {};
    const transactionFailureData = {};
    reportTransactions.forEach((transaction) => {
        transactionsOptimisticData[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`] = {
            ...transaction,
            amount: -transaction.amount,
            modifiedAmount: transaction.modifiedAmount ? -transaction.modifiedAmount : 0,
        };
        transactionFailureData[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`] = transaction;
    });
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE_COLLECTION,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}`,
        value: transactionsOptimisticData,
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE_COLLECTION,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}`,
        value: transactionFailureData,
    });
    // We need to move the report preview action from the DM to the expense chat.
    const parentReportActions = allReportActions?.[`${iouReport.parentReportID}`];
    const parentReportActionID = iouReport.parentReportActionID;
    const reportPreview = iouReport?.parentReportID && parentReportActionID ? parentReportActions?.[parentReportActionID] : undefined;
    const oldChatReportID = iouReport.chatReportID;
    if (reportPreview?.reportActionID) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${oldChatReportID}`,
            value: { [reportPreview.reportActionID]: null },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${oldChatReportID}`,
            value: { [reportPreview.reportActionID]: reportPreview },
        });
        // Add the reportPreview action to expense chat
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseChatReportId}`,
            value: { [reportPreview.reportActionID]: { ...reportPreview, childReportName: expenseReport.reportName, created: DateUtils_1.default.getDBTime() } },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseChatReportId}`,
            value: { [reportPreview.reportActionID]: null },
        });
    }
    // Create the CHANGE_POLICY report action and add it to the expense report which indicates to the user where the report has been moved
    const changePolicyReportAction = (0, ReportUtils_1.buildOptimisticChangePolicyReportAction)(iouReport.policyID, policyID, true);
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
        value: { [changePolicyReportAction.reportActionID]: changePolicyReportAction },
    });
    successData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
        value: {
            [changePolicyReportAction.reportActionID]: {
                ...changePolicyReportAction,
                pendingAction: null,
            },
        },
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
        value: { [changePolicyReportAction.reportActionID]: null },
    });
    // To optimistically remove the GBR from the DM we need to update the hasOutstandingChildRequest param to false
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${oldChatReportID}`,
        value: {
            hasOutstandingChildRequest: false,
            iouReportID: null,
        },
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${oldChatReportID}`,
        value: {
            hasOutstandingChildRequest: true,
            iouReportID,
        },
    });
    // Create the MOVED report action and add it to the DM chat which indicates to the user where the report has been moved
    const movedReportAction = (0, ReportUtils_1.buildOptimisticMovedReportAction)(iouReport.policyID, policyID, expenseChatReportId, iouReportID, policyName);
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${oldChatReportID}`,
        value: { [movedReportAction.reportActionID]: movedReportAction },
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${oldChatReportID}`,
        value: { [movedReportAction.reportActionID]: null },
    });
    const parameters = {
        iouReportID,
        policyID,
        changePolicyReportActionID: changePolicyReportAction.reportActionID,
        dmMovedReportActionID: movedReportAction.reportActionID,
        optimisticReportID: expenseChatReportId,
    };
    API.write(types_1.WRITE_COMMANDS.MOVE_IOU_REPORT_TO_EXISTING_POLICY, parameters, { optimisticData, successData, failureData });
}
/**
 * Moves an IOU report to a policy by converting it to an expense report
 * @param reportID - The ID of the IOU report to move
 * @param policyID - The ID of the policy to move the report to
 */
function moveIOUReportToPolicyAndInviteSubmitter(reportID, policyID, formatPhoneNumber) {
    const iouReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = (0, PolicyUtils_1.getPolicy)(policyID);
    if (!policy || !iouReport) {
        return;
    }
    const isPolicyAdmin = (0, PolicyUtils_1.isPolicyAdmin)(policy);
    const submitterAccountID = iouReport.ownerAccountID;
    const submitterEmail = PersonalDetailsUtils.getLoginByAccountID(submitterAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID);
    const submitterLogin = PhoneNumber.addSMSDomainIfPhoneNumber(submitterEmail);
    const iouReportID = iouReport.reportID;
    // This flow only works for admins moving an IOU report to a policy where the submitter is NOT yet a member of the policy
    if (!isPolicyAdmin || !(0, ReportUtils_1.isIOUReportUsingReport)(iouReport) || !submitterAccountID || !submitterEmail || (0, PolicyUtils_1.isPolicyMember)(policy, submitterLogin)) {
        return;
    }
    const isReimbursed = (0, ReportUtils_1.isReportManuallyReimbursed)(iouReport);
    // We only allow moving IOU report to a policy if it doesn't have requests from multiple users, as we do not want to create negative amount expenses
    if (!isReimbursed && ReportActionsUtils.hasRequestFromCurrentAccount(reportID, iouReport.managerID ?? CONST_1.default.DEFAULT_NUMBER_ID)) {
        return;
    }
    const optimisticData = [];
    const successData = [];
    const failureData = [];
    // Optimistically add the submitter to the workspace and create a expense chat for them
    const policyKey = `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`;
    const invitedEmailsToAccountIDs = {
        [submitterEmail]: submitterAccountID,
    };
    // Set up new member optimistic data
    const role = CONST_1.default.POLICY.ROLE.USER;
    // Get personal details onyx data (similar to addMembersToWorkspace)
    const { newAccountIDs, newLogins } = PersonalDetailsUtils.getNewAccountIDsAndLogins([submitterLogin], [submitterAccountID]);
    const newPersonalDetailsOnyxData = PersonalDetailsUtils.getPersonalDetailsOnyxDataForOptimisticUsers(newLogins, newAccountIDs, formatPhoneNumber);
    // Build announce room members data for the new member
    const announceRoomMembers = (0, Member_1.buildRoomMembersOnyxData)(CONST_1.default.REPORT.CHAT_TYPE.POLICY_ANNOUNCE, policyID, [submitterAccountID]);
    // Create policy expense chat for the submitter
    const policyExpenseChats = (0, Policy_1.createPolicyExpenseChats)(policyID, invitedEmailsToAccountIDs);
    const optimisticPolicyExpenseChatReportID = policyExpenseChats.reportCreationData[submitterEmail].reportID;
    const optimisticPolicyExpenseChatCreatedReportActionID = policyExpenseChats.reportCreationData[submitterEmail].reportActionID;
    // Set up optimistic member state
    const optimisticMembersState = {
        [submitterLogin]: {
            role,
            email: submitterLogin,
            pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
            submitsTo: (0, PolicyUtils_1.getDefaultApprover)(allPolicies?.[policyKey]),
        },
    };
    const successMembersState = {
        [submitterLogin]: { pendingAction: null },
    };
    const failureMembersState = {
        [submitterLogin]: {
            errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('workspace.people.error.genericAdd'),
        },
    };
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: policyKey,
        value: {
            employeeList: optimisticMembersState,
        },
    });
    successData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: policyKey,
        value: {
            employeeList: successMembersState,
        },
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: policyKey,
        value: {
            employeeList: failureMembersState,
        },
    });
    optimisticData.push(...newPersonalDetailsOnyxData.optimisticData, ...policyExpenseChats.onyxOptimisticData, ...announceRoomMembers.optimisticData);
    successData.push(...newPersonalDetailsOnyxData.finallyData, ...policyExpenseChats.onyxSuccessData, ...announceRoomMembers.successData);
    failureData.push(...policyExpenseChats.onyxFailureData, ...announceRoomMembers.failureData);
    // Next we need to convert the IOU report to Expense report.
    // We need to change:
    // - report type
    // - change the sign of the report total
    // - update its policyID and policyName
    // - update the chatReportID to point to the expense chat if the policy has policy expense chat enabled
    const expenseReport = {
        ...iouReport,
        chatReportID: optimisticPolicyExpenseChatReportID,
        policyID,
        policyName: policy.name,
        parentReportID: optimisticPolicyExpenseChatReportID,
        type: CONST_1.default.REPORT.TYPE.EXPENSE,
        total: -(iouReport?.total ?? 0),
    };
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
        value: expenseReport,
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
        value: iouReport,
    });
    // The expense report transactions need to have the amount reversed to negative values
    const reportTransactions = (0, ReportUtils_1.getReportTransactions)(reportID);
    // For performance reasons, we are going to compose a merge collection data for transactions
    const transactionsOptimisticData = {};
    const transactionFailureData = {};
    reportTransactions.forEach((transaction) => {
        transactionsOptimisticData[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`] = {
            ...transaction,
            amount: -transaction.amount,
            modifiedAmount: transaction.modifiedAmount ? -transaction.modifiedAmount : 0,
        };
        transactionFailureData[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`] = transaction;
    });
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE_COLLECTION,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}`,
        value: transactionsOptimisticData,
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE_COLLECTION,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}`,
        value: transactionFailureData,
    });
    // We need to move the report preview action from the DM to the expense chat.
    const oldChatReportID = iouReport.chatReportID;
    const reportPreviewActionID = iouReport.parentReportActionID;
    const reportPreview = !!oldChatReportID && !!reportPreviewActionID ? allReportActions?.[oldChatReportID]?.[reportPreviewActionID] : undefined;
    if (reportPreview?.reportActionID) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${oldChatReportID}`,
            value: { [reportPreview.reportActionID]: null },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${oldChatReportID}`,
            value: { [reportPreview.reportActionID]: reportPreview },
        });
        // Add the reportPreview action to expense chat
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${optimisticPolicyExpenseChatReportID}`,
            value: { [reportPreview.reportActionID]: { ...reportPreview, created: DateUtils_1.default.getDBTime() } },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${optimisticPolicyExpenseChatReportID}`,
            value: { [reportPreview.reportActionID]: null },
        });
    }
    // Create the CHANGE_POLICY report action and add it to the expense report which indicates to the user where the report has been moved
    const changePolicyReportAction = (0, ReportUtils_1.buildOptimisticChangePolicyReportAction)(iouReport.policyID, policyID, true);
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
        value: { [changePolicyReportAction.reportActionID]: changePolicyReportAction },
    });
    successData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
        value: {
            [changePolicyReportAction.reportActionID]: {
                ...changePolicyReportAction,
                pendingAction: null,
            },
        },
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
        value: { [changePolicyReportAction.reportActionID]: null },
    });
    // To optimistically remove the GBR from the DM we need to update the hasOutstandingChildRequest param to false
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${oldChatReportID}`,
        value: {
            hasOutstandingChildRequest: false,
            iouReportID: null,
        },
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${oldChatReportID}`,
        value: {
            hasOutstandingChildRequest: true,
            iouReportID: reportID,
        },
    });
    // Create the MOVED report action and add it to the DM chat which indicates to the user where the report has been moved
    const movedReportAction = (0, ReportUtils_1.buildOptimisticMovedReportAction)(iouReport.policyID, policyID, optimisticPolicyExpenseChatReportID, iouReportID, policy.name);
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${oldChatReportID}`,
        value: { [movedReportAction.reportActionID]: movedReportAction },
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${oldChatReportID}`,
        value: { [movedReportAction.reportActionID]: null },
    });
    const parameters = {
        iouReportID: reportID,
        policyID,
        policyExpenseChatReportID: optimisticPolicyExpenseChatReportID ?? String(CONST_1.default.DEFAULT_NUMBER_ID),
        policyExpenseCreatedReportActionID: optimisticPolicyExpenseChatCreatedReportActionID ?? String(CONST_1.default.DEFAULT_NUMBER_ID),
        changePolicyReportActionID: changePolicyReportAction.reportActionID,
        dmMovedReportActionID: movedReportAction.reportActionID,
    };
    API.write(types_1.WRITE_COMMANDS.MOVE_IOU_REPORT_TO_POLICY_AND_INVITE_SUBMITTER, parameters, { optimisticData, successData, failureData });
    return { policyExpenseChatReportID: optimisticPolicyExpenseChatReportID };
}
/**
 * Dismisses the change report policy educational modal so that it doesn't show up again.
 */
function dismissChangePolicyModal() {
    const date = new Date();
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_DISMISSED_PRODUCT_TRAINING,
            value: {
                [CONST_1.default.CHANGE_POLICY_TRAINING_MODAL]: {
                    timestamp: DateUtils_1.default.getDBTime(date.valueOf()),
                    dismissedMethod: 'click',
                },
            },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.DISMISS_PRODUCT_TRAINING, { name: CONST_1.default.CHANGE_POLICY_TRAINING_MODAL, dismissedMethod: 'click' }, { optimisticData });
}
/**
 * @private
 * Builds a map of parentReportID to child report IDs for efficient traversal.
 */
function buildReportIDToThreadsReportIDsMap() {
    const reportIDToThreadsReportIDsMap = {};
    Object.values(allReports ?? {}).forEach((report) => {
        if (!report?.parentReportID) {
            return;
        }
        if (!reportIDToThreadsReportIDsMap[report.parentReportID]) {
            reportIDToThreadsReportIDsMap[report.parentReportID] = [];
        }
        reportIDToThreadsReportIDsMap[report.parentReportID].push(report.reportID);
    });
    return reportIDToThreadsReportIDsMap;
}
/**
 * @private
 * Recursively updates the policyID for a report and all its child reports.
 */
function updatePolicyIdForReportAndThreads(currentReportID, policyID, reportIDToThreadsReportIDsMap, optimisticData, failureData) {
    const currentReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${currentReportID}`];
    const originalPolicyID = currentReport?.policyID;
    if (originalPolicyID) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${currentReportID}`,
            value: { policyID },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${currentReportID}`,
            value: { policyID: originalPolicyID },
        });
    }
    // Recursively process child reports for the current report
    const childReportIDs = reportIDToThreadsReportIDsMap[currentReportID] || [];
    childReportIDs.forEach((childReportID) => {
        updatePolicyIdForReportAndThreads(childReportID, policyID, reportIDToThreadsReportIDsMap, optimisticData, failureData);
    });
}
function navigateToTrainingModal(dismissedProductTrainingNVP, reportID) {
    if (dismissedProductTrainingNVP?.[CONST_1.default.CHANGE_POLICY_TRAINING_MODAL]) {
        return;
    }
    react_native_1.InteractionManager.runAfterInteractions(() => {
        Navigation_1.default.navigate(ROUTES_1.default.CHANGE_POLICY_EDUCATIONAL.getRoute(ROUTES_1.default.REPORT_WITH_ID.getRoute(reportID)));
    });
}
function buildOptimisticChangePolicyData(report, policy, reportNextStep, optimisticPolicyExpenseChatReport, isReportArchived = false) {
    const optimisticData = [];
    const successData = [];
    const failureData = [];
    // 1. Optimistically set the policyID on the report (and all its threads) by:
    // 1.1 Preprocess reports to create a map of parentReportID to child reports list of reportIDs
    // 1.2 Recursively update the policyID of the report and all its child reports
    const reportID = report.reportID;
    const reportIDToThreadsReportIDsMap = buildReportIDToThreadsReportIDsMap();
    updatePolicyIdForReportAndThreads(reportID, policy.id, reportIDToThreadsReportIDsMap, optimisticData, failureData);
    // We reopen and reassign the report if the report is open/submitted and the manager is not a member of the new policy. This is to prevent the old manager from seeing a report that they can't action on.
    let newStatusNum = report?.statusNum;
    const isOpenOrSubmitted = (0, ReportUtils_1.isOpenExpenseReport)(report) || (0, ReportUtils_1.isProcessingReport)(report);
    const managerLogin = PersonalDetailsUtils.getLoginByAccountID(report.managerID ?? CONST_1.default.DEFAULT_NUMBER_ID);
    if (isOpenOrSubmitted && managerLogin && !(0, PolicyUtils_1.isPolicyMember)(policy, managerLogin)) {
        newStatusNum = CONST_1.default.REPORT.STATUS_NUM.OPEN;
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
                managerID: (0, ReportUtils_1.getNextApproverAccountID)(report, true),
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
            value: {
                stateNum: report.stateNum,
                statusNum: report.statusNum,
                managerID: report.managerID,
            },
        });
    }
    if (newStatusNum) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${reportID}`,
            value: (0, NextStepUtils_1.buildNextStep)({ ...report, policyID: policy.id }, newStatusNum),
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${reportID}`,
            value: reportNextStep,
        });
    }
    // 2. If this is a thread, we have to mark the parent report preview action as deleted to properly update the UI
    if (report.parentReportID && report.parentReportActionID) {
        const oldWorkspaceChatReportID = report.parentReportID;
        const oldReportPreviewActionID = report.parentReportActionID;
        const oldReportPreviewAction = allReportActions?.[oldWorkspaceChatReportID]?.[oldReportPreviewActionID];
        const deletedTime = DateUtils_1.default.getDBTime();
        const firstMessage = Array.isArray(oldReportPreviewAction?.message) ? oldReportPreviewAction.message.at(0) : null;
        const updatedReportPreviewAction = {
            ...oldReportPreviewAction,
            originalMessage: {
                deleted: deletedTime,
            },
            ...(firstMessage && {
                message: [
                    {
                        ...firstMessage,
                        deleted: deletedTime,
                    },
                    ...(Array.isArray(oldReportPreviewAction?.message) ? oldReportPreviewAction.message.slice(1) : []),
                ],
            }),
            ...(!Array.isArray(oldReportPreviewAction?.message) && {
                message: {
                    deleted: deletedTime,
                },
            }),
        };
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${oldWorkspaceChatReportID}`,
            value: { [oldReportPreviewActionID]: updatedReportPreviewAction },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${oldWorkspaceChatReportID}`,
            value: {
                [oldReportPreviewActionID]: {
                    ...oldReportPreviewAction,
                    originalMessage: {
                        deleted: null,
                    },
                    ...(!Array.isArray(oldReportPreviewAction?.message) && {
                        message: {
                            deleted: null,
                        },
                    }),
                },
            },
        });
        // Update the expense chat report
        const chatReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${oldWorkspaceChatReportID}`];
        const lastMessageText = (0, ReportUtils_1.getLastVisibleMessage)(oldWorkspaceChatReportID, { [oldReportPreviewActionID]: updatedReportPreviewAction }, isReportArchived)?.lastMessageText;
        const lastVisibleActionCreated = (0, ReportUtils_1.getReportLastMessage)(oldWorkspaceChatReportID, { [oldReportPreviewActionID]: updatedReportPreviewAction })?.lastVisibleActionCreated;
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${oldWorkspaceChatReportID}`,
            value: {
                hasOutstandingChildRequest: false,
                iouReportID: null,
                lastMessageText,
                lastVisibleActionCreated,
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${oldWorkspaceChatReportID}`,
            value: chatReport,
        });
    }
    // 3. Optimistically create a new REPORT_PREVIEW reportAction with the newReportPreviewActionID
    // and set it as a parent of the moved report
    const policyExpenseChat = optimisticPolicyExpenseChatReport ?? (0, ReportUtils_1.getPolicyExpenseChat)(report.ownerAccountID, policy.id);
    const optimisticReportPreviewAction = (0, ReportUtils_1.buildOptimisticReportPreview)(policyExpenseChat, report);
    const newPolicyExpenseChatReportID = policyExpenseChat?.reportID;
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${newPolicyExpenseChatReportID}`,
        value: { [optimisticReportPreviewAction.reportActionID]: optimisticReportPreviewAction },
    });
    successData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${newPolicyExpenseChatReportID}`,
        value: {
            [optimisticReportPreviewAction.reportActionID]: {
                pendingAction: null,
            },
        },
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${newPolicyExpenseChatReportID}`,
        value: { [optimisticReportPreviewAction.reportActionID]: null },
    });
    // Set the new report preview action as a parent of the moved report,
    // and set the parentReportID on the moved report as the expense chat reportID
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
        value: { parentReportActionID: optimisticReportPreviewAction.reportActionID, parentReportID: newPolicyExpenseChatReportID },
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`,
        value: { parentReportActionID: report.parentReportActionID, parentReportID: report.parentReportID },
    });
    // Set lastVisibleActionCreated
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${newPolicyExpenseChatReportID}`,
        value: { lastVisibleActionCreated: optimisticReportPreviewAction?.created },
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${newPolicyExpenseChatReportID}`,
        value: { lastVisibleActionCreated: policyExpenseChat?.lastVisibleActionCreated },
    });
    // 4. Optimistically create a CHANGE_POLICY reportAction on the report using the reportActionID
    const optimisticMovedReportAction = (0, ReportUtils_1.buildOptimisticChangePolicyReportAction)(report.policyID, policy.id);
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
        value: { [optimisticMovedReportAction.reportActionID]: optimisticMovedReportAction },
    });
    successData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
        value: {
            [optimisticMovedReportAction.reportActionID]: {
                pendingAction: null,
                errors: null,
            },
        },
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
        value: {
            [optimisticMovedReportAction.reportActionID]: {
                errors: (0, ErrorUtils_1.getMicroSecondTranslationErrorWithTranslationKey)('common.genericErrorMessage'),
            },
        },
    });
    const currentSearchQueryJSON = (0, SearchQueryUtils_1.getCurrentSearchQueryJSON)();
    // Search data might not have the new policy data so we should add it optimistically.
    if (policy && currentSearchQueryJSON) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${currentSearchQueryJSON.hash}`,
            value: {
                data: { [`${ONYXKEYS_1.default.COLLECTION.POLICY}${policy.id}`]: policy },
            },
        });
    }
    // 5. Make sure the expense report is not archived
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${reportID}`,
        value: {
            private_isArchived: null,
        },
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${reportID}`,
        value: {
            private_isArchived: DateUtils_1.default.getDBTime(),
        },
    });
    return { optimisticData, successData, failureData, optimisticReportPreviewAction, optimisticMovedReportAction };
}
/**
 * Changes the policy of a report and all its child reports, and moves the report to the new policy's expense chat.
 */
function changeReportPolicy(report, policy, reportNextStep, isReportArchived = false) {
    if (!report || !policy || report.policyID === policy.id || !(0, ReportUtils_1.isExpenseReport)(report)) {
        return;
    }
    const { optimisticData, successData, failureData, optimisticReportPreviewAction, optimisticMovedReportAction } = buildOptimisticChangePolicyData(report, policy, reportNextStep, undefined, isReportArchived);
    const params = {
        reportID: report.reportID,
        policyID: policy.id,
        reportPreviewReportActionID: optimisticReportPreviewAction.reportActionID,
        changePolicyReportActionID: optimisticMovedReportAction.reportActionID,
    };
    API.write(types_1.WRITE_COMMANDS.CHANGE_REPORT_POLICY, params, { optimisticData, successData, failureData });
    // If the dismissedProductTraining.changeReportModal is not set,
    // navigate to CHANGE_POLICY_EDUCATIONAL and a backTo param for the report page.
    navigateToTrainingModal(nvpDismissedProductTraining, report.reportID);
}
/**
 * Invites the submitter to the new report policy, changes the policy of a report and all its child reports, and moves the report to the new policy's expense chat
 */
function changeReportPolicyAndInviteSubmitter(report, policy, employeeList, formatPhoneNumber, isReportArchived = false) {
    if (!report.reportID || !policy?.id || report.policyID === policy.id || !(0, ReportUtils_1.isExpenseReport)(report) || !report.ownerAccountID) {
        return;
    }
    const submitterEmail = PersonalDetailsUtils.getLoginByAccountID(report.ownerAccountID);
    if (!submitterEmail) {
        return;
    }
    const policyMemberAccountIDs = Object.values((0, PolicyUtils_1.getMemberAccountIDsForWorkspace)(employeeList, false, false));
    const { optimisticData, successData, failureData, membersChats } = (0, Member_1.buildAddMembersToWorkspaceOnyxData)({ [submitterEmail]: report.ownerAccountID }, policy.id, policyMemberAccountIDs, CONST_1.default.POLICY.ROLE.USER, formatPhoneNumber, CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS);
    const optimisticPolicyExpenseChatReportID = membersChats.reportCreationData[submitterEmail].reportID;
    const optimisticPolicyExpenseChatCreatedReportActionID = membersChats.reportCreationData[submitterEmail].reportActionID;
    if (!optimisticPolicyExpenseChatReportID) {
        return;
    }
    const { optimisticData: optimisticChangePolicyData, successData: successChangePolicyData, failureData: failureChangePolicyData, optimisticReportPreviewAction, optimisticMovedReportAction, } = buildOptimisticChangePolicyData(report, policy, undefined, membersChats.reportCreationData[submitterEmail], isReportArchived);
    optimisticData.push(...optimisticChangePolicyData);
    successData.push(...successChangePolicyData);
    failureData.push(...failureChangePolicyData);
    const params = {
        reportID: report.reportID,
        policyID: policy.id,
        reportPreviewReportActionID: optimisticReportPreviewAction.reportActionID,
        changePolicyReportActionID: optimisticMovedReportAction.reportActionID,
        policyExpenseChatReportID: optimisticPolicyExpenseChatReportID,
        policyExpenseCreatedReportActionID: optimisticPolicyExpenseChatCreatedReportActionID,
    };
    API.write(types_1.WRITE_COMMANDS.CHANGE_REPORT_POLICY_AND_INVITE_SUBMITTER, params, { optimisticData, successData, failureData });
    // If the dismissedProductTraining.changeReportModal is not set,
    // navigate to CHANGE_POLICY_EDUCATIONAL and a backTo param for the report page.
    navigateToTrainingModal(nvpDismissedProductTraining, report.reportID);
}
/**
 * Resolves Concierge category options by adding a comment and updating the report action
 * @param reportID - The report ID where the comment should be added
 * @param actionReportID - The report ID where the report action should be updated (may be different for threads)
 * @param reportActionID - The specific report action ID to update
 * @param selectedCategory - The category selected by the user
 */
function resolveConciergeCategoryOptions(reportID, actionReportID, reportActionID, selectedCategory, timezoneParam) {
    if (!reportID || !actionReportID || !reportActionID) {
        return;
    }
    addComment(reportID, selectedCategory, timezoneParam);
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${actionReportID}`, {
        [reportActionID]: {
            originalMessage: {
                selectedCategory,
            },
        },
    });
}
