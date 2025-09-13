"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mapValues_1 = require("lodash/mapValues");
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConfirmModal_1 = require("@components/ConfirmModal");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ReceiptAudit_1 = require("@components/ReceiptAudit");
const ReceiptEmptyState_1 = require("@components/ReceiptEmptyState");
const useActiveRoute_1 = require("@hooks/useActiveRoute");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useTransactionViolations_1 = require("@hooks/useTransactionViolations");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const ReceiptUtils_1 = require("@libs/ReceiptUtils");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const ViolationsUtils_1 = require("@libs/Violations/ViolationsUtils");
const Navigation_1 = require("@navigation/Navigation");
const IOU_1 = require("@userActions/IOU");
const Report_1 = require("@userActions/Report");
const ReportActions_1 = require("@userActions/ReportActions");
const Transaction_1 = require("@userActions/Transaction");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const ReportActionItemImage_1 = require("./ReportActionItemImage");
const receiptImageViolationNames = [
    CONST_1.default.VIOLATIONS.RECEIPT_REQUIRED,
    CONST_1.default.VIOLATIONS.RECEIPT_NOT_SMART_SCANNED,
    CONST_1.default.VIOLATIONS.CASH_EXPENSE_WITH_NO_RECEIPT,
    CONST_1.default.VIOLATIONS.SMARTSCAN_FAILED,
    CONST_1.default.VIOLATIONS.PROHIBITED_EXPENSE,
    CONST_1.default.VIOLATIONS.RECEIPT_GENERATED_WITH_AI,
];
const receiptFieldViolationNames = [CONST_1.default.VIOLATIONS.MODIFIED_AMOUNT, CONST_1.default.VIOLATIONS.MODIFIED_DATE];
function MoneyRequestReceiptView({ allReports, report, readonly = false, updatedTransaction, isFromReviewDuplicates = false, mergeTransactionID }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { getReportRHPActiveRoute } = (0, useActiveRoute_1.default)();
    const parentReportID = report?.parentReportID;
    const parentReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReportID}`];
    const chatReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReport?.parentReportID}`];
    const [parentReportActions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${parentReportID}`, {
        canEvict: false,
        canBeMissing: true,
    });
    const parentReportAction = report?.parentReportActionID ? parentReportActions?.[report.parentReportActionID] : undefined;
    const isTrackExpense = (0, ReportUtils_1.isTrackExpenseReport)(report);
    const moneyRequestReport = parentReport;
    const linkedTransactionID = (0, react_1.useMemo)(() => {
        if (!parentReportAction) {
            return undefined;
        }
        const originalMessage = parentReportAction && (0, ReportActionsUtils_1.isMoneyRequestAction)(parentReportAction) ? (0, ReportActionsUtils_1.getOriginalMessage)(parentReportAction) : undefined;
        return originalMessage?.IOUTransactionID;
    }, [parentReportAction]);
    const [transaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${(0, getNonEmptyStringOnyxID_1.default)(linkedTransactionID)}`, { canBeMissing: true });
    const transactionViolations = (0, useTransactionViolations_1.default)(transaction?.transactionID);
    const isDistanceRequest = (0, TransactionUtils_1.isDistanceRequest)(transaction);
    const hasReceipt = (0, TransactionUtils_1.hasReceipt)(updatedTransaction ?? transaction);
    const isTransactionScanning = (0, TransactionUtils_1.isScanning)(updatedTransaction ?? transaction);
    const didReceiptScanSucceed = hasReceipt && (0, TransactionUtils_1.didReceiptScanSucceed)(transaction);
    const isInvoice = (0, ReportUtils_1.isInvoiceReport)(moneyRequestReport);
    const isPaidReport = (0, ReportActionsUtils_1.isPayAction)(parentReportAction);
    const isChatReportArchived = (0, useReportIsArchived_1.default)(moneyRequestReport?.chatReportID);
    // Flags for allowing or disallowing editing an expense
    // Used for non-restricted fields such as: description, category, tag, billable, etc...
    const isReportArchived = (0, useReportIsArchived_1.default)(report?.reportID);
    const isEditable = !!(0, ReportUtils_1.canUserPerformWriteAction)(report, isReportArchived) && !readonly;
    const canEdit = (0, ReportActionsUtils_1.isMoneyRequestAction)(parentReportAction) && (0, ReportUtils_1.canEditMoneyRequest)(parentReportAction, transaction, isChatReportArchived) && isEditable;
    const canEditReceipt = isEditable && (0, ReportUtils_1.canEditFieldOfMoneyRequest)(parentReportAction, CONST_1.default.EDIT_REQUEST_FIELD.RECEIPT, undefined, isChatReportArchived);
    const iouType = (0, react_1.useMemo)(() => {
        if (isTrackExpense) {
            return CONST_1.default.IOU.TYPE.TRACK;
        }
        if (isInvoice) {
            return CONST_1.default.IOU.TYPE.INVOICE;
        }
        return CONST_1.default.IOU.TYPE.SUBMIT;
    }, [isTrackExpense, isInvoice]);
    let receiptURIs;
    if (hasReceipt) {
        receiptURIs = (0, ReceiptUtils_1.getThumbnailAndImageURIs)(updatedTransaction ?? transaction);
    }
    const pendingAction = transaction?.pendingAction;
    // Need to return undefined when we have pendingAction to avoid the duplicate pending action
    const getPendingFieldAction = (fieldPath) => (pendingAction ? undefined : transaction?.pendingFields?.[fieldPath]);
    const isReceiptAllowed = !isPaidReport && !isInvoice;
    const shouldShowReceiptEmptyState = isReceiptAllowed && !hasReceipt;
    const [receiptImageViolations, receiptViolations] = (0, react_1.useMemo)(() => {
        const imageViolations = [];
        const allViolations = [];
        for (const violation of transactionViolations ?? []) {
            const isReceiptFieldViolation = receiptFieldViolationNames.includes(violation.name);
            const isReceiptImageViolation = receiptImageViolationNames.includes(violation.name);
            if (isReceiptFieldViolation || isReceiptImageViolation) {
                const violationMessage = ViolationsUtils_1.default.getViolationTranslation(violation, translate, canEdit);
                allViolations.push(violationMessage);
                if (isReceiptImageViolation) {
                    imageViolations.push(violationMessage);
                }
            }
        }
        return [imageViolations, allViolations];
    }, [transactionViolations, translate, canEdit]);
    const receiptRequiredViolation = transactionViolations?.some((violation) => violation.name === CONST_1.default.VIOLATIONS.RECEIPT_REQUIRED);
    const customRulesViolation = transactionViolations?.some((violation) => violation.name === CONST_1.default.VIOLATIONS.CUSTOM_RULES);
    // Whether to show receipt audit result (e.g.`Verified`, `Issue Found`) and messages (e.g. `Receipt not verified. Please confirm accuracy.`)
    // `!!(receiptViolations.length || didReceiptScanSucceed)` is for not showing `Verified` when `receiptViolations` is empty and `didReceiptScanSucceed` is false.
    const shouldShowAuditMessage = !isTransactionScanning && (hasReceipt || !!receiptRequiredViolation || !!customRulesViolation) && !!(receiptViolations.length || didReceiptScanSucceed) && (0, ReportUtils_1.isPaidGroupPolicy)(report);
    const shouldShowReceiptAudit = isReceiptAllowed && (shouldShowReceiptEmptyState || hasReceipt);
    const errors = {
        ...(transaction?.errorFields?.route ?? transaction?.errorFields?.waypoints ?? transaction?.errors),
        ...parentReportAction?.errors,
    };
    const [showConfirmDismissReceiptError, setShowConfirmDismissReceiptError] = (0, react_1.useState)(false);
    const dismissReceiptError = (0, react_1.useCallback)(() => {
        if (!report?.reportID) {
            return;
        }
        if (transaction?.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD) {
            if (chatReport?.reportID && (0, ReportUtils_1.getCreationReportErrors)(chatReport)) {
                (0, Report_1.navigateToConciergeChatAndDeleteReport)(chatReport.reportID, true, true);
                return;
            }
            if (parentReportAction) {
                (0, IOU_1.cleanUpMoneyRequest)(transaction?.transactionID ?? linkedTransactionID, parentReportAction, report.reportID, true);
                return;
            }
        }
        if (!transaction?.transactionID) {
            if (!linkedTransactionID) {
                return;
            }
            (0, Transaction_1.clearError)(linkedTransactionID);
            (0, ReportActions_1.clearAllRelatedReportActionErrors)(report.reportID, parentReportAction);
            return;
        }
        (0, Transaction_1.revert)(transaction, (0, Transaction_1.getLastModifiedExpense)(report?.reportID));
        (0, Transaction_1.clearError)(transaction.transactionID);
        (0, ReportActions_1.clearAllRelatedReportActionErrors)(report.reportID, parentReportAction);
    }, [transaction, chatReport, parentReportAction, linkedTransactionID, report?.reportID]);
    const receiptStyle = shouldUseNarrowLayout ? styles.expenseViewImageSmall : styles.expenseViewImage;
    return (<react_native_1.View style={styles.pRelative}>
            {shouldShowReceiptAudit && (<OfflineWithFeedback_1.default pendingAction={getPendingFieldAction('receipt')}>
                    <ReceiptAudit_1.default notes={receiptViolations} shouldShowAuditResult={!!shouldShowAuditMessage}/>
                </OfflineWithFeedback_1.default>)}
            {shouldShowReceiptEmptyState && (<OfflineWithFeedback_1.default pendingAction={getPendingFieldAction('receipt')} style={styles.mv3}>
                    <ReceiptEmptyState_1.default disabled={!canEditReceipt} onPress={() => {
                if (!transaction?.transactionID || !report?.reportID) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_SCAN.getRoute(CONST_1.default.IOU.ACTION.EDIT, iouType, transaction.transactionID, report.reportID, getReportRHPActiveRoute()));
            }} isThumbnail={!canEditReceipt} isInMoneyRequestView style={receiptStyle}/>
                </OfflineWithFeedback_1.default>)}
            {(hasReceipt || !(0, EmptyObject_1.isEmptyObject)(errors)) && (<OfflineWithFeedback_1.default pendingAction={isDistanceRequest ? getPendingFieldAction('waypoints') : getPendingFieldAction('receipt')} errors={errors} errorRowStyles={[styles.mh4, !shouldShowReceiptEmptyState && styles.mt3]} onClose={() => {
                if (!transaction?.transactionID && !linkedTransactionID) {
                    return;
                }
                const errorEntries = Object.entries(errors ?? {});
                const errorMessages = (0, mapValues_1.default)(Object.fromEntries(errorEntries), (error) => error);
                const hasReceiptError = Object.values(errorMessages).some((error) => (0, ErrorUtils_1.isReceiptError)(error));
                if (hasReceiptError) {
                    setShowConfirmDismissReceiptError(true);
                }
                else {
                    dismissReceiptError();
                }
            }} dismissError={dismissReceiptError} style={shouldShowReceiptEmptyState ? styles.mb3 : styles.mv3}>
                    {hasReceipt && (<react_native_1.View style={[styles.moneyRequestViewImage, receiptStyle]}>
                            <ReportActionItemImage_1.default thumbnail={receiptURIs?.thumbnail} fileExtension={receiptURIs?.fileExtension} isThumbnail={receiptURIs?.isThumbnail} image={receiptURIs?.image} isLocalFile={receiptURIs?.isLocalFile} filename={receiptURIs?.filename} transaction={updatedTransaction ?? transaction} enablePreviewModal readonly={readonly || !canEditReceipt} isFromReviewDuplicates={isFromReviewDuplicates} mergeTransactionID={mergeTransactionID}/>
                        </react_native_1.View>)}
                </OfflineWithFeedback_1.default>)}
            {!shouldShowReceiptEmptyState && !hasReceipt && <react_native_1.View style={{ marginVertical: 6 }}/>}
            {!!shouldShowAuditMessage && <ReceiptAudit_1.ReceiptAuditMessages notes={receiptImageViolations}/>}
            <ConfirmModal_1.default isVisible={showConfirmDismissReceiptError} onConfirm={() => {
            dismissReceiptError();
            setShowConfirmDismissReceiptError(false);
        }} onCancel={() => {
            setShowConfirmDismissReceiptError(false);
        }} title={translate('iou.dismissReceiptError')} prompt={translate('iou.dismissReceiptErrorConfirmation')} confirmText={translate('common.dismiss')} cancelText={translate('common.cancel')} shouldShowCancelButton danger/>
        </react_native_1.View>);
}
MoneyRequestReceiptView.displayName = 'MoneyRequestReceiptView';
exports.default = MoneyRequestReceiptView;
