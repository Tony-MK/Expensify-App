"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var TransactionPreview_1 = require("@components/ReportActionItem/TransactionPreview");
var usePolicy_1 = require("@hooks/usePolicy");
var useReportWithTransactionsAndViolations_1 = require("@hooks/useReportWithTransactionsAndViolations");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useStyleUtils_1 = require("@hooks/useStyleUtils");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var useTransactionViolations_1 = require("@hooks/useTransactionViolations");
var Fullstory_1 = require("@libs/Fullstory");
var Performance_1 = require("@libs/Performance");
var ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var Navigation_1 = require("@navigation/Navigation");
var ReportActionContextMenu_1 = require("@pages/home/report/ContextMenu/ReportActionContextMenu");
var Timing_1 = require("@userActions/Timing");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var MoneyRequestReportPreviewContent_1 = require("./MoneyRequestReportPreviewContent");
function MoneyRequestReportPreview(_a) {
    var allReports = _a.allReports, policies = _a.policies, iouReportID = _a.iouReportID, policyID = _a.policyID, chatReportID = _a.chatReportID, action = _a.action, contextMenuAnchor = _a.contextMenuAnchor, _b = _a.isHovered, isHovered = _b === void 0 ? false : _b, _c = _a.isWhisper, isWhisper = _c === void 0 ? false : _c, _d = _a.checkIfContextMenuActive, checkIfContextMenuActive = _d === void 0 ? function () { } : _d, onPaymentOptionsShow = _a.onPaymentOptionsShow, onPaymentOptionsHide = _a.onPaymentOptionsHide, _e = _a.shouldDisplayContextMenu, shouldDisplayContextMenu = _e === void 0 ? true : _e, _f = _a.isInvoice, isInvoice = _f === void 0 ? false : _f, shouldShowBorder = _a.shouldShowBorder;
    var styles = (0, useThemeStyles_1.default)();
    var StyleUtils = (0, useStyleUtils_1.default)();
    var shouldUseNarrowLayout = (0, useResponsiveLayout_1.default)().shouldUseNarrowLayout;
    var personalDetailsList = (0, OnyxListItemProvider_1.usePersonalDetails)();
    var chatReport = allReports === null || allReports === void 0 ? void 0 : allReports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(chatReportID)];
    var invoiceReceiverPolicy = policies === null || policies === void 0 ? void 0 : policies["".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat((chatReport === null || chatReport === void 0 ? void 0 : chatReport.invoiceReceiver) && 'policyID' in chatReport.invoiceReceiver ? chatReport.invoiceReceiver.policyID : undefined)];
    var invoiceReceiverPersonalDetail = (chatReport === null || chatReport === void 0 ? void 0 : chatReport.invoiceReceiver) && 'accountID' in chatReport.invoiceReceiver ? personalDetailsList === null || personalDetailsList === void 0 ? void 0 : personalDetailsList[chatReport.invoiceReceiver.accountID] : null;
    var _g = (0, useReportWithTransactionsAndViolations_1.default)(iouReportID), iouReport = _g[0], transactions = _g[1], violations = _g[2];
    var policy = (0, usePolicy_1.default)(policyID);
    var lastTransaction = transactions === null || transactions === void 0 ? void 0 : transactions.at(0);
    var lastTransactionViolations = (0, useTransactionViolations_1.default)(lastTransaction === null || lastTransaction === void 0 ? void 0 : lastTransaction.transactionID);
    var isTrackExpenseAction = (0, ReportActionsUtils_1.isTrackExpenseAction)(action);
    var isSplitBillAction = (0, ReportActionsUtils_1.isSplitBillAction)(action);
    var widthsRef = (0, react_1.useRef)({ currentWidth: null, currentWrapperWidth: null });
    var _h = (0, react_1.useState)({ currentWidth: 0, currentWrapperWidth: 0 }), widths = _h[0], setWidths = _h[1];
    var updateWidths = (0, react_1.useCallback)(function () {
        var _a = widthsRef.current, currentWidth = _a.currentWidth, currentWrapperWidth = _a.currentWrapperWidth;
        if (currentWidth && currentWrapperWidth) {
            setWidths({ currentWidth: currentWidth, currentWrapperWidth: currentWrapperWidth });
        }
    }, []);
    var onCarouselLayout = (0, react_1.useCallback)(function (e) {
        var newWidth = e.nativeEvent.layout.width;
        if (widthsRef.current.currentWidth !== newWidth) {
            widthsRef.current.currentWidth = newWidth;
            updateWidths();
        }
    }, [updateWidths]);
    var onWrapperLayout = (0, react_1.useCallback)(function (e) {
        var newWrapperWidth = e.nativeEvent.layout.width;
        if (widthsRef.current.currentWrapperWidth !== newWrapperWidth) {
            widthsRef.current.currentWrapperWidth = newWrapperWidth;
            updateWidths();
        }
    }, [updateWidths]);
    var reportPreviewStyles = (0, react_1.useMemo)(function () { return StyleUtils.getMoneyRequestReportPreviewStyle(shouldUseNarrowLayout, transactions.length, widths.currentWidth, widths.currentWrapperWidth); }, [StyleUtils, widths, shouldUseNarrowLayout, transactions.length]);
    var shouldShowPayerAndReceiver = (0, react_1.useMemo)(function () {
        if (!(0, ReportUtils_1.isIOUReport)(iouReport) && action.childType !== CONST_1.default.REPORT.TYPE.IOU) {
            return false;
        }
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        return transactions.some(function (transaction) { return ((transaction === null || transaction === void 0 ? void 0 : transaction.modifiedAmount) || (transaction === null || transaction === void 0 ? void 0 : transaction.amount)) < 0; });
    }, [transactions, action.childType, iouReport]);
    var openReportFromPreview = (0, react_1.useCallback)(function () {
        var _a;
        if (!iouReportID || ((_a = ReportActionContextMenu_1.contextMenuRef.current) === null || _a === void 0 ? void 0 : _a.isContextMenuOpening)) {
            return;
        }
        Performance_1.default.markStart(CONST_1.default.TIMING.OPEN_REPORT_FROM_PREVIEW);
        Timing_1.default.start(CONST_1.default.TIMING.OPEN_REPORT_FROM_PREVIEW);
        Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(iouReportID, undefined, undefined, Navigation_1.default.getActiveRoute()));
    }, [iouReportID]);
    var renderItem = function (_a) {
        var item = _a.item;
        return (<TransactionPreview_1.default allReports={allReports} chatReportID={chatReportID} action={(0, ReportActionsUtils_1.getIOUActionForReportID)(item.reportID, item.transactionID)} contextAction={action} reportID={item.reportID} isBillSplit={isSplitBillAction} isTrackExpense={isTrackExpenseAction} contextMenuAnchor={contextMenuAnchor} isWhisper={isWhisper} isHovered={isHovered} iouReportID={iouReportID} containerStyles={[styles.h100, reportPreviewStyles.transactionPreviewCarouselStyle]} shouldDisplayContextMenu={shouldDisplayContextMenu} transactionPreviewWidth={reportPreviewStyles.transactionPreviewCarouselStyle.width} transactionID={item.transactionID} reportPreviewAction={action} onPreviewPressed={openReportFromPreview} shouldShowPayerAndReceiver={shouldShowPayerAndReceiver}/>);
    };
    var fsClass = Fullstory_1.default.getChatFSClass(personalDetailsList, iouReport);
    return (<MoneyRequestReportPreviewContent_1.default iouReportID={iouReportID} chatReportID={chatReportID} iouReport={iouReport} chatReport={chatReport} action={action} containerStyles={[reportPreviewStyles.componentStyle]} contextMenuAnchor={contextMenuAnchor} isHovered={isHovered} isWhisper={isWhisper} checkIfContextMenuActive={checkIfContextMenuActive} onPaymentOptionsShow={onPaymentOptionsShow} onPaymentOptionsHide={onPaymentOptionsHide} transactions={transactions} violations={violations} policy={policy} invoiceReceiverPersonalDetail={invoiceReceiverPersonalDetail} invoiceReceiverPolicy={invoiceReceiverPolicy} lastTransactionViolations={lastTransactionViolations} renderTransactionItem={renderItem} onCarouselLayout={onCarouselLayout} onWrapperLayout={onWrapperLayout} currentWidth={widths.currentWidth} reportPreviewStyles={reportPreviewStyles} shouldDisplayContextMenu={shouldDisplayContextMenu} isInvoice={isInvoice} onPress={openReportFromPreview} shouldShowBorder={shouldShowBorder} forwardedFSClass={fsClass}/>);
}
MoneyRequestReportPreview.displayName = 'MoneyRequestReportPreview';
exports.default = MoneyRequestReportPreview;
