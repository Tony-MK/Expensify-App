"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const AvatarWithImagePicker_1 = require("@components/AvatarWithImagePicker");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const ConfirmModal_1 = require("@components/ConfirmModal");
const DisplayNames_1 = require("@components/DisplayNames");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const MentionReportContext_1 = require("@components/HTMLEngineProvider/HTMLRenderers/MentionReportRenderer/MentionReportContext");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ParentNavigationSubtitle_1 = require("@components/ParentNavigationSubtitle");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const PromotedActionsBar_1 = require("@components/PromotedActionsBar");
const ReportActionAvatars_1 = require("@components/ReportActionAvatars");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const SearchContext_1 = require("@components/Search/SearchContext");
const useDuplicateTransactionsAndViolations_1 = require("@hooks/useDuplicateTransactionsAndViolations");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePaginatedReportActions_1 = require("@hooks/usePaginatedReportActions");
const usePermissions_1 = require("@hooks/usePermissions");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const getBase62ReportID_1 = require("@libs/getBase62ReportID");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const Parser_1 = require("@libs/Parser");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const StringUtils_1 = require("@libs/StringUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const IOU_1 = require("@userActions/IOU");
const Report_1 = require("@userActions/Report");
const Session_1 = require("@userActions/Session");
const Task_1 = require("@userActions/Task");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const withReportOrNotFound_1 = require("./home/report/withReportOrNotFound");
const CASES = {
    DEFAULT: 'default',
    MONEY_REQUEST: 'money_request',
    MONEY_REPORT: 'money_report',
};
function ReportDetailsPage({ policy, report, route, reportMetadata }) {
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const backTo = route.params.backTo;
    const [parentReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.parentReportID}`, { canBeMissing: true });
    const [chatReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.chatReportID}`, { canBeMissing: true });
    const [parentReportAction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.parentReportID}`, {
        selector: (actions) => (report?.parentReportActionID ? actions?.[report.parentReportActionID] : undefined),
        canBeMissing: true,
    });
    const [reportNameValuePairs] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report?.reportID}`, { canBeMissing: false });
    const { reportActions } = (0, usePaginatedReportActions_1.default)(report.reportID);
    const { removeTransaction } = (0, SearchContext_1.useSearchContext)();
    const transactionThreadReportID = (0, react_1.useMemo)(() => (0, ReportActionsUtils_1.getOneTransactionThreadReportID)(report, chatReport, reportActions ?? [], isOffline), [reportActions, isOffline, report, chatReport]);
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    /* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
    const [transactionThreadReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReportID}`, { canBeMissing: true });
    const [isDebugModeEnabled = false] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_DEBUG_MODE_ENABLED, { canBeMissing: true });
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: false });
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const [isLastMemberLeavingGroupModalVisible, setIsLastMemberLeavingGroupModalVisible] = (0, react_1.useState)(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = (0, react_1.useState)(false);
    const isPolicyAdmin = (0, react_1.useMemo)(() => (0, PolicyUtils_1.isPolicyAdmin)(policy), [policy]);
    const isPolicyEmployee = (0, react_1.useMemo)(() => (0, PolicyUtils_1.isPolicyEmployee)(report?.policyID, policy), [report?.policyID, policy]);
    const isPolicyExpenseChat = (0, react_1.useMemo)(() => (0, ReportUtils_1.isPolicyExpenseChat)(report), [report]);
    const shouldUseFullTitle = (0, react_1.useMemo)(() => (0, ReportUtils_1.shouldUseFullTitleToDisplay)(report), [report]);
    const isChatRoom = (0, react_1.useMemo)(() => (0, ReportUtils_1.isChatRoom)(report), [report]);
    const isUserCreatedPolicyRoom = (0, react_1.useMemo)(() => (0, ReportUtils_1.isUserCreatedPolicyRoom)(report), [report]);
    const isDefaultRoom = (0, react_1.useMemo)(() => (0, ReportUtils_1.isDefaultRoom)(report), [report]);
    const isChatThread = (0, react_1.useMemo)(() => (0, ReportUtils_1.isChatThread)(report), [report]);
    const isMoneyRequestReport = (0, react_1.useMemo)(() => (0, ReportUtils_1.isMoneyRequestReport)(report), [report]);
    const isMoneyRequest = (0, react_1.useMemo)(() => (0, ReportUtils_1.isMoneyRequest)(report), [report]);
    const isInvoiceReport = (0, react_1.useMemo)(() => (0, ReportUtils_1.isInvoiceReport)(report), [report]);
    const isFinancialReportsForBusinesses = (0, react_1.useMemo)(() => (0, ReportUtils_1.isFinancialReportsForBusinesses)(report), [report]);
    const isInvoiceRoom = (0, react_1.useMemo)(() => (0, ReportUtils_1.isInvoiceRoom)(report), [report]);
    const isTaskReport = (0, react_1.useMemo)(() => (0, ReportUtils_1.isTaskReport)(report), [report]);
    const isSelfDM = (0, react_1.useMemo)(() => (0, ReportUtils_1.isSelfDM)(report), [report]);
    const isTrackExpenseReport = (0, react_1.useMemo)(() => (0, ReportUtils_1.isTrackExpenseReport)(report), [report]);
    const isCanceledTaskReport = (0, ReportUtils_1.isCanceledTaskReport)(report, parentReportAction);
    const isParentReportArchived = (0, useReportIsArchived_1.default)(parentReport?.reportID);
    const isTaskModifiable = (0, Task_1.canModifyTask)(report, session?.accountID, isParentReportArchived);
    const isTaskActionable = (0, Task_1.canActionTask)(report, session?.accountID, parentReport, isParentReportArchived);
    const canEditReportDescription = (0, react_1.useMemo)(() => (0, ReportUtils_1.canEditReportDescription)(report, policy), [report, policy]);
    const shouldShowReportDescription = isChatRoom && (canEditReportDescription || report.description !== '') && (isTaskReport ? isTaskModifiable : true);
    const isExpenseReport = isMoneyRequestReport || isInvoiceReport || isMoneyRequest;
    const isSingleTransactionView = isMoneyRequest || isTrackExpenseReport;
    const isSelfDMTrackExpenseReport = isTrackExpenseReport && (0, ReportUtils_1.isSelfDM)(parentReport);
    const isReportArchived = (0, useReportIsArchived_1.default)(report?.reportID);
    const isArchivedRoom = (0, react_1.useMemo)(() => (0, ReportUtils_1.isArchivedNonExpenseReport)(report, isReportArchived), [report, isReportArchived]);
    const shouldDisableRename = (0, react_1.useMemo)(() => (0, ReportUtils_1.shouldDisableRename)(report, isReportArchived), [report, isReportArchived]);
    const parentNavigationSubtitleData = (0, ReportUtils_1.getParentNavigationSubtitle)(report, isParentReportArchived);
    const base62ReportID = (0, getBase62ReportID_1.default)(Number(report.reportID));
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- policy is a dependency because `getChatRoomSubtitle` calls `getPolicyName` which in turn retrieves the value from the `policy` value stored in Onyx
    const chatRoomSubtitle = (0, react_1.useMemo)(() => {
        const subtitle = (0, ReportUtils_1.getChatRoomSubtitle)(report, false, isReportArchived);
        if (subtitle) {
            return subtitle;
        }
        return '';
    }, [isReportArchived, report]);
    const isSystemChat = (0, react_1.useMemo)(() => (0, ReportUtils_1.isSystemChat)(report), [report]);
    const isGroupChat = (0, react_1.useMemo)(() => (0, ReportUtils_1.isGroupChat)(report), [report]);
    const isRootGroupChat = (0, react_1.useMemo)(() => (0, ReportUtils_1.isRootGroupChat)(report, isReportArchived), [report, isReportArchived]);
    const isThread = (0, react_1.useMemo)(() => (0, ReportUtils_1.isThread)(report), [report]);
    const shouldOpenRoomMembersPage = isUserCreatedPolicyRoom || isChatThread || (isPolicyExpenseChat && isPolicyAdmin);
    const participants = (0, react_1.useMemo)(() => {
        return (0, ReportUtils_1.getParticipantsList)(report, personalDetails, shouldOpenRoomMembersPage);
    }, [report, personalDetails, shouldOpenRoomMembersPage]);
    let caseID;
    if (isMoneyRequestReport || isInvoiceReport) {
        // 3. MoneyReportHeader
        caseID = CASES.MONEY_REPORT;
    }
    else if (isSingleTransactionView) {
        // 2. MoneyRequestHeader
        caseID = CASES.MONEY_REQUEST;
    }
    else {
        // 1. HeaderView
        caseID = CASES.DEFAULT;
    }
    // Get the active chat members by filtering out the pending members with delete action
    const activeChatMembers = participants.flatMap((accountID) => {
        const pendingMember = reportMetadata?.pendingChatMembers?.findLast((member) => member.accountID === accountID.toString());
        const detail = personalDetails?.[accountID];
        if (!detail) {
            return [];
        }
        return !pendingMember || pendingMember.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE ? accountID : [];
    });
    const isPrivateNotesFetchTriggered = reportMetadata?.isLoadingPrivateNotes !== undefined;
    const requestParentReportAction = (0, react_1.useMemo)(() => {
        // 2. MoneyReport case
        if (caseID === CASES.MONEY_REPORT) {
            if (!reportActions || !transactionThreadReport?.parentReportActionID) {
                return undefined;
            }
            return reportActions.find((action) => action.reportActionID === transactionThreadReport.parentReportActionID);
        }
        return parentReportAction;
    }, [caseID, parentReportAction, reportActions, transactionThreadReport?.parentReportActionID]);
    const isActionOwner = typeof requestParentReportAction?.actorAccountID === 'number' && typeof session?.accountID === 'number' && requestParentReportAction.actorAccountID === session?.accountID;
    const isDeletedParentAction = (0, ReportActionsUtils_1.isDeletedAction)(requestParentReportAction);
    const moneyRequestReport = (0, react_1.useMemo)(() => {
        if (caseID === CASES.MONEY_REQUEST) {
            return parentReport;
        }
        return report;
    }, [caseID, parentReport, report]);
    const isMoneyRequestReportArchived = (0, useReportIsArchived_1.default)(moneyRequestReport?.reportID);
    const shouldShowTaskDeleteButton = isTaskReport &&
        !isCanceledTaskReport &&
        (0, ReportUtils_1.canWriteInReport)(report) &&
        report.stateNum !== CONST_1.default.REPORT.STATE_NUM.APPROVED &&
        !(0, ReportUtils_1.isClosedReport)(report) &&
        isTaskModifiable &&
        isTaskActionable;
    const canDeleteRequest = isActionOwner && ((0, ReportUtils_1.canDeleteTransaction)(moneyRequestReport, isMoneyRequestReportArchived) || isSelfDMTrackExpenseReport) && !isDeletedParentAction;
    const iouTransactionID = (0, ReportActionsUtils_1.isMoneyRequestAction)(requestParentReportAction) ? (0, ReportActionsUtils_1.getOriginalMessage)(requestParentReportAction)?.IOUTransactionID : undefined;
    const [iouTransaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${iouTransactionID}`, { canBeMissing: true });
    const { duplicateTransactions, duplicateTransactionViolations } = (0, useDuplicateTransactionsAndViolations_1.default)(iouTransactionID ? [iouTransactionID] : []);
    const isCardTransactionCanBeDeleted = (0, ReportUtils_1.canDeleteCardTransactionByLiabilityType)(iouTransaction);
    const shouldShowDeleteButton = shouldShowTaskDeleteButton || (canDeleteRequest && isCardTransactionCanBeDeleted) || (0, TransactionUtils_1.isDemoTransaction)(iouTransaction);
    const [reportAttributes] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { canBeMissing: true, selector: (val) => val?.reports });
    (0, react_1.useEffect)(() => {
        if (canDeleteRequest) {
            return;
        }
        setIsDeleteModalVisible(false);
    }, [canDeleteRequest]);
    (0, react_1.useEffect)(() => {
        // Do not fetch private notes if isLoadingPrivateNotes is already defined, or if the network is offline, or if the report is a self DM.
        if (isPrivateNotesFetchTriggered || isOffline || isSelfDM) {
            return;
        }
        (0, Report_1.getReportPrivateNote)(report?.reportID);
    }, [report?.reportID, isOffline, isPrivateNotesFetchTriggered, isSelfDM]);
    const leaveChat = (0, react_1.useCallback)(() => {
        Navigation_1.default.dismissModal();
        Navigation_1.default.isNavigationReady().then(() => {
            if (isRootGroupChat) {
                (0, Report_1.leaveGroupChat)(report.reportID);
                return;
            }
            const isWorkspaceMemberLeavingWorkspaceRoom = (report.visibility === CONST_1.default.REPORT.VISIBILITY.RESTRICTED || isPolicyExpenseChat) && isPolicyEmployee;
            (0, Report_1.leaveRoom)(report.reportID, isWorkspaceMemberLeavingWorkspaceRoom);
        });
    }, [isPolicyEmployee, isPolicyExpenseChat, isRootGroupChat, report.reportID, report.visibility]);
    const shouldShowLeaveButton = (0, ReportUtils_1.canLeaveChat)(report, policy, !!reportNameValuePairs?.private_isArchived);
    const shouldShowGoToWorkspace = (0, PolicyUtils_1.shouldShowPolicy)(policy, false, session?.email) && !policy?.isJoinRequestPending;
    const reportName = Parser_1.default.htmlToText((0, ReportUtils_1.getReportName)(report, undefined, undefined, undefined, undefined, reportAttributes));
    const additionalRoomDetails = (isPolicyExpenseChat && !!report?.isOwnPolicyExpenseChat) || (0, ReportUtils_1.isExpenseReport)(report) || isPolicyExpenseChat || isInvoiceRoom
        ? chatRoomSubtitle
        : `${translate('threads.in')} ${chatRoomSubtitle}`;
    let roomDescription;
    if (caseID === CASES.MONEY_REQUEST) {
        roomDescription = translate('common.name');
    }
    else if (isGroupChat) {
        roomDescription = translate('newRoomPage.groupName');
    }
    else {
        roomDescription = translate('newRoomPage.roomName');
    }
    const shouldShowNotificationPref = !isMoneyRequestReport && !(0, ReportUtils_1.isHiddenForCurrentUser)(report);
    const shouldShowWriteCapability = !isMoneyRequestReport;
    const shouldShowMenuItem = shouldShowNotificationPref || shouldShowWriteCapability || (!!report?.visibility && report.chatType !== CONST_1.default.REPORT.CHAT_TYPE.INVOICE);
    const menuItems = (0, react_1.useMemo)(() => {
        const items = [];
        if (isSelfDM) {
            return [];
        }
        if (isArchivedRoom) {
            return items;
        }
        // The Members page is only shown when:
        // - The report is a thread in a chat report
        // - The report is not a user created room with participants to show i.e. DM, Group Chat, etc
        // - The report is a user created room and the room and the current user is a workspace member i.e. non-workspace members should not see this option.
        if ((isGroupChat ||
            (isDefaultRoom && isChatThread && isPolicyEmployee) ||
            (!isUserCreatedPolicyRoom && participants.length) ||
            (isUserCreatedPolicyRoom && (isPolicyEmployee || (isChatThread && !(0, ReportUtils_1.isPublicRoom)(report))))) &&
            !(0, ReportUtils_1.isConciergeChatReport)(report) &&
            !isSystemChat &&
            activeChatMembers.length > 0) {
            items.push({
                key: CONST_1.default.REPORT_DETAILS_MENU_ITEM.MEMBERS,
                translationKey: 'common.members',
                icon: Expensicons.Users,
                subtitle: activeChatMembers.length,
                isAnonymousAction: false,
                shouldShowRightIcon: true,
                action: () => {
                    if (shouldOpenRoomMembersPage) {
                        Navigation_1.default.navigate(ROUTES_1.default.ROOM_MEMBERS.getRoute(report?.reportID, backTo));
                    }
                    else {
                        Navigation_1.default.navigate(ROUTES_1.default.REPORT_PARTICIPANTS.getRoute(report?.reportID, backTo));
                    }
                },
            });
        }
        else if ((isUserCreatedPolicyRoom && (!participants.length || !isPolicyEmployee)) || ((isDefaultRoom || isPolicyExpenseChat) && isChatThread && !isPolicyEmployee)) {
            items.push({
                key: CONST_1.default.REPORT_DETAILS_MENU_ITEM.INVITE,
                translationKey: 'common.invite',
                icon: Expensicons.Users,
                isAnonymousAction: false,
                shouldShowRightIcon: true,
                action: () => {
                    Navigation_1.default.navigate(ROUTES_1.default.ROOM_INVITE.getRoute(report?.reportID));
                },
            });
        }
        if (shouldShowMenuItem) {
            items.push({
                key: CONST_1.default.REPORT_DETAILS_MENU_ITEM.SETTINGS,
                translationKey: 'common.settings',
                icon: Expensicons.Gear,
                isAnonymousAction: false,
                shouldShowRightIcon: true,
                action: () => {
                    Navigation_1.default.navigate(ROUTES_1.default.REPORT_SETTINGS.getRoute(report?.reportID, backTo));
                },
            });
        }
        if (isTrackExpenseReport && !isDeletedParentAction) {
            const actionReportID = (0, ReportUtils_1.getOriginalReportID)(report.reportID, parentReportAction);
            const whisperAction = (0, ReportActionsUtils_1.getTrackExpenseActionableWhisper)(iouTransactionID, moneyRequestReport?.reportID);
            const actionableWhisperReportActionID = whisperAction?.reportActionID;
            items.push({
                key: CONST_1.default.REPORT_DETAILS_MENU_ITEM.TRACK.SUBMIT,
                translationKey: 'actionableMentionTrackExpense.submit',
                icon: Expensicons.Send,
                isAnonymousAction: false,
                shouldShowRightIcon: true,
                action: () => {
                    (0, ReportUtils_1.createDraftTransactionAndNavigateToParticipantSelector)(iouTransactionID, actionReportID, CONST_1.default.IOU.ACTION.SUBMIT, actionableWhisperReportActionID);
                },
            });
            if (isBetaEnabled(CONST_1.default.BETAS.TRACK_FLOWS)) {
                items.push({
                    key: CONST_1.default.REPORT_DETAILS_MENU_ITEM.TRACK.CATEGORIZE,
                    translationKey: 'actionableMentionTrackExpense.categorize',
                    icon: Expensicons.Folder,
                    isAnonymousAction: false,
                    shouldShowRightIcon: true,
                    action: () => {
                        (0, ReportUtils_1.createDraftTransactionAndNavigateToParticipantSelector)(iouTransactionID, actionReportID, CONST_1.default.IOU.ACTION.CATEGORIZE, actionableWhisperReportActionID);
                    },
                });
                items.push({
                    key: CONST_1.default.REPORT_DETAILS_MENU_ITEM.TRACK.SHARE,
                    translationKey: 'actionableMentionTrackExpense.share',
                    icon: Expensicons.UserPlus,
                    isAnonymousAction: false,
                    shouldShowRightIcon: true,
                    action: () => {
                        (0, ReportUtils_1.createDraftTransactionAndNavigateToParticipantSelector)(iouTransactionID, actionReportID, CONST_1.default.IOU.ACTION.SHARE, actionableWhisperReportActionID);
                    },
                });
            }
        }
        // Prevent displaying private notes option for threads and task reports
        if (!isChatThread && !isMoneyRequestReport && !isInvoiceReport && !isTaskReport) {
            items.push({
                key: CONST_1.default.REPORT_DETAILS_MENU_ITEM.PRIVATE_NOTES,
                translationKey: 'privateNotes.title',
                icon: Expensicons.Pencil,
                isAnonymousAction: false,
                shouldShowRightIcon: true,
                action: () => (0, ReportUtils_1.navigateToPrivateNotes)(report, session, backTo),
                brickRoadIndicator: (0, Report_1.hasErrorInPrivateNotes)(report) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined,
            });
        }
        // Show actions related to Task Reports
        if (isTaskReport && !isCanceledTaskReport) {
            if ((0, ReportUtils_1.isCompletedTaskReport)(report) && isTaskActionable) {
                items.push({
                    key: CONST_1.default.REPORT_DETAILS_MENU_ITEM.MARK_AS_INCOMPLETE,
                    icon: Expensicons.Checkmark,
                    translationKey: 'task.markAsIncomplete',
                    isAnonymousAction: false,
                    action: (0, Session_1.callFunctionIfActionIsAllowed)(() => {
                        Navigation_1.default.goBack(backTo);
                        (0, Task_1.reopenTask)(report);
                    }),
                });
            }
        }
        if (shouldShowGoToWorkspace) {
            items.push({
                key: CONST_1.default.REPORT_DETAILS_MENU_ITEM.GO_TO_WORKSPACE,
                translationKey: 'workspace.common.goToWorkspace',
                icon: Expensicons.Building,
                action: () => {
                    if (!report?.policyID) {
                        return;
                    }
                    if (isSmallScreenWidth) {
                        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_INITIAL.getRoute(report?.policyID, Navigation_1.default.getActiveRoute()));
                    }
                    else {
                        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_OVERVIEW.getRoute(report?.policyID));
                    }
                },
                isAnonymousAction: false,
                shouldShowRightIcon: true,
            });
        }
        if (shouldShowLeaveButton) {
            items.push({
                key: CONST_1.default.REPORT_DETAILS_MENU_ITEM.LEAVE_ROOM,
                translationKey: 'common.leave',
                icon: Expensicons.Exit,
                isAnonymousAction: true,
                action: () => {
                    if ((0, ReportUtils_1.getParticipantsAccountIDsForDisplay)(report, false, true).length === 1 && isRootGroupChat) {
                        setIsLastMemberLeavingGroupModalVisible(true);
                        return;
                    }
                    leaveChat();
                },
            });
        }
        if (report?.reportID && isDebugModeEnabled) {
            items.push({
                key: CONST_1.default.REPORT_DETAILS_MENU_ITEM.DEBUG,
                translationKey: 'debug.debug',
                icon: Expensicons.Bug,
                action: () => Navigation_1.default.navigate(ROUTES_1.default.DEBUG_REPORT.getRoute(report.reportID)),
                isAnonymousAction: true,
                shouldShowRightIcon: true,
            });
        }
        return items;
    }, [
        isSelfDM,
        isArchivedRoom,
        isGroupChat,
        isDefaultRoom,
        isChatThread,
        isPolicyEmployee,
        isUserCreatedPolicyRoom,
        participants.length,
        report,
        isSystemChat,
        activeChatMembers.length,
        isPolicyExpenseChat,
        shouldShowMenuItem,
        isTrackExpenseReport,
        isDeletedParentAction,
        isMoneyRequestReport,
        isInvoiceReport,
        isTaskReport,
        isCanceledTaskReport,
        shouldShowGoToWorkspace,
        shouldShowLeaveButton,
        isDebugModeEnabled,
        shouldOpenRoomMembersPage,
        backTo,
        parentReportAction,
        iouTransactionID,
        moneyRequestReport?.reportID,
        isBetaEnabled,
        session,
        isTaskActionable,
        isRootGroupChat,
        leaveChat,
        isSmallScreenWidth,
    ]);
    const displayNamesWithTooltips = (0, react_1.useMemo)(() => {
        const hasMultipleParticipants = participants.length > 1;
        return (0, ReportUtils_1.getDisplayNamesWithTooltips)((0, OptionsListUtils_1.getPersonalDetailsForAccountIDs)(participants, personalDetails), hasMultipleParticipants, localeCompare);
    }, [participants, personalDetails, localeCompare]);
    const icons = (0, react_1.useMemo)(() => (0, ReportUtils_1.getIcons)(report, personalDetails, null, '', -1, policy, undefined, isReportArchived), [report, personalDetails, policy, isReportArchived]);
    const chatRoomSubtitleText = chatRoomSubtitle ? (<DisplayNames_1.default fullTitle={chatRoomSubtitle} tooltipEnabled numberOfLines={1} textStyles={[styles.sidebarLinkText, styles.textLabelSupporting, styles.pre, styles.mt1, styles.textAlignCenter]} shouldUseFullTitle/>) : null;
    const renderedAvatar = (0, react_1.useMemo)(() => {
        if (!isGroupChat || isThread) {
            return (<react_native_1.View style={styles.mb3}>
                    <ReportActionAvatars_1.default noRightMarginOnSubscriptContainer size={CONST_1.default.AVATAR_SIZE.X_LARGE} useProfileNavigationWrapper singleAvatarContainerStyle={[]} reportID={report?.reportID ?? moneyRequestReport?.reportID}/>
                </react_native_1.View>);
        }
        return (<AvatarWithImagePicker_1.default source={icons.at(0)?.source} avatarID={icons.at(0)?.id} isUsingDefaultAvatar={!report.avatarUrl} size={CONST_1.default.AVATAR_SIZE.X_LARGE} avatarStyle={styles.avatarXLarge} onViewPhotoPress={() => Navigation_1.default.navigate(ROUTES_1.default.REPORT_AVATAR.getRoute(report.reportID))} onImageRemoved={() => {
                // Calling this without a file will remove the avatar
                (0, Report_1.updateGroupChatAvatar)(report.reportID);
            }} onImageSelected={(file) => (0, Report_1.updateGroupChatAvatar)(report.reportID, file)} editIcon={Expensicons.Camera} editIconStyle={styles.smallEditIconAccount} pendingAction={report.pendingFields?.avatar ?? undefined} errors={report.errorFields?.avatar ?? null} errorRowStyles={styles.mt6} onErrorClose={() => (0, Report_1.clearAvatarErrors)(report.reportID)} style={[styles.w100, styles.mb3]}/>);
    }, [
        isGroupChat,
        isThread,
        icons,
        report.avatarUrl,
        report.pendingFields?.avatar,
        report.errorFields?.avatar,
        report.reportID,
        styles.avatarXLarge,
        styles.smallEditIconAccount,
        styles.mt6,
        styles.w100,
        styles.mb3,
        moneyRequestReport,
    ]);
    const canJoin = (0, ReportUtils_1.canJoinChat)(report, parentReportAction, policy, !!reportNameValuePairs?.private_isArchived);
    const promotedActions = (0, react_1.useMemo)(() => {
        const result = [];
        if (canJoin) {
            result.push(PromotedActionsBar_1.PromotedActions.join(report));
        }
        if (report) {
            result.push(PromotedActionsBar_1.PromotedActions.pin(report));
        }
        result.push(PromotedActionsBar_1.PromotedActions.share(report, backTo));
        return result;
    }, [canJoin, report, backTo]);
    const nameSectionExpenseIOU = (<react_native_1.View style={[styles.reportDetailsRoomInfo, styles.mw100]}>
            {shouldDisableRename && (<>
                    <react_native_1.View style={[styles.alignSelfCenter, styles.w100, styles.mt1]}>
                        <DisplayNames_1.default fullTitle={reportName} displayNamesWithTooltips={displayNamesWithTooltips} tooltipEnabled numberOfLines={isChatRoom && !isChatThread ? 0 : 1} textStyles={[styles.textHeadline, styles.textAlignCenter, isChatRoom && !isChatThread ? undefined : styles.pre]} shouldUseFullTitle={shouldUseFullTitle}/>
                    </react_native_1.View>
                    {isPolicyAdmin ? (<PressableWithoutFeedback_1.default style={[styles.w100]} disabled={policy?.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={chatRoomSubtitle} accessible onPress={() => {
                    let policyID = report?.policyID;
                    if (!policyID) {
                        policyID = '';
                    }
                    Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_INITIAL.getRoute(policyID));
                }}>
                            {chatRoomSubtitleText}
                        </PressableWithoutFeedback_1.default>) : (chatRoomSubtitleText)}
                </>)}
            {!(0, EmptyObject_1.isEmptyObject)(parentNavigationSubtitleData) && (isMoneyRequestReport || isInvoiceReport || isMoneyRequest || isTaskReport) && (<ParentNavigationSubtitle_1.default parentNavigationSubtitleData={parentNavigationSubtitleData} parentReportID={report?.parentReportID} parentReportActionID={report?.parentReportActionID} pressableStyles={[styles.mt1, styles.mw100]}/>)}
        </react_native_1.View>);
    const nameSectionGroupWorkspace = (<OfflineWithFeedback_1.default pendingAction={report?.pendingFields?.reportName} errors={report?.errorFields?.reportName} errorRowStyles={[styles.ph5]} onClose={() => (0, Report_1.clearPolicyRoomNameErrors)(report?.reportID)}>
            <react_native_1.View style={[styles.flex1, !shouldDisableRename && styles.mt3]}>
                <MenuItemWithTopDescription_1.default shouldShowRightIcon={!shouldDisableRename} interactive={!shouldDisableRename} title={StringUtils_1.default.lineBreaksToSpaces(reportName)} titleStyle={styles.newKansasLarge} titleContainerStyle={shouldDisableRename && styles.alignItemsCenter} shouldCheckActionAllowedOnPress={false} description={!shouldDisableRename ? roomDescription : ''} furtherDetails={chatRoomSubtitle && !isGroupChat ? additionalRoomDetails : ''} furtherDetailsNumberOfLines={isPolicyExpenseChat ? 0 : undefined} furtherDetailsStyle={isPolicyExpenseChat ? [styles.textAlignCenter, styles.breakWord] : undefined} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.REPORT_SETTINGS_NAME.getRoute(report.reportID, backTo))} numberOfLinesTitle={isThread ? 2 : 0} shouldBreakWord/>
            </react_native_1.View>
        </OfflineWithFeedback_1.default>);
    const titleField = (0, react_1.useMemo)(() => {
        const fields = (0, ReportUtils_1.getAvailableReportFields)(report, Object.values(policy?.fieldList ?? {}));
        return fields.find((reportField) => (0, ReportUtils_1.isReportFieldOfTypeTitle)(reportField));
    }, [report, policy?.fieldList]);
    const fieldKey = (0, ReportUtils_1.getReportFieldKey)(titleField?.fieldID);
    const isFieldDisabled = (0, ReportUtils_1.isReportFieldDisabled)(report, titleField, policy);
    const shouldShowTitleField = caseID !== CASES.MONEY_REQUEST && !isFieldDisabled && (0, ReportUtils_1.isAdminOwnerApproverOrReportOwner)(report, policy);
    const nameSectionFurtherDetailsContent = (<ParentNavigationSubtitle_1.default parentNavigationSubtitleData={parentNavigationSubtitleData} parentReportID={report?.parentReportID} parentReportActionID={report?.parentReportActionID} pressableStyles={[styles.mt1, styles.mw100]}/>);
    const nameSectionTitleField = !!titleField && (<OfflineWithFeedback_1.default pendingAction={report.pendingFields?.reportName} errors={report.errorFields?.reportName} errorRowStyles={styles.ph5} key={`menuItem-${fieldKey}`} onClose={() => (0, Report_1.clearPolicyRoomNameErrors)(report.reportID)}>
            <react_native_1.View style={[styles.flex1]}>
                <MenuItemWithTopDescription_1.default shouldShowRightIcon={!isFieldDisabled} interactive={!isFieldDisabled} title={reportName} titleStyle={styles.newKansasLarge} shouldCheckActionAllowedOnPress={false} description={expensify_common_1.Str.UCFirst(titleField.name)} onPress={() => {
            let policyID = report.policyID;
            if (!policyID) {
                policyID = '';
            }
            Navigation_1.default.navigate(ROUTES_1.default.EDIT_REPORT_FIELD_REQUEST.getRoute(report.reportID, policyID, titleField.fieldID, backTo));
        }} furtherDetailsComponent={nameSectionFurtherDetailsContent}/>
            </react_native_1.View>
        </OfflineWithFeedback_1.default>);
    const deleteTransaction = (0, react_1.useCallback)(() => {
        if (caseID === CASES.DEFAULT) {
            (0, Task_1.deleteTask)(report, isReportArchived);
            return;
        }
        if (!requestParentReportAction) {
            return;
        }
        const isTrackExpense = (0, ReportActionsUtils_1.isTrackExpenseAction)(requestParentReportAction);
        if (isTrackExpense) {
            (0, IOU_1.deleteTrackExpense)(moneyRequestReport?.reportID, iouTransactionID, requestParentReportAction, duplicateTransactions, duplicateTransactionViolations, isSingleTransactionView);
        }
        else {
            (0, IOU_1.deleteMoneyRequest)(iouTransactionID, requestParentReportAction, duplicateTransactions, duplicateTransactionViolations, isSingleTransactionView);
            removeTransaction(iouTransactionID);
        }
    }, [
        duplicateTransactions,
        duplicateTransactionViolations,
        caseID,
        iouTransactionID,
        isSingleTransactionView,
        moneyRequestReport?.reportID,
        removeTransaction,
        report,
        requestParentReportAction,
        isReportArchived,
    ]);
    // A flag to indicate whether the user chose to delete the transaction or not
    const isTransactionDeleted = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        return () => {
            // Perform the actual deletion after the details page is unmounted. This prevents the [Deleted ...] text from briefly appearing when dismissing the modal.
            if (!isTransactionDeleted.current) {
                return;
            }
            isTransactionDeleted.current = false;
            deleteTransaction();
        };
    }, [deleteTransaction]);
    // Where to navigate back to after deleting the transaction and its report.
    const navigateToTargetUrl = (0, react_1.useCallback)(() => {
        // If transaction was not deleted (i.e. Cancel was clicked), do nothing
        // which only dismiss the delete confirmation modal
        if (!isTransactionDeleted.current) {
            return;
        }
        let urlToNavigateBack;
        // Only proceed with navigation logic if transaction was actually deleted
        if (!(0, EmptyObject_1.isEmptyObject)(requestParentReportAction)) {
            const isTrackExpense = (0, ReportActionsUtils_1.isTrackExpenseAction)(requestParentReportAction);
            if (isTrackExpense) {
                urlToNavigateBack = (0, IOU_1.getNavigationUrlAfterTrackExpenseDelete)(moneyRequestReport?.reportID, iouTransactionID, requestParentReportAction, isSingleTransactionView);
            }
            else {
                urlToNavigateBack = (0, IOU_1.getNavigationUrlOnMoneyRequestDelete)(iouTransactionID, requestParentReportAction, isSingleTransactionView);
            }
        }
        if (!urlToNavigateBack) {
            Navigation_1.default.dismissModal();
        }
        else {
            (0, Report_1.setDeleteTransactionNavigateBackUrl)(urlToNavigateBack);
            (0, ReportUtils_1.navigateBackOnDeleteTransaction)(urlToNavigateBack, true);
        }
    }, [iouTransactionID, requestParentReportAction, isSingleTransactionView, isTransactionDeleted, moneyRequestReport?.reportID]);
    const mentionReportContextValue = (0, react_1.useMemo)(() => ({ currentReportID: report.reportID, exactlyMatch: true }), [report.reportID]);
    return (<ScreenWrapper_1.default testID={ReportDetailsPage.displayName}>
            <FullPageNotFoundView_1.default shouldShow={(0, EmptyObject_1.isEmptyObject)(report)}>
                <HeaderWithBackButton_1.default title={translate('common.details')} onBackButtonPress={() => Navigation_1.default.goBack(backTo)}/>
                <ScrollView_1.default contentContainerStyle={[styles.flexGrow1]}>
                    <react_native_1.View style={[styles.reportDetailsTitleContainer, styles.pb0]}>
                        {renderedAvatar}
                        {isExpenseReport && (!shouldShowTitleField || !titleField) && nameSectionExpenseIOU}
                    </react_native_1.View>

                    {isExpenseReport && shouldShowTitleField && titleField && nameSectionTitleField}

                    {!isExpenseReport && nameSectionGroupWorkspace}

                    {shouldShowReportDescription && (<OfflineWithFeedback_1.default pendingAction={report.pendingFields?.description}>
                            <MentionReportContext_1.default.Provider value={mentionReportContextValue}>
                                <MenuItemWithTopDescription_1.default shouldShowRightIcon interactive title={(0, ReportUtils_1.getReportDescription)(report)} shouldRenderAsHTML shouldTruncateTitle characterLimit={100} shouldCheckActionAllowedOnPress={false} description={translate('reportDescriptionPage.roomDescription')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.REPORT_DESCRIPTION.getRoute(report.reportID, Navigation_1.default.getActiveRoute()))}/>
                            </MentionReportContext_1.default.Provider>
                        </OfflineWithFeedback_1.default>)}

                    {isFinancialReportsForBusinesses && (<>
                            <MenuItemWithTopDescription_1.default title={base62ReportID} description={translate('common.reportID')} copyValue={base62ReportID} interactive={false} shouldBlockSelection copyable/>
                            <MenuItemWithTopDescription_1.default title={report.reportID} description={translate('common.longID')} copyValue={report.reportID} interactive={false} shouldBlockSelection copyable/>
                        </>)}

                    <PromotedActionsBar_1.default containerStyle={styles.mt5} promotedActions={promotedActions}/>

                    {menuItems.map((item) => (<MenuItem_1.default key={item.key} title={translate(item.translationKey)} subtitle={item.subtitle} icon={item.icon} onPress={item.action} isAnonymousAction={item.isAnonymousAction} shouldShowRightIcon={item.shouldShowRightIcon} brickRoadIndicator={item.brickRoadIndicator}/>))}

                    {shouldShowDeleteButton && (<MenuItem_1.default key={CONST_1.default.REPORT_DETAILS_MENU_ITEM.DELETE} icon={Expensicons.Trashcan} title={caseID === CASES.DEFAULT ? translate('common.delete') : translate('reportActionContextMenu.deleteAction', { action: requestParentReportAction })} onPress={() => setIsDeleteModalVisible(true)}/>)}
                </ScrollView_1.default>
                <ConfirmModal_1.default danger title={translate('groupChat.lastMemberTitle')} isVisible={isLastMemberLeavingGroupModalVisible} onConfirm={() => {
            setIsLastMemberLeavingGroupModalVisible(false);
            leaveChat();
        }} onCancel={() => setIsLastMemberLeavingGroupModalVisible(false)} prompt={translate('groupChat.lastMemberWarning')} confirmText={translate('common.leave')} cancelText={translate('common.cancel')}/>
                <ConfirmModal_1.default title={caseID === CASES.DEFAULT ? translate('task.deleteTask') : translate('iou.deleteExpense', { count: 1 })} isVisible={isDeleteModalVisible} onConfirm={() => {
            setIsDeleteModalVisible(false);
            isTransactionDeleted.current = true;
        }} onCancel={() => setIsDeleteModalVisible(false)} prompt={caseID === CASES.DEFAULT ? translate('task.deleteConfirmation') : translate('iou.deleteConfirmation', { count: 1 })} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger shouldEnableNewFocusManagement onModalHide={navigateToTargetUrl}/>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
ReportDetailsPage.displayName = 'ReportDetailsPage';
exports.default = (0, withReportOrNotFound_1.default)()(ReportDetailsPage);
