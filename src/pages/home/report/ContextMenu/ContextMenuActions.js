"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestrictedReadOnlyContextMenuActions = void 0;
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const Expensicons = require("@components/Icon/Expensicons");
const MiniQuickEmojiReactions_1 = require("@components/Reactions/MiniQuickEmojiReactions");
const QuickEmojiReactions_1 = require("@components/Reactions/QuickEmojiReactions");
const addEncryptedAuthTokenToURL_1 = require("@libs/addEncryptedAuthTokenToURL");
const Browser_1 = require("@libs/Browser");
const Clipboard_1 = require("@libs/Clipboard");
const EmailUtils_1 = require("@libs/EmailUtils");
const Environment_1 = require("@libs/Environment/Environment");
const fileDownload_1 = require("@libs/fileDownload");
const getAttachmentDetails_1 = require("@libs/fileDownload/getAttachmentDetails");
const Localize_1 = require("@libs/Localize");
const ModifiedExpenseMessage_1 = require("@libs/ModifiedExpenseMessage");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Parser_1 = require("@libs/Parser");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportActionComposeFocusManager_1 = require("@libs/ReportActionComposeFocusManager");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const TaskUtils_1 = require("@libs/TaskUtils");
const Download_1 = require("@userActions/Download");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const keyboard_1 = require("@src/utils/keyboard");
const ReportActionContextMenu_1 = require("./ReportActionContextMenu");
/** Gets the HTML version of the message in an action */
function getActionHtml(reportAction) {
    const message = Array.isArray(reportAction?.message) ? (reportAction?.message?.at(-1) ?? null) : (reportAction?.message ?? null);
    return message?.html ?? '';
}
/** Sets the HTML string to Clipboard */
function setClipboardMessage(content) {
    if (!content) {
        return;
    }
    if (!Clipboard_1.default.canSetHtml()) {
        Clipboard_1.default.setString(Parser_1.default.htmlToMarkdown(content));
    }
    else {
        // Use markdown format text for the plain text(clipboard type "text/plain") to ensure consistency across all platforms.
        // More info: https://github.com/Expensify/App/issues/53718
        const markdownText = Parser_1.default.htmlToMarkdown(content);
        Clipboard_1.default.setHtml(content, markdownText);
    }
}
// A list of all the context actions in this menu.
const ContextMenuActions = [
    {
        isAnonymousAction: false,
        shouldShow: ({ type, reportAction }) => type === CONST_1.default.CONTEXT_MENU_TYPES.REPORT_ACTION && !!reportAction && 'message' in reportAction && !(0, ReportActionsUtils_1.isMessageDeleted)(reportAction),
        renderContent: (closePopover, { reportID, reportAction, close: closeManually, openContextMenu, setIsEmojiPickerActive }) => {
            const isMini = !closePopover;
            const closeContextMenu = (onHideCallback) => {
                if (isMini) {
                    closeManually();
                    if (onHideCallback) {
                        onHideCallback();
                    }
                }
                else {
                    (0, ReportActionContextMenu_1.hideContextMenu)(false, onHideCallback);
                }
            };
            const toggleEmojiAndCloseMenu = (emoji, existingReactions) => {
                (0, Report_1.toggleEmojiReaction)(reportID, reportAction, emoji, existingReactions);
                closeContextMenu();
                setIsEmojiPickerActive?.(false);
            };
            if (isMini) {
                return (<MiniQuickEmojiReactions_1.default key="MiniQuickEmojiReactions" onEmojiSelected={toggleEmojiAndCloseMenu} onPressOpenPicker={() => {
                        openContextMenu();
                        setIsEmojiPickerActive?.(true);
                    }} onEmojiPickerClosed={() => {
                        closeContextMenu();
                        setIsEmojiPickerActive?.(false);
                    }} reportActionID={reportAction?.reportActionID} reportAction={reportAction}/>);
            }
            return (<QuickEmojiReactions_1.default key="BaseQuickEmojiReactions" closeContextMenu={closeContextMenu} onEmojiSelected={toggleEmojiAndCloseMenu} reportActionID={reportAction?.reportActionID} reportAction={reportAction} setIsEmojiPickerActive={setIsEmojiPickerActive}/>);
        },
    },
    {
        isAnonymousAction: false,
        textTranslateKey: 'reportActionContextMenu.replyInThread',
        icon: Expensicons.ChatBubbleReply,
        shouldShow: ({ type, reportAction, reportID, isThreadReportParentAction, isArchivedRoom }) => {
            if (type !== CONST_1.default.CONTEXT_MENU_TYPES.REPORT_ACTION || !reportID) {
                return false;
            }
            return !(0, ReportUtils_1.shouldDisableThread)(reportAction, reportID, isThreadReportParentAction, isArchivedRoom);
        },
        onPress: (closePopover, { reportAction, reportID }) => {
            const originalReportID = (0, ReportUtils_1.getOriginalReportID)(reportID, reportAction);
            if (closePopover) {
                (0, ReportActionContextMenu_1.hideContextMenu)(false, () => {
                    keyboard_1.default.dismiss().then(() => {
                        (0, Report_1.navigateToAndOpenChildReport)(reportAction?.childReportID, reportAction, originalReportID);
                    });
                });
                return;
            }
            (0, Report_1.navigateToAndOpenChildReport)(reportAction?.childReportID, reportAction, originalReportID);
        },
        getDescription: () => { },
    },
    {
        isAnonymousAction: false,
        textTranslateKey: 'reportActionContextMenu.markAsUnread',
        icon: Expensicons.ChatBubbleUnread,
        successIcon: Expensicons.Checkmark,
        shouldShow: ({ type, isUnreadChat }) => type === CONST_1.default.CONTEXT_MENU_TYPES.REPORT_ACTION || (type === CONST_1.default.CONTEXT_MENU_TYPES.REPORT && !isUnreadChat),
        onPress: (closePopover, { reportAction, reportID }) => {
            (0, Report_1.markCommentAsUnread)(reportID, reportAction);
            if (closePopover) {
                (0, ReportActionContextMenu_1.hideContextMenu)(true, ReportActionComposeFocusManager_1.default.focus);
            }
        },
        getDescription: () => { },
    },
    {
        isAnonymousAction: false,
        textTranslateKey: 'reportActionContextMenu.markAsRead',
        icon: Expensicons.Mail,
        successIcon: Expensicons.Checkmark,
        shouldShow: ({ type, isUnreadChat }) => type === CONST_1.default.CONTEXT_MENU_TYPES.REPORT && isUnreadChat,
        onPress: (closePopover, { reportID }) => {
            (0, Report_1.readNewestAction)(reportID, true);
            if (closePopover) {
                (0, ReportActionContextMenu_1.hideContextMenu)(true, ReportActionComposeFocusManager_1.default.focus);
            }
        },
        getDescription: () => { },
    },
    {
        isAnonymousAction: false,
        textTranslateKey: 'reportActionContextMenu.editAction',
        icon: Expensicons.Pencil,
        shouldShow: ({ type, reportAction, isArchivedRoom, isChronosReport, moneyRequestAction }) => type === CONST_1.default.CONTEXT_MENU_TYPES.REPORT_ACTION && ((0, ReportUtils_1.canEditReportAction)(reportAction) || (0, ReportUtils_1.canEditReportAction)(moneyRequestAction)) && !isArchivedRoom && !isChronosReport,
        onPress: (closePopover, { reportID, reportAction, draftMessage, moneyRequestAction }) => {
            if ((0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction) || (0, ReportActionsUtils_1.isMoneyRequestAction)(moneyRequestAction)) {
                const editExpense = () => {
                    const childReportID = reportAction?.childReportID;
                    (0, Report_1.openReport)(childReportID);
                    Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(childReportID));
                };
                if (closePopover) {
                    (0, ReportActionContextMenu_1.hideContextMenu)(false, editExpense);
                    return;
                }
                editExpense();
                return;
            }
            const editAction = () => {
                if (!draftMessage) {
                    (0, Report_1.saveReportActionDraft)(reportID, reportAction, Parser_1.default.htmlToMarkdown(getActionHtml(reportAction)));
                }
                else {
                    (0, Report_1.deleteReportActionDraft)(reportID, reportAction);
                }
            };
            if (closePopover) {
                // Hide popover, then call editAction
                (0, ReportActionContextMenu_1.hideContextMenu)(false, editAction);
                return;
            }
            // No popover to hide, call editAction immediately
            editAction();
        },
        getDescription: () => { },
    },
    {
        isAnonymousAction: false,
        textTranslateKey: 'iou.unhold',
        icon: Expensicons.Stopwatch,
        shouldShow: ({ type, moneyRequestAction, areHoldRequirementsMet }) => type === CONST_1.default.CONTEXT_MENU_TYPES.REPORT_ACTION && areHoldRequirementsMet && (0, ReportUtils_1.canHoldUnholdReportAction)(moneyRequestAction).canUnholdRequest,
        onPress: (closePopover, { moneyRequestAction }) => {
            if (closePopover) {
                (0, ReportActionContextMenu_1.hideContextMenu)(false, () => (0, ReportUtils_1.changeMoneyRequestHoldStatus)(moneyRequestAction));
                return;
            }
            // No popover to hide, call changeMoneyRequestHoldStatus immediately
            (0, ReportUtils_1.changeMoneyRequestHoldStatus)(moneyRequestAction);
        },
        getDescription: () => { },
    },
    {
        isAnonymousAction: false,
        textTranslateKey: 'iou.hold',
        icon: Expensicons.Stopwatch,
        shouldShow: ({ type, moneyRequestAction, areHoldRequirementsMet }) => type === CONST_1.default.CONTEXT_MENU_TYPES.REPORT_ACTION && areHoldRequirementsMet && (0, ReportUtils_1.canHoldUnholdReportAction)(moneyRequestAction).canHoldRequest,
        onPress: (closePopover, { moneyRequestAction }) => {
            if (closePopover) {
                (0, ReportActionContextMenu_1.hideContextMenu)(false, () => (0, ReportUtils_1.changeMoneyRequestHoldStatus)(moneyRequestAction));
                return;
            }
            // No popover to hide, call changeMoneyRequestHoldStatus immediately
            (0, ReportUtils_1.changeMoneyRequestHoldStatus)(moneyRequestAction);
        },
        getDescription: () => { },
    },
    {
        isAnonymousAction: false,
        textTranslateKey: 'reportActionContextMenu.joinThread',
        icon: Expensicons.Bell,
        shouldShow: ({ reportAction, isArchivedRoom, isThreadReportParentAction }) => {
            const childReportNotificationPreference = (0, ReportUtils_1.getChildReportNotificationPreference)(reportAction);
            const isDeletedAction = (0, ReportActionsUtils_1.isDeletedAction)(reportAction);
            const shouldDisplayThreadReplies = (0, ReportUtils_1.shouldDisplayThreadReplies)(reportAction, isThreadReportParentAction);
            const subscribed = childReportNotificationPreference !== 'hidden';
            const isWhisperAction = (0, ReportActionsUtils_1.isWhisperAction)(reportAction) || (0, ReportActionsUtils_1.isActionableTrackExpense)(reportAction);
            const isExpenseReportAction = (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction) || (0, ReportActionsUtils_1.isReportPreviewAction)(reportAction);
            const isTaskAction = (0, ReportActionsUtils_1.isCreatedTaskReportAction)(reportAction);
            return (!subscribed &&
                !isWhisperAction &&
                !isTaskAction &&
                !isExpenseReportAction &&
                !isThreadReportParentAction &&
                (shouldDisplayThreadReplies || (!isDeletedAction && !isArchivedRoom)));
        },
        onPress: (closePopover, { reportAction, reportID }) => {
            const childReportNotificationPreference = (0, ReportUtils_1.getChildReportNotificationPreference)(reportAction);
            const originalReportID = (0, ReportUtils_1.getOriginalReportID)(reportID, reportAction);
            if (closePopover) {
                (0, ReportActionContextMenu_1.hideContextMenu)(false, () => {
                    ReportActionComposeFocusManager_1.default.focus();
                    (0, Report_1.toggleSubscribeToChildReport)(reportAction?.childReportID, reportAction, originalReportID, childReportNotificationPreference);
                });
                return;
            }
            ReportActionComposeFocusManager_1.default.focus();
            (0, Report_1.toggleSubscribeToChildReport)(reportAction?.childReportID, reportAction, originalReportID, childReportNotificationPreference);
        },
        getDescription: () => { },
    },
    {
        isAnonymousAction: true,
        textTranslateKey: 'reportActionContextMenu.copyURLToClipboard',
        icon: Expensicons.Copy,
        successTextTranslateKey: 'reportActionContextMenu.copied',
        successIcon: Expensicons.Checkmark,
        shouldShow: ({ type }) => type === CONST_1.default.CONTEXT_MENU_TYPES.LINK,
        onPress: (closePopover, { selection }) => {
            Clipboard_1.default.setString(selection);
            (0, ReportActionContextMenu_1.hideContextMenu)(true, ReportActionComposeFocusManager_1.default.focus);
        },
        getDescription: (selection) => selection,
    },
    {
        isAnonymousAction: true,
        textTranslateKey: 'reportActionContextMenu.copyToClipboard',
        icon: Expensicons.Copy,
        successTextTranslateKey: 'reportActionContextMenu.copied',
        successIcon: Expensicons.Checkmark,
        shouldShow: ({ type }) => type === CONST_1.default.CONTEXT_MENU_TYPES.TEXT,
        onPress: (closePopover, { selection }) => {
            Clipboard_1.default.setString(selection);
            (0, ReportActionContextMenu_1.hideContextMenu)(true, ReportActionComposeFocusManager_1.default.focus);
        },
        getDescription: () => undefined,
    },
    {
        isAnonymousAction: true,
        textTranslateKey: 'reportActionContextMenu.copyEmailToClipboard',
        icon: Expensicons.Copy,
        successTextTranslateKey: 'reportActionContextMenu.copied',
        successIcon: Expensicons.Checkmark,
        shouldShow: ({ type }) => type === CONST_1.default.CONTEXT_MENU_TYPES.EMAIL,
        onPress: (closePopover, { selection }) => {
            Clipboard_1.default.setString(EmailUtils_1.default.trimMailTo(selection));
            (0, ReportActionContextMenu_1.hideContextMenu)(true, ReportActionComposeFocusManager_1.default.focus);
        },
        getDescription: (selection) => EmailUtils_1.default.prefixMailSeparatorsWithBreakOpportunities(EmailUtils_1.default.trimMailTo(selection ?? '')),
    },
    {
        isAnonymousAction: true,
        textTranslateKey: 'reportActionContextMenu.copyToClipboard',
        icon: Expensicons.Copy,
        successTextTranslateKey: 'reportActionContextMenu.copied',
        successIcon: Expensicons.Checkmark,
        shouldShow: ({ type, reportAction }) => type === CONST_1.default.CONTEXT_MENU_TYPES.REPORT_ACTION && !(0, ReportActionsUtils_1.isReportActionAttachment)(reportAction) && !(0, ReportActionsUtils_1.isMessageDeleted)(reportAction) && !(0, ReportActionsUtils_1.isTripPreview)(reportAction),
        // If return value is true, we switch the `text` and `icon` on
        // `ContextMenuItem` with `successText` and `successIcon` which will fall back to
        // the `text` and `icon`
        onPress: (closePopover, { reportAction, transaction, selection, report, reportID, card, originalReport, isTryNewDotNVPDismissed, movedFromReport, movedToReport }) => {
            const isReportPreviewAction = (0, ReportActionsUtils_1.isReportPreviewAction)(reportAction);
            const messageHtml = getActionHtml(reportAction);
            const messageText = (0, ReportActionsUtils_1.getReportActionMessageText)(reportAction);
            const isAttachment = (0, ReportActionsUtils_1.isReportActionAttachment)(reportAction);
            if (!isAttachment) {
                const content = selection || messageHtml;
                if (isReportPreviewAction) {
                    const iouReportID = (0, ReportActionsUtils_1.getIOUReportIDFromReportActionPreview)(reportAction);
                    const displayMessage = (0, ReportUtils_1.getReportPreviewMessage)(iouReportID, reportAction);
                    Clipboard_1.default.setString(displayMessage);
                }
                else if ((0, ReportActionsUtils_1.isTaskAction)(reportAction)) {
                    const { text, html } = (0, TaskUtils_1.getTaskReportActionMessage)(reportAction);
                    const displayMessage = html ?? text;
                    setClipboardMessage(displayMessage);
                }
                else if ((0, ReportActionsUtils_1.isModifiedExpenseAction)(reportAction)) {
                    const modifyExpenseMessage = (0, ModifiedExpenseMessage_1.getForReportAction)({
                        reportAction,
                        policyID: report?.policyID,
                        movedFromReport,
                        movedToReport,
                    });
                    Clipboard_1.default.setString(modifyExpenseMessage);
                }
                else if ((0, ReportActionsUtils_1.isReimbursementDeQueuedOrCanceledAction)(reportAction)) {
                    const { expenseReportID } = (0, ReportActionsUtils_1.getOriginalMessage)(reportAction) ?? {};
                    const displayMessage = (0, ReportUtils_1.getReimbursementDeQueuedOrCanceledActionMessage)(reportAction, expenseReportID);
                    Clipboard_1.default.setString(displayMessage);
                }
                else if ((0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction)) {
                    const displayMessage = (0, ReportUtils_1.getIOUReportActionDisplayMessage)(reportAction, transaction);
                    if (displayMessage === Parser_1.default.htmlToText(displayMessage)) {
                        Clipboard_1.default.setString(displayMessage);
                    }
                    else {
                        setClipboardMessage(displayMessage);
                    }
                }
                else if ((0, ReportActionsUtils_1.isCreatedTaskReportAction)(reportAction)) {
                    const taskPreviewMessage = (0, TaskUtils_1.getTaskCreatedMessage)(reportAction, true);
                    Clipboard_1.default.setString(taskPreviewMessage);
                }
                else if ((0, ReportActionsUtils_1.isMemberChangeAction)(reportAction)) {
                    const logMessage = (0, ReportActionsUtils_1.getMemberChangeMessageFragment)(reportAction, ReportUtils_1.getReportName).html ?? '';
                    setClipboardMessage(logMessage);
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_NAME) {
                    Clipboard_1.default.setString(expensify_common_1.Str.htmlDecode((0, ReportUtils_1.getWorkspaceNameUpdatedMessage)(reportAction)));
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_DESCRIPTION) {
                    Clipboard_1.default.setString((0, ReportActionsUtils_1.getWorkspaceDescriptionUpdatedMessage)(reportAction));
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_CURRENCY) {
                    Clipboard_1.default.setString((0, ReportActionsUtils_1.getWorkspaceCurrencyUpdateMessage)(reportAction));
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_AUTO_REPORTING_FREQUENCY) {
                    Clipboard_1.default.setString((0, ReportActionsUtils_1.getWorkspaceFrequencyUpdateMessage)(reportAction));
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.ADD_CATEGORY ||
                    reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_CATEGORY ||
                    reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_CATEGORY ||
                    reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.SET_CATEGORY_NAME) {
                    Clipboard_1.default.setString((0, ReportActionsUtils_1.getWorkspaceCategoryUpdateMessage)(reportAction));
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_TAG_LIST_NAME) {
                    Clipboard_1.default.setString((0, PolicyUtils_1.getCleanedTagName)((0, ReportActionsUtils_1.getTagListNameUpdatedMessage)(reportAction)));
                }
                else if ((0, ReportActionsUtils_1.isTagModificationAction)(reportAction.actionName)) {
                    Clipboard_1.default.setString((0, PolicyUtils_1.getCleanedTagName)((0, ReportActionsUtils_1.getWorkspaceTagUpdateMessage)(reportAction)));
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_CUSTOM_UNIT) {
                    Clipboard_1.default.setString((0, ReportActionsUtils_1.getWorkspaceCustomUnitUpdatedMessage)(reportAction));
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.ADD_CUSTOM_UNIT_RATE) {
                    Clipboard_1.default.setString((0, ReportActionsUtils_1.getWorkspaceCustomUnitRateAddedMessage)(reportAction));
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_CUSTOM_UNIT_RATE) {
                    Clipboard_1.default.setString((0, ReportActionsUtils_1.getWorkspaceCustomUnitRateUpdatedMessage)(reportAction));
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_CUSTOM_UNIT_RATE) {
                    Clipboard_1.default.setString((0, ReportActionsUtils_1.getWorkspaceCustomUnitRateDeletedMessage)(reportAction));
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.ADD_REPORT_FIELD) {
                    Clipboard_1.default.setString((0, ReportActionsUtils_1.getWorkspaceReportFieldAddMessage)(reportAction));
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_REPORT_FIELD) {
                    Clipboard_1.default.setString((0, ReportActionsUtils_1.getWorkspaceReportFieldUpdateMessage)(reportAction));
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_REPORT_FIELD) {
                    Clipboard_1.default.setString((0, ReportActionsUtils_1.getWorkspaceReportFieldDeleteMessage)(reportAction));
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_FIELD) {
                    setClipboardMessage((0, ReportActionsUtils_1.getWorkspaceUpdateFieldMessage)(reportAction));
                }
                else if (reportAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_MAX_EXPENSE_AMOUNT_NO_RECEIPT) {
                    Clipboard_1.default.setString((0, ReportActionsUtils_1.getPolicyChangeLogMaxExpenseAmountNoReceiptMessage)(reportAction));
                }
                else if (reportAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_MAX_EXPENSE_AMOUNT) {
                    Clipboard_1.default.setString((0, ReportActionsUtils_1.getPolicyChangeLogMaxExpenseAmountMessage)(reportAction));
                }
                else if (reportAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_DEFAULT_BILLABLE) {
                    Clipboard_1.default.setString((0, ReportActionsUtils_1.getPolicyChangeLogDefaultBillableMessage)(reportAction));
                }
                else if (reportAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_DEFAULT_REIMBURSABLE) {
                    Clipboard_1.default.setString((0, ReportActionsUtils_1.getPolicyChangeLogDefaultReimbursableMessage)(reportAction));
                }
                else if (reportAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_DEFAULT_TITLE_ENFORCED) {
                    Clipboard_1.default.setString((0, ReportActionsUtils_1.getPolicyChangeLogDefaultTitleEnforcedMessage)(reportAction));
                }
                else if ((0, ReportActionsUtils_1.isActionOfType)(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.UNREPORTED_TRANSACTION)) {
                    setClipboardMessage((0, ReportUtils_1.getUnreportedTransactionMessage)());
                }
                else if ((0, ReportActionsUtils_1.isReimbursementQueuedAction)(reportAction)) {
                    Clipboard_1.default.setString((0, ReportUtils_1.getReimbursementQueuedActionMessage)({ reportAction, reportOrID: reportID, shouldUseShortDisplayName: false }));
                }
                else if ((0, ReportActionsUtils_1.isActionableMentionWhisper)(reportAction)) {
                    const mentionWhisperMessage = (0, ReportActionsUtils_1.getActionableMentionWhisperMessage)(reportAction);
                    setClipboardMessage(mentionWhisperMessage);
                }
                else if ((0, ReportActionsUtils_1.isActionableTrackExpense)(reportAction)) {
                    setClipboardMessage(CONST_1.default.ACTIONABLE_TRACK_EXPENSE_WHISPER_MESSAGE);
                }
                else if ((0, ReportActionsUtils_1.isRenamedAction)(reportAction)) {
                    setClipboardMessage((0, ReportActionsUtils_1.getRenamedAction)(reportAction, (0, ReportUtils_1.isExpenseReport)(report)));
                }
                else if ((0, ReportActionsUtils_1.isActionOfType)(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.SUBMITTED) ||
                    (0, ReportActionsUtils_1.isActionOfType)(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.SUBMITTED_AND_CLOSED) ||
                    (0, ReportActionsUtils_1.isMarkAsClosedAction)(reportAction)) {
                    const harvesting = !(0, ReportActionsUtils_1.isMarkAsClosedAction)(reportAction) ? ((0, ReportActionsUtils_1.getOriginalMessage)(reportAction)?.harvesting ?? false) : false;
                    if (harvesting) {
                        setClipboardMessage((0, Localize_1.translateLocal)('iou.automaticallySubmitted'));
                    }
                    else {
                        Clipboard_1.default.setString((0, Localize_1.translateLocal)('iou.submitted', { memo: (0, ReportActionsUtils_1.getOriginalMessage)(reportAction)?.message }));
                    }
                }
                else if ((0, ReportActionsUtils_1.isActionOfType)(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.APPROVED)) {
                    const { automaticAction } = (0, ReportActionsUtils_1.getOriginalMessage)(reportAction) ?? {};
                    if (automaticAction) {
                        setClipboardMessage((0, Localize_1.translateLocal)('iou.automaticallyApproved'));
                    }
                    else {
                        Clipboard_1.default.setString((0, Localize_1.translateLocal)('iou.approvedMessage'));
                    }
                }
                else if ((0, ReportActionsUtils_1.isUnapprovedAction)(reportAction)) {
                    Clipboard_1.default.setString((0, Localize_1.translateLocal)('iou.unapproved'));
                }
                else if ((0, ReportActionsUtils_1.isActionOfType)(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.FORWARDED)) {
                    const { automaticAction } = (0, ReportActionsUtils_1.getOriginalMessage)(reportAction) ?? {};
                    if (automaticAction) {
                        setClipboardMessage((0, Localize_1.translateLocal)('iou.automaticallyForwarded'));
                    }
                    else {
                        Clipboard_1.default.setString((0, Localize_1.translateLocal)('iou.forwarded'));
                    }
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.REJECTED) {
                    const displayMessage = (0, ReportUtils_1.getRejectedReportMessage)();
                    Clipboard_1.default.setString(displayMessage);
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.CORPORATE_UPGRADE) {
                    const displayMessage = (0, ReportUtils_1.getUpgradeWorkspaceMessage)();
                    Clipboard_1.default.setString(displayMessage);
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.TEAM_DOWNGRADE) {
                    const displayMessage = (0, ReportUtils_1.getDowngradeWorkspaceMessage)();
                    Clipboard_1.default.setString(displayMessage);
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.HOLD) {
                    Clipboard_1.default.setString((0, Localize_1.translateLocal)('iou.heldExpense'));
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.UNHOLD) {
                    Clipboard_1.default.setString((0, Localize_1.translateLocal)('iou.unheldExpense'));
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.REJECTEDTRANSACTION_THREAD) {
                    Clipboard_1.default.setString((0, Localize_1.translateLocal)('iou.reject.reportActions.rejectedExpense'));
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.REJECTED_TRANSACTION_MARKASRESOLVED) {
                    Clipboard_1.default.setString((0, Localize_1.translateLocal)('iou.reject.reportActions.markedAsResolved'));
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.RETRACTED) {
                    Clipboard_1.default.setString((0, Localize_1.translateLocal)('iou.retracted'));
                }
                else if ((0, ReportActionsUtils_1.isOldDotReportAction)(reportAction)) {
                    const oldDotActionMessage = (0, ReportActionsUtils_1.getMessageOfOldDotReportAction)(reportAction);
                    Clipboard_1.default.setString(oldDotActionMessage);
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.DISMISSED_VIOLATION) {
                    const originalMessage = (0, ReportActionsUtils_1.getOriginalMessage)(reportAction);
                    const reason = originalMessage?.reason;
                    const violationName = originalMessage?.violationName;
                    Clipboard_1.default.setString((0, Localize_1.translateLocal)(`violationDismissal.${violationName}.${reason}`));
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.RESOLVED_DUPLICATES) {
                    Clipboard_1.default.setString((0, Localize_1.translateLocal)('violations.resolvedDuplicates'));
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.EXPORTED_TO_INTEGRATION) {
                    setClipboardMessage((0, ReportActionsUtils_1.getExportIntegrationMessageHTML)(reportAction));
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.ROOM_CHANGE_LOG.UPDATE_ROOM_DESCRIPTION) {
                    setClipboardMessage((0, ReportActionsUtils_1.getUpdateRoomDescriptionMessage)(reportAction));
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.ADD_EMPLOYEE) {
                    setClipboardMessage((0, ReportActionsUtils_1.getPolicyChangeLogAddEmployeeMessage)(reportAction));
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_EMPLOYEE) {
                    setClipboardMessage((0, ReportActionsUtils_1.getPolicyChangeLogUpdateEmployee)(reportAction));
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_EMPLOYEE) {
                    setClipboardMessage((0, ReportActionsUtils_1.getPolicyChangeLogDeleteMemberMessage)(reportAction));
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.DELETED_TRANSACTION) {
                    setClipboardMessage((0, ReportUtils_1.getDeletedTransactionMessage)(reportAction));
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.REOPENED) {
                    setClipboardMessage((0, ReportActionsUtils_1.getReopenedMessage)());
                }
                else if ((0, ReportActionsUtils_1.isActionOfType)(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.INTEGRATION_SYNC_FAILED)) {
                    setClipboardMessage((0, ReportActionsUtils_1.getIntegrationSyncFailedMessage)(reportAction, report?.policyID, isTryNewDotNVPDismissed));
                }
                else if ((0, ReportActionsUtils_1.isCardIssuedAction)(reportAction)) {
                    setClipboardMessage((0, ReportActionsUtils_1.getCardIssuedMessage)({ reportAction, shouldRenderHTML: true, policyID: report?.policyID, expensifyCard: card }));
                }
                else if ((0, ReportActionsUtils_1.isActionOfType)(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.ADD_INTEGRATION)) {
                    setClipboardMessage((0, ReportActionsUtils_1.getAddedConnectionMessage)(reportAction));
                }
                else if ((0, ReportActionsUtils_1.isActionOfType)(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_INTEGRATION)) {
                    setClipboardMessage((0, ReportActionsUtils_1.getRemovedConnectionMessage)(reportAction));
                }
                else if ((0, ReportActionsUtils_1.isActionOfType)(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.TRAVEL_UPDATE)) {
                    setClipboardMessage((0, ReportActionsUtils_1.getTravelUpdateMessage)(reportAction));
                }
                else if ((0, ReportActionsUtils_1.isActionOfType)(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_AUDIT_RATE)) {
                    setClipboardMessage((0, ReportActionsUtils_1.getUpdatedAuditRateMessage)(reportAction));
                }
                else if ((0, ReportActionsUtils_1.isActionOfType)(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.ADD_APPROVER_RULE)) {
                    setClipboardMessage((0, ReportActionsUtils_1.getAddedApprovalRuleMessage)(reportAction));
                }
                else if ((0, ReportActionsUtils_1.isActionOfType)(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_APPROVER_RULE)) {
                    setClipboardMessage((0, ReportActionsUtils_1.getDeletedApprovalRuleMessage)(reportAction));
                }
                else if ((0, ReportActionsUtils_1.isActionOfType)(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_APPROVER_RULE)) {
                    setClipboardMessage((0, ReportActionsUtils_1.getUpdatedApprovalRuleMessage)(reportAction));
                }
                else if ((0, ReportActionsUtils_1.isActionOfType)(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_MANUAL_APPROVAL_THRESHOLD)) {
                    setClipboardMessage((0, ReportActionsUtils_1.getUpdatedManualApprovalThresholdMessage)(reportAction));
                }
                else if ((0, ReportActionsUtils_1.isActionOfType)(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.TAKE_CONTROL) || (0, ReportActionsUtils_1.isActionOfType)(reportAction, CONST_1.default.REPORT.ACTIONS.TYPE.REROUTE)) {
                    setClipboardMessage((0, ReportActionsUtils_1.getChangedApproverActionMessage)(reportAction));
                }
                else if ((0, ReportActionsUtils_1.isMovedAction)(reportAction)) {
                    setClipboardMessage((0, ReportUtils_1.getMovedActionMessage)(reportAction, originalReport));
                }
                else if (reportAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CHANGE_POLICY) {
                    const displayMessage = (0, ReportUtils_1.getPolicyChangeMessage)(reportAction);
                    Clipboard_1.default.setString(displayMessage);
                }
                else if ((0, ReportActionsUtils_1.isActionableJoinRequest)(reportAction)) {
                    const displayMessage = (0, ReportActionsUtils_1.getJoinRequestMessage)(reportAction);
                    Clipboard_1.default.setString(displayMessage);
                }
                else if (content) {
                    setClipboardMessage(content.replace(/(<mention-user>)(.*?)(<\/mention-user>)/gi, (match, openTag, innerContent, closeTag) => {
                        const modifiedContent = expensify_common_1.Str.removeSMSDomain(innerContent) || '';
                        return openTag + modifiedContent + closeTag || '';
                    }));
                }
                else if (messageText) {
                    Clipboard_1.default.setString(messageText);
                }
            }
            if (closePopover) {
                (0, ReportActionContextMenu_1.hideContextMenu)(true, ReportActionComposeFocusManager_1.default.focus);
            }
        },
        getDescription: () => { },
    },
    {
        isAnonymousAction: true,
        textTranslateKey: 'reportActionContextMenu.copyLink',
        icon: Expensicons.LinkCopy,
        successIcon: Expensicons.Checkmark,
        successTextTranslateKey: 'reportActionContextMenu.copied',
        shouldShow: ({ type, reportAction, menuTarget }) => {
            const isAttachment = (0, ReportActionsUtils_1.isReportActionAttachment)(reportAction);
            // Only hide the copy link menu item when context menu is opened over img element.
            const isAttachmentTarget = menuTarget?.current && 'tagName' in menuTarget.current && menuTarget?.current.tagName === 'IMG' && isAttachment;
            return type === CONST_1.default.CONTEXT_MENU_TYPES.REPORT_ACTION && !isAttachmentTarget && !(0, ReportActionsUtils_1.isMessageDeleted)(reportAction);
        },
        onPress: (closePopover, { reportAction, reportID }) => {
            const originalReportID = (0, ReportUtils_1.getOriginalReportID)(reportID, reportAction);
            (0, Environment_1.getEnvironmentURL)().then((environmentURL) => {
                const reportActionID = reportAction?.reportActionID;
                Clipboard_1.default.setString(`${environmentURL}/r/${originalReportID}/${reportActionID}`);
            });
            (0, ReportActionContextMenu_1.hideContextMenu)(true, ReportActionComposeFocusManager_1.default.focus);
        },
        getDescription: () => { },
    },
    {
        isAnonymousAction: false,
        textTranslateKey: 'common.pin',
        icon: Expensicons.Pin,
        shouldShow: ({ type, isPinnedChat }) => type === CONST_1.default.CONTEXT_MENU_TYPES.REPORT && !isPinnedChat,
        onPress: (closePopover, { reportID }) => {
            (0, Report_1.togglePinnedState)(reportID, false);
            if (closePopover) {
                (0, ReportActionContextMenu_1.hideContextMenu)(false, ReportActionComposeFocusManager_1.default.focus);
            }
        },
        getDescription: () => { },
    },
    {
        isAnonymousAction: false,
        textTranslateKey: 'common.unPin',
        icon: Expensicons.Pin,
        shouldShow: ({ type, isPinnedChat }) => type === CONST_1.default.CONTEXT_MENU_TYPES.REPORT && isPinnedChat,
        onPress: (closePopover, { reportID }) => {
            (0, Report_1.togglePinnedState)(reportID, true);
            if (closePopover) {
                (0, ReportActionContextMenu_1.hideContextMenu)(false, ReportActionComposeFocusManager_1.default.focus);
            }
        },
        getDescription: () => { },
    },
    {
        isAnonymousAction: false,
        textTranslateKey: 'reportActionContextMenu.flagAsOffensive',
        icon: Expensicons.Flag,
        shouldShow: ({ type, reportAction, isArchivedRoom, isChronosReport, reportID }) => type === CONST_1.default.CONTEXT_MENU_TYPES.REPORT_ACTION &&
            (0, ReportUtils_1.canFlagReportAction)(reportAction, reportID) &&
            !isArchivedRoom &&
            !isChronosReport &&
            reportAction?.actorAccountID !== CONST_1.default.ACCOUNT_ID.CONCIERGE,
        onPress: (closePopover, { reportID, reportAction }) => {
            if (!reportID) {
                return;
            }
            const activeRoute = Navigation_1.default.getActiveRoute();
            if (closePopover) {
                (0, ReportActionContextMenu_1.hideContextMenu)(false, () => {
                    keyboard_1.default.dismiss().then(() => {
                        Navigation_1.default.navigate(ROUTES_1.default.FLAG_COMMENT.getRoute(reportID, reportAction?.reportActionID, activeRoute));
                    });
                });
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.FLAG_COMMENT.getRoute(reportID, reportAction?.reportActionID, activeRoute));
        },
        getDescription: () => { },
    },
    {
        isAnonymousAction: true,
        textTranslateKey: 'common.download',
        icon: Expensicons.Download,
        successTextTranslateKey: 'common.download',
        successIcon: Expensicons.Download,
        shouldShow: ({ reportAction, isOffline }) => {
            const isAttachment = (0, ReportActionsUtils_1.isReportActionAttachment)(reportAction);
            const html = getActionHtml(reportAction);
            const isUploading = html.includes(CONST_1.default.ATTACHMENT_OPTIMISTIC_SOURCE_ATTRIBUTE);
            return isAttachment && !isUploading && !!reportAction?.reportActionID && !(0, ReportActionsUtils_1.isMessageDeleted)(reportAction) && !isOffline;
        },
        onPress: (closePopover, { reportAction }) => {
            const html = getActionHtml(reportAction);
            const { originalFileName, sourceURL } = (0, getAttachmentDetails_1.default)(html);
            const sourceURLWithAuth = (0, addEncryptedAuthTokenToURL_1.default)(sourceURL ?? '');
            const sourceID = (sourceURL?.match(CONST_1.default.REGEX.ATTACHMENT_ID) ?? [])[1];
            (0, Download_1.setDownload)(sourceID, true);
            const anchorRegex = CONST_1.default.REGEX_LINK_IN_ANCHOR;
            const isAnchorTag = anchorRegex.test(html);
            (0, fileDownload_1.default)(sourceURLWithAuth, originalFileName ?? '', '', isAnchorTag && (0, Browser_1.isMobileSafari)()).then(() => (0, Download_1.setDownload)(sourceID, false));
            if (closePopover) {
                (0, ReportActionContextMenu_1.hideContextMenu)(true, ReportActionComposeFocusManager_1.default.focus);
            }
        },
        getDescription: () => { },
        shouldDisable: (download) => download?.isDownloading ?? false,
    },
    {
        isAnonymousAction: true,
        textTranslateKey: 'reportActionContextMenu.copyOnyxData',
        icon: Expensicons.Copy,
        successTextTranslateKey: 'reportActionContextMenu.copied',
        successIcon: Expensicons.Checkmark,
        shouldShow: ({ type, isProduction }) => type === CONST_1.default.CONTEXT_MENU_TYPES.REPORT && !isProduction,
        onPress: (closePopover, { report }) => {
            Clipboard_1.default.setString(JSON.stringify(report, null, 4));
            (0, ReportActionContextMenu_1.hideContextMenu)(true, ReportActionComposeFocusManager_1.default.focus);
        },
        getDescription: () => { },
    },
    {
        isAnonymousAction: true,
        textTranslateKey: 'debug.debug',
        icon: Expensicons.Bug,
        shouldShow: ({ type, isDebugModeEnabled }) => [CONST_1.default.CONTEXT_MENU_TYPES.REPORT_ACTION, CONST_1.default.CONTEXT_MENU_TYPES.REPORT].some((value) => value === type) && !!isDebugModeEnabled,
        onPress: (closePopover, { reportID, reportAction }) => {
            if (reportAction) {
                Navigation_1.default.navigate(ROUTES_1.default.DEBUG_REPORT_ACTION.getRoute(reportID, reportAction.reportActionID));
            }
            else {
                Navigation_1.default.navigate(ROUTES_1.default.DEBUG_REPORT.getRoute(reportID));
            }
            (0, ReportActionContextMenu_1.hideContextMenu)(false, ReportActionComposeFocusManager_1.default.focus);
        },
        getDescription: () => { },
    },
    {
        isAnonymousAction: false,
        textTranslateKey: 'reportActionContextMenu.deleteAction',
        icon: Expensicons.Trashcan,
        shouldShow: ({ type, reportAction, isArchivedRoom, isChronosReport, reportID, moneyRequestAction, iouTransaction }) => 
        // Until deleting parent threads is supported in FE, we will prevent the user from deleting a thread parent
        !!reportID &&
            type === CONST_1.default.CONTEXT_MENU_TYPES.REPORT_ACTION &&
            (0, ReportUtils_1.canDeleteReportAction)(moneyRequestAction ?? reportAction, (0, ReportActionsUtils_1.isMoneyRequestAction)(moneyRequestAction) ? (0, ReportActionsUtils_1.getOriginalMessage)(moneyRequestAction)?.IOUReportID : reportID, iouTransaction) &&
            !isArchivedRoom &&
            !isChronosReport &&
            !(0, ReportActionsUtils_1.isMessageDeleted)(reportAction),
        onPress: (closePopover, { reportID: reportIDParam, reportAction, moneyRequestAction }) => {
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            const reportID = (0, ReportActionsUtils_1.isMoneyRequestAction)(moneyRequestAction) ? (0, ReportActionsUtils_1.getOriginalMessage)(moneyRequestAction)?.IOUReportID || reportIDParam : reportIDParam;
            if (closePopover) {
                // Hide popover, then call showDeleteConfirmModal
                (0, ReportActionContextMenu_1.hideContextMenu)(false, () => (0, ReportActionContextMenu_1.showDeleteModal)(reportID, moneyRequestAction ?? reportAction));
                return;
            }
            // No popover to hide, call showDeleteConfirmModal immediately
            (0, ReportActionContextMenu_1.showDeleteModal)(reportID, moneyRequestAction ?? reportAction);
        },
        getDescription: () => { },
    },
    {
        isAnonymousAction: true,
        textTranslateKey: 'reportActionContextMenu.menu',
        icon: Expensicons.ThreeDots,
        shouldShow: ({ isMini }) => isMini,
        onPress: (closePopover, { openOverflowMenu, event, openContextMenu, anchorRef }) => {
            openOverflowMenu(event, anchorRef ?? { current: null });
            openContextMenu();
        },
        getDescription: () => { },
        shouldPreventDefaultFocusOnPress: false,
    },
];
const restrictedReadOnlyActions = [
    'reportActionContextMenu.replyInThread',
    'reportActionContextMenu.editAction',
    'reportActionContextMenu.joinThread',
    'reportActionContextMenu.deleteAction',
];
const RestrictedReadOnlyContextMenuActions = ContextMenuActions.filter((action) => 'textTranslateKey' in action && restrictedReadOnlyActions.includes(action.textTranslateKey));
exports.RestrictedReadOnlyContextMenuActions = RestrictedReadOnlyContextMenuActions;
exports.default = ContextMenuActions;
