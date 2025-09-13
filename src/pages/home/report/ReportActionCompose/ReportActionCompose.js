"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onSubmitAction = void 0;
const debounce_1 = require("lodash/debounce");
const noop_1 = require("lodash/noop");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const ActionSheetAwareScrollView = require("@components/ActionSheetAwareScrollView");
const AttachmentComposerModal_1 = require("@components/AttachmentComposerModal");
const Consumer_1 = require("@components/DragAndDrop/Consumer");
const DropZoneUI_1 = require("@components/DropZone/DropZoneUI");
const DualDropZone_1 = require("@components/DropZone/DualDropZone");
const EmojiPickerButton_1 = require("@components/EmojiPicker/EmojiPickerButton");
const ExceededCommentLength_1 = require("@components/ExceededCommentLength");
const Expensicons = require("@components/Icon/Expensicons");
const ImportedStateIndicator_1 = require("@components/ImportedStateIndicator");
const OfflineIndicator_1 = require("@components/OfflineIndicator");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useDebounce_1 = require("@hooks/useDebounce");
const useFilesValidation_1 = require("@hooks/useFilesValidation");
const useHandleExceedMaxCommentLength_1 = require("@hooks/useHandleExceedMaxCommentLength");
const useHandleExceedMaxTaskTitleLength_1 = require("@hooks/useHandleExceedMaxTaskTitleLength");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const canFocusInputOnScreenFocus_1 = require("@libs/canFocusInputOnScreenFocus");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const DomUtils_1 = require("@libs/DomUtils");
const DraftCommentUtils_1 = require("@libs/DraftCommentUtils");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const Performance_1 = require("@libs/Performance");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const willBlurTextInputOnTapOutside_1 = require("@libs/willBlurTextInputOnTapOutside");
const Navigation_1 = require("@navigation/Navigation");
const AgentZeroProcessingRequestIndicator_1 = require("@pages/home/report/AgentZeroProcessingRequestIndicator");
const ParticipantLocalTime_1 = require("@pages/home/report/ParticipantLocalTime");
const ReportTypingIndicator_1 = require("@pages/home/report/ReportTypingIndicator");
const EmojiPickerAction_1 = require("@userActions/EmojiPickerAction");
const IOU_1 = require("@userActions/IOU");
const Report_1 = require("@userActions/Report");
const Timing_1 = require("@userActions/Timing");
const TransactionEdit_1 = require("@userActions/TransactionEdit");
const User_1 = require("@userActions/User");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const AttachmentPickerWithMenuItems_1 = require("./AttachmentPickerWithMenuItems");
const ComposerWithSuggestions_1 = require("./ComposerWithSuggestions");
const SendButton_1 = require("./SendButton");
// We want consistent auto focus behavior on input between native and mWeb so we have some auto focus management code that will
// prevent auto focus on existing chat for mobile device
const shouldFocusInputOnScreenFocus = (0, canFocusInputOnScreenFocus_1.default)();
const willBlurTextInputOnTapOutside = (0, willBlurTextInputOnTapOutside_1.default)();
// eslint-disable-next-line import/no-mutable-exports
let onSubmitAction = noop_1.default;
exports.onSubmitAction = onSubmitAction;
function ReportActionCompose({ isComposerFullSize = false, onSubmit, pendingAction, report, reportID, lastReportAction, onComposerFocus, onComposerBlur, didHideComposerInput, reportTransactions, }) {
    const actionSheetAwareScrollViewContext = (0, react_1.useContext)(ActionSheetAwareScrollView.ActionSheetAwareScrollViewContext);
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth, isMediumScreenWidth, shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const actionButtonRef = (0, react_1.useRef)(null);
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const [blockedFromConcierge] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_BLOCKED_FROM_CONCIERGE, { canBeMissing: true });
    const [currentDate] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CURRENT_DATE, { canBeMissing: true });
    const [shouldShowComposeInput = true] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SHOULD_SHOW_COMPOSE_INPUT, { canBeMissing: true });
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${report?.policyID}`, { canBeMissing: true });
    const [initialModalState] = (0, useOnyx_1.default)(ONYXKEYS_1.default.MODAL, { canBeMissing: true });
    const [newParentReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.parentReportID}`, { canBeMissing: true });
    /**
     * Updates the Highlight state of the composer
     */
    const [isFocused, setIsFocused] = (0, react_1.useState)(() => {
        return shouldFocusInputOnScreenFocus && shouldShowComposeInput && !initialModalState?.isVisible && !initialModalState?.willAlertModalBecomeVisible;
    });
    const [isFullComposerAvailable, setIsFullComposerAvailable] = (0, react_1.useState)(isComposerFullSize);
    // A flag to indicate whether the onScroll callback is likely triggered by a layout change (caused by text change) or not
    const isScrollLikelyLayoutTriggered = (0, react_1.useRef)(false);
    /**
     * Reset isScrollLikelyLayoutTriggered to false.
     *
     * The function is debounced with a handpicked wait time to address 2 issues:
     * 1. There is a slight delay between onChangeText and onScroll
     * 2. Layout change will trigger onScroll multiple times
     */
    const debouncedLowerIsScrollLikelyLayoutTriggered = (0, useDebounce_1.default)((0, react_1.useCallback)(() => (isScrollLikelyLayoutTriggered.current = false), []), 500);
    const raiseIsScrollLikelyLayoutTriggered = (0, react_1.useCallback)(() => {
        isScrollLikelyLayoutTriggered.current = true;
        debouncedLowerIsScrollLikelyLayoutTriggered();
    }, [debouncedLowerIsScrollLikelyLayoutTriggered]);
    const [isCommentEmpty, setIsCommentEmpty] = (0, react_1.useState)(() => {
        const draftComment = (0, DraftCommentUtils_1.getDraftComment)(reportID);
        return !draftComment || !!draftComment.match(CONST_1.default.REGEX.EMPTY_COMMENT);
    });
    /**
     * Updates the visibility state of the menu
     */
    const [isMenuVisible, setMenuVisibility] = (0, react_1.useState)(false);
    const [isAttachmentPreviewActive, setIsAttachmentPreviewActive] = (0, react_1.useState)(false);
    /**
     * Updates the composer when the comment length is exceeded
     * Shows red borders and prevents the comment from being sent
     */
    const { hasExceededMaxCommentLength, validateCommentMaxLength, setHasExceededMaxCommentLength } = (0, useHandleExceedMaxCommentLength_1.default)();
    const { hasExceededMaxTaskTitleLength, validateTaskTitleMaxLength, setHasExceededMaxTitleLength } = (0, useHandleExceedMaxTaskTitleLength_1.default)();
    const [exceededMaxLength, setExceededMaxLength] = (0, react_1.useState)(null);
    const suggestionsRef = (0, react_1.useRef)(null);
    const composerRef = (0, react_1.useRef)(undefined);
    const reportParticipantIDs = (0, react_1.useMemo)(() => Object.keys(report?.participants ?? {})
        .map(Number)
        .filter((accountID) => accountID !== currentUserPersonalDetails.accountID), [currentUserPersonalDetails.accountID, report?.participants]);
    const shouldShowReportRecipientLocalTime = (0, react_1.useMemo)(() => (0, ReportUtils_1.canShowReportRecipientLocalTime)(personalDetails, report, currentUserPersonalDetails.accountID) && !isComposerFullSize, [personalDetails, report, currentUserPersonalDetails.accountID, isComposerFullSize]);
    const includesConcierge = (0, react_1.useMemo)(() => (0, ReportUtils_1.chatIncludesConcierge)({ participants: report?.participants }), [report?.participants]);
    const userBlockedFromConcierge = (0, react_1.useMemo)(() => (0, User_1.isBlockedFromConcierge)(blockedFromConcierge), [blockedFromConcierge]);
    const isBlockedFromConcierge = (0, react_1.useMemo)(() => includesConcierge && userBlockedFromConcierge, [includesConcierge, userBlockedFromConcierge]);
    const isReportArchived = (0, useReportIsArchived_1.default)(report?.reportID);
    const isTransactionThreadView = (0, react_1.useMemo)(() => (0, ReportUtils_1.isReportTransactionThread)(report), [report]);
    const isExpensesReport = (0, react_1.useMemo)(() => reportTransactions && reportTransactions.length > 1, [reportTransactions]);
    const [reportActions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report?.reportID}`, {
        canEvict: false,
        canBeMissing: true,
    });
    const personalDetail = (0, useCurrentUserPersonalDetails_1.default)();
    const iouAction = reportActions ? Object.values(reportActions).find((action) => (0, ReportActionsUtils_1.isMoneyRequestAction)(action)) : null;
    const linkedTransactionID = iouAction && !isExpensesReport ? (0, ReportActionsUtils_1.getLinkedTransactionID)(iouAction) : undefined;
    const transactionID = (0, react_1.useMemo)(() => (0, TransactionUtils_1.getTransactionID)(reportID) ?? linkedTransactionID, [reportID, linkedTransactionID]);
    const [transaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${(0, getNonEmptyStringOnyxID_1.default)(transactionID)}`, { canBeMissing: true });
    const isSingleTransactionView = (0, react_1.useMemo)(() => !!transaction && !!reportTransactions && reportTransactions.length === 1, [transaction, reportTransactions]);
    const shouldAddOrReplaceReceipt = (isTransactionThreadView || isSingleTransactionView) && ((0, TransactionUtils_1.isManualDistanceRequest)(transaction) || !(0, TransactionUtils_1.isDistanceRequest)(transaction));
    const hasReceipt = (0, react_1.useMemo)(() => (0, TransactionUtils_1.hasReceipt)(transaction), [transaction]);
    const shouldDisplayDualDropZone = (0, react_1.useMemo)(() => {
        const parentReport = (0, ReportUtils_1.getParentReport)(report);
        const isSettledOrApproved = (0, ReportUtils_1.isSettled)(report) || (0, ReportUtils_1.isSettled)(parentReport) || (0, ReportUtils_1.isReportApproved)({ report }) || (0, ReportUtils_1.isReportApproved)({ report: parentReport });
        const hasMoneyRequestOptions = !!(0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, policy, reportParticipantIDs, isReportArchived).length;
        const canModifyReceipt = shouldAddOrReplaceReceipt && !isSettledOrApproved;
        const isRoomOrGroupChat = (0, ReportUtils_1.isChatRoom)(report) || (0, ReportUtils_1.isGroupChat)(report);
        return !isRoomOrGroupChat && (canModifyReceipt || hasMoneyRequestOptions);
    }, [shouldAddOrReplaceReceipt, report, reportParticipantIDs, policy, isReportArchived]);
    // Placeholder to display in the chat input.
    const inputPlaceholder = (0, react_1.useMemo)(() => {
        if (includesConcierge && userBlockedFromConcierge) {
            return translate('reportActionCompose.blockedFromConcierge');
        }
        return translate('reportActionCompose.writeSomething');
    }, [includesConcierge, translate, userBlockedFromConcierge]);
    const focus = () => {
        if (composerRef.current === null) {
            return;
        }
        composerRef.current?.focus(true);
    };
    const isKeyboardVisibleWhenShowingModalRef = (0, react_1.useRef)(false);
    const isNextModalWillOpenRef = (0, react_1.useRef)(false);
    const containerRef = (0, react_1.useRef)(null);
    const measureContainer = (0, react_1.useCallback)((callback) => {
        if (!containerRef.current) {
            return;
        }
        containerRef.current.measureInWindow(callback);
    }, 
    // We added isComposerFullSize in dependencies so that when this value changes, we recalculate the position of the popup
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    [isComposerFullSize]);
    const onAddActionPressed = (0, react_1.useCallback)(() => {
        if (!willBlurTextInputOnTapOutside) {
            isKeyboardVisibleWhenShowingModalRef.current = !!composerRef.current?.isFocused();
        }
        composerRef.current?.blur();
    }, []);
    const onItemSelected = (0, react_1.useCallback)(() => {
        isKeyboardVisibleWhenShowingModalRef.current = false;
    }, []);
    const updateShouldShowSuggestionMenuToFalse = (0, react_1.useCallback)(() => {
        if (!suggestionsRef.current) {
            return;
        }
        suggestionsRef.current.updateShouldShowSuggestionMenuToFalse(false);
    }, []);
    const attachmentFileRef = (0, react_1.useRef)(null);
    const addAttachment = (0, react_1.useCallback)((file) => {
        attachmentFileRef.current = file;
        const clear = composerRef.current?.clear;
        if (!clear) {
            throw new Error('The composerRef.clear function is not set yet. This should never happen, and indicates a developer error.');
        }
        (0, react_native_reanimated_1.runOnUI)(clear)();
    }, []);
    /**
     * Event handler to update the state after the attachment preview is closed.
     */
    const onAttachmentPreviewClose = (0, react_1.useCallback)(() => {
        updateShouldShowSuggestionMenuToFalse();
        setIsAttachmentPreviewActive(false);
    }, [updateShouldShowSuggestionMenuToFalse]);
    /**
     * Add a new comment to this chat
     */
    const submitForm = (0, react_1.useCallback)((newComment) => {
        const newCommentTrimmed = newComment.trim();
        if (attachmentFileRef.current) {
            if (Array.isArray(attachmentFileRef.current)) {
                // Handle multiple files
                attachmentFileRef.current.forEach((file) => {
                    (0, Report_1.addAttachment)(reportID, file, personalDetail.timezone ?? CONST_1.default.DEFAULT_TIME_ZONE, newCommentTrimmed, true);
                });
            }
            else {
                // Handle single file
                (0, Report_1.addAttachment)(reportID, attachmentFileRef.current, personalDetail.timezone ?? CONST_1.default.DEFAULT_TIME_ZONE, newCommentTrimmed, true);
            }
            attachmentFileRef.current = null;
        }
        else {
            Performance_1.default.markStart(CONST_1.default.TIMING.SEND_MESSAGE, { message: newCommentTrimmed });
            Timing_1.default.start(CONST_1.default.TIMING.SEND_MESSAGE);
            onSubmit(newCommentTrimmed);
        }
    }, [onSubmit, reportID, personalDetail.timezone]);
    const onTriggerAttachmentPicker = (0, react_1.useCallback)(() => {
        isNextModalWillOpenRef.current = true;
        isKeyboardVisibleWhenShowingModalRef.current = true;
    }, []);
    const onBlur = (0, react_1.useCallback)((event) => {
        const webEvent = event;
        setIsFocused(false);
        onComposerBlur?.();
        if (suggestionsRef.current) {
            suggestionsRef.current.resetSuggestions();
        }
        if (webEvent.relatedTarget && webEvent.relatedTarget === actionButtonRef.current) {
            isKeyboardVisibleWhenShowingModalRef.current = true;
        }
    }, [onComposerBlur]);
    const onFocus = (0, react_1.useCallback)(() => {
        setIsFocused(true);
        onComposerFocus?.();
    }, [onComposerFocus]);
    (0, react_1.useEffect)(() => {
        if (hasExceededMaxTaskTitleLength) {
            setExceededMaxLength(CONST_1.default.TITLE_CHARACTER_LIMIT);
        }
        else if (hasExceededMaxCommentLength) {
            setExceededMaxLength(CONST_1.default.MAX_COMMENT_LENGTH);
        }
        else {
            setExceededMaxLength(null);
        }
    }, [hasExceededMaxTaskTitleLength, hasExceededMaxCommentLength]);
    // We are returning a callback here as we want to invoke the method on unmount only
    (0, react_1.useEffect)(() => () => {
        if (!(0, EmojiPickerAction_1.isActive)(report?.reportID)) {
            return;
        }
        (0, EmojiPickerAction_1.hideEmojiPicker)();
    }, 
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    []);
    // When we invite someone to a room they don't have the policy object, but we still want them to be able to mention other reports they are members of, so we only check if the policyID in the report is from a workspace
    const isGroupPolicyReport = (0, react_1.useMemo)(() => !!report?.policyID && report.policyID !== CONST_1.default.POLICY.ID_FAKE, [report]);
    const reportRecipientAccountIDs = (0, ReportUtils_1.getReportRecipientAccountIDs)(report, currentUserPersonalDetails.accountID);
    const reportRecipient = personalDetails?.[reportRecipientAccountIDs[0]];
    const shouldUseFocusedColor = !isBlockedFromConcierge && isFocused;
    const hasReportRecipient = !(0, EmptyObject_1.isEmptyObject)(reportRecipient);
    const isSendDisabled = isCommentEmpty || isBlockedFromConcierge || !!exceededMaxLength;
    // Note: using JS refs is not well supported in reanimated, thus we need to store the function in a shared value
    // useSharedValue on web doesn't support functions, so we need to wrap it in an object.
    const composerRefShared = (0, react_native_reanimated_1.useSharedValue)({ clear: undefined });
    const handleSendMessage = (0, react_1.useCallback)(() => {
        'worklet';
        const clearComposer = composerRefShared.get().clear;
        if (!clearComposer) {
            throw new Error('The composerRefShared.clear function is not set yet. This should never happen, and indicates a developer error.');
        }
        if (isSendDisabled) {
            return;
        }
        // This will cause onCleared to be triggered where we actually send the message
        clearComposer();
    }, [isSendDisabled, composerRefShared]);
    const measureComposer = (0, react_1.useCallback)((e) => {
        actionSheetAwareScrollViewContext.transitionActionSheetState({
            type: ActionSheetAwareScrollView.Actions.MEASURE_COMPOSER,
            payload: {
                composerHeight: e.nativeEvent.layout.height,
            },
        });
    }, [actionSheetAwareScrollViewContext]);
    // eslint-disable-next-line react-compiler/react-compiler
    exports.onSubmitAction = onSubmitAction = handleSendMessage;
    const emojiPositionValues = (0, react_1.useMemo)(() => ({
        secondaryRowHeight: styles.chatItemComposeSecondaryRow.height,
        secondaryRowMarginTop: styles.chatItemComposeSecondaryRow.marginTop,
        secondaryRowMarginBottom: styles.chatItemComposeSecondaryRow.marginBottom,
        composeBoxMinHeight: styles.chatItemComposeBox.minHeight,
        emojiButtonHeight: styles.chatItemEmojiButton.height,
    }), [
        styles.chatItemComposeSecondaryRow.height,
        styles.chatItemComposeSecondaryRow.marginTop,
        styles.chatItemComposeSecondaryRow.marginBottom,
        styles.chatItemComposeBox.minHeight,
        styles.chatItemEmojiButton.height,
    ]);
    const emojiShiftVertical = (0, react_1.useMemo)(() => {
        const chatItemComposeSecondaryRowHeight = emojiPositionValues.secondaryRowHeight + emojiPositionValues.secondaryRowMarginTop + emojiPositionValues.secondaryRowMarginBottom;
        const reportActionComposeHeight = emojiPositionValues.composeBoxMinHeight + chatItemComposeSecondaryRowHeight;
        const emojiOffsetWithComposeBox = (emojiPositionValues.composeBoxMinHeight - emojiPositionValues.emojiButtonHeight) / 2;
        return reportActionComposeHeight - emojiOffsetWithComposeBox - CONST_1.default.MENU_POSITION_REPORT_ACTION_COMPOSE_BOTTOM;
    }, [emojiPositionValues]);
    const validateMaxLength = (0, react_1.useCallback)((value) => {
        const taskCommentMatch = value?.match(CONST_1.default.REGEX.TASK_TITLE_WITH_OPTIONAL_SHORT_MENTION);
        if (taskCommentMatch) {
            const title = taskCommentMatch?.[3] ? taskCommentMatch[3].trim().replace(/\n/g, ' ') : '';
            setHasExceededMaxCommentLength(false);
            validateTaskTitleMaxLength(title);
        }
        else {
            setHasExceededMaxTitleLength(false);
            validateCommentMaxLength(value, { reportID });
        }
    }, [setHasExceededMaxCommentLength, setHasExceededMaxTitleLength, validateTaskTitleMaxLength, validateCommentMaxLength, reportID]);
    const debouncedValidate = (0, react_1.useMemo)(() => (0, debounce_1.default)(validateMaxLength, CONST_1.default.TIMING.COMMENT_LENGTH_DEBOUNCE_TIME, { leading: true }), [validateMaxLength]);
    const onValueChange = (0, react_1.useCallback)((value) => {
        if (value.length === 0 && isComposerFullSize) {
            (0, Report_1.setIsComposerFullSize)(reportID, false);
        }
        debouncedValidate(value);
    }, [isComposerFullSize, reportID, debouncedValidate]);
    const saveFileAndInitMoneyRequest = (files) => {
        if (files.length === 0) {
            return;
        }
        if (shouldAddOrReplaceReceipt && transactionID) {
            const source = URL.createObjectURL(files.at(0));
            (0, IOU_1.replaceReceipt)({ transactionID, file: files.at(0), source });
        }
        else {
            const initialTransaction = (0, IOU_1.initMoneyRequest)({
                reportID,
                newIouRequestType: CONST_1.default.IOU.REQUEST_TYPE.SCAN,
                report,
                parentReport: newParentReport,
                currentDate,
            });
            files.forEach((file, index) => {
                const source = URL.createObjectURL(file);
                const newTransaction = index === 0
                    ? initialTransaction
                    : (0, TransactionEdit_1.buildOptimisticTransactionAndCreateDraft)({
                        initialTransaction: initialTransaction,
                        currentUserPersonalDetails,
                        reportID,
                    });
                const newTransactionID = newTransaction?.transactionID ?? CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID;
                (0, IOU_1.setMoneyRequestReceipt)(newTransactionID, source, file.name ?? '', true);
                (0, IOU_1.setMoneyRequestParticipantsFromReport)(newTransactionID, report);
            });
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(CONST_1.default.IOU.ACTION.CREATE, (0, ReportUtils_1.isSelfDM)(report) ? CONST_1.default.IOU.TYPE.TRACK : CONST_1.default.IOU.TYPE.SUBMIT, CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID, reportID));
        }
    };
    const { validateFiles, PDFValidationComponent, ErrorModal } = (0, useFilesValidation_1.default)(saveFileAndInitMoneyRequest);
    const handleAddingReceipt = (e) => {
        if (policy && (0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(policy.id)) {
            Navigation_1.default.navigate(ROUTES_1.default.RESTRICTED_ACTION.getRoute(policy.id));
            return;
        }
        if (shouldAddOrReplaceReceipt && transactionID) {
            const file = e?.dataTransfer?.files?.[0];
            if (file) {
                file.uri = URL.createObjectURL(file);
                validateFiles([file], Array.from(e.dataTransfer?.items ?? []));
                return;
            }
        }
        const files = Array.from(e?.dataTransfer?.files ?? []);
        if (files.length === 0) {
            return;
        }
        files.forEach((file) => {
            // eslint-disable-next-line no-param-reassign
            file.uri = URL.createObjectURL(file);
        });
        validateFiles(files, Array.from(e.dataTransfer?.items ?? []));
    };
    return (<react_native_1.View style={[shouldShowReportRecipientLocalTime && !isOffline && styles.chatItemComposeWithFirstRow, isComposerFullSize && styles.chatItemFullComposeRow]}>
            <OfflineWithFeedback_1.default pendingAction={pendingAction}>
                {shouldShowReportRecipientLocalTime && hasReportRecipient && <ParticipantLocalTime_1.default participant={reportRecipient}/>}
            </OfflineWithFeedback_1.default>
            <react_native_1.View onLayout={measureComposer} style={isComposerFullSize ? styles.flex1 : {}}>
                <OfflineWithFeedback_1.default shouldDisableOpacity pendingAction={pendingAction} style={isComposerFullSize ? styles.chatItemFullComposeRow : {}} contentContainerStyle={isComposerFullSize ? styles.flex1 : {}}>
                    <react_native_1.View ref={containerRef} style={[
            shouldUseFocusedColor ? styles.chatItemComposeBoxFocusedColor : styles.chatItemComposeBoxColor,
            styles.flexRow,
            styles.chatItemComposeBox,
            isComposerFullSize && styles.chatItemFullComposeBox,
            !!exceededMaxLength && styles.borderColorDanger,
        ]}>
                        {PDFValidationComponent}
                        <AttachmentComposerModal_1.default headerTitle={translate('reportActionCompose.sendAttachment')} onConfirm={addAttachment} onModalShow={() => setIsAttachmentPreviewActive(true)} onModalHide={onAttachmentPreviewClose} shouldDisableSendButton={!!exceededMaxLength} report={report}>
                            {({ displayFilesInModal }) => {
            const handleAttachmentDrop = (event) => {
                if (isAttachmentPreviewActive) {
                    return;
                }
                if (event.dataTransfer?.files.length && event.dataTransfer?.files.length > 1) {
                    const files = Array.from(event.dataTransfer?.files).map((file) => {
                        // eslint-disable-next-line no-param-reassign
                        file.uri = URL.createObjectURL(file);
                        return file;
                    });
                    displayFilesInModal(files, Array.from(event.dataTransfer?.items ?? []));
                    return;
                }
                const data = event.dataTransfer?.files[0];
                if (data) {
                    data.uri = URL.createObjectURL(data);
                    displayFilesInModal([data], Array.from(event.dataTransfer?.items ?? []));
                }
            };
            return (<>
                                        <AttachmentPickerWithMenuItems_1.default displayFilesInModal={displayFilesInModal} reportID={reportID} report={report} currentUserPersonalDetails={currentUserPersonalDetails} reportParticipantIDs={reportParticipantIDs} isFullComposerAvailable={isFullComposerAvailable} isComposerFullSize={isComposerFullSize} disabled={isBlockedFromConcierge} setMenuVisibility={setMenuVisibility} isMenuVisible={isMenuVisible} onTriggerAttachmentPicker={onTriggerAttachmentPicker} raiseIsScrollLikelyLayoutTriggered={raiseIsScrollLikelyLayoutTriggered} onAddActionPressed={onAddActionPressed} onItemSelected={onItemSelected} onCanceledAttachmentPicker={() => {
                    if (!shouldFocusInputOnScreenFocus) {
                        return;
                    }
                    focus();
                }} actionButtonRef={actionButtonRef} shouldDisableAttachmentItem={!!exceededMaxLength}/>
                                        <ComposerWithSuggestions_1.default ref={(ref) => {
                    composerRef.current = ref ?? undefined;
                    composerRefShared.set({
                        clear: ref?.clear,
                    });
                }} suggestionsRef={suggestionsRef} isNextModalWillOpenRef={isNextModalWillOpenRef} isScrollLikelyLayoutTriggered={isScrollLikelyLayoutTriggered} raiseIsScrollLikelyLayoutTriggered={raiseIsScrollLikelyLayoutTriggered} reportID={reportID} policyID={report?.policyID} includeChronos={(0, ReportUtils_1.chatIncludesChronos)(report)} isGroupPolicyReport={isGroupPolicyReport} lastReportAction={lastReportAction} isMenuVisible={isMenuVisible} inputPlaceholder={inputPlaceholder} isComposerFullSize={isComposerFullSize} setIsFullComposerAvailable={setIsFullComposerAvailable} displayFilesInModal={displayFilesInModal} onCleared={submitForm} disabled={isBlockedFromConcierge} setIsCommentEmpty={setIsCommentEmpty} handleSendMessage={handleSendMessage} shouldShowComposeInput={shouldShowComposeInput} onFocus={onFocus} onBlur={onBlur} measureParentContainer={measureContainer} onValueChange={onValueChange} didHideComposerInput={didHideComposerInput}/>
                                        {shouldDisplayDualDropZone && (<DualDropZone_1.default isEditing={shouldAddOrReplaceReceipt && hasReceipt} onAttachmentDrop={handleAttachmentDrop} onReceiptDrop={handleAddingReceipt} shouldAcceptSingleReceipt={shouldAddOrReplaceReceipt}/>)}
                                        {!shouldDisplayDualDropZone && (<Consumer_1.default onDrop={handleAttachmentDrop}>
                                                <DropZoneUI_1.default icon={Expensicons.MessageInABottle} dropTitle={translate('dropzone.addAttachments')} dropStyles={styles.attachmentDropOverlay(true)} dropTextStyles={styles.attachmentDropText} dashedBorderStyles={styles.activeDropzoneDashedBorder(theme.attachmentDropBorderColorActive, true)}/>
                                            </Consumer_1.default>)}
                                    </>);
        }}
                        </AttachmentComposerModal_1.default>
                        {(0, DeviceCapabilities_1.canUseTouchScreen)() && isMediumScreenWidth ? null : (<EmojiPickerButton_1.default isDisabled={isBlockedFromConcierge} onModalHide={(isNavigating) => {
                if (isNavigating) {
                    return;
                }
                const activeElementId = DomUtils_1.default.getActiveElement()?.id;
                if (activeElementId === CONST_1.default.COMPOSER.NATIVE_ID || activeElementId === CONST_1.default.EMOJI_PICKER_BUTTON_NATIVE_ID) {
                    return;
                }
                focus();
            }} onEmojiSelected={(...args) => composerRef.current?.replaceSelectionWithText(...args)} emojiPickerID={report?.reportID} shiftVertical={emojiShiftVertical}/>)}
                        <SendButton_1.default isDisabled={isSendDisabled} handleSendMessage={handleSendMessage}/>
                    </react_native_1.View>
                    {ErrorModal}
                    <react_native_1.View style={[
            styles.flexRow,
            styles.justifyContentBetween,
            styles.alignItemsCenter,
            (!isSmallScreenWidth || (isSmallScreenWidth && !isOffline)) && styles.chatItemComposeSecondaryRow,
        ]}>
                        {!shouldUseNarrowLayout && <OfflineIndicator_1.default containerStyles={[styles.chatItemComposeSecondaryRow]}/>}
                        <AgentZeroProcessingRequestIndicator_1.default reportID={reportID}/>
                        <ReportTypingIndicator_1.default reportID={reportID}/>
                        {!!exceededMaxLength && (<ExceededCommentLength_1.default maxCommentLength={exceededMaxLength} isTaskTitle={hasExceededMaxTaskTitleLength}/>)}
                    </react_native_1.View>
                </OfflineWithFeedback_1.default>
                {!isSmallScreenWidth && (<react_native_1.View style={[styles.mln5, styles.mrn5]}>
                        <ImportedStateIndicator_1.default />
                    </react_native_1.View>)}
            </react_native_1.View>
        </react_native_1.View>);
}
ReportActionCompose.displayName = 'ReportActionCompose';
exports.default = (0, react_1.memo)(ReportActionCompose);
