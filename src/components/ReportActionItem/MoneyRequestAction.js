"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const isEmpty_1 = require("lodash/isEmpty");
const react_1 = require("react");
const RenderHTML_1 = require("@components/RenderHTML");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Report_1 = require("@libs/actions/Report");
const IOUUtils_1 = require("@libs/IOUUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportActionContextMenu_1 = require("@pages/home/report/ContextMenu/ReportActionContextMenu");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const TransactionPreview_1 = require("./TransactionPreview");
function MoneyRequestAction({ allReports, action, chatReportID, requestReportID, reportID, isMostRecentIOUReportAction, contextMenuAnchor, checkIfContextMenuActive = () => { }, isHovered = false, style, isWhisper = false, shouldDisplayContextMenu = true, }) {
    const chatReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReportID}`];
    const iouReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${requestReportID}`];
    const [reportActions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReportID}`, { canEvict: false, canBeMissing: true });
    const StyleUtils = (0, useStyleUtils_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const route = (0, native_1.useRoute)();
    const isReviewDuplicateTransactionPage = route.name === SCREENS_1.default.TRANSACTION_DUPLICATE.REVIEW;
    const isSplitBillAction = (0, ReportActionsUtils_1.isSplitBillAction)(action);
    const isTrackExpenseAction = (0, ReportActionsUtils_1.isTrackExpenseAction)(action);
    const containerStyles = (0, react_1.useMemo)(() => [styles.cursorPointer, isHovered ? styles.reportPreviewBoxHoverBorder : undefined, style], [isHovered, style, styles.cursorPointer, styles.reportPreviewBoxHoverBorder]);
    const reportPreviewStyles = StyleUtils.getMoneyRequestReportPreviewStyle(shouldUseNarrowLayout, 1, undefined, undefined);
    const onMoneyRequestPreviewPressed = () => {
        if (ReportActionContextMenu_1.contextMenuRef.current?.isContextMenuOpening) {
            return;
        }
        if (isSplitBillAction) {
            Navigation_1.default.navigate(ROUTES_1.default.SPLIT_BILL_DETAILS.getRoute(chatReportID, action.reportActionID, Navigation_1.default.getReportRHPActiveRoute()));
            return;
        }
        // In case the childReportID is not present it probably means the transaction thread was not created yet,
        // so we need to send the parentReportActionID and the transactionID to the route so we can call OpenReport correctly
        const transactionID = (0, ReportActionsUtils_1.isMoneyRequestAction)(action) ? (0, ReportActionsUtils_1.getOriginalMessage)(action)?.IOUTransactionID : CONST_1.default.DEFAULT_NUMBER_ID;
        if (!action?.childReportID && transactionID && action.reportActionID) {
            const transactionThreadReport = (0, Report_1.createTransactionThreadReport)(iouReport, action);
            Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(transactionThreadReport?.reportID, undefined, undefined, Navigation_1.default.getActiveRoute()));
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(action?.childReportID, undefined, undefined, Navigation_1.default.getActiveRoute()));
    };
    let shouldShowPendingConversionMessage = false;
    const isDeletedParentAction = (0, ReportActionsUtils_1.isDeletedParentAction)(action);
    const isReversedTransaction = (0, ReportActionsUtils_1.isReversedTransaction)(action);
    if (!(0, EmptyObject_1.isEmptyObject)(iouReport) &&
        !(0, EmptyObject_1.isEmptyObject)(reportActions) &&
        chatReport?.iouReportID &&
        isMostRecentIOUReportAction &&
        action.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD &&
        isOffline) {
        shouldShowPendingConversionMessage = (0, IOUUtils_1.isIOUReportPendingCurrencyConversion)(iouReport);
    }
    if (isDeletedParentAction || isReversedTransaction) {
        let message;
        if (isReversedTransaction) {
            message = 'parentReportAction.reversedTransaction';
        }
        else {
            message = 'parentReportAction.deletedExpense';
        }
        return <RenderHTML_1.default html={`<deleted-action ${CONST_1.default.REVERSED_TRANSACTION_ATTRIBUTE}="${isReversedTransaction}">${translate(message)}</deleted-action>`}/>;
    }
    if ((0, isEmpty_1.default)(iouReport) && !(isSplitBillAction || isTrackExpenseAction)) {
        return null;
    }
    return (<TransactionPreview_1.default allReports={allReports} iouReportID={requestReportID} chatReportID={chatReportID} reportID={reportID} action={action} transactionPreviewWidth={reportPreviewStyles.transactionPreviewStandaloneStyle.width} isBillSplit={isSplitBillAction} isTrackExpense={isTrackExpenseAction} contextMenuAnchor={contextMenuAnchor} checkIfContextMenuActive={checkIfContextMenuActive} shouldShowPendingConversionMessage={shouldShowPendingConversionMessage} onPreviewPressed={onMoneyRequestPreviewPressed} containerStyles={[reportPreviewStyles.transactionPreviewStandaloneStyle, isReviewDuplicateTransactionPage ? [containerStyles, styles.borderNone] : styles.mt2]} isHovered={isHovered} isWhisper={isWhisper} shouldDisplayContextMenu={shouldDisplayContextMenu}/>);
}
MoneyRequestAction.displayName = 'MoneyRequestAction';
exports.default = MoneyRequestAction;
