"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const AttachmentModal_1 = require("@components/AttachmentModal");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const IOU_1 = require("@libs/actions/IOU");
const Report_1 = require("@libs/actions/Report");
const MergeTransactionUtils_1 = require("@libs/MergeTransactionUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReceiptUtils_1 = require("@libs/ReceiptUtils");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const tryResolveUrlFromApiRoot_1 = require("@libs/tryResolveUrlFromApiRoot");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function TransactionReceipt({ route }) {
    const reportID = route.params.reportID;
    const transactionID = route.params.transactionID;
    const action = 'action' in route.params ? route.params.action : undefined;
    const iouType = 'iouType' in route.params ? route.params.iouType : undefined;
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, { canBeMissing: true });
    const [transactionMain] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, { canBeMissing: true });
    const [transactionDraft] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`, { canBeMissing: true });
    const [reportMetadata = CONST_1.default.DEFAULT_REPORT_METADATA] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`, { canBeMissing: true });
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const mergeTransactionID = 'mergeTransactionID' in route.params ? route.params.mergeTransactionID : undefined;
    const isFromReviewDuplicates = 'isFromReviewDuplicates' in route.params ? route.params.isFromReviewDuplicates === 'true' : undefined;
    const [mergeTransaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION}${mergeTransactionID}`, { canBeMissing: true });
    const isDraftTransaction = !!action;
    // Determine which transaction to use based on the scenario
    let transaction;
    if (isDraftTransaction) {
        transaction = transactionDraft;
    }
    else if (mergeTransactionID && mergeTransaction && transactionMain) {
        // If we have a merge transaction, we need to use the receipt from the merge transaction
        transaction = {
            ...transactionMain,
            receipt: mergeTransaction.receipt,
            filename: (0, MergeTransactionUtils_1.getReceiptFileName)(mergeTransaction.receipt),
        };
    }
    else {
        transaction = transactionMain;
    }
    const receiptURIs = (0, ReceiptUtils_1.getThumbnailAndImageURIs)(transaction);
    const isLocalFile = receiptURIs.isLocalFile;
    const readonly = route.params.readonly === 'true';
    const imageSource = isDraftTransaction ? transactionDraft?.receipt?.source : (0, tryResolveUrlFromApiRoot_1.default)(receiptURIs.image ?? '');
    const parentReportAction = (0, ReportActionsUtils_1.getReportAction)(report?.parentReportID, report?.parentReportActionID);
    const canEditReceipt = (0, ReportUtils_1.canEditFieldOfMoneyRequest)(parentReportAction, CONST_1.default.EDIT_REQUEST_FIELD.RECEIPT);
    const canDeleteReceipt = (0, ReportUtils_1.canEditFieldOfMoneyRequest)(parentReportAction, CONST_1.default.EDIT_REQUEST_FIELD.RECEIPT, true);
    const isEReceipt = transaction && !(0, TransactionUtils_1.hasReceiptSource)(transaction) && (0, TransactionUtils_1.hasEReceipt)(transaction);
    const isTrackExpenseAction = (0, ReportActionsUtils_1.isTrackExpenseAction)(parentReportAction);
    (0, react_1.useEffect)(() => {
        if ((!!report && !!transaction) || isDraftTransaction) {
            return;
        }
        (0, Report_1.openReport)(reportID);
        // I'm disabling the warning, as it expects to use exhaustive deps, even though we want this useEffect to run only on the first render.
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    const receiptPath = transaction?.receipt?.source;
    (0, react_1.useEffect)(() => {
        if (!isDraftTransaction || !iouType || !transaction) {
            return;
        }
        const requestType = (0, TransactionUtils_1.getRequestType)(transaction, isBetaEnabled(CONST_1.default.BETAS.MANUAL_DISTANCE));
        const receiptFilename = transaction?.filename;
        const receiptType = transaction?.receipt?.type;
        (0, IOU_1.navigateToStartStepIfScanFileCannotBeRead)(receiptFilename, receiptPath, () => { }, requestType, iouType, transactionID, reportID, receiptType, () => Navigation_1.default.goBack(ROUTES_1.default.MONEY_REQUEST_STEP_SCAN.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType, transactionID, reportID, ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(action, iouType, transactionID, reportID))));
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [receiptPath]);
    const moneyRequestReportID = (0, ReportUtils_1.isMoneyRequestReport)(report) ? report?.reportID : report?.parentReportID;
    const isTrackExpenseReport = (0, ReportUtils_1.isTrackExpenseReport)(report);
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowNotFoundPage = isTrackExpenseReport || isDraftTransaction || transaction?.reportID === CONST_1.default.REPORT.SPLIT_REPORT_ID || isFromReviewDuplicates
        ? !transaction
        : moneyRequestReportID !== transaction?.reportID;
    return (<AttachmentModal_1.default source={imageSource} isAuthTokenRequired={!isLocalFile && !isDraftTransaction} report={report} isReceiptAttachment canEditReceipt={((canEditReceipt && !readonly) || isDraftTransaction) && !transaction?.receipt?.isTestDriveReceipt} canDeleteReceipt={canDeleteReceipt && !readonly && !isDraftTransaction && !transaction?.receipt?.isTestDriveReceipt} allowDownload={!isEReceipt} isTrackExpenseAction={isTrackExpenseAction} originalFileName={isDraftTransaction ? transaction?.filename : receiptURIs?.filename} defaultOpen iouAction={action} iouType={iouType} draftTransactionID={isDraftTransaction ? transactionID : undefined} onModalClose={Navigation_1.default.dismissModal} isLoading={!transaction && reportMetadata?.isLoadingInitialReportActions} shouldShowNotFoundPage={shouldShowNotFoundPage}/>);
}
TransactionReceipt.displayName = 'TransactionReceipt';
exports.default = TransactionReceipt;
