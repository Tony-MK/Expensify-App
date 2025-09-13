"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const ActionSheetAwareScrollView_1 = require("@components/ActionSheetAwareScrollView");
const ConfirmModal_1 = require("@components/ConfirmModal");
const PopoverWithMeasuredContent_1 = require("@components/PopoverWithMeasuredContent");
const useDuplicateTransactionsAndViolations_1 = require("@hooks/useDuplicateTransactionsAndViolations");
const useLocalize_1 = require("@hooks/useLocalize");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const IOU_1 = require("@libs/actions/IOU");
const Report_1 = require("@libs/actions/Report");
const calculateAnchorPosition_1 = require("@libs/calculateAnchorPosition");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const CONST_1 = require("@src/CONST");
const BaseReportActionContextMenu_1 = require("./BaseReportActionContextMenu");
function extractPointerEvent(event) {
    if ('nativeEvent' in event) {
        return event.nativeEvent;
    }
    return event;
}
function PopoverReportActionContextMenu(_props, ref) {
    const { translate } = (0, useLocalize_1.default)();
    const reportIDRef = (0, react_1.useRef)(undefined);
    const typeRef = (0, react_1.useRef)(undefined);
    const reportActionRef = (0, react_1.useRef)(null);
    const reportActionIDRef = (0, react_1.useRef)(undefined);
    const originalReportIDRef = (0, react_1.useRef)(undefined);
    const selectionRef = (0, react_1.useRef)('');
    const reportActionDraftMessageRef = (0, react_1.useRef)(undefined);
    const isReportArchived = (0, useReportIsArchived_1.default)(reportIDRef.current);
    const cursorRelativePosition = (0, react_1.useRef)({
        horizontal: 0,
        vertical: 0,
    });
    // The horizontal and vertical position (relative to the screen) where the popover will display.
    const popoverAnchorPosition = (0, react_1.useRef)({
        horizontal: 0,
        vertical: 0,
    });
    const actionSheetAwareScrollViewContext = (0, react_1.useContext)(ActionSheetAwareScrollView_1.ActionSheetAwareScrollViewContext);
    const instanceIDRef = (0, react_1.useRef)('');
    const [isPopoverVisible, setIsPopoverVisible] = (0, react_1.useState)(false);
    const [isDeleteCommentConfirmModalVisible, setIsDeleteCommentConfirmModalVisible] = (0, react_1.useState)(false);
    const [shouldSetModalVisibilityForDeleteConfirmation, setShouldSetModalVisibilityForDeleteConfirmation] = (0, react_1.useState)(true);
    const [isRoomArchived, setIsRoomArchived] = (0, react_1.useState)(false);
    const [isChronosReportEnabled, setIsChronosReportEnabled] = (0, react_1.useState)(false);
    const [isChatPinned, setIsChatPinned] = (0, react_1.useState)(false);
    const [hasUnreadMessages, setHasUnreadMessages] = (0, react_1.useState)(false);
    const [isThreadReportParentAction, setIsThreadReportParentAction] = (0, react_1.useState)(false);
    const [disabledActions, setDisabledActions] = (0, react_1.useState)([]);
    const [shouldSwitchPositionIfOverflow, setShouldSwitchPositionIfOverflow] = (0, react_1.useState)(false);
    const [isWithoutOverlay, setIsWithoutOverlay] = (0, react_1.useState)(true);
    const contentRef = (0, react_1.useRef)(null);
    const anchorRef = (0, react_1.useRef)(null);
    const dimensionsEventListener = (0, react_1.useRef)(null);
    const contextMenuAnchorRef = (0, react_1.useRef)(null);
    const contextMenuTargetNode = (0, react_1.useRef)(null);
    const contextMenuDimensions = (0, react_1.useRef)({
        width: 0,
        height: 0,
    });
    const onPopoverShow = (0, react_1.useRef)(() => { });
    const [isContextMenuOpening, setIsContextMenuOpening] = (0, react_1.useState)(false);
    const onPopoverHide = (0, react_1.useRef)(() => { });
    const onEmojiPickerToggle = (0, react_1.useRef)(undefined);
    const onCancelDeleteModal = (0, react_1.useRef)(() => { });
    const onConfirmDeleteModal = (0, react_1.useRef)(() => { });
    const onPopoverHideActionCallback = (0, react_1.useRef)(() => { });
    const callbackWhenDeleteModalHide = (0, react_1.useRef)(() => { });
    /** Get the Context menu anchor position. We calculate the anchor coordinates from measureInWindow async method */
    const getContextMenuMeasuredLocation = (0, react_1.useCallback)(() => new Promise((resolve) => {
        if (contextMenuAnchorRef.current && 'measureInWindow' in contextMenuAnchorRef.current && typeof contextMenuAnchorRef.current.measureInWindow === 'function') {
            contextMenuAnchorRef.current.measureInWindow((x, y) => resolve({ x, y }));
        }
        else {
            resolve({ x: 0, y: 0 });
        }
    }), []);
    /** This gets called on Dimensions change to find the anchor coordinates for the action context menu. */
    const measureContextMenuAnchorPosition = (0, react_1.useCallback)(() => {
        if (!isPopoverVisible) {
            return;
        }
        getContextMenuMeasuredLocation().then(({ x, y }) => {
            if (!x || !y) {
                return;
            }
            popoverAnchorPosition.current = {
                horizontal: cursorRelativePosition.current.horizontal + x,
                vertical: cursorRelativePosition.current.vertical + y,
            };
        });
    }, [isPopoverVisible, getContextMenuMeasuredLocation]);
    (0, react_1.useEffect)(() => {
        dimensionsEventListener.current = react_native_1.Dimensions.addEventListener('change', measureContextMenuAnchorPosition);
        return () => {
            if (!dimensionsEventListener.current) {
                return;
            }
            dimensionsEventListener.current.remove();
        };
    }, [measureContextMenuAnchorPosition]);
    /** Whether Context Menu is active for the Report Action. */
    const isActiveReportAction = (actionID) => !!actionID && (reportActionIDRef.current === actionID || reportActionRef.current?.reportActionID === actionID);
    const clearActiveReportAction = () => {
        reportActionIDRef.current = undefined;
        reportActionRef.current = null;
    };
    /**
     * Show the ReportActionContextMenu modal popover.
     *
     * @param type - context menu type [EMAIL, LINK, REPORT_ACTION]
     * @param [event] - A press event.
     * @param [selection] - Copied content.
     * @param contextMenuAnchor - popoverAnchor
     * @param reportID - Active Report Id
     * @param reportActionID - ReportAction for ContextMenu
     * @param originalReportID - The current Report Id of the reportAction
     * @param draftMessage - ReportAction draft message
     * @param [onShow] - Run a callback when Menu is shown
     * @param [onHide] - Run a callback when Menu is hidden
     * @param isArchivedRoom - Whether the provided report is an archived room
     * @param isChronosReport - Flag to check if the chat participant is Chronos
     * @param isPinnedChat - Flag to check if the chat is pinned in the LHN. Used for the Pin/Unpin action
     * @param isUnreadChat - Flag to check if the chat is unread in the LHN. Used for the Mark as Read/Unread action
     */
    const showContextMenu = (showContextMenuParams) => {
        const { type, event, selection, contextMenuAnchor, report = {}, reportAction = {}, callbacks = {}, disabledOptions = [], shouldCloseOnTarget = false, isOverflowMenu = false, withoutOverlay = true, } = showContextMenuParams;
        const { reportID, originalReportID, isArchivedRoom = false, isChronos = false, isPinnedChat = false, isUnreadChat = false } = report;
        const { reportActionID, draftMessage, isThreadReportParentAction: isThreadReportParentActionParam = false } = reportAction;
        const { onShow = () => { }, onHide = () => { }, setIsEmojiPickerActive = () => { } } = callbacks;
        setIsContextMenuOpening(true);
        setIsWithoutOverlay(withoutOverlay);
        const { pageX = 0, pageY = 0 } = extractPointerEvent(event);
        contextMenuAnchorRef.current = contextMenuAnchor;
        contextMenuTargetNode.current = event.target;
        if (shouldCloseOnTarget) {
            anchorRef.current = event.target;
        }
        else {
            anchorRef.current = null;
        }
        onPopoverShow.current = onShow;
        onPopoverHide.current = onHide;
        onEmojiPickerToggle.current = setIsEmojiPickerActive;
        new Promise((resolve) => {
            if (!!(!pageX && !pageY && contextMenuAnchorRef.current) || isOverflowMenu) {
                (0, calculateAnchorPosition_1.default)(contextMenuAnchorRef.current).then((position) => {
                    popoverAnchorPosition.current = { horizontal: position.horizontal, vertical: position.vertical };
                    contextMenuDimensions.current = { width: position.vertical, height: position.height };
                    resolve();
                });
            }
            else {
                getContextMenuMeasuredLocation().then(({ x, y }) => {
                    cursorRelativePosition.current = {
                        horizontal: pageX - x,
                        vertical: pageY - y,
                    };
                    popoverAnchorPosition.current = {
                        horizontal: pageX,
                        vertical: pageY,
                    };
                    resolve();
                });
            }
        }).then(() => {
            setDisabledActions(disabledOptions);
            typeRef.current = type;
            reportIDRef.current = reportID;
            reportActionIDRef.current = reportActionID;
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            originalReportIDRef.current = originalReportID || undefined;
            selectionRef.current = selection;
            setIsPopoverVisible(true);
            reportActionDraftMessageRef.current = draftMessage;
            setIsRoomArchived(isArchivedRoom);
            setIsChronosReportEnabled(isChronos);
            setIsChatPinned(isPinnedChat);
            setHasUnreadMessages(isUnreadChat);
            setIsThreadReportParentAction(isThreadReportParentActionParam);
            setShouldSwitchPositionIfOverflow(isOverflowMenu);
        });
    };
    /** After Popover shows, call the registered onPopoverShow callback and reset it */
    const runAndResetOnPopoverShow = () => {
        instanceIDRef.current = Math.random().toString(36).slice(2, 7);
        onPopoverShow.current();
        // After we have called the action, reset it.
        onPopoverShow.current = () => { };
        // After the context menu opening animation ends reset isContextMenuOpening.
        setTimeout(() => {
            setIsContextMenuOpening(false);
        }, CONST_1.default.ANIMATED_TRANSITION);
    };
    /** Run the callback and return a noop function to reset it */
    const runAndResetCallback = (callback) => {
        callback();
        return () => { };
    };
    /** After Popover hides, call the registered onPopoverHide & onPopoverHideActionCallback callback and reset it */
    const runAndResetOnPopoverHide = () => {
        reportIDRef.current = undefined;
        reportActionIDRef.current = undefined;
        originalReportIDRef.current = undefined;
        instanceIDRef.current = '';
        selectionRef.current = '';
        onPopoverHide.current = runAndResetCallback(onPopoverHide.current);
        onPopoverHideActionCallback.current = runAndResetCallback(onPopoverHideActionCallback.current);
    };
    /**
     * Hide the ReportActionContextMenu modal popover.
     * @param onHideActionCallback Callback to be called after popover is completely hidden
     */
    const hideContextMenu = (onHideActionCallback) => {
        if (typeof onHideActionCallback === 'function') {
            onPopoverHideActionCallback.current = onHideActionCallback;
        }
        actionSheetAwareScrollViewContext.transitionActionSheetState({
            type: ActionSheetAwareScrollView_1.Actions.CLOSE_POPOVER,
        });
        selectionRef.current = '';
        reportActionDraftMessageRef.current = undefined;
        setIsPopoverVisible(false);
    };
    const transactionIDs = [];
    if ((0, ReportActionsUtils_1.isMoneyRequestAction)(reportActionRef.current)) {
        const originalMessage = (0, ReportActionsUtils_1.getOriginalMessage)(reportActionRef.current);
        if (originalMessage && 'IOUTransactionID' in originalMessage && !!originalMessage.IOUTransactionID) {
            transactionIDs.push(originalMessage.IOUTransactionID);
        }
    }
    const { duplicateTransactions, duplicateTransactionViolations } = (0, useDuplicateTransactionsAndViolations_1.default)(transactionIDs);
    const confirmDeleteAndHideModal = (0, react_1.useCallback)(() => {
        callbackWhenDeleteModalHide.current = runAndResetCallback(onConfirmDeleteModal.current);
        const reportAction = reportActionRef.current;
        if ((0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction)) {
            const originalMessage = (0, ReportActionsUtils_1.getOriginalMessage)(reportAction);
            if ((0, ReportActionsUtils_1.isTrackExpenseAction)(reportAction)) {
                (0, IOU_1.deleteTrackExpense)(reportIDRef.current, originalMessage?.IOUTransactionID, reportAction, duplicateTransactions, duplicateTransactionViolations);
            }
            else {
                (0, IOU_1.deleteMoneyRequest)(originalMessage?.IOUTransactionID, reportAction, duplicateTransactions, duplicateTransactionViolations);
            }
        }
        else if (reportAction) {
            react_native_1.InteractionManager.runAfterInteractions(() => {
                (0, Report_1.deleteReportComment)(reportIDRef.current, reportAction, isReportArchived);
            });
        }
        react_native_1.DeviceEventEmitter.emit(`deletedReportAction_${reportIDRef.current}`, reportAction?.reportActionID);
        setIsDeleteCommentConfirmModalVisible(false);
    }, [duplicateTransactions, duplicateTransactionViolations, isReportArchived]);
    const hideDeleteModal = () => {
        callbackWhenDeleteModalHide.current = () => (onCancelDeleteModal.current = runAndResetCallback(onCancelDeleteModal.current));
        setIsDeleteCommentConfirmModalVisible(false);
        setShouldSetModalVisibilityForDeleteConfirmation(true);
        setIsRoomArchived(false);
        setIsChronosReportEnabled(false);
        setIsChatPinned(false);
        setHasUnreadMessages(false);
    };
    /** Opens the Confirm delete action modal */
    const showDeleteModal = (reportID, reportAction, shouldSetModalVisibility = true, onConfirm = () => { }, onCancel = () => { }) => {
        onCancelDeleteModal.current = onCancel;
        onConfirmDeleteModal.current = onConfirm;
        reportIDRef.current = reportID;
        reportActionRef.current = reportAction ?? null;
        setShouldSetModalVisibilityForDeleteConfirmation(shouldSetModalVisibility);
        setIsDeleteCommentConfirmModalVisible(true);
    };
    (0, react_1.useImperativeHandle)(ref, () => ({
        showContextMenu,
        hideContextMenu,
        showDeleteModal,
        hideDeleteModal,
        isActiveReportAction,
        instanceIDRef,
        runAndResetOnPopoverHide,
        clearActiveReportAction,
        contentRef,
        isContextMenuOpening,
    }));
    const reportAction = reportActionRef.current;
    return (<>
            <PopoverWithMeasuredContent_1.default isVisible={isPopoverVisible} onClose={hideContextMenu} onModalShow={runAndResetOnPopoverShow} onModalHide={runAndResetOnPopoverHide} anchorPosition={popoverAnchorPosition.current} animationIn="fadeIn" disableAnimation={false} shouldSetModalVisibility={false} fullscreen withoutOverlay={isWithoutOverlay} anchorDimensions={contextMenuDimensions.current} anchorRef={anchorRef} shouldSwitchPositionIfOverflow={shouldSwitchPositionIfOverflow}>
                <BaseReportActionContextMenu_1.default isVisible={isPopoverVisible} type={typeRef.current} reportID={reportIDRef.current} reportActionID={reportActionIDRef.current} draftMessage={reportActionDraftMessageRef.current} selection={selectionRef.current} isArchivedRoom={isRoomArchived} isChronosReport={isChronosReportEnabled} isPinnedChat={isChatPinned} isUnreadChat={hasUnreadMessages} isThreadReportParentAction={isThreadReportParentAction} anchor={contextMenuTargetNode} contentRef={contentRef} originalReportID={originalReportIDRef.current} disabledActions={disabledActions} setIsEmojiPickerActive={onEmojiPickerToggle.current}/>
            </PopoverWithMeasuredContent_1.default>
            <ConfirmModal_1.default title={translate('reportActionContextMenu.deleteAction', { action: reportAction })} isVisible={isDeleteCommentConfirmModalVisible} shouldSetModalVisibility={shouldSetModalVisibilityForDeleteConfirmation} onConfirm={confirmDeleteAndHideModal} onCancel={hideDeleteModal} onModalHide={() => {
            clearActiveReportAction();
            callbackWhenDeleteModalHide.current();
        }} prompt={translate('reportActionContextMenu.deleteConfirmation', { action: reportAction })} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger/>
        </>);
}
PopoverReportActionContextMenu.displayName = 'PopoverReportActionContextMenu';
exports.default = (0, react_1.forwardRef)(PopoverReportActionContextMenu);
