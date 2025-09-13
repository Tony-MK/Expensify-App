"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fast_equals_1 = require("fast-equals");
const react_1 = require("react");
const react_native_1 = require("react-native");
const ActionSheetAwareScrollView = require("@components/ActionSheetAwareScrollView");
const ContextMenuItem_1 = require("@components/ContextMenuItem");
const FocusTrapForModal_1 = require("@components/FocusTrap/FocusTrapForModal");
const useArrowKeyFocusManager_1 = require("@hooks/useArrowKeyFocusManager");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useGetExpensifyCardFromReportAction_1 = require("@hooks/useGetExpensifyCardFromReportAction");
const useKeyboardShortcut_1 = require("@hooks/useKeyboardShortcut");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePaginatedReportActions_1 = require("@hooks/usePaginatedReportActions");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useRestoreInputFocus_1 = require("@hooks/useRestoreInputFocus");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const ModifiedExpenseMessage_1 = require("@libs/ModifiedExpenseMessage");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const shouldEnableContextMenuEnterShortcut_1 = require("@libs/shouldEnableContextMenuEnterShortcut");
const Session_1 = require("@userActions/Session");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const ContextMenuActions_1 = require("./ContextMenuActions");
const ReportActionContextMenu_1 = require("./ReportActionContextMenu");
function BaseReportActionContextMenu({ type = CONST_1.default.CONTEXT_MENU_TYPES.REPORT_ACTION, anchor, contentRef, isChronosReport = false, isArchivedRoom = false, isMini = false, isVisible = false, isPinnedChat = false, isUnreadChat = false, isThreadReportParentAction = false, selection = '', draftMessage = '', reportActionID, reportID, originalReportID, checkIfContextMenuActive, disabledActions = [], setIsEmojiPickerActive, }) {
    const actionSheetAwareScrollViewContext = (0, react_1.useContext)(ActionSheetAwareScrollView.ActionSheetAwareScrollViewContext);
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { shouldUseNarrowLayout, isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const menuItemRefs = (0, react_1.useRef)({});
    const [shouldKeepOpen, setShouldKeepOpen] = (0, react_1.useState)(false);
    const wrapperStyle = StyleUtils.getReportActionContextMenuStyles(isMini, shouldUseNarrowLayout);
    const { isOffline } = (0, useNetwork_1.default)();
    const { isProduction } = (0, useEnvironment_1.default)();
    const threeDotRef = (0, react_1.useRef)(null);
    const [betas] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BETAS, { canBeMissing: true });
    const [reportActions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${originalReportID}`, {
        canBeMissing: true,
        canEvict: false,
    });
    const transactionID = (0, ReportActionsUtils_1.getLinkedTransactionID)(reportActionID, reportID);
    const [transaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${(0, getNonEmptyStringOnyxID_1.default)(transactionID)}`, { canBeMissing: true });
    const [isDebugModeEnabled] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_DEBUG_MODE_ENABLED, { canBeMissing: true });
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, { canBeMissing: true });
    const [originalReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${originalReportID}`, { canBeMissing: true });
    const isOriginalReportArchived = (0, useReportIsArchived_1.default)(originalReportID);
    const policyID = report?.policyID;
    const reportAction = (0, react_1.useMemo)(() => {
        if ((0, EmptyObject_1.isEmptyObject)(reportActions) || reportActionID === '0' || reportActionID === '-1' || !reportActionID) {
            return;
        }
        return reportActions[reportActionID];
    }, [reportActions, reportActionID]);
    const [movedFromReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${(0, ModifiedExpenseMessage_1.getMovedReportID)(reportAction, CONST_1.default.REPORT.MOVE_TYPE.FROM)}`, { canBeMissing: true });
    const [movedToReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${(0, ModifiedExpenseMessage_1.getMovedReportID)(reportAction, CONST_1.default.REPORT.MOVE_TYPE.TO)}`, { canBeMissing: true });
    const sourceID = (0, ReportUtils_1.getSourceIDFromReportAction)(reportAction);
    const [download] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.DOWNLOAD}${sourceID}`, { canBeMissing: true });
    const [childReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportAction?.childReportID}`, { canBeMissing: true });
    const [childReportActions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportAction?.childReportID}`, { canBeMissing: true });
    const [childChatReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${childReport?.chatReportID}`, { canBeMissing: true });
    const parentReportAction = (0, ReportActionsUtils_1.getReportAction)(childReport?.parentReportID, childReport?.parentReportActionID);
    const { reportActions: paginatedReportActions } = (0, usePaginatedReportActions_1.default)(childReport?.reportID);
    const transactionThreadReportID = (0, react_1.useMemo)(() => (0, ReportActionsUtils_1.getOneTransactionThreadReportID)(childReport, childChatReport, paginatedReportActions ?? [], isOffline), [paginatedReportActions, isOffline, childReport, childChatReport]);
    const [transactionThreadReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReportID}`, { canBeMissing: true });
    const isMoneyRequestReport = (0, react_1.useMemo)(() => (0, ReportUtils_1.isMoneyRequestReport)(childReport), [childReport]);
    const isInvoiceReport = (0, react_1.useMemo)(() => (0, ReportUtils_1.isInvoiceReport)(childReport), [childReport]);
    const requestParentReportAction = (0, react_1.useMemo)(() => {
        if (isMoneyRequestReport || isInvoiceReport) {
            if (transactionThreadReportID === CONST_1.default.FAKE_REPORT_ID) {
                return Object.values(childReportActions ?? {}).find((action) => action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.IOU);
            }
            if (!paginatedReportActions || !transactionThreadReport?.parentReportActionID) {
                return undefined;
            }
            return paginatedReportActions.find((action) => action.reportActionID === transactionThreadReport.parentReportActionID);
        }
        return parentReportAction;
    }, [parentReportAction, isMoneyRequestReport, isInvoiceReport, paginatedReportActions, transactionThreadReport?.parentReportActionID, transactionThreadReportID, childReportActions]);
    const moneyRequestAction = transactionThreadReportID ? requestParentReportAction : parentReportAction;
    const isChildReportArchived = (0, useReportIsArchived_1.default)(childReport?.reportID);
    const isParentReportArchived = (0, useReportIsArchived_1.default)(childReport?.parentReportID);
    const [parentReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${childReport?.parentReportID}`, { canBeMissing: true });
    const iouTransactionID = (0, ReportActionsUtils_1.getOriginalMessage)(moneyRequestAction ?? reportAction)?.IOUTransactionID;
    const [iouTransaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${iouTransactionID}`, { canBeMissing: true });
    const [tryNewDot] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_TRY_NEW_DOT, { canBeMissing: false });
    const isTryNewDotNVPDismissed = !!tryNewDot?.classicRedirect?.dismissed;
    const isMoneyRequest = (0, react_1.useMemo)(() => (0, ReportUtils_1.isMoneyRequest)(childReport), [childReport]);
    const isTrackExpenseReport = (0, ReportUtils_1.isTrackExpenseReport)(childReport);
    const isSingleTransactionView = isMoneyRequest || isTrackExpenseReport;
    const isMoneyRequestOrReport = isMoneyRequestReport || isSingleTransactionView;
    const areHoldRequirementsMet = !isInvoiceReport &&
        isMoneyRequestOrReport &&
        !(0, ReportUtils_1.isArchivedNonExpenseReport)(transactionThreadReportID ? childReport : parentReport, transactionThreadReportID ? isChildReportArchived : isParentReportArchived);
    const shouldEnableArrowNavigation = !isMini && (isVisible || shouldKeepOpen);
    let filteredContextMenuActions = ContextMenuActions_1.default.filter((contextAction) => !disabledActions.includes(contextAction) &&
        contextAction.shouldShow({
            type,
            reportAction,
            isArchivedRoom,
            betas,
            menuTarget: anchor,
            isChronosReport,
            reportID,
            isPinnedChat,
            isUnreadChat,
            isThreadReportParentAction,
            isOffline: !!isOffline,
            isMini,
            isProduction,
            moneyRequestAction,
            areHoldRequirementsMet,
            isDebugModeEnabled,
            iouTransaction,
        }));
    if (isMini) {
        const menuAction = filteredContextMenuActions.at(-1);
        const otherActions = filteredContextMenuActions.slice(0, -1);
        if (otherActions.length > CONST_1.default.MINI_CONTEXT_MENU_MAX_ITEMS && menuAction) {
            filteredContextMenuActions = otherActions.slice(0, CONST_1.default.MINI_CONTEXT_MENU_MAX_ITEMS - 1);
            filteredContextMenuActions.push(menuAction);
        }
        else {
            filteredContextMenuActions = otherActions;
        }
    }
    // Context menu actions that are not rendered as menu items are excluded from arrow navigation
    const nonMenuItemActionIndexes = filteredContextMenuActions.map((contextAction, index) => 'renderContent' in contextAction && typeof contextAction.renderContent === 'function' ? index : undefined);
    const disabledIndexes = nonMenuItemActionIndexes.filter((index) => index !== undefined);
    const [focusedIndex, setFocusedIndex] = (0, useArrowKeyFocusManager_1.default)({
        initialFocusedIndex: -1,
        disabledIndexes,
        maxIndex: filteredContextMenuActions.length - 1,
        isActive: shouldEnableArrowNavigation,
    });
    /**
     * Checks if user is anonymous. If true and the action doesn't accept for anonymous user, hides the context menu and
     * shows the sign in modal. Else, executes the callback.
     */
    const interceptAnonymousUser = (callback, isAnonymousAction = false) => {
        if ((0, Session_1.isAnonymousUser)() && !isAnonymousAction) {
            (0, ReportActionContextMenu_1.hideContextMenu)(false);
            react_native_1.InteractionManager.runAfterInteractions(() => {
                (0, Session_1.signOutAndRedirectToSignIn)();
            });
        }
        else {
            callback();
        }
    };
    (0, useKeyboardShortcut_1.default)(CONST_1.default.KEYBOARD_SHORTCUTS.ENTER, (event) => {
        if (!menuItemRefs.current[focusedIndex]) {
            return;
        }
        // Ensures the event does not cause side-effects beyond the context menu, e.g. when an outside element is focused
        if (event) {
            event.stopPropagation();
        }
        menuItemRefs.current[focusedIndex]?.triggerPressAndUpdateSuccess?.();
        setFocusedIndex(-1);
    }, { isActive: shouldEnableArrowNavigation && shouldEnableContextMenuEnterShortcut_1.default, shouldPreventDefault: false });
    (0, useRestoreInputFocus_1.default)(isVisible);
    const openOverflowMenu = (event, anchorRef) => {
        (0, ReportActionContextMenu_1.showContextMenu)({
            type: CONST_1.default.CONTEXT_MENU_TYPES.REPORT_ACTION,
            event,
            selection,
            contextMenuAnchor: anchorRef?.current,
            report: {
                reportID,
                originalReportID,
                isArchivedRoom: (0, ReportUtils_1.isArchivedNonExpenseReport)(originalReport, isOriginalReportArchived),
                isChronos: (0, ReportUtils_1.chatIncludesChronosWithID)(originalReportID),
            },
            reportAction: {
                reportActionID: reportAction?.reportActionID,
                draftMessage,
                isThreadReportParentAction,
            },
            callbacks: {
                onShow: checkIfContextMenuActive,
                onHide: () => {
                    checkIfContextMenuActive?.();
                    setShouldKeepOpen(false);
                },
            },
            disabledOptions: filteredContextMenuActions,
            shouldCloseOnTarget: true,
            isOverflowMenu: true,
        });
    };
    // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
    const card = (0, useGetExpensifyCardFromReportAction_1.default)({ reportAction: (reportAction ?? null), policyID });
    return ((isVisible || shouldKeepOpen || !isMini) && (<FocusTrapForModal_1.default active={!isMini && !isSmallScreenWidth && (isVisible || shouldKeepOpen)}>
                <react_native_1.View ref={contentRef} style={wrapperStyle}>
                    {filteredContextMenuActions.map((contextAction, index) => {
            const closePopup = !isMini;
            const payload = {
                // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
                reportAction: (reportAction ?? null),
                reportID,
                report,
                draftMessage,
                selection,
                close: () => setShouldKeepOpen(false),
                transitionActionSheetState: actionSheetAwareScrollViewContext.transitionActionSheetState,
                openContextMenu: () => setShouldKeepOpen(true),
                interceptAnonymousUser,
                openOverflowMenu,
                setIsEmojiPickerActive,
                moneyRequestAction,
                card,
                originalReport,
                isTryNewDotNVPDismissed,
                movedFromReport,
                movedToReport,
            };
            if ('renderContent' in contextAction) {
                return contextAction.renderContent(closePopup, payload);
            }
            const { textTranslateKey } = contextAction;
            const isKeyInActionUpdateKeys = textTranslateKey === 'reportActionContextMenu.editAction' ||
                textTranslateKey === 'reportActionContextMenu.deleteAction' ||
                textTranslateKey === 'reportActionContextMenu.deleteConfirmation';
            const text = textTranslateKey && (isKeyInActionUpdateKeys ? translate(textTranslateKey, { action: moneyRequestAction ?? reportAction }) : translate(textTranslateKey));
            const transactionPayload = textTranslateKey === 'reportActionContextMenu.copyToClipboard' && transaction && { transaction };
            const isMenuAction = textTranslateKey === 'reportActionContextMenu.menu';
            return (<ContextMenuItem_1.default ref={(ref) => {
                    menuItemRefs.current[index] = ref;
                }} buttonRef={isMenuAction ? threeDotRef : { current: null }} icon={contextAction.icon} text={text ?? ''} successIcon={contextAction.successIcon} successText={contextAction.successTextTranslateKey ? translate(contextAction.successTextTranslateKey) : undefined} isMini={isMini} key={contextAction.textTranslateKey} onPress={(event) => interceptAnonymousUser(() => contextAction.onPress?.(closePopup, { ...payload, ...transactionPayload, event, ...(isMenuAction ? { anchorRef: threeDotRef } : {}) }), contextAction.isAnonymousAction)} description={contextAction.getDescription?.(selection) ?? ''} isAnonymousAction={contextAction.isAnonymousAction} isFocused={focusedIndex === index} shouldPreventDefaultFocusOnPress={contextAction.shouldPreventDefaultFocusOnPress} onFocus={() => setFocusedIndex(index)} onBlur={() => (index === filteredContextMenuActions.length - 1 || index === 1) && setFocusedIndex(-1)} disabled={contextAction?.shouldDisable ? contextAction?.shouldDisable(download) : false} shouldShowLoadingSpinnerIcon={contextAction?.shouldDisable ? contextAction?.shouldDisable(download) : false}/>);
        })}
                </react_native_1.View>
            </FocusTrapForModal_1.default>));
}
exports.default = (0, react_1.memo)(BaseReportActionContextMenu, fast_equals_1.deepEqual);
