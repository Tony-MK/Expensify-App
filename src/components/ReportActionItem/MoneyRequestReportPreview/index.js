"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const TransactionPreview_1 = require("@components/ReportActionItem/TransactionPreview");
const usePolicy_1 = require("@hooks/usePolicy");
const useReportWithTransactionsAndViolations_1 = require("@hooks/useReportWithTransactionsAndViolations");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useTransactionViolations_1 = require("@hooks/useTransactionViolations");
const Fullstory_1 = require("@libs/Fullstory");
const Performance_1 = require("@libs/Performance");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const Navigation_1 = require("@navigation/Navigation");
const ReportActionContextMenu_1 = require("@pages/home/report/ContextMenu/ReportActionContextMenu");
const Timing_1 = require("@userActions/Timing");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const MoneyRequestReportPreviewContent_1 = require("./MoneyRequestReportPreviewContent");
function MoneyRequestReportPreview({ allReports, policies, iouReportID, policyID, chatReportID, action, contextMenuAnchor, isHovered = false, isWhisper = false, checkIfContextMenuActive = () => { }, onPaymentOptionsShow, onPaymentOptionsHide, shouldDisplayContextMenu = true, isInvoice = false, shouldShowBorder, }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const personalDetailsList = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const chatReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReportID}`];
    const invoiceReceiverPolicy = policies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${chatReport?.invoiceReceiver && 'policyID' in chatReport.invoiceReceiver ? chatReport.invoiceReceiver.policyID : undefined}`];
    const invoiceReceiverPersonalDetail = chatReport?.invoiceReceiver && 'accountID' in chatReport.invoiceReceiver ? personalDetailsList?.[chatReport.invoiceReceiver.accountID] : null;
    const [iouReport, transactions, violations] = (0, useReportWithTransactionsAndViolations_1.default)(iouReportID);
    const policy = (0, usePolicy_1.default)(policyID);
    const lastTransaction = transactions?.at(0);
    const lastTransactionViolations = (0, useTransactionViolations_1.default)(lastTransaction?.transactionID);
    const isTrackExpenseAction = (0, ReportActionsUtils_1.isTrackExpenseAction)(action);
    const isSplitBillAction = (0, ReportActionsUtils_1.isSplitBillAction)(action);
    const widthsRef = (0, react_1.useRef)({ currentWidth: null, currentWrapperWidth: null });
    const [widths, setWidths] = (0, react_1.useState)({ currentWidth: 0, currentWrapperWidth: 0 });
    const updateWidths = (0, react_1.useCallback)(() => {
        const { currentWidth, currentWrapperWidth } = widthsRef.current;
        if (currentWidth && currentWrapperWidth) {
            setWidths({ currentWidth, currentWrapperWidth });
        }
    }, []);
    const onCarouselLayout = (0, react_1.useCallback)((e) => {
        const newWidth = e.nativeEvent.layout.width;
        if (widthsRef.current.currentWidth !== newWidth) {
            widthsRef.current.currentWidth = newWidth;
            updateWidths();
        }
    }, [updateWidths]);
    const onWrapperLayout = (0, react_1.useCallback)((e) => {
        const newWrapperWidth = e.nativeEvent.layout.width;
        if (widthsRef.current.currentWrapperWidth !== newWrapperWidth) {
            widthsRef.current.currentWrapperWidth = newWrapperWidth;
            updateWidths();
        }
    }, [updateWidths]);
    const reportPreviewStyles = (0, react_1.useMemo)(() => StyleUtils.getMoneyRequestReportPreviewStyle(shouldUseNarrowLayout, transactions.length, widths.currentWidth, widths.currentWrapperWidth), [StyleUtils, widths, shouldUseNarrowLayout, transactions.length]);
    const shouldShowPayerAndReceiver = (0, react_1.useMemo)(() => {
        if (!(0, ReportUtils_1.isIOUReport)(iouReport) && action.childType !== CONST_1.default.REPORT.TYPE.IOU) {
            return false;
        }
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        return transactions.some((transaction) => (transaction?.modifiedAmount || transaction?.amount) < 0);
    }, [transactions, action.childType, iouReport]);
    const openReportFromPreview = (0, react_1.useCallback)(() => {
        if (!iouReportID || ReportActionContextMenu_1.contextMenuRef.current?.isContextMenuOpening) {
            return;
        }
        Performance_1.default.markStart(CONST_1.default.TIMING.OPEN_REPORT_FROM_PREVIEW);
        Timing_1.default.start(CONST_1.default.TIMING.OPEN_REPORT_FROM_PREVIEW);
        Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(iouReportID, undefined, undefined, Navigation_1.default.getActiveRoute()));
    }, [iouReportID]);
    const renderItem = ({ item }) => (<TransactionPreview_1.default allReports={allReports} chatReportID={chatReportID} action={(0, ReportActionsUtils_1.getIOUActionForReportID)(item.reportID, item.transactionID)} contextAction={action} reportID={item.reportID} isBillSplit={isSplitBillAction} isTrackExpense={isTrackExpenseAction} contextMenuAnchor={contextMenuAnchor} isWhisper={isWhisper} isHovered={isHovered} iouReportID={iouReportID} containerStyles={[styles.h100, reportPreviewStyles.transactionPreviewCarouselStyle]} shouldDisplayContextMenu={shouldDisplayContextMenu} transactionPreviewWidth={reportPreviewStyles.transactionPreviewCarouselStyle.width} transactionID={item.transactionID} reportPreviewAction={action} onPreviewPressed={openReportFromPreview} shouldShowPayerAndReceiver={shouldShowPayerAndReceiver}/>);
    const fsClass = Fullstory_1.default.getChatFSClass(personalDetailsList, iouReport);
    return (<MoneyRequestReportPreviewContent_1.default iouReportID={iouReportID} chatReportID={chatReportID} iouReport={iouReport} chatReport={chatReport} action={action} containerStyles={[reportPreviewStyles.componentStyle]} contextMenuAnchor={contextMenuAnchor} isHovered={isHovered} isWhisper={isWhisper} checkIfContextMenuActive={checkIfContextMenuActive} onPaymentOptionsShow={onPaymentOptionsShow} onPaymentOptionsHide={onPaymentOptionsHide} transactions={transactions} violations={violations} policy={policy} invoiceReceiverPersonalDetail={invoiceReceiverPersonalDetail} invoiceReceiverPolicy={invoiceReceiverPolicy} lastTransactionViolations={lastTransactionViolations} renderTransactionItem={renderItem} onCarouselLayout={onCarouselLayout} onWrapperLayout={onWrapperLayout} currentWidth={widths.currentWidth} reportPreviewStyles={reportPreviewStyles} shouldDisplayContextMenu={shouldDisplayContextMenu} isInvoice={isInvoice} onPress={openReportFromPreview} shouldShowBorder={shouldShowBorder} forwardedFSClass={fsClass}/>);
}
MoneyRequestReportPreview.displayName = 'MoneyRequestReportPreview';
exports.default = MoneyRequestReportPreview;
