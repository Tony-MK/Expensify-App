"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fast_equals_1 = require("fast-equals");
const mapValues_1 = require("lodash/mapValues");
const react_1 = require("react");
const react_native_1 = require("react-native");
const ActionSheetAwareScrollView = require("@components/ActionSheetAwareScrollView");
const AttachmentContext_1 = require("@components/AttachmentContext");
const Button_1 = require("@components/Button");
const ConfirmModal_1 = require("@components/ConfirmModal");
const DisplayNames_1 = require("@components/DisplayNames");
const Hoverable_1 = require("@components/Hoverable");
const MentionReportContext_1 = require("@components/HTMLEngineProvider/HTMLRenderers/MentionReportRenderer/MentionReportContext");
const Icon_1 = require("@components/Icon");
const Expensicons_1 = require("@components/Icon/Expensicons");
const InlineSystemMessage_1 = require("@components/InlineSystemMessage");
const KYCWall_1 = require("@components/KYCWall");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const PressableWithSecondaryInteraction_1 = require("@components/PressableWithSecondaryInteraction");
const ReportActionItemEmojiReactions_1 = require("@components/Reactions/ReportActionItemEmojiReactions");
const RenderHTML_1 = require("@components/RenderHTML");
const ActionableItemButtons_1 = require("@components/ReportActionItem/ActionableItemButtons");
const ChronosOOOListActions_1 = require("@components/ReportActionItem/ChronosOOOListActions");
const ExportIntegration_1 = require("@components/ReportActionItem/ExportIntegration");
const IssueCardMessage_1 = require("@components/ReportActionItem/IssueCardMessage");
const MoneyRequestAction_1 = require("@components/ReportActionItem/MoneyRequestAction");
const MoneyRequestReportPreview_1 = require("@components/ReportActionItem/MoneyRequestReportPreview");
const TaskAction_1 = require("@components/ReportActionItem/TaskAction");
const TaskPreview_1 = require("@components/ReportActionItem/TaskPreview");
const TransactionPreview_1 = require("@components/ReportActionItem/TransactionPreview");
const TripRoomPreview_1 = require("@components/ReportActionItem/TripRoomPreview");
const SearchContext_1 = require("@components/Search/SearchContext");
const ShowContextMenuContext_1 = require("@components/ShowContextMenuContext");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const UnreadActionIndicator_1 = require("@components/UnreadActionIndicator");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const usePermissions_1 = require("@hooks/usePermissions");
const usePrevious_1 = require("@hooks/usePrevious");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ControlSelection_1 = require("@libs/ControlSelection");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const focusComposerWithDelay_1 = require("@libs/focusComposerWithDelay");
const isReportMessageAttachment_1 = require("@libs/isReportMessageAttachment");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Permissions_1 = require("@libs/Permissions");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const SelectionScraper_1 = require("@libs/SelectionScraper");
const shouldRenderAppPaymentCard_1 = require("@libs/shouldRenderAppPaymentCard");
const ReportScreenContext_1 = require("@pages/home/ReportScreenContext");
const AttachmentModalContext_1 = require("@pages/media/AttachmentModalScreen/AttachmentModalContext");
const variables_1 = require("@styles/variables");
const BankAccounts_1 = require("@userActions/BankAccounts");
const EmojiPickerAction_1 = require("@userActions/EmojiPickerAction");
const Member_1 = require("@userActions/Policy/Member");
const Report_1 = require("@userActions/Report");
const Session_1 = require("@userActions/Session");
const User_1 = require("@userActions/User");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const ContextMenuActions_1 = require("./ContextMenu/ContextMenuActions");
const MiniReportActionContextMenu_1 = require("./ContextMenu/MiniReportActionContextMenu");
const ReportActionContextMenu_1 = require("./ContextMenu/ReportActionContextMenu");
const LinkPreviewer_1 = require("./LinkPreviewer");
const ReportActionItemBasicMessage_1 = require("./ReportActionItemBasicMessage");
const ReportActionItemContentCreated_1 = require("./ReportActionItemContentCreated");
const ReportActionItemDraft_1 = require("./ReportActionItemDraft");
const ReportActionItemGrouped_1 = require("./ReportActionItemGrouped");
const ReportActionItemMessage_1 = require("./ReportActionItemMessage");
const ReportActionItemMessageEdit_1 = require("./ReportActionItemMessageEdit");
const ReportActionItemSingle_1 = require("./ReportActionItemSingle");
const ReportActionItemThread_1 = require("./ReportActionItemThread");
const TripSummary_1 = require("./TripSummary");
// This is equivalent to returning a negative boolean in normal functions, but we can keep the element return type
// If the child was rendered using RenderHTML and an empty html string, it has an empty prop called html
// If we render an empty component/fragment, this does not apply
const emptyHTML = <RenderHTML_1.default html=""/>;
const isEmptyHTML = ({ props: { html } }) => typeof html === 'string' && html.length === 0;
/**
 * This is a pure version of ReportActionItem, used in ReportActionList and Search result chat list items.
 * Since the search result has a separate Onyx key under the 'snapshot_' prefix, we should not connect this component with Onyx.
 * Instead, pass all Onyx read/write operations as props.
 */
function PureReportActionItem({ allReports, policies, action, report, policy, transactionThreadReport, linkedReportActionID, displayAsGroup, index, isMostRecentIOUReportAction, parentReportAction, shouldDisplayNewMarker, shouldHideThreadDividerLine = false, onPress = undefined, isFirstVisibleReportAction = false, isThreadReportParentAction = false, shouldUseThreadDividerLine = false, shouldDisplayContextMenu = true, parentReportActionForTransactionThread, draftMessage, iouReport, taskReport, linkedReport, iouReportOfLinkedReport, emojiReactions, linkedTransactionRouteError, isUserValidated, parentReport, personalDetails, blockedFromConcierge, originalReportID = '-1', deleteReportActionDraft = () => { }, isArchivedRoom, isChronosReport, toggleEmojiReaction = () => { }, createDraftTransactionAndNavigateToParticipantSelector = () => { }, resolveActionableReportMentionWhisper = () => { }, resolveActionableMentionWhisper = () => { }, isClosedExpenseReportWithNoExpenses, isCurrentUserTheOnlyParticipant = () => false, missingPaymentMethod, reimbursementDeQueuedOrCanceledActionMessage = '', modifiedExpenseMessage = '', getTransactionsWithReceipts = () => [], clearError = () => { }, clearAllRelatedReportActionErrors = () => { }, dismissTrackExpenseActionableWhisper = () => { }, userBillingFundID, shouldShowBorder, shouldHighlight = false, isTryNewDotNVPDismissed = false, currentUserAccountID, }) {
    const actionSheetAwareScrollViewContext = (0, react_1.useContext)(ActionSheetAwareScrollView.ActionSheetAwareScrollViewContext);
    const { translate, datetimeToCalendarTime, formatPhoneNumber, localeCompare } = (0, useLocalize_1.default)();
    const personalDetail = (0, useCurrentUserPersonalDetails_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const reportID = report?.reportID ?? action?.reportID;
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const [isContextMenuActive, setIsContextMenuActive] = (0, react_1.useState)(() => (0, ReportActionContextMenu_1.isActiveReportAction)(action.reportActionID));
    const [isEmojiPickerActive, setIsEmojiPickerActive] = (0, react_1.useState)();
    const [isPaymentMethodPopoverActive, setIsPaymentMethodPopoverActive] = (0, react_1.useState)();
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const shouldRenderViewBasedOnAction = (0, ReportActionsUtils_1.useTableReportViewActionRenderConditionals)(action);
    const [isHidden, setIsHidden] = (0, react_1.useState)(false);
    const [moderationDecision, setModerationDecision] = (0, react_1.useState)(CONST_1.default.MODERATION.MODERATOR_DECISION_APPROVED);
    const reactionListRef = (0, react_1.useContext)(ReportScreenContext_1.ReactionListContext);
    const { updateHiddenAttachments } = (0, react_1.useContext)(AttachmentModalContext_1.default);
    const composerTextInputRef = (0, react_1.useRef)(null);
    const popoverAnchorRef = (0, react_1.useRef)(null);
    const downloadedPreviews = (0, react_1.useRef)([]);
    const prevDraftMessage = (0, usePrevious_1.default)(draftMessage);
    const isReportActionLinked = linkedReportActionID && action.reportActionID && linkedReportActionID === action.reportActionID;
    const [isReportActionActive, setIsReportActionActive] = (0, react_1.useState)(!!isReportActionLinked);
    const isActionableWhisper = (0, ReportActionsUtils_1.isActionableMentionWhisper)(action) || (0, ReportActionsUtils_1.isActionableMentionInviteToSubmitExpenseConfirmWhisper)(action) || (0, ReportActionsUtils_1.isActionableTrackExpense)(action) || (0, ReportActionsUtils_1.isActionableReportMentionWhisper)(action);
    const isReportArchived = (0, useReportIsArchived_1.default)(report?.reportID);
    const highlightedBackgroundColorIfNeeded = (0, react_1.useMemo)(
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    () => (isReportActionLinked || shouldHighlight ? StyleUtils.getBackgroundColorStyle(theme.messageHighlightBG) : {}), [StyleUtils, isReportActionLinked, theme.messageHighlightBG, shouldHighlight]);
    const reportPreviewStyles = StyleUtils.getMoneyRequestReportPreviewStyle(shouldUseNarrowLayout, 1, undefined, undefined);
    const isDeletedParentAction = (0, ReportActionsUtils_1.isDeletedParentAction)(action);
    // IOUDetails only exists when we are sending money
    const isSendingMoney = (0, ReportActionsUtils_1.isMoneyRequestAction)(action) && (0, ReportActionsUtils_1.getOriginalMessage)(action)?.type === CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY && (0, ReportActionsUtils_1.getOriginalMessage)(action)?.IOUDetails;
    const updateHiddenState = (0, react_1.useCallback)((isHiddenValue) => {
        setIsHidden(isHiddenValue);
        const message = Array.isArray(action.message) ? action.message?.at(-1) : action.message;
        const isAttachment = CONST_1.default.ATTACHMENT_REGEX.test(message?.html ?? '') || (0, isReportMessageAttachment_1.isReportMessageAttachment)(message);
        if (!isAttachment) {
            return;
        }
        updateHiddenAttachments(action.reportActionID, isHiddenValue);
    }, [action.reportActionID, action.message, updateHiddenAttachments]);
    const { isOnSearch, currentSearchHash } = (0, SearchContext_1.useSearchContext)();
    const [showConfirmDismissReceiptError, setShowConfirmDismissReceiptError] = (0, react_1.useState)(false);
    const dismissError = (0, react_1.useCallback)(() => {
        const transactionID = (0, ReportActionsUtils_1.isMoneyRequestAction)(action) ? (0, ReportActionsUtils_1.getOriginalMessage)(action)?.IOUTransactionID : undefined;
        if (transactionID) {
            clearError(transactionID);
        }
        clearAllRelatedReportActionErrors(reportID, action);
    }, [reportID, clearError, clearAllRelatedReportActionErrors, action]);
    const onClose = () => {
        const errors = linkedTransactionRouteError ?? (0, ErrorUtils_1.getLatestErrorMessageField)(action);
        const errorEntries = Object.entries(errors ?? {});
        const errorMessages = (0, mapValues_1.default)(Object.fromEntries(errorEntries), (error) => error);
        const hasReceiptError = Object.values(errorMessages).some((error) => (0, ErrorUtils_1.isReceiptError)(error));
        if (hasReceiptError) {
            setShowConfirmDismissReceiptError(true);
        }
        else {
            dismissError();
        }
    };
    (0, react_1.useEffect)(() => () => {
        // ReportActionContextMenu, EmojiPicker and PopoverReactionList are global components,
        // we should also hide them when the current component is destroyed
        if ((0, ReportActionContextMenu_1.isActiveReportAction)(action.reportActionID)) {
            (0, ReportActionContextMenu_1.hideContextMenu)();
            (0, ReportActionContextMenu_1.hideDeleteModal)();
        }
        if ((0, EmojiPickerAction_1.isActive)(action.reportActionID)) {
            (0, EmojiPickerAction_1.hideEmojiPicker)(true);
        }
        if (reactionListRef?.current?.isActiveReportAction(action.reportActionID)) {
            reactionListRef?.current?.hideReactionList();
        }
    }, [action.reportActionID, reactionListRef]);
    (0, react_1.useEffect)(() => {
        // We need to hide EmojiPicker when this is a deleted parent action
        if (!isDeletedParentAction || !(0, EmojiPickerAction_1.isActive)(action.reportActionID)) {
            return;
        }
        (0, EmojiPickerAction_1.hideEmojiPicker)(true);
    }, [isDeletedParentAction, action.reportActionID]);
    (0, react_1.useEffect)(() => {
        if (prevDraftMessage !== undefined || draftMessage === undefined) {
            return;
        }
        (0, focusComposerWithDelay_1.default)(composerTextInputRef.current)(true);
    }, [prevDraftMessage, draftMessage]);
    (0, react_1.useEffect)(() => {
        if (!Permissions_1.default.canUseLinkPreviews()) {
            return;
        }
        const urls = (0, ReportActionsUtils_1.extractLinksFromMessageHtml)(action);
        if ((0, fast_equals_1.deepEqual)(downloadedPreviews.current, urls) || action.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE) {
            return;
        }
        downloadedPreviews.current = urls;
        (0, Report_1.expandURLPreview)(reportID, action.reportActionID);
    }, [action, reportID]);
    (0, react_1.useEffect)(() => {
        if (draftMessage === undefined || !(0, ReportActionsUtils_1.isDeletedAction)(action)) {
            return;
        }
        deleteReportActionDraft(reportID, action);
    }, [draftMessage, action, reportID, deleteReportActionDraft]);
    // Hide the message if it is being moderated for a higher offense, or is hidden by a moderator
    // Removed messages should not be shown anyway and should not need this flow
    const latestDecision = (0, ReportActionsUtils_1.getReportActionMessage)(action)?.moderationDecision?.decision ?? '';
    (0, react_1.useEffect)(() => {
        if (action.actionName !== CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT) {
            return;
        }
        // Hide reveal message button and show the message if latestDecision is changed to empty
        if (!latestDecision) {
            setModerationDecision(CONST_1.default.MODERATION.MODERATOR_DECISION_APPROVED);
            setIsHidden(false);
            return;
        }
        setModerationDecision(latestDecision);
        if (![CONST_1.default.MODERATION.MODERATOR_DECISION_APPROVED, CONST_1.default.MODERATION.MODERATOR_DECISION_PENDING].some((item) => item === latestDecision) && !(0, ReportActionsUtils_1.isPendingRemove)(action)) {
            setIsHidden(true);
            return;
        }
        setIsHidden(false);
    }, [latestDecision, action]);
    const toggleContextMenuFromActiveReportAction = (0, react_1.useCallback)(() => {
        setIsContextMenuActive((0, ReportActionContextMenu_1.isActiveReportAction)(action.reportActionID));
    }, [action.reportActionID]);
    const handleShowContextMenu = (0, react_1.useCallback)((callback) => {
        if (!(popoverAnchorRef.current && 'measureInWindow' in popoverAnchorRef.current)) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/naming-convention
        popoverAnchorRef.current?.measureInWindow((_fx, frameY, _width, height) => {
            actionSheetAwareScrollViewContext.transitionActionSheetState({
                type: ActionSheetAwareScrollView.Actions.OPEN_POPOVER,
                payload: {
                    popoverHeight: 0,
                    frameY,
                    height,
                },
            });
            callback();
        });
    }, [actionSheetAwareScrollViewContext]);
    const disabledActions = (0, react_1.useMemo)(() => (!(0, ReportUtils_1.canWriteInReport)(report) ? ContextMenuActions_1.RestrictedReadOnlyContextMenuActions : []), [report]);
    /**
     * Show the ReportActionContextMenu modal popover.
     *
     * @param [event] - A press event.
     */
    const showPopover = (0, react_1.useCallback)((event) => {
        // Block menu on the message being Edited or if the report action item has errors
        if (draftMessage !== undefined || !(0, EmptyObject_1.isEmptyObject)(action.errors) || !shouldDisplayContextMenu) {
            return;
        }
        handleShowContextMenu(() => {
            setIsContextMenuActive(true);
            const selection = SelectionScraper_1.default.getCurrentSelection();
            (0, ReportActionContextMenu_1.showContextMenu)({
                type: CONST_1.default.CONTEXT_MENU_TYPES.REPORT_ACTION,
                event,
                selection,
                contextMenuAnchor: popoverAnchorRef.current,
                report: {
                    reportID,
                    originalReportID,
                    isArchivedRoom,
                    isChronos: isChronosReport,
                },
                reportAction: {
                    reportActionID: action.reportActionID,
                    draftMessage,
                    isThreadReportParentAction,
                },
                callbacks: {
                    onShow: toggleContextMenuFromActiveReportAction,
                    onHide: toggleContextMenuFromActiveReportAction,
                    setIsEmojiPickerActive: setIsEmojiPickerActive,
                },
                disabledOptions: disabledActions,
            });
        });
    }, [
        draftMessage,
        action,
        reportID,
        toggleContextMenuFromActiveReportAction,
        originalReportID,
        shouldDisplayContextMenu,
        disabledActions,
        isArchivedRoom,
        isChronosReport,
        handleShowContextMenu,
        isThreadReportParentAction,
    ]);
    const toggleReaction = (0, react_1.useCallback)((emoji, ignoreSkinToneOnCompare) => {
        toggleEmojiReaction(reportID, action, emoji, emojiReactions, undefined, ignoreSkinToneOnCompare);
    }, [reportID, action, emojiReactions, toggleEmojiReaction]);
    const contextValue = (0, react_1.useMemo)(() => ({
        anchor: popoverAnchorRef.current,
        report,
        isReportArchived,
        action,
        transactionThreadReport,
        checkIfContextMenuActive: toggleContextMenuFromActiveReportAction,
        onShowContextMenu: handleShowContextMenu,
        isDisabled: false,
        shouldDisplayContextMenu,
    }), [report, action, toggleContextMenuFromActiveReportAction, transactionThreadReport, handleShowContextMenu, shouldDisplayContextMenu, isReportArchived]);
    const attachmentContextValue = (0, react_1.useMemo)(() => {
        if (isOnSearch) {
            return { type: CONST_1.default.ATTACHMENT_TYPE.SEARCH, currentSearchHash };
        }
        return { reportID, type: CONST_1.default.ATTACHMENT_TYPE.REPORT };
    }, [reportID, isOnSearch, currentSearchHash]);
    const mentionReportContextValue = (0, react_1.useMemo)(() => ({ currentReportID: report?.reportID, exactlyMatch: true }), [report?.reportID]);
    const actionableItemButtons = (0, react_1.useMemo)(() => {
        if ((0, ReportActionsUtils_1.isActionableAddPaymentCard)(action) && userBillingFundID === undefined && (0, shouldRenderAppPaymentCard_1.default)()) {
            return [
                {
                    text: 'subscription.cardSection.addCardButton',
                    key: `${action.reportActionID}-actionableAddPaymentCard-submit`,
                    onPress: () => {
                        Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_SUBSCRIPTION_ADD_PAYMENT_CARD);
                    },
                    isPrimary: true,
                },
            ];
        }
        if ((0, ReportActionsUtils_1.isConciergeCategoryOptions)(action)) {
            const options = (0, ReportActionsUtils_1.getOriginalMessage)(action)?.options;
            if (!options) {
                return [];
            }
            if ((0, ReportActionsUtils_1.isResolvedConciergeCategoryOptions)(action)) {
                return [];
            }
            if (!reportID) {
                return [];
            }
            return options.map((option, i) => ({
                text: `${i + 1} - ${option}`,
                key: `${action.reportActionID}-conciergeCategoryOptions-${option}`,
                onPress: () => {
                    (0, Report_1.resolveConciergeCategoryOptions)(reportID, originalReportID, action.reportActionID, option, personalDetail.timezone ?? CONST_1.default.DEFAULT_TIME_ZONE);
                },
            }));
        }
        if (!isActionableWhisper && (!(0, ReportActionsUtils_1.isActionableJoinRequest)(action) || (0, ReportActionsUtils_1.getOriginalMessage)(action)?.choice !== '')) {
            return [];
        }
        if ((0, ReportActionsUtils_1.isActionableTrackExpense)(action)) {
            const transactionID = (0, ReportActionsUtils_1.getOriginalMessage)(action)?.transactionID;
            const options = [
                {
                    text: 'actionableMentionTrackExpense.submit',
                    key: `${action.reportActionID}-actionableMentionTrackExpense-submit`,
                    onPress: () => {
                        createDraftTransactionAndNavigateToParticipantSelector(transactionID, reportID, CONST_1.default.IOU.ACTION.SUBMIT, action.reportActionID);
                    },
                },
            ];
            if (isBetaEnabled(CONST_1.default.BETAS.TRACK_FLOWS)) {
                options.push({
                    text: 'actionableMentionTrackExpense.categorize',
                    key: `${action.reportActionID}-actionableMentionTrackExpense-categorize`,
                    onPress: () => {
                        createDraftTransactionAndNavigateToParticipantSelector(transactionID, reportID, CONST_1.default.IOU.ACTION.CATEGORIZE, action.reportActionID);
                    },
                }, {
                    text: 'actionableMentionTrackExpense.share',
                    key: `${action.reportActionID}-actionableMentionTrackExpense-share`,
                    onPress: () => {
                        createDraftTransactionAndNavigateToParticipantSelector(transactionID, reportID, CONST_1.default.IOU.ACTION.SHARE, action.reportActionID);
                    },
                });
            }
            options.push({
                text: 'actionableMentionTrackExpense.nothing',
                key: `${action.reportActionID}-actionableMentionTrackExpense-nothing`,
                onPress: () => {
                    dismissTrackExpenseActionableWhisper(reportID, action);
                },
            });
            return options;
        }
        if ((0, ReportActionsUtils_1.isActionableJoinRequest)(action)) {
            return [
                {
                    text: 'actionableMentionJoinWorkspaceOptions.accept',
                    key: `${action.reportActionID}-actionableMentionJoinWorkspace-${CONST_1.default.REPORT.ACTIONABLE_MENTION_JOIN_WORKSPACE_RESOLUTION.ACCEPT}`,
                    onPress: () => (0, Member_1.acceptJoinRequest)(reportID, action),
                    isPrimary: true,
                },
                {
                    text: 'actionableMentionJoinWorkspaceOptions.decline',
                    key: `${action.reportActionID}-actionableMentionJoinWorkspace-${CONST_1.default.REPORT.ACTIONABLE_MENTION_JOIN_WORKSPACE_RESOLUTION.DECLINE}`,
                    onPress: () => (0, Member_1.declineJoinRequest)(reportID, action),
                },
            ];
        }
        if ((0, ReportActionsUtils_1.isActionableReportMentionWhisper)(action)) {
            return [
                {
                    text: 'common.yes',
                    key: `${action.reportActionID}-actionableReportMentionWhisper-${CONST_1.default.REPORT.ACTIONABLE_REPORT_MENTION_WHISPER_RESOLUTION.CREATE}`,
                    onPress: () => resolveActionableReportMentionWhisper(reportID, action, CONST_1.default.REPORT.ACTIONABLE_REPORT_MENTION_WHISPER_RESOLUTION.CREATE),
                    isPrimary: true,
                },
                {
                    text: 'common.no',
                    key: `${action.reportActionID}-actionableReportMentionWhisper-${CONST_1.default.REPORT.ACTIONABLE_REPORT_MENTION_WHISPER_RESOLUTION.NOTHING}`,
                    onPress: () => resolveActionableReportMentionWhisper(reportID, action, CONST_1.default.REPORT.ACTIONABLE_REPORT_MENTION_WHISPER_RESOLUTION.NOTHING),
                },
            ];
        }
        if ((0, ReportActionsUtils_1.isActionableMentionInviteToSubmitExpenseConfirmWhisper)(action)) {
            return [
                {
                    text: 'common.buttonConfirm',
                    key: `${action.reportActionID}-actionableReportMentionConfirmWhisper-${CONST_1.default.REPORT.ACTIONABLE_MENTION_INVITE_TO_SUBMIT_EXPENSE_CONFIRM_WHISPER.DONE}`,
                    onPress: () => (0, Report_1.resolveActionableMentionConfirmWhisper)(reportID, action, CONST_1.default.REPORT.ACTIONABLE_MENTION_INVITE_TO_SUBMIT_EXPENSE_CONFIRM_WHISPER.DONE, formatPhoneNumber, isReportArchived),
                    isPrimary: true,
                },
            ];
        }
        const actionableMentionWhisperOptions = [];
        const isReportInPolicy = !!report?.policyID && report.policyID !== CONST_1.default.POLICY.ID_FAKE && (0, PolicyUtils_1.getPersonalPolicy)()?.id !== report.policyID;
        if (isReportInPolicy && ((0, PolicyUtils_1.isPolicyAdmin)(policy) || (0, PolicyUtils_1.isPolicyOwner)(policy, currentUserAccountID))) {
            actionableMentionWhisperOptions.push({
                text: 'actionableMentionWhisperOptions.inviteToSubmitExpense',
                key: `${action.reportActionID}-actionableMentionWhisper-${CONST_1.default.REPORT.ACTIONABLE_MENTION_WHISPER_RESOLUTION.INVITE_TO_SUBMIT_EXPENSE}`,
                onPress: () => resolveActionableMentionWhisper(reportID, action, CONST_1.default.REPORT.ACTIONABLE_MENTION_WHISPER_RESOLUTION.INVITE_TO_SUBMIT_EXPENSE, formatPhoneNumber, policy, isReportArchived),
                isMediumSized: true,
            });
        }
        actionableMentionWhisperOptions.push({
            text: 'actionableMentionWhisperOptions.inviteToChat',
            key: `${action.reportActionID}-actionableMentionWhisper-${CONST_1.default.REPORT.ACTIONABLE_MENTION_WHISPER_RESOLUTION.INVITE}`,
            onPress: () => resolveActionableMentionWhisper(reportID, action, CONST_1.default.REPORT.ACTIONABLE_MENTION_WHISPER_RESOLUTION.INVITE, formatPhoneNumber, policy, isReportArchived),
            isMediumSized: true,
        }, {
            text: 'actionableMentionWhisperOptions.nothing',
            key: `${action.reportActionID}-actionableMentionWhisper-${CONST_1.default.REPORT.ACTIONABLE_MENTION_WHISPER_RESOLUTION.NOTHING}`,
            onPress: () => resolveActionableMentionWhisper(reportID, action, CONST_1.default.REPORT.ACTIONABLE_MENTION_WHISPER_RESOLUTION.NOTHING, formatPhoneNumber, policy, isReportArchived),
            isMediumSized: true,
        });
        return actionableMentionWhisperOptions;
    }, [
        action,
        userBillingFundID,
        isActionableWhisper,
        report?.policyID,
        policy,
        currentUserAccountID,
        reportID,
        originalReportID,
        personalDetail.timezone,
        isBetaEnabled,
        createDraftTransactionAndNavigateToParticipantSelector,
        dismissTrackExpenseActionableWhisper,
        resolveActionableReportMentionWhisper,
        formatPhoneNumber,
        resolveActionableMentionWhisper,
        isReportArchived,
    ]);
    /**
     * Get the content of ReportActionItem
     * @param hovered whether the ReportActionItem is hovered
     * @param isWhisper whether the report action is a whisper
     * @param hasErrors whether the report action has any errors
     * @returns child component(s)
     */
    const renderItemContent = (hovered = false, isWhisper = false, hasErrors = false) => {
        let children;
        const moneyRequestOriginalMessage = (0, ReportActionsUtils_1.isMoneyRequestAction)(action) ? (0, ReportActionsUtils_1.getOriginalMessage)(action) : undefined;
        const moneyRequestActionType = moneyRequestOriginalMessage?.type;
        // Show the preview for when expense is present
        if ((0, ReportActionsUtils_1.isIOURequestReportAction)(action)) {
            const isSplitScanWithNoAmount = moneyRequestActionType === CONST_1.default.IOU.REPORT_ACTION_TYPE.SPLIT && moneyRequestOriginalMessage?.amount === 0;
            const chatReportID = moneyRequestOriginalMessage?.IOUReportID ? report?.chatReportID : reportID;
            // There is no single iouReport for bill splits, so only 1:1 requests require an iouReportID
            const iouReportID = moneyRequestOriginalMessage?.IOUReportID?.toString();
            children = (<MoneyRequestAction_1.default allReports={allReports} 
            // If originalMessage.iouReportID is set, this is a 1:1 IOU expense in a DM chat whose reportID is report.chatReportID
            chatReportID={chatReportID} requestReportID={iouReportID} reportID={reportID} action={action} isMostRecentIOUReportAction={isMostRecentIOUReportAction} isHovered={hovered} contextMenuAnchor={popoverAnchorRef.current} checkIfContextMenuActive={toggleContextMenuFromActiveReportAction} style={displayAsGroup ? [] : [styles.mt2]} isWhisper={isWhisper} shouldDisplayContextMenu={shouldDisplayContextMenu}/>);
            if (report?.type === CONST_1.default.REPORT.TYPE.CHAT) {
                const isSplitBill = moneyRequestActionType === CONST_1.default.IOU.REPORT_ACTION_TYPE.SPLIT;
                const shouldShowSplitPreview = isSplitBill || isSplitScanWithNoAmount;
                if (report.chatType === CONST_1.default.REPORT.CHAT_TYPE.SELF_DM || shouldShowSplitPreview) {
                    children = (<react_native_1.View style={[styles.mt1, styles.w100]}>
                            <TransactionPreview_1.default allReports={allReports} iouReportID={(0, ReportActionsUtils_1.getIOUReportIDFromReportActionPreview)(action)} chatReportID={reportID} reportID={reportID} action={action} shouldDisplayContextMenu={shouldDisplayContextMenu} isBillSplit={(0, ReportActionsUtils_1.isSplitBillAction)(action)} transactionID={shouldShowSplitPreview ? moneyRequestOriginalMessage?.IOUTransactionID : undefined} containerStyles={[reportPreviewStyles.transactionPreviewStandaloneStyle, styles.mt1]} transactionPreviewWidth={reportPreviewStyles.transactionPreviewStandaloneStyle.width} onPreviewPressed={() => {
                            if (shouldShowSplitPreview) {
                                Navigation_1.default.navigate(ROUTES_1.default.SPLIT_BILL_DETAILS.getRoute(chatReportID, action.reportActionID, Navigation_1.default.getReportRHPActiveRoute()));
                                return;
                            }
                            if (!action.childReportID) {
                                return;
                            }
                            Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(action.childReportID, undefined, undefined, Navigation_1.default.getActiveRoute()));
                        }} isTrackExpense={(0, ReportActionsUtils_1.isTrackExpenseAction)(action)}/>
                        </react_native_1.View>);
                }
                else {
                    children = emptyHTML;
                }
            }
        }
        else if ((0, ReportActionsUtils_1.isTripPreview)(action)) {
            children = (<TripRoomPreview_1.default action={action} chatReport={linkedReport} iouReport={iouReportOfLinkedReport} isHovered={hovered} contextMenuAnchor={popoverAnchorRef.current} containerStyles={displayAsGroup ? [] : [styles.mt2]} checkIfContextMenuActive={toggleContextMenuFromActiveReportAction} shouldDisplayContextMenu={shouldDisplayContextMenu}/>);
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW && isClosedExpenseReportWithNoExpenses) {
            children = <RenderHTML_1.default html={`<deleted-action>${translate('parentReportAction.deletedReport')}</deleted-action>`}/>;
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW) {
            children = (<MoneyRequestReportPreview_1.default allReports={allReports} policies={policies} iouReportID={(0, ReportActionsUtils_1.getIOUReportIDFromReportActionPreview)(action)} policyID={report?.policyID} chatReportID={reportID} action={action} contextMenuAnchor={popoverAnchorRef.current} isHovered={hovered} isWhisper={isWhisper} isInvoice={action.childType === CONST_1.default.REPORT.CHAT_TYPE.INVOICE} checkIfContextMenuActive={toggleContextMenuFromActiveReportAction} onPaymentOptionsShow={() => setIsPaymentMethodPopoverActive(true)} onPaymentOptionsHide={() => setIsPaymentMethodPopoverActive(false)} shouldDisplayContextMenu={shouldDisplayContextMenu} shouldShowBorder={shouldShowBorder}/>);
        }
        else if ((0, ReportActionsUtils_1.isTaskAction)(action)) {
            children = <TaskAction_1.default action={action}/>;
        }
        else if ((0, ReportActionsUtils_1.isCreatedTaskReportAction)(action)) {
            children = (<ShowContextMenuContext_1.ShowContextMenuContext.Provider value={contextValue}>
                    <TaskPreview_1.default style={displayAsGroup ? [] : [styles.mt1]} taskReport={taskReport} chatReportID={reportID} action={action} isHovered={hovered} onShowContextMenu={handleShowContextMenu} contextMenuAnchor={popoverAnchorRef.current} checkIfContextMenuActive={toggleContextMenuFromActiveReportAction} policyID={report?.policyID} shouldDisplayContextMenu={shouldDisplayContextMenu}/>
                </ShowContextMenuContext_1.ShowContextMenuContext.Provider>);
        }
        else if ((0, ReportActionsUtils_1.isReimbursementQueuedAction)(action)) {
            const targetReport = (0, ReportUtils_1.isChatThread)(report) ? parentReport : report;
            const submitterDisplayName = formatPhoneNumber((0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(personalDetails?.[targetReport?.ownerAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID]));
            const paymentType = (0, ReportActionsUtils_1.getOriginalMessage)(action)?.paymentType ?? '';
            children = (<ReportActionItemBasicMessage_1.default message={translate(paymentType === CONST_1.default.IOU.PAYMENT_TYPE.EXPENSIFY ? 'iou.waitingOnEnabledWallet' : 'iou.waitingOnBankAccount', { submitterDisplayName })}>
                    <>
                        {missingPaymentMethod === 'bankAccount' && (<Button_1.default success style={[styles.w100, styles.requestPreviewBox]} text={translate('bankAccount.addBankAccount')} onPress={() => (0, BankAccounts_1.openPersonalBankAccountSetupView)({ exitReportID: Navigation_1.default.getTopmostReportId() ?? targetReport?.reportID, isUserValidated })} pressOnEnter large/>)}
                        {missingPaymentMethod === 'wallet' && (<KYCWall_1.default onSuccessfulKYC={() => Navigation_1.default.navigate(ROUTES_1.default.ENABLE_PAYMENTS)} enablePaymentsRoute={ROUTES_1.default.ENABLE_PAYMENTS} addBankAccountRoute={ROUTES_1.default.BANK_ACCOUNT_PERSONAL} addDebitCardRoute={ROUTES_1.default.SETTINGS_ADD_DEBIT_CARD} chatReportID={targetReport?.reportID} iouReport={iouReport}>
                                {(triggerKYCFlow, buttonRef) => (<Button_1.default ref={buttonRef} success large style={[styles.w100, styles.requestPreviewBox]} text={translate('iou.enableWallet')} onPress={triggerKYCFlow}/>)}
                            </KYCWall_1.default>)}
                    </>
                </ReportActionItemBasicMessage_1.default>);
        }
        else if ((0, ReportActionsUtils_1.isReimbursementDeQueuedOrCanceledAction)(action)) {
            children = <ReportActionItemBasicMessage_1.default message={reimbursementDeQueuedOrCanceledActionMessage}/>;
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.MODIFIED_EXPENSE) {
            children = <ReportActionItemBasicMessage_1.default message={modifiedExpenseMessage}/>;
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.SUBMITTED) || (0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.SUBMITTED_AND_CLOSED) || (0, ReportActionsUtils_1.isMarkAsClosedAction)(action)) {
            const wasSubmittedViaHarvesting = !(0, ReportActionsUtils_1.isMarkAsClosedAction)(action) ? ((0, ReportActionsUtils_1.getOriginalMessage)(action)?.harvesting ?? false) : false;
            if (wasSubmittedViaHarvesting) {
                children = (<ReportActionItemBasicMessage_1.default>
                        <RenderHTML_1.default html={`<comment><muted-text>${translate('iou.automaticallySubmitted')}</muted-text></comment>`}/>
                    </ReportActionItemBasicMessage_1.default>);
            }
            else {
                children = <ReportActionItemBasicMessage_1.default message={translate('iou.submitted', { memo: (0, ReportActionsUtils_1.getOriginalMessage)(action)?.message })}/>;
            }
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.APPROVED)) {
            const wasAutoApproved = (0, ReportActionsUtils_1.getOriginalMessage)(action)?.automaticAction ?? false;
            if (wasAutoApproved) {
                children = (<ReportActionItemBasicMessage_1.default>
                        <RenderHTML_1.default html={`<comment><muted-text>${translate('iou.automaticallyApproved')}</muted-text></comment>`}/>
                    </ReportActionItemBasicMessage_1.default>);
            }
            else {
                children = <ReportActionItemBasicMessage_1.default message={translate('iou.approvedMessage')}/>;
            }
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.IOU) && (0, ReportActionsUtils_1.getOriginalMessage)(action)?.type === CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY) {
            const wasAutoPaid = (0, ReportActionsUtils_1.getOriginalMessage)(action)?.automaticAction ?? false;
            const paymentType = (0, ReportActionsUtils_1.getOriginalMessage)(action)?.paymentType;
            if (paymentType === CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE) {
                children = <ReportActionItemBasicMessage_1.default message={translate('iou.paidElsewhere')}/>;
            }
            else if (paymentType === CONST_1.default.IOU.PAYMENT_TYPE.VBBA) {
                const last4Digits = policy?.achAccount?.accountNumber?.slice(-4) ?? '';
                if (wasAutoPaid) {
                    const translation = translate('iou.automaticallyPaidWithBusinessBankAccount', { amount: '', last4Digits });
                    children = (<ReportActionItemBasicMessage_1.default>
                            <RenderHTML_1.default html={`<comment><muted-text>${translation}</muted-text></comment>`}/>
                        </ReportActionItemBasicMessage_1.default>);
                }
                else {
                    children = <ReportActionItemBasicMessage_1.default message={translate('iou.businessBankAccount', { amount: '', last4Digits })?.toLowerCase()}/>;
                }
            }
            else if (wasAutoPaid) {
                children = (<ReportActionItemBasicMessage_1.default>
                        <RenderHTML_1.default html={`<comment><muted-text>${translate('iou.automaticallyPaidWithExpensify')}</muted-text></comment>`}/>
                    </ReportActionItemBasicMessage_1.default>);
            }
            else {
                children = <ReportActionItemBasicMessage_1.default message={translate('iou.paidWithExpensify')}/>;
            }
        }
        else if ((0, ReportActionsUtils_1.isUnapprovedAction)(action)) {
            children = <ReportActionItemBasicMessage_1.default message={translate('iou.unapproved')}/>;
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.FORWARDED)) {
            const wasAutoForwarded = (0, ReportActionsUtils_1.getOriginalMessage)(action)?.automaticAction ?? false;
            if (wasAutoForwarded) {
                children = (<ReportActionItemBasicMessage_1.default>
                        <RenderHTML_1.default html={`<comment><muted-text>${translate('iou.automaticallyForwarded')}</muted-text></comment>`}/>
                    </ReportActionItemBasicMessage_1.default>);
            }
            else {
                children = <ReportActionItemBasicMessage_1.default message={translate('iou.forwarded')}/>;
            }
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.REJECTED) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportUtils_1.getRejectedReportMessage)()}/>;
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.CORPORATE_UPGRADE) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportUtils_1.getUpgradeWorkspaceMessage)()}/>;
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.TEAM_DOWNGRADE) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportUtils_1.getDowngradeWorkspaceMessage)()}/>;
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.HOLD) {
            children = <ReportActionItemBasicMessage_1.default message={translate('iou.heldExpense')}/>;
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.HOLD_COMMENT) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getReportActionText)(action)}/>;
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.UNHOLD) {
            children = <ReportActionItemBasicMessage_1.default message={translate('iou.unheldExpense')}/>;
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.REJECTEDTRANSACTION_THREAD) {
            children = <ReportActionItemBasicMessage_1.default message={translate('iou.reject.reportActions.rejectedExpense')}/>;
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.REJECTED_TRANSACTION_MARKASRESOLVED) {
            children = <ReportActionItemBasicMessage_1.default message={translate('iou.reject.reportActions.markedAsResolved')}/>;
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.RETRACTED) {
            children = <ReportActionItemBasicMessage_1.default message={translate('iou.retracted')}/>;
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.REOPENED) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getReopenedMessage)()}/>;
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CHANGE_POLICY) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportUtils_1.getPolicyChangeMessage)(action)}/>;
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.DELETED_TRANSACTION) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportUtils_1.getDeletedTransactionMessage)(action)}/>;
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.MOVED_TRANSACTION) {
            const movedTransactionOriginalMessage = (0, ReportActionsUtils_1.getOriginalMessage)(action) ?? {};
            const { toReportID } = movedTransactionOriginalMessage;
            const toReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${toReportID}`];
            // When expenses are merged multiple times, the previous toReportID may reference a deleted report,
            // making it impossible to retrieve the report name for display
            // Ref: https://github.com/Expensify/App/issues/70338
            if (!toReport) {
                children = emptyHTML;
            }
            else {
                children = (<ReportActionItemBasicMessage_1.default message="">
                        <RenderHTML_1.default html={`<comment><muted-text>${(0, ReportUtils_1.getMovedTransactionMessage)(toReport)}</muted-text></comment>`}/>
                    </ReportActionItemBasicMessage_1.default>);
            }
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.MOVED) {
            children = (<ReportActionItemBasicMessage_1.default message="">
                    <RenderHTML_1.default html={`<comment><muted-text>${(0, ReportUtils_1.getMovedActionMessage)(action, report)}</muted-text></comment>`}/>
                </ReportActionItemBasicMessage_1.default>);
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.TRAVEL_UPDATE)) {
            children = (<ReportActionItemBasicMessage_1.default message="">
                    <RenderHTML_1.default html={`<comment><muted-text>${(0, ReportActionsUtils_1.getTravelUpdateMessage)(action, datetimeToCalendarTime)}</muted-text></comment>`}/>
                </ReportActionItemBasicMessage_1.default>);
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.UNREPORTED_TRANSACTION) {
            children = (<ReportActionItemBasicMessage_1.default message="">
                    <RenderHTML_1.default html={`<comment><muted-text>${(0, ReportUtils_1.getUnreportedTransactionMessage)()}</muted-text></comment>`}/>
                </ReportActionItemBasicMessage_1.default>);
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.MERGED_WITH_CASH_TRANSACTION) {
            children = <ReportActionItemBasicMessage_1.default message={translate('systemMessage.mergedWithCashTransaction')}/>;
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.DISMISSED_VIOLATION)) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getDismissedViolationMessageText)((0, ReportActionsUtils_1.getOriginalMessage)(action))}/>;
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.RESOLVED_DUPLICATES)) {
            children = <ReportActionItemBasicMessage_1.default message={translate('violations.resolvedDuplicates')}/>;
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_NAME) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportUtils_1.getWorkspaceNameUpdatedMessage)(action)}/>;
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_CURRENCY) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getWorkspaceCurrencyUpdateMessage)(action)}/>;
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_AUTO_REPORTING_FREQUENCY) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getWorkspaceFrequencyUpdateMessage)(action)}/>;
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.ADD_CATEGORY ||
            action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_CATEGORY ||
            action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_CATEGORY ||
            action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.SET_CATEGORY_NAME) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getWorkspaceCategoryUpdateMessage)(action, policy)}/>;
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_TAG_LIST_NAME) {
            children = <ReportActionItemBasicMessage_1.default message={(0, PolicyUtils_1.getCleanedTagName)((0, ReportActionsUtils_1.getTagListNameUpdatedMessage)(action))}/>;
        }
        else if ((0, ReportActionsUtils_1.isTagModificationAction)(action.actionName)) {
            children = <ReportActionItemBasicMessage_1.default message={(0, PolicyUtils_1.getCleanedTagName)((0, ReportActionsUtils_1.getWorkspaceTagUpdateMessage)(action))}/>;
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_CUSTOM_UNIT) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getWorkspaceCustomUnitUpdatedMessage)(action)}/>;
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.ADD_CUSTOM_UNIT_RATE) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getWorkspaceCustomUnitRateAddedMessage)(action)}/>;
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_CUSTOM_UNIT_RATE) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getWorkspaceCustomUnitRateUpdatedMessage)(action)}/>;
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_CUSTOM_UNIT_RATE) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getWorkspaceCustomUnitRateDeletedMessage)(action)}/>;
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.ADD_REPORT_FIELD) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getWorkspaceReportFieldAddMessage)(action)}/>;
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_REPORT_FIELD) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getWorkspaceReportFieldUpdateMessage)(action)}/>;
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_REPORT_FIELD) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getWorkspaceReportFieldDeleteMessage)(action)}/>;
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_FIELD)) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getWorkspaceUpdateFieldMessage)(action)}/>;
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_MAX_EXPENSE_AMOUNT_NO_RECEIPT)) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getPolicyChangeLogMaxExpenseAmountNoReceiptMessage)(action)}/>;
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_MAX_EXPENSE_AMOUNT)) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getPolicyChangeLogMaxExpenseAmountMessage)(action)}/>;
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_DEFAULT_BILLABLE)) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getPolicyChangeLogDefaultBillableMessage)(action)}/>;
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_DEFAULT_REIMBURSABLE)) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getPolicyChangeLogDefaultReimbursableMessage)(action)}/>;
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_DEFAULT_TITLE_ENFORCED)) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getPolicyChangeLogDefaultTitleEnforcedMessage)(action)}/>;
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.ADD_EMPLOYEE) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getPolicyChangeLogAddEmployeeMessage)(action)}/>;
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_EMPLOYEE) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getPolicyChangeLogUpdateEmployee)(action)}/>;
        }
        else if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_EMPLOYEE) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getPolicyChangeLogDeleteMemberMessage)(action)}/>;
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.ADD_APPROVER_RULE)) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getAddedApprovalRuleMessage)(action)}/>;
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_APPROVER_RULE)) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getDeletedApprovalRuleMessage)(action)}/>;
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_APPROVER_RULE)) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getUpdatedApprovalRuleMessage)(action)}/>;
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.REMOVED_FROM_APPROVAL_CHAIN)) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getRemovedFromApprovalChainMessage)(action)}/>;
        }
        else if ((0, ReportActionsUtils_1.isActionableJoinRequest)(action)) {
            children = (<react_native_1.View>
                    <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getJoinRequestMessage)(action)}/>
                    {actionableItemButtons.length > 0 && (<ActionableItemButtons_1.default items={actionableItemButtons} shouldUseLocalization layout={(0, ReportActionsUtils_1.isActionableTrackExpense)(action) ? 'vertical' : 'horizontal'}/>)}
                </react_native_1.View>);
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.DEMOTED_FROM_WORKSPACE)) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getDemotedFromWorkspaceMessage)(action)}/>;
        }
        else if ((0, ReportActionsUtils_1.isCardIssuedAction)(action)) {
            children = (<IssueCardMessage_1.default action={action} policyID={report?.policyID}/>);
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.EXPORTED_TO_INTEGRATION)) {
            children = <ExportIntegration_1.default action={action}/>;
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.RECEIPT_SCAN_FAILED)) {
            children = <ReportActionItemBasicMessage_1.default message={translate('iou.receiptScanningFailed')}/>;
        }
        else if ((0, ReportActionsUtils_1.isRenamedAction)(action)) {
            const message = (0, ReportActionsUtils_1.getRenamedAction)(action, (0, ReportUtils_1.isExpenseReport)(report));
            children = <ReportActionItemBasicMessage_1.default message={message}/>;
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.INTEGRATION_SYNC_FAILED)) {
            children = (<ReportActionItemBasicMessage_1.default message="">
                    <RenderHTML_1.default html={`<comment><muted-text>${(0, ReportActionsUtils_1.getIntegrationSyncFailedMessage)(action, report?.policyID, isTryNewDotNVPDismissed)}</muted-text></comment>`}/>
                </ReportActionItemBasicMessage_1.default>);
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.ADD_INTEGRATION)) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getAddedConnectionMessage)(action)}/>;
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.DELETE_INTEGRATION)) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getRemovedConnectionMessage)(action)}/>;
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_AUDIT_RATE)) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getUpdatedAuditRateMessage)(action)}/>;
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.POLICY_CHANGE_LOG.UPDATE_MANUAL_APPROVAL_THRESHOLD)) {
            children = <ReportActionItemBasicMessage_1.default message={(0, ReportActionsUtils_1.getUpdatedManualApprovalThresholdMessage)(action)}/>;
        }
        else if ((0, ReportActionsUtils_1.isActionableMentionWhisper)(action)) {
            children = (<ReportActionItemBasicMessage_1.default>
                    <RenderHTML_1.default html={(0, ReportActionsUtils_1.getActionableMentionWhisperMessage)(action)}/>
                    {actionableItemButtons.length > 0 && (<ActionableItemButtons_1.default items={actionableItemButtons} shouldUseLocalization layout="vertical"/>)}
                </ReportActionItemBasicMessage_1.default>);
        }
        else if ((0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.TAKE_CONTROL) || (0, ReportActionsUtils_1.isActionOfType)(action, CONST_1.default.REPORT.ACTIONS.TYPE.REROUTE)) {
            children = (<ReportActionItemBasicMessage_1.default>
                    <RenderHTML_1.default html={`<comment><muted-text>${(0, ReportActionsUtils_1.getChangedApproverActionMessage)(action)}</muted-text></comment>`}/>
                </ReportActionItemBasicMessage_1.default>);
        }
        else {
            const hasBeenFlagged = ![CONST_1.default.MODERATION.MODERATOR_DECISION_APPROVED, CONST_1.default.MODERATION.MODERATOR_DECISION_PENDING].some((item) => item === moderationDecision) && !(0, ReportActionsUtils_1.isPendingRemove)(action);
            children = (<MentionReportContext_1.default.Provider value={mentionReportContextValue}>
                    <ShowContextMenuContext_1.ShowContextMenuContext.Provider value={contextValue}>
                        <AttachmentContext_1.AttachmentContext.Provider value={attachmentContextValue}>
                            {draftMessage === undefined ? (<react_native_1.View style={displayAsGroup && hasBeenFlagged ? styles.blockquote : {}}>
                                    <ReportActionItemMessage_1.default reportID={reportID} action={action} displayAsGroup={displayAsGroup} isHidden={isHidden}/>
                                    {hasBeenFlagged && (<Button_1.default small style={[styles.mt2, styles.alignSelfStart]} onPress={() => updateHiddenState(!isHidden)}>
                                            <Text_1.default style={[styles.buttonSmallText, styles.userSelectNone]} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true }}>
                                                {isHidden ? translate('moderation.revealMessage') : translate('moderation.hideMessage')}
                                            </Text_1.default>
                                        </Button_1.default>)}
                                    {/**
                These are the actionable buttons that appear at the bottom of a Concierge message
                for example: Invite a user mentioned but not a member of the room
                https://github.com/Expensify/App/issues/32741
            */}
                                    {actionableItemButtons.length > 0 && (<ActionableItemButtons_1.default items={actionableItemButtons} layout={(0, ReportActionsUtils_1.isActionableTrackExpense)(action) || (0, ReportActionsUtils_1.isConciergeCategoryOptions)(action) || (0, ReportActionsUtils_1.isActionableMentionWhisper)(action) ? 'vertical' : 'horizontal'} shouldUseLocalization={!(0, ReportActionsUtils_1.isConciergeCategoryOptions)(action)}/>)}
                                </react_native_1.View>) : (<ReportActionItemMessageEdit_1.default action={action} draftMessage={draftMessage} reportID={reportID} policyID={report?.policyID} index={index} ref={composerTextInputRef} shouldDisableEmojiPicker={((0, ReportUtils_1.chatIncludesConcierge)(report) && (0, User_1.isBlockedFromConcierge)(blockedFromConcierge)) || (0, ReportUtils_1.isArchivedNonExpenseReport)(report, isArchivedRoom)} isGroupPolicyReport={!!report?.policyID && report.policyID !== CONST_1.default.POLICY.ID_FAKE}/>)}
                        </AttachmentContext_1.AttachmentContext.Provider>
                    </ShowContextMenuContext_1.ShowContextMenuContext.Provider>
                </MentionReportContext_1.default.Provider>);
        }
        const numberOfThreadReplies = action.childVisibleActionCount ?? 0;
        const shouldDisplayThreadReplies = (0, ReportUtils_1.shouldDisplayThreadReplies)(action, isThreadReportParentAction) && !isOnSearch;
        const oldestFourAccountIDs = action.childOldestFourAccountIDs
            ?.split(',')
            .map((accountID) => Number(accountID))
            .filter((accountID) => typeof accountID === 'number') ?? [];
        const draftMessageRightAlign = draftMessage !== undefined ? styles.chatItemReactionsDraftRight : {};
        const itemContent = (<>
                {children}
                {Permissions_1.default.canUseLinkPreviews() && !isHidden && (action.linkMetadata?.length ?? 0) > 0 && (<react_native_1.View style={draftMessage !== undefined ? styles.chatItemReactionsDraftRight : {}}>
                        <LinkPreviewer_1.default linkMetadata={action.linkMetadata?.filter((item) => !(0, EmptyObject_1.isEmptyObject)(item))}/>
                    </react_native_1.View>)}
                {!(0, ReportActionsUtils_1.isMessageDeleted)(action) && (<react_native_1.View style={draftMessageRightAlign}>
                        <ReportActionItemEmojiReactions_1.default reportAction={action} emojiReactions={isOnSearch ? {} : emojiReactions} shouldBlockReactions={hasErrors} toggleReaction={(emoji, ignoreSkinToneOnCompare) => {
                    if ((0, Session_1.isAnonymousUser)()) {
                        (0, ReportActionContextMenu_1.hideContextMenu)(false);
                        react_native_1.InteractionManager.runAfterInteractions(() => {
                            (0, Session_1.signOutAndRedirectToSignIn)();
                        });
                    }
                    else {
                        toggleReaction(emoji, ignoreSkinToneOnCompare);
                    }
                }} setIsEmojiPickerActive={setIsEmojiPickerActive}/>
                    </react_native_1.View>)}

                {shouldDisplayThreadReplies && (<react_native_1.View style={draftMessageRightAlign}>
                        <ReportActionItemThread_1.default reportAction={action} reportID={reportID} numberOfReplies={numberOfThreadReplies} mostRecentReply={`${action.childLastVisibleActionCreated}`} isHovered={hovered || isContextMenuActive} accountIDs={oldestFourAccountIDs} onSecondaryInteraction={showPopover} isActive={isReportActionActive && !isContextMenuActive}/>
                    </react_native_1.View>)}
            </>);
        return isEmptyHTML(children) ? emptyHTML : itemContent;
    };
    /**
     * Get ReportActionItem with a proper wrapper
     * @param hovered whether the ReportActionItem is hovered
     * @param isWhisper whether the ReportActionItem is a whisper
     * @param hasErrors whether the report action has any errors
     * @returns report action item
     */
    const renderReportActionItem = (hovered, isWhisper, hasErrors) => {
        const content = renderItemContent(hovered || isContextMenuActive || isEmojiPickerActive, isWhisper, hasErrors);
        if (isEmptyHTML(content) || (!shouldRenderViewBasedOnAction && !isClosedExpenseReportWithNoExpenses)) {
            return emptyHTML;
        }
        if (draftMessage !== undefined) {
            return <ReportActionItemDraft_1.default>{content}</ReportActionItemDraft_1.default>;
        }
        if (!displayAsGroup) {
            return (<ReportActionItemSingle_1.default action={action} showHeader={draftMessage === undefined} wrapperStyle={{
                    ...(isOnSearch && styles.p0),
                    ...(isWhisper && styles.pt1),
                }} report={report} iouReport={iouReport} isHovered={hovered || isContextMenuActive} isActive={isReportActionActive && !isContextMenuActive} hasBeenFlagged={![CONST_1.default.MODERATION.MODERATOR_DECISION_APPROVED, CONST_1.default.MODERATION.MODERATOR_DECISION_PENDING].some((item) => item === moderationDecision) && !(0, ReportActionsUtils_1.isPendingRemove)(action)}>
                    {content}
                </ReportActionItemSingle_1.default>);
        }
        return <ReportActionItemGrouped_1.default wrapperStyle={isWhisper ? styles.pt1 : {}}>{content}</ReportActionItemGrouped_1.default>;
    };
    if (action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED) {
        const transactionID = (0, ReportActionsUtils_1.isMoneyRequestAction)(parentReportActionForTransactionThread) ? (0, ReportActionsUtils_1.getOriginalMessage)(parentReportActionForTransactionThread)?.IOUTransactionID : undefined;
        return (<ReportActionItemContentCreated_1.default contextValue={contextValue} allReports={allReports} parentReportAction={parentReportAction} parentReport={parentReport} transactionID={transactionID} draftMessage={draftMessage} shouldHideThreadDividerLine={shouldHideThreadDividerLine}/>);
    }
    if ((0, ReportActionsUtils_1.isTripPreview)(action) && isThreadReportParentAction) {
        return <TripSummary_1.default reportID={(0, ReportActionsUtils_1.getOriginalMessage)(action)?.linkedReportID}/>;
    }
    if ((0, ReportActionsUtils_1.isChronosOOOListAction)(action)) {
        return (<ChronosOOOListActions_1.default action={action} reportID={reportID}/>);
    }
    // For the `pay` IOU action on non-pay expense flow, we don't want to render anything if `isWaitingOnBankAccount` is true
    // Otherwise, we will see two system messages informing the payee needs to add a bank account or wallet
    if ((0, ReportActionsUtils_1.isMoneyRequestAction)(action) && !!report?.isWaitingOnBankAccount && (0, ReportActionsUtils_1.getOriginalMessage)(action)?.type === CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY && !isSendingMoney) {
        return null;
    }
    // We currently send whispers to all report participants and hide them in the UI for users that shouldn't see them.
    // This is a temporary solution needed for comment-linking.
    // The long term solution will leverage end-to-end encryption and only targeted users will be able to decrypt.
    if ((0, ReportActionsUtils_1.isWhisperActionTargetedToOthers)(action)) {
        return null;
    }
    const hasErrors = !(0, EmptyObject_1.isEmptyObject)(action.errors);
    const whisperedTo = (0, ReportActionsUtils_1.getWhisperedTo)(action);
    const isMultipleParticipant = whisperedTo.length > 1;
    const iouReportID = (0, ReportActionsUtils_1.isMoneyRequestAction)(action) && (0, ReportActionsUtils_1.getOriginalMessage)(action)?.IOUReportID ? (0, ReportActionsUtils_1.getOriginalMessage)(action)?.IOUReportID?.toString() : undefined;
    const transactionsWithReceipts = getTransactionsWithReceipts(iouReportID);
    const isWhisper = whisperedTo.length > 0 && transactionsWithReceipts.length === 0;
    const whisperedToPersonalDetails = isWhisper
        ? Object.values(personalDetails ?? {}).filter((details) => whisperedTo.includes(details?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID))
        : [];
    const isWhisperOnlyVisibleByUser = isWhisper && isCurrentUserTheOnlyParticipant(whisperedTo);
    const displayNamesWithTooltips = isWhisper ? (0, ReportUtils_1.getDisplayNamesWithTooltips)(whisperedToPersonalDetails, isMultipleParticipant, localeCompare) : [];
    const renderSearchHeader = (children) => {
        if (!isOnSearch) {
            return children;
        }
        return (<react_native_1.View style={[styles.p4]}>
                <react_native_1.View style={styles.webViewStyles.tagStyles.ol}>
                    <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, !isWhisper ? styles.mb3 : {}]}>
                        <Text_1.default style={styles.chatItemMessageHeaderPolicy}>{translate('common.in')}&nbsp;</Text_1.default>
                        <TextLink_1.default fontSize={variables_1.default.fontSizeSmall} onPress={() => {
                onPress?.();
            }} numberOfLines={1}>
                            {(0, ReportUtils_1.getChatListItemReportName)(action, report)}
                        </TextLink_1.default>
                    </react_native_1.View>
                    {children}
                </react_native_1.View>
            </react_native_1.View>);
    };
    return (<PressableWithSecondaryInteraction_1.default ref={popoverAnchorRef} onPress={() => {
            if (draftMessage === undefined) {
                onPress?.();
            }
            if (!react_native_1.Keyboard.isVisible()) {
                return;
            }
            react_native_1.Keyboard.dismiss();
        }} style={[action.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE && !isDeletedParentAction ? styles.pointerEventsNone : styles.pointerEventsAuto]} onPressIn={() => shouldUseNarrowLayout && (0, DeviceCapabilities_1.canUseTouchScreen)() && ControlSelection_1.default.block()} onPressOut={() => ControlSelection_1.default.unblock()} onSecondaryInteraction={showPopover} preventDefaultContextMenu={draftMessage === undefined && !hasErrors} withoutFocusOnSecondaryInteraction accessibilityLabel={translate('accessibilityHints.chatMessage')} accessible>
            <Hoverable_1.default shouldHandleScroll isDisabled={draftMessage !== undefined} shouldFreezeCapture={isPaymentMethodPopoverActive} onHoverIn={() => {
            setIsReportActionActive(false);
        }} onHoverOut={() => {
            setIsReportActionActive(!!isReportActionLinked);
        }}>
                {(hovered) => (<react_native_1.View style={highlightedBackgroundColorIfNeeded}>
                        {shouldDisplayNewMarker && (!shouldUseThreadDividerLine || !isFirstVisibleReportAction) && <UnreadActionIndicator_1.default reportActionID={action.reportActionID}/>}
                        {shouldDisplayContextMenu && (<MiniReportActionContextMenu_1.default reportID={reportID} reportActionID={action.reportActionID} anchor={popoverAnchorRef} originalReportID={originalReportID} isArchivedRoom={isArchivedRoom} displayAsGroup={displayAsGroup} disabledActions={disabledActions} isVisible={hovered && draftMessage === undefined && !hasErrors} isThreadReportParentAction={isThreadReportParentAction} draftMessage={draftMessage} isChronosReport={isChronosReport} checkIfContextMenuActive={toggleContextMenuFromActiveReportAction} setIsEmojiPickerActive={setIsEmojiPickerActive}/>)}
                        <react_native_1.View style={StyleUtils.getReportActionItemStyle(hovered || isWhisper || isContextMenuActive || !!isEmojiPickerActive || draftMessage !== undefined || isPaymentMethodPopoverActive, draftMessage === undefined && !!onPress)}>
                            <OfflineWithFeedback_1.default onClose={onClose} dismissError={dismissError} 
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        pendingAction={draftMessage !== undefined ? undefined : (action.pendingAction ?? (action.isOptimisticAction ? CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD : undefined))} shouldHideOnDelete={!isDeletedParentAction} errors={(linkedTransactionRouteError ?? !isOnSearch) ? (0, ErrorUtils_1.getLatestErrorMessageField)(action) : {}} errorRowStyles={[styles.ml10, styles.mr2]} needsOffscreenAlphaCompositing={(0, ReportActionsUtils_1.isMoneyRequestAction)(action)} shouldDisableStrikeThrough>
                                {renderSearchHeader(<>
                                        {isWhisper && (<react_native_1.View style={[styles.flexRow, styles.pl5, styles.pt2, styles.pr3]}>
                                                <react_native_1.View style={[styles.pl6, styles.mr3]}>
                                                    <Icon_1.default fill={theme.icon} src={Expensicons_1.Eye} small/>
                                                </react_native_1.View>
                                                <Text_1.default style={[styles.chatItemMessageHeaderTimestamp]}>
                                                    {translate('reportActionContextMenu.onlyVisible')}
                                                    &nbsp;
                                                </Text_1.default>
                                                <DisplayNames_1.default fullTitle={(0, ReportUtils_1.getWhisperDisplayNames)(whisperedTo) ?? ''} displayNamesWithTooltips={displayNamesWithTooltips} tooltipEnabled numberOfLines={1} textStyles={[styles.chatItemMessageHeaderTimestamp, styles.flex1]} shouldUseFullTitle={isWhisperOnlyVisibleByUser}/>
                                            </react_native_1.View>)}
                                        {renderReportActionItem(!!hovered || !!isReportActionLinked, isWhisper, hasErrors)}
                                    </>)}
                            </OfflineWithFeedback_1.default>
                        </react_native_1.View>
                    </react_native_1.View>)}
            </Hoverable_1.default>
            <react_native_1.View style={styles.reportActionSystemMessageContainer}>
                <InlineSystemMessage_1.default message={action.error}/>
            </react_native_1.View>
            <ConfirmModal_1.default isVisible={showConfirmDismissReceiptError} onConfirm={() => {
            dismissError();
            setShowConfirmDismissReceiptError(false);
        }} onCancel={() => {
            setShowConfirmDismissReceiptError(false);
        }} title={translate('iou.dismissReceiptError')} prompt={translate('iou.dismissReceiptErrorConfirmation')} confirmText={translate('common.dismiss')} cancelText={translate('common.cancel')} shouldShowCancelButton danger/>
        </PressableWithSecondaryInteraction_1.default>);
}
exports.default = (0, react_1.memo)(PureReportActionItem, (prevProps, nextProps) => {
    const prevParentReportAction = prevProps.parentReportAction;
    const nextParentReportAction = nextProps.parentReportAction;
    return (prevProps.displayAsGroup === nextProps.displayAsGroup &&
        prevProps.isMostRecentIOUReportAction === nextProps.isMostRecentIOUReportAction &&
        prevProps.shouldDisplayNewMarker === nextProps.shouldDisplayNewMarker &&
        (0, fast_equals_1.deepEqual)(prevProps.action, nextProps.action) &&
        (0, fast_equals_1.deepEqual)(prevProps.report?.pendingFields, nextProps.report?.pendingFields) &&
        (0, fast_equals_1.deepEqual)(prevProps.report?.isDeletedParentAction, nextProps.report?.isDeletedParentAction) &&
        (0, fast_equals_1.deepEqual)(prevProps.report?.errorFields, nextProps.report?.errorFields) &&
        prevProps.report?.statusNum === nextProps.report?.statusNum &&
        prevProps.report?.stateNum === nextProps.report?.stateNum &&
        prevProps.report?.parentReportID === nextProps.report?.parentReportID &&
        prevProps.report?.parentReportActionID === nextProps.report?.parentReportActionID &&
        // TaskReport's created actions render the TaskView, which updates depending on certain fields in the TaskReport
        (0, ReportUtils_1.isTaskReport)(prevProps.report) === (0, ReportUtils_1.isTaskReport)(nextProps.report) &&
        prevProps.action.actionName === nextProps.action.actionName &&
        prevProps.report?.reportName === nextProps.report?.reportName &&
        prevProps.report?.description === nextProps.report?.description &&
        (0, ReportUtils_1.isCompletedTaskReport)(prevProps.report) === (0, ReportUtils_1.isCompletedTaskReport)(nextProps.report) &&
        prevProps.report?.managerID === nextProps.report?.managerID &&
        prevProps.shouldHideThreadDividerLine === nextProps.shouldHideThreadDividerLine &&
        prevProps.report?.total === nextProps.report?.total &&
        prevProps.report?.nonReimbursableTotal === nextProps.report?.nonReimbursableTotal &&
        prevProps.report?.policyAvatar === nextProps.report?.policyAvatar &&
        prevProps.linkedReportActionID === nextProps.linkedReportActionID &&
        (0, fast_equals_1.deepEqual)(prevProps.report?.fieldList, nextProps.report?.fieldList) &&
        (0, fast_equals_1.deepEqual)(prevProps.transactionThreadReport, nextProps.transactionThreadReport) &&
        (0, fast_equals_1.deepEqual)(prevProps.reportActions, nextProps.reportActions) &&
        (0, fast_equals_1.deepEqual)(prevParentReportAction, nextParentReportAction) &&
        prevProps.draftMessage === nextProps.draftMessage &&
        prevProps.iouReport?.reportID === nextProps.iouReport?.reportID &&
        (0, fast_equals_1.deepEqual)(prevProps.emojiReactions, nextProps.emojiReactions) &&
        (0, fast_equals_1.deepEqual)(prevProps.linkedTransactionRouteError, nextProps.linkedTransactionRouteError) &&
        prevProps.isUserValidated === nextProps.isUserValidated &&
        prevProps.parentReport?.reportID === nextProps.parentReport?.reportID &&
        (0, fast_equals_1.deepEqual)(prevProps.personalDetails, nextProps.personalDetails) &&
        (0, fast_equals_1.deepEqual)(prevProps.blockedFromConcierge, nextProps.blockedFromConcierge) &&
        prevProps.originalReportID === nextProps.originalReportID &&
        prevProps.isArchivedRoom === nextProps.isArchivedRoom &&
        prevProps.isChronosReport === nextProps.isChronosReport &&
        prevProps.isClosedExpenseReportWithNoExpenses === nextProps.isClosedExpenseReportWithNoExpenses &&
        (0, fast_equals_1.deepEqual)(prevProps.missingPaymentMethod, nextProps.missingPaymentMethod) &&
        prevProps.reimbursementDeQueuedOrCanceledActionMessage === nextProps.reimbursementDeQueuedOrCanceledActionMessage &&
        prevProps.modifiedExpenseMessage === nextProps.modifiedExpenseMessage &&
        prevProps.shouldHighlight === nextProps.shouldHighlight &&
        prevProps.userBillingFundID === nextProps.userBillingFundID);
});
