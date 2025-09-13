"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const useDuplicateTransactionsAndViolations_1 = require("@hooks/useDuplicateTransactionsAndViolations");
const useLoadingBarVisibility_1 = require("@hooks/useLoadingBarVisibility");
const useLocalize_1 = require("@hooks/useLocalize");
const useMobileSelectionMode_1 = require("@hooks/useMobileSelectionMode");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useParticipantsInvoiceReport_1 = require("@hooks/useParticipantsInvoiceReport");
const usePaymentAnimations_1 = require("@hooks/usePaymentAnimations");
const usePaymentOptions_1 = require("@hooks/usePaymentOptions");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSelectedTransactionsActions_1 = require("@hooks/useSelectedTransactionsActions");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useTransactionsAndViolationsForReport_1 = require("@hooks/useTransactionsAndViolationsForReport");
const useTransactionViolations_1 = require("@hooks/useTransactionViolations");
const MergeTransaction_1 = require("@libs/actions/MergeTransaction");
const MobileSelectionMode_1 = require("@libs/actions/MobileSelectionMode");
const Report_1 = require("@libs/actions/Report");
const Search_1 = require("@libs/actions/Search");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const getPlatform_1 = require("@libs/getPlatform");
const Log_1 = require("@libs/Log");
const MoneyRequestReportUtils_1 = require("@libs/MoneyRequestReportUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const NextStepUtils_1 = require("@libs/NextStepUtils");
const PaymentUtils_1 = require("@libs/PaymentUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportPrimaryActionUtils_1 = require("@libs/ReportPrimaryActionUtils");
const ReportSecondaryActionUtils_1 = require("@libs/ReportSecondaryActionUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const variables_1 = require("@styles/variables");
const IOU_1 = require("@userActions/IOU");
const Transaction_1 = require("@userActions/Transaction");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const AnimatedSubmitButton_1 = require("./AnimatedSubmitButton");
const BrokenConnectionDescription_1 = require("./BrokenConnectionDescription");
const Button_1 = require("./Button");
const ButtonWithDropdownMenu_1 = require("./ButtonWithDropdownMenu");
const ConfirmModal_1 = require("./ConfirmModal");
const DecisionModal_1 = require("./DecisionModal");
const DelegateNoAccessModalProvider_1 = require("./DelegateNoAccessModalProvider");
const Header_1 = require("./Header");
const HeaderWithBackButton_1 = require("./HeaderWithBackButton");
const HoldOrRejectEducationalModal_1 = require("./HoldOrRejectEducationalModal");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const KYCWall_1 = require("./KYCWall");
const LoadingBar_1 = require("./LoadingBar");
const Modal_1 = require("./Modal");
const MoneyReportHeaderStatusBar_1 = require("./MoneyReportHeaderStatusBar");
const MoneyReportHeaderStatusBarSkeleton_1 = require("./MoneyReportHeaderStatusBarSkeleton");
const MoneyRequestHeaderStatusBar_1 = require("./MoneyRequestHeaderStatusBar");
const ProcessMoneyReportHoldMenu_1 = require("./ProcessMoneyReportHoldMenu");
const SearchContext_1 = require("./Search/SearchContext");
const AnimatedSettlementButton_1 = require("./SettlementButton/AnimatedSettlementButton");
const Text_1 = require("./Text");
function MoneyReportHeader({ policy, report: moneyRequestReport, transactionThreadReportID, reportActions, isLoadingInitialReportActions, shouldDisplayBackButton = false, onBackButtonPress, }) {
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to use a correct layout for the hold expense modal https://github.com/Expensify/App/pull/47990#issuecomment-2362382026
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { shouldUseNarrowLayout, isSmallScreenWidth, isMediumScreenWidth } = (0, useResponsiveLayout_1.default)();
    const shouldDisplayNarrowVersion = shouldUseNarrowLayout || isMediumScreenWidth;
    const route = (0, native_1.useRoute)();
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const [chatReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${moneyRequestReport?.chatReportID}`, { canBeMissing: true });
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const [nextStep] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${moneyRequestReport?.reportID}`, { canBeMissing: true });
    const [isUserValidated] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { selector: (account) => account?.validated, canBeMissing: true });
    const [transactionThreadReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReportID}`, { canBeMissing: true });
    const [reportPDFFilename] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.NVP_EXPENSIFY_REPORT_PDF_FILENAME}${moneyRequestReport?.reportID}`, { canBeMissing: true }) ?? null;
    const [download] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.DOWNLOAD}${reportPDFFilename}`, { canBeMissing: true });
    const isDownloadingPDF = download?.isDownloading ?? false;
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const [activePolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, { canBeMissing: true });
    const [integrationsExportTemplates] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_INTEGRATION_SERVER_EXPORT_TEMPLATES, { canBeMissing: true });
    const [csvExportLayouts] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_CSV_EXPORT_LAYOUTS, { canBeMissing: true });
    // Collate the list of user-created in-app export templates
    const customInAppTemplates = (0, react_1.useMemo)(() => {
        const policyTemplates = Object.entries(policy?.exportLayouts ?? {}).map(([templateName, layout]) => ({
            ...layout,
            templateName,
            description: policy?.name,
            policyID: policy?.id,
        }));
        // Collate a list of the user's account level in-app export templates, excluding the Default CSV template
        const csvTemplates = Object.entries(csvExportLayouts ?? {})
            .filter(([, layout]) => layout.name !== CONST_1.default.REPORT.EXPORT_OPTION_LABELS.DEFAULT_CSV)
            .map(([templateName, layout]) => ({
            ...layout,
            templateName,
            description: '',
            policyID: undefined,
        }));
        return [...policyTemplates, ...csvTemplates];
    }, [csvExportLayouts, policy]);
    const requestParentReportAction = (0, react_1.useMemo)(() => {
        if (!reportActions || !transactionThreadReport?.parentReportActionID) {
            return null;
        }
        return reportActions.find((action) => action.reportActionID === transactionThreadReport.parentReportActionID);
    }, [reportActions, transactionThreadReport?.parentReportActionID]);
    const { transactions: reportTransactions, violations } = (0, useTransactionsAndViolationsForReport_1.default)(moneyRequestReport?.reportID);
    const transactions = (0, react_1.useMemo)(() => {
        return Object.values(reportTransactions);
    }, [reportTransactions]);
    const iouTransactionID = (0, ReportActionsUtils_1.isMoneyRequestAction)(requestParentReportAction) ? (0, ReportActionsUtils_1.getOriginalMessage)(requestParentReportAction)?.IOUTransactionID : undefined;
    const [transaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${(0, getNonEmptyStringOnyxID_1.default)(iouTransactionID)}`, {
        canBeMissing: true,
    });
    const [dismissedRejectUseExplanation] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_DISMISSED_REJECT_USE_EXPLANATION, { canBeMissing: true });
    const [dismissedHoldUseExplanation, dismissedHoldUseExplanationResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_DISMISSED_HOLD_USE_EXPLANATION, { canBeMissing: true });
    const isLoadingHoldUseExplained = (0, isLoadingOnyxValue_1.default)(dismissedHoldUseExplanationResult);
    const [invoiceReceiverPolicy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${chatReport?.invoiceReceiver && 'policyID' in chatReport.invoiceReceiver ? chatReport.invoiceReceiver.policyID : undefined}`, { canBeMissing: true });
    const { duplicateTransactions, duplicateTransactionViolations } = (0, useDuplicateTransactionsAndViolations_1.default)(transactions.map((t) => t.transactionID));
    const isExported = (0, react_1.useMemo)(() => (0, ReportUtils_1.isExported)(reportActions), [reportActions]);
    // wrapped in useMemo to improve performance because this is an operation on array
    const integrationNameFromExportMessage = (0, react_1.useMemo)(() => {
        if (!isExported) {
            return null;
        }
        return (0, ReportUtils_1.getIntegrationNameFromExportMessage)(reportActions);
    }, [isExported, reportActions]);
    const transactionViolations = (0, useTransactionViolations_1.default)(transaction?.transactionID);
    const [downloadErrorModalVisible, setDownloadErrorModalVisible] = (0, react_1.useState)(false);
    const [isCancelPaymentModalVisible, setIsCancelPaymentModalVisible] = (0, react_1.useState)(false);
    const [isDeleteExpenseModalVisible, setIsDeleteExpenseModalVisible] = (0, react_1.useState)(false);
    const [isDeleteReportModalVisible, setIsDeleteReportModalVisible] = (0, react_1.useState)(false);
    const [isUnapproveModalVisible, setIsUnapproveModalVisible] = (0, react_1.useState)(false);
    const [isReopenWarningModalVisible, setIsReopenWarningModalVisible] = (0, react_1.useState)(false);
    const [isPDFModalVisible, setIsPDFModalVisible] = (0, react_1.useState)(false);
    const [isExportWithTemplateModalVisible, setIsExportWithTemplateModalVisible] = (0, react_1.useState)(false);
    const [exportModalStatus, setExportModalStatus] = (0, react_1.useState)(null);
    const { isPaidAnimationRunning, isApprovedAnimationRunning, isSubmittingAnimationRunning, startAnimation, stopAnimation, startApprovedAnimation, startSubmittingAnimation } = (0, usePaymentAnimations_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const isOnHold = (0, TransactionUtils_1.isOnHold)(transaction);
    const [policies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true });
    const [isHoldMenuVisible, setIsHoldMenuVisible] = (0, react_1.useState)(false);
    const [paymentType, setPaymentType] = (0, react_1.useState)();
    const [requestType, setRequestType] = (0, react_1.useState)();
    const canAllowSettlement = (0, ReportUtils_1.hasUpdatedTotal)(moneyRequestReport, policy);
    const policyType = policy?.type;
    const connectedIntegration = (0, PolicyUtils_1.getValidConnectedIntegration)(policy);
    const connectedIntegrationFallback = (0, PolicyUtils_1.getConnectedIntegration)(policy);
    const hasScanningReceipt = (0, ReportUtils_1.getTransactionsWithReceipts)(moneyRequestReport?.reportID).some((t) => (0, TransactionUtils_1.isScanning)(t));
    const hasOnlyPendingTransactions = (0, react_1.useMemo)(() => {
        return !!transactions && transactions.length > 0 && transactions.every((t) => (0, TransactionUtils_1.isExpensifyCardTransaction)(t) && (0, TransactionUtils_1.isPending)(t));
    }, [transactions]);
    const transactionIDs = (0, react_1.useMemo)(() => transactions?.map((t) => t.transactionID) ?? [], [transactions]);
    const messagePDF = (0, react_1.useMemo)(() => {
        if (!reportPDFFilename) {
            return translate('reportDetailsPage.waitForPDF');
        }
        if (reportPDFFilename === CONST_1.default.REPORT_DETAILS_MENU_ITEM.ERROR) {
            return translate('reportDetailsPage.errorPDF');
        }
        return translate('reportDetailsPage.generatedPDF');
    }, [reportPDFFilename, translate]);
    // Check if there is pending rter violation in all transactionViolations with given transactionIDs.
    // wrapped in useMemo to avoid unnecessary re-renders and for better performance (array operation inside of function)
    const hasAllPendingRTERViolations = (0, react_1.useMemo)(() => (0, TransactionUtils_1.allHavePendingRTERViolation)(transactions, violations), [transactions, violations]);
    // Check if user should see broken connection violation warning.
    const shouldShowBrokenConnectionViolation = (0, TransactionUtils_1.shouldShowBrokenConnectionViolationForMultipleTransactions)(transactionIDs, moneyRequestReport, policy, violations);
    const hasOnlyHeldExpenses = (0, ReportUtils_1.hasOnlyHeldExpenses)(moneyRequestReport?.reportID);
    const isPayAtEndExpense = (0, TransactionUtils_1.isPayAtEndExpense)(transaction);
    const isArchivedReport = (0, useReportIsArchived_1.default)(moneyRequestReport?.reportID);
    const isChatReportArchived = (0, useReportIsArchived_1.default)(chatReport?.reportID);
    const [archiveReason] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${moneyRequestReport?.reportID}`, { selector: ReportUtils_1.getArchiveReason, canBeMissing: true });
    const [reportNameValuePairs] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${moneyRequestReport?.reportID}`, { canBeMissing: true });
    const getCanIOUBePaid = (0, react_1.useCallback)((onlyShowPayElsewhere = false, shouldCheckApprovedState = true) => (0, IOU_1.canIOUBePaid)(moneyRequestReport, chatReport, policy, transaction ? [transaction] : undefined, onlyShowPayElsewhere, undefined, undefined, shouldCheckApprovedState), [moneyRequestReport, chatReport, policy, transaction]);
    const isInvoiceReport = (0, ReportUtils_1.isInvoiceReport)(moneyRequestReport);
    const [isDownloadErrorModalVisible, setIsDownloadErrorModalVisible] = (0, react_1.useState)(false);
    const [isRejectEducationalModalVisible, setIsRejectEducationalModalVisible] = (0, react_1.useState)(false);
    const { selectedTransactionIDs, removeTransaction, clearSelectedTransactions, currentSearchQueryJSON, currentSearchKey } = (0, SearchContext_1.useSearchContext)();
    const beginExportWithTemplate = (0, react_1.useCallback)((templateName, templateType, transactionIDList, policyID) => {
        if (!moneyRequestReport) {
            return;
        }
        setIsExportWithTemplateModalVisible(true);
        (0, Search_1.queueExportSearchWithTemplate)({
            templateName,
            templateType,
            jsonQuery: '{}',
            reportIDList: [moneyRequestReport.reportID],
            transactionIDList,
            policyID,
        });
    }, [moneyRequestReport]);
    const { options: selectedTransactionsOptions, handleDeleteTransactions, isDeleteModalVisible: hookDeleteModalVisible, hideDeleteModal, } = (0, useSelectedTransactionsActions_1.default)({
        report: moneyRequestReport,
        reportActions,
        allTransactionsLength: transactions.length,
        session,
        onExportFailed: () => setIsDownloadErrorModalVisible(true),
        policy,
        beginExportWithTemplate: (templateName, templateType, transactionIDList, policyID) => beginExportWithTemplate(templateName, templateType, transactionIDList, policyID),
    });
    const shouldShowSelectedTransactionsButton = !!selectedTransactionsOptions.length && !transactionThreadReportID;
    const canIOUBePaid = (0, react_1.useMemo)(() => getCanIOUBePaid(), [getCanIOUBePaid]);
    const onlyShowPayElsewhere = (0, react_1.useMemo)(() => !canIOUBePaid && getCanIOUBePaid(true), [canIOUBePaid, getCanIOUBePaid]);
    const shouldShowPayButton = isPaidAnimationRunning || canIOUBePaid || onlyShowPayElsewhere;
    const shouldShowApproveButton = (0, react_1.useMemo)(() => ((0, IOU_1.canApproveIOU)(moneyRequestReport, policy, transactions) && !hasOnlyPendingTransactions) || isApprovedAnimationRunning, [moneyRequestReport, policy, transactions, hasOnlyPendingTransactions, isApprovedAnimationRunning]);
    const shouldDisableApproveButton = shouldShowApproveButton && !(0, ReportUtils_1.isAllowedToApproveExpenseReport)(moneyRequestReport);
    const isFromPaidPolicy = policyType === CONST_1.default.POLICY.TYPE.TEAM || policyType === CONST_1.default.POLICY.TYPE.CORPORATE;
    const hasDuplicates = (0, TransactionUtils_1.hasDuplicateTransactions)(moneyRequestReport?.reportID);
    const shouldShowMarkAsResolved = (0, ReportPrimaryActionUtils_1.isMarkAsResolvedAction)(moneyRequestReport, transactionViolations);
    const shouldShowStatusBar = hasAllPendingRTERViolations ||
        shouldShowBrokenConnectionViolation ||
        hasOnlyHeldExpenses ||
        hasScanningReceipt ||
        isPayAtEndExpense ||
        hasOnlyPendingTransactions ||
        hasDuplicates ||
        shouldShowMarkAsResolved;
    // When prevent self-approval is enabled & the current user is submitter AND they're submitting to themselves, we need to show the optimistic next step
    // We should always show this optimistic message for policies with preventSelfApproval
    // to avoid any flicker during transitions between online/offline states
    const nextApproverAccountID = (0, ReportUtils_1.getNextApproverAccountID)(moneyRequestReport);
    const isSubmitterSameAsNextApprover = (0, ReportUtils_1.isReportOwner)(moneyRequestReport) && nextApproverAccountID === moneyRequestReport?.ownerAccountID;
    const optimisticNextStep = isSubmitterSameAsNextApprover && policy?.preventSelfApproval ? (0, NextStepUtils_1.buildOptimisticNextStepForPreventSelfApprovalsEnabled)() : nextStep;
    const shouldShowNextStep = isFromPaidPolicy && !isInvoiceReport && !shouldShowStatusBar;
    const { nonHeldAmount, fullAmount, hasValidNonHeldAmount } = (0, ReportUtils_1.getNonHeldAndFullAmount)(moneyRequestReport, shouldShowPayButton);
    const isAnyTransactionOnHold = (0, ReportUtils_1.hasHeldExpenses)(moneyRequestReport?.reportID);
    const { isDelegateAccessRestricted, showDelegateNoAccessModal } = (0, react_1.useContext)(DelegateNoAccessModalProvider_1.DelegateNoAccessContext);
    const shouldShowLoadingBar = (0, useLoadingBarVisibility_1.default)();
    const isReportInRHP = route.name === SCREENS_1.default.SEARCH.REPORT_RHP;
    const shouldDisplaySearchRouter = !isReportInRHP || isSmallScreenWidth;
    const existingB2BInvoiceReport = (0, useParticipantsInvoiceReport_1.default)(activePolicyID, CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.BUSINESS, chatReport?.policyID);
    const confirmPayment = (0, react_1.useCallback)((type, payAsBusiness, methodID, paymentMethod) => {
        if (!type || !chatReport) {
            return;
        }
        setPaymentType(type);
        setRequestType(CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY);
        if (isDelegateAccessRestricted) {
            showDelegateNoAccessModal();
        }
        else if (isAnyTransactionOnHold) {
            if ((0, getPlatform_1.default)() === CONST_1.default.PLATFORM.IOS) {
                react_native_1.InteractionManager.runAfterInteractions(() => setIsHoldMenuVisible(true));
            }
            else {
                setIsHoldMenuVisible(true);
            }
        }
        else if (isInvoiceReport) {
            startAnimation();
            (0, IOU_1.payInvoice)(type, chatReport, moneyRequestReport, payAsBusiness, existingB2BInvoiceReport, methodID, paymentMethod);
        }
        else {
            startAnimation();
            (0, IOU_1.payMoneyRequest)(type, chatReport, moneyRequestReport, undefined, true);
            if (currentSearchQueryJSON) {
                (0, Search_1.search)({
                    searchKey: currentSearchKey,
                    shouldCalculateTotals: true,
                    offset: 0,
                    queryJSON: currentSearchQueryJSON,
                });
            }
        }
    }, [
        chatReport,
        isAnyTransactionOnHold,
        isDelegateAccessRestricted,
        showDelegateNoAccessModal,
        isInvoiceReport,
        moneyRequestReport,
        startAnimation,
        existingB2BInvoiceReport,
        currentSearchQueryJSON,
        currentSearchKey,
    ]);
    const confirmApproval = () => {
        setRequestType(CONST_1.default.IOU.REPORT_ACTION_TYPE.APPROVE);
        if (isDelegateAccessRestricted) {
            showDelegateNoAccessModal();
        }
        else if (isAnyTransactionOnHold) {
            setIsHoldMenuVisible(true);
        }
        else {
            startApprovedAnimation();
            (0, IOU_1.approveMoneyRequest)(moneyRequestReport, true);
            if (currentSearchQueryJSON) {
                (0, Search_1.search)({
                    searchKey: currentSearchKey,
                    shouldCalculateTotals: true,
                    offset: 0,
                    queryJSON: currentSearchQueryJSON,
                });
            }
        }
    };
    const markAsCash = (0, react_1.useCallback)(() => {
        if (!requestParentReportAction) {
            return;
        }
        const reportID = transactionThreadReport?.reportID;
        if (!iouTransactionID || !reportID) {
            return;
        }
        (0, Transaction_1.markAsCash)(iouTransactionID, reportID);
    }, [iouTransactionID, requestParentReportAction, transactionThreadReport?.reportID]);
    const getStatusIcon = (src) => (<Icon_1.default src={src} height={variables_1.default.iconSizeSmall} width={variables_1.default.iconSizeSmall} fill={theme.icon}/>);
    const getStatusBarProps = () => {
        if (shouldShowMarkAsResolved) {
            return { icon: getStatusIcon(Expensicons.Hourglass), description: translate('iou.reject.rejectedStatus') };
        }
        if (isPayAtEndExpense) {
            if (!isArchivedReport) {
                return { icon: getStatusIcon(Expensicons.Hourglass), description: translate('iou.bookingPendingDescription') };
            }
            if (isArchivedReport && archiveReason === CONST_1.default.REPORT.ARCHIVE_REASON.BOOKING_END_DATE_HAS_PASSED) {
                return { icon: getStatusIcon(Expensicons.Box), description: translate('iou.bookingArchivedDescription') };
            }
        }
        if (hasOnlyHeldExpenses) {
            return { icon: getStatusIcon(Expensicons.Stopwatch), description: translate(transactions.length > 1 ? 'iou.expensesOnHold' : 'iou.expenseOnHold') };
        }
        if (hasDuplicates) {
            return { icon: getStatusIcon(Expensicons.Flag), description: translate('iou.duplicateTransaction', { isSubmitted: (0, ReportUtils_1.isProcessingReport)(moneyRequestReport) }) };
        }
        if (!!transaction?.transactionID && shouldShowBrokenConnectionViolation) {
            return {
                icon: getStatusIcon(Expensicons.Hourglass),
                description: (<BrokenConnectionDescription_1.default transactionID={transaction?.transactionID} report={moneyRequestReport} policy={policy}/>),
            };
        }
        if (hasAllPendingRTERViolations) {
            return { icon: getStatusIcon(Expensicons.Hourglass), description: translate('iou.pendingMatchWithCreditCardDescription') };
        }
        if (hasOnlyPendingTransactions) {
            return { icon: getStatusIcon(Expensicons.CreditCardHourglass), description: translate('iou.transactionPendingDescription') };
        }
        if (hasScanningReceipt) {
            return { icon: getStatusIcon(Expensicons.ReceiptScan), description: translate('iou.receiptScanInProgressDescription') };
        }
    };
    const getFirstDuplicateThreadID = (transactionsList, allReportActions) => {
        const duplicateTransaction = transactionsList.find((reportTransaction) => (0, TransactionUtils_1.isDuplicate)(reportTransaction));
        if (!duplicateTransaction) {
            return null;
        }
        return (0, MoneyRequestReportUtils_1.getThreadReportIDsForTransactions)(allReportActions, [duplicateTransaction]).at(0);
    };
    const statusBarProps = getStatusBarProps();
    const dismissModalAndUpdateUseReject = () => {
        setIsRejectEducationalModalVisible(false);
        (0, IOU_1.dismissRejectUseExplanation)();
        if (requestParentReportAction) {
            (0, ReportUtils_1.rejectMoneyRequestReason)(requestParentReportAction);
        }
    };
    (0, react_1.useEffect)(() => {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if (isLoadingHoldUseExplained || dismissedHoldUseExplanation || !isOnHold) {
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.PROCESS_MONEY_REQUEST_HOLD.getRoute(Navigation_1.default.getReportRHPActiveRoute()));
    }, [dismissedHoldUseExplanation, isLoadingHoldUseExplained, isOnHold]);
    const primaryAction = (0, react_1.useMemo)(() => {
        return (0, ReportPrimaryActionUtils_1.getReportPrimaryAction)({
            report: moneyRequestReport,
            chatReport,
            reportTransactions: transactions,
            violations,
            policy,
            reportNameValuePairs,
            reportActions,
            isChatReportArchived,
            invoiceReceiverPolicy,
            isPaidAnimationRunning,
            isSubmittingAnimationRunning,
        });
    }, [
        isPaidAnimationRunning,
        isSubmittingAnimationRunning,
        moneyRequestReport,
        chatReport,
        transactions,
        violations,
        policy,
        reportNameValuePairs,
        reportActions,
        isChatReportArchived,
        invoiceReceiverPolicy,
    ]);
    const confirmExport = (0, react_1.useCallback)(() => {
        setExportModalStatus(null);
        if (!moneyRequestReport?.reportID || !connectedIntegration) {
            return;
        }
        if (exportModalStatus === CONST_1.default.REPORT.EXPORT_OPTIONS.EXPORT_TO_INTEGRATION) {
            (0, Report_1.exportToIntegration)(moneyRequestReport?.reportID, connectedIntegration);
        }
        else if (exportModalStatus === CONST_1.default.REPORT.EXPORT_OPTIONS.MARK_AS_EXPORTED) {
            (0, Report_1.markAsManuallyExported)(moneyRequestReport?.reportID, connectedIntegration);
        }
    }, [connectedIntegration, exportModalStatus, moneyRequestReport?.reportID]);
    const getAmount = (actionType) => ({
        formattedAmount: (0, MoneyRequestReportUtils_1.getTotalAmountForIOUReportPreviewButton)(moneyRequestReport, policy, actionType),
    });
    const { formattedAmount: totalAmount } = hasOnlyHeldExpenses ? getAmount(CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.REVIEW) : getAmount(CONST_1.default.REPORT.PRIMARY_ACTIONS.PAY);
    const paymentButtonOptions = (0, usePaymentOptions_1.default)({
        currency: moneyRequestReport?.currency,
        iouReport: moneyRequestReport,
        chatReportID: chatReport?.reportID,
        formattedAmount: totalAmount,
        policyID: moneyRequestReport?.policyID,
        onPress: confirmPayment,
        shouldHidePaymentOptions: !shouldShowPayButton,
        shouldShowApproveButton,
        shouldDisableApproveButton,
        onlyShowPayElsewhere,
    });
    const addExpenseDropdownOptions = (0, react_1.useMemo)(() => [
        {
            value: CONST_1.default.REPORT.ADD_EXPENSE_OPTIONS.CREATE_NEW_EXPENSE,
            text: translate('iou.createExpense'),
            icon: Expensicons.Plus,
            onSelected: () => {
                if (!moneyRequestReport?.reportID) {
                    return;
                }
                if (policy && (0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(policy.id)) {
                    Navigation_1.default.navigate(ROUTES_1.default.RESTRICTED_ACTION.getRoute(policy.id));
                    return;
                }
                (0, IOU_1.startMoneyRequest)(CONST_1.default.IOU.TYPE.SUBMIT, moneyRequestReport?.reportID);
            },
        },
        {
            value: CONST_1.default.REPORT.ADD_EXPENSE_OPTIONS.ADD_UNREPORTED_EXPENSE,
            text: translate('iou.addUnreportedExpense'),
            icon: Expensicons.ReceiptPlus,
            onSelected: () => {
                if (policy && (0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(policy.id)) {
                    Navigation_1.default.navigate(ROUTES_1.default.RESTRICTED_ACTION.getRoute(policy.id));
                    return;
                }
                (0, Report_1.openUnreportedExpense)(moneyRequestReport?.reportID);
            },
        },
    ], [moneyRequestReport?.reportID, policy, translate]);
    const [offlineModalVisible, setOfflineModalVisible] = (0, react_1.useState)(false);
    const exportSubmenuOptions = (0, react_1.useMemo)(() => {
        const options = {
            [CONST_1.default.REPORT.EXPORT_OPTIONS.DOWNLOAD_CSV]: {
                text: translate('export.basicExport'),
                icon: Expensicons.Table,
                value: CONST_1.default.REPORT.EXPORT_OPTIONS.DOWNLOAD_CSV,
                onSelected: () => {
                    if (!moneyRequestReport) {
                        return;
                    }
                    if (isOffline) {
                        setOfflineModalVisible(true);
                        return;
                    }
                    (0, Report_1.exportReportToCSV)({ reportID: moneyRequestReport.reportID, transactionIDList: transactionIDs }, () => {
                        setDownloadErrorModalVisible(true);
                    });
                },
            },
            [CONST_1.default.REPORT.EXPORT_OPTIONS.EXPENSE_LEVEL_EXPORT]: {
                text: translate('export.expenseLevelExport'),
                icon: Expensicons.Table,
                value: CONST_1.default.REPORT.EXPORT_OPTIONS.EXPENSE_LEVEL_EXPORT,
                onSelected: () => beginExportWithTemplate(CONST_1.default.REPORT.EXPORT_OPTIONS.EXPENSE_LEVEL_EXPORT, CONST_1.default.EXPORT_TEMPLATE_TYPES.INTEGRATIONS, transactionIDs),
            },
            [CONST_1.default.REPORT.EXPORT_OPTIONS.REPORT_LEVEL_EXPORT]: {
                text: translate('export.reportLevelExport'),
                icon: Expensicons.Table,
                value: CONST_1.default.REPORT.EXPORT_OPTIONS.REPORT_LEVEL_EXPORT,
                onSelected: () => beginExportWithTemplate(CONST_1.default.REPORT.EXPORT_OPTIONS.REPORT_LEVEL_EXPORT, CONST_1.default.EXPORT_TEMPLATE_TYPES.INTEGRATIONS, transactionIDs),
            },
            [CONST_1.default.REPORT.EXPORT_OPTIONS.EXPORT_TO_INTEGRATION]: {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                text: translate('workspace.common.exportIntegrationSelected', { connectionName: connectedIntegrationFallback }),
                icon: (0, ReportUtils_1.getIntegrationExportIcon)(connectedIntegration ?? connectedIntegrationFallback),
                value: CONST_1.default.REPORT.EXPORT_OPTIONS.EXPORT_TO_INTEGRATION,
                onSelected: () => {
                    if (!connectedIntegration || !moneyRequestReport) {
                        return;
                    }
                    if (isExported) {
                        setExportModalStatus(CONST_1.default.REPORT.EXPORT_OPTIONS.EXPORT_TO_INTEGRATION);
                        return;
                    }
                    (0, Report_1.exportToIntegration)(moneyRequestReport?.reportID, connectedIntegration);
                },
            },
            [CONST_1.default.REPORT.EXPORT_OPTIONS.MARK_AS_EXPORTED]: {
                text: translate('workspace.common.markAsExported'),
                icon: (0, ReportUtils_1.getIntegrationExportIcon)(connectedIntegration ?? connectedIntegrationFallback),
                value: CONST_1.default.REPORT.EXPORT_OPTIONS.MARK_AS_EXPORTED,
                onSelected: () => {
                    if (!connectedIntegration || !moneyRequestReport) {
                        return;
                    }
                    if (isExported) {
                        setExportModalStatus(CONST_1.default.REPORT.EXPORT_OPTIONS.MARK_AS_EXPORTED);
                        return;
                    }
                    (0, Report_1.markAsManuallyExported)(moneyRequestReport?.reportID, connectedIntegration);
                },
            },
        };
        // Add any custom IS export templates that have been added to the user's account as export options
        if (integrationsExportTemplates && integrationsExportTemplates.length > 0) {
            for (const template of integrationsExportTemplates) {
                options[template.name] = {
                    text: template.name,
                    icon: Expensicons.Table,
                    value: template.name,
                    onSelected: () => beginExportWithTemplate(template.name, CONST_1.default.EXPORT_TEMPLATE_TYPES.INTEGRATIONS, transactionIDs),
                };
            }
        }
        // Add any in-app export templates that the user has created as export options
        if (customInAppTemplates && customInAppTemplates.length > 0) {
            for (const template of customInAppTemplates) {
                options[template.name] = {
                    text: template.name,
                    icon: Expensicons.Table,
                    value: template.templateName,
                    description: template.description,
                    onSelected: () => beginExportWithTemplate(template.templateName, CONST_1.default.EXPORT_TEMPLATE_TYPES.IN_APP, transactionIDs, template.policyID),
                };
            }
        }
        return options;
    }, [
        translate,
        connectedIntegrationFallback,
        connectedIntegration,
        moneyRequestReport,
        isOffline,
        transactionIDs,
        isExported,
        beginExportWithTemplate,
        integrationsExportTemplates,
        customInAppTemplates,
    ]);
    const primaryActionsImplementation = {
        [CONST_1.default.REPORT.PRIMARY_ACTIONS.SUBMIT]: (<AnimatedSubmitButton_1.default success text={translate('common.submit')} onPress={() => {
                if (!moneyRequestReport) {
                    return;
                }
                startSubmittingAnimation();
                (0, IOU_1.submitReport)(moneyRequestReport);
                if (currentSearchQueryJSON) {
                    (0, Search_1.search)({
                        searchKey: currentSearchKey,
                        shouldCalculateTotals: true,
                        offset: 0,
                        queryJSON: currentSearchQueryJSON,
                    });
                }
            }} isSubmittingAnimationRunning={isSubmittingAnimationRunning} onAnimationFinish={stopAnimation}/>),
        [CONST_1.default.REPORT.PRIMARY_ACTIONS.APPROVE]: (<Button_1.default success onPress={confirmApproval} text={translate('iou.approve')}/>),
        [CONST_1.default.REPORT.PRIMARY_ACTIONS.PAY]: (<AnimatedSettlementButton_1.default isPaidAnimationRunning={isPaidAnimationRunning} isApprovedAnimationRunning={isApprovedAnimationRunning} onAnimationFinish={stopAnimation} formattedAmount={totalAmount} canIOUBePaid onlyShowPayElsewhere={onlyShowPayElsewhere} currency={moneyRequestReport?.currency} confirmApproval={confirmApproval} policyID={moneyRequestReport?.policyID} chatReportID={chatReport?.reportID} iouReport={moneyRequestReport} onPress={confirmPayment} enablePaymentsRoute={ROUTES_1.default.ENABLE_PAYMENTS} shouldHidePaymentOptions={!shouldShowPayButton} shouldShowApproveButton={shouldShowApproveButton} shouldDisableApproveButton={shouldDisableApproveButton} isDisabled={isOffline && !canAllowSettlement} isLoading={!isOffline && !canAllowSettlement}/>),
        [CONST_1.default.REPORT.PRIMARY_ACTIONS.EXPORT_TO_ACCOUNTING]: (<Button_1.default success 
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        text={translate('workspace.common.exportIntegrationSelected', { connectionName: connectedIntegration })} onPress={() => {
                if (!connectedIntegration || !moneyRequestReport) {
                    return;
                }
                if (isExported) {
                    setExportModalStatus(CONST_1.default.REPORT.EXPORT_OPTIONS.EXPORT_TO_INTEGRATION);
                    return;
                }
                (0, Report_1.exportToIntegration)(moneyRequestReport?.reportID, connectedIntegration);
            }}/>),
        [CONST_1.default.REPORT.PRIMARY_ACTIONS.REMOVE_HOLD]: (<Button_1.default success text={translate('iou.unhold')} onPress={() => {
                const parentReportAction = (0, ReportActionsUtils_1.getReportAction)(moneyRequestReport?.parentReportID, moneyRequestReport?.parentReportActionID);
                const IOUActions = (0, ReportPrimaryActionUtils_1.getAllExpensesToHoldIfApplicable)(moneyRequestReport, reportActions);
                if (IOUActions.length) {
                    IOUActions.forEach(ReportUtils_1.changeMoneyRequestHoldStatus);
                    return;
                }
                const moneyRequestAction = transactionThreadReportID ? requestParentReportAction : parentReportAction;
                if (!moneyRequestAction) {
                    return;
                }
                (0, ReportUtils_1.changeMoneyRequestHoldStatus)(moneyRequestAction);
            }}/>),
        [CONST_1.default.REPORT.PRIMARY_ACTIONS.MARK_AS_CASH]: (<Button_1.default success text={translate('iou.markAsCash')} onPress={markAsCash}/>),
        [CONST_1.default.REPORT.TRANSACTION_PRIMARY_ACTIONS.MARK_AS_RESOLVED]: (<Button_1.default success onPress={() => {
                if (!transaction?.transactionID) {
                    return;
                }
                (0, IOU_1.markRejectViolationAsResolved)(transaction?.transactionID, transactionThreadReport?.reportID);
            }} text={translate('iou.reject.markAsResolved')}/>),
        [CONST_1.default.REPORT.PRIMARY_ACTIONS.REVIEW_DUPLICATES]: (<Button_1.default success text={translate('iou.reviewDuplicates')} onPress={() => {
                let threadID = transactionThreadReportID ?? getFirstDuplicateThreadID(transactions, reportActions);
                if (!threadID) {
                    const duplicateTransaction = transactions.find((reportTransaction) => (0, TransactionUtils_1.isDuplicate)(reportTransaction));
                    const transactionID = duplicateTransaction?.transactionID;
                    const iouAction = (0, ReportActionsUtils_1.getIOUActionForReportID)(moneyRequestReport?.reportID, transactionID);
                    const createdTransactionThreadReport = (0, Report_1.createTransactionThreadReport)(moneyRequestReport, iouAction);
                    threadID = createdTransactionThreadReport?.reportID;
                }
                Navigation_1.default.navigate(ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_PAGE.getRoute(threadID));
            }}/>),
        [CONST_1.default.REPORT.PRIMARY_ACTIONS.ADD_EXPENSE]: (<ButtonWithDropdownMenu_1.default onPress={() => { }} shouldAlwaysShowDropdownMenu customText={translate('iou.addExpense')} options={addExpenseDropdownOptions} isSplitButton={false}/>),
    };
    const beginPDFExport = (reportID) => {
        setIsPDFModalVisible(true);
        (0, Report_1.exportReportToPDF)({ reportID });
    };
    const secondaryActions = (0, react_1.useMemo)(() => {
        if (!moneyRequestReport) {
            return [];
        }
        return (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({
            report: moneyRequestReport,
            chatReport,
            reportTransactions: transactions,
            violations,
            policy,
            reportNameValuePairs,
            reportActions,
            policies,
            isChatReportArchived,
        });
    }, [moneyRequestReport, transactions, violations, policy, reportNameValuePairs, reportActions, policies, chatReport, isChatReportArchived]);
    const secondaryExportActions = (0, react_1.useMemo)(() => {
        if (!moneyRequestReport) {
            return [];
        }
        return (0, ReportSecondaryActionUtils_1.getSecondaryExportReportActions)(moneyRequestReport, policy, reportActions, integrationsExportTemplates ?? [], customInAppTemplates ?? []);
    }, [moneyRequestReport, policy, reportActions, integrationsExportTemplates, customInAppTemplates]);
    const secondaryActionsImplementation = {
        [CONST_1.default.REPORT.SECONDARY_ACTIONS.VIEW_DETAILS]: {
            value: CONST_1.default.REPORT.SECONDARY_ACTIONS.VIEW_DETAILS,
            text: translate('iou.viewDetails'),
            icon: Expensicons.Info,
            onSelected: () => {
                (0, ReportUtils_1.navigateToDetailsPage)(moneyRequestReport, Navigation_1.default.getReportRHPActiveRoute());
            },
        },
        [CONST_1.default.REPORT.SECONDARY_ACTIONS.EXPORT]: {
            value: CONST_1.default.REPORT.SECONDARY_ACTIONS.EXPORT,
            text: translate('common.export'),
            backButtonText: translate('common.export'),
            icon: Expensicons.Export,
            rightIcon: Expensicons.ArrowRight,
            subMenuItems: secondaryExportActions.map((action) => exportSubmenuOptions[action]),
        },
        [CONST_1.default.REPORT.SECONDARY_ACTIONS.DOWNLOAD_PDF]: {
            value: CONST_1.default.REPORT.SECONDARY_ACTIONS.DOWNLOAD_PDF,
            text: translate('common.downloadAsPDF'),
            icon: Expensicons.Document,
            onSelected: () => {
                if (!moneyRequestReport) {
                    return;
                }
                beginPDFExport(moneyRequestReport.reportID);
            },
        },
        [CONST_1.default.REPORT.SECONDARY_ACTIONS.SUBMIT]: {
            value: CONST_1.default.REPORT.SECONDARY_ACTIONS.SUBMIT,
            text: translate('common.submit'),
            icon: Expensicons.Send,
            onSelected: () => {
                if (!moneyRequestReport) {
                    return;
                }
                (0, IOU_1.submitReport)(moneyRequestReport);
            },
        },
        [CONST_1.default.REPORT.SECONDARY_ACTIONS.APPROVE]: {
            text: translate('iou.approve', getAmount(CONST_1.default.REPORT.SECONDARY_ACTIONS.APPROVE)),
            icon: Expensicons.ThumbsUp,
            value: CONST_1.default.REPORT.SECONDARY_ACTIONS.APPROVE,
            onSelected: confirmApproval,
        },
        [CONST_1.default.REPORT.SECONDARY_ACTIONS.UNAPPROVE]: {
            text: translate('iou.unapprove'),
            icon: Expensicons.CircularArrowBackwards,
            value: CONST_1.default.REPORT.SECONDARY_ACTIONS.UNAPPROVE,
            onSelected: () => {
                if (isDelegateAccessRestricted) {
                    showDelegateNoAccessModal();
                    return;
                }
                if (isExported) {
                    setIsUnapproveModalVisible(true);
                    return;
                }
                (0, IOU_1.unapproveExpenseReport)(moneyRequestReport);
            },
        },
        [CONST_1.default.REPORT.SECONDARY_ACTIONS.CANCEL_PAYMENT]: {
            text: translate('iou.cancelPayment'),
            icon: Expensicons.Clear,
            value: CONST_1.default.REPORT.SECONDARY_ACTIONS.CANCEL_PAYMENT,
            onSelected: () => {
                setIsCancelPaymentModalVisible(true);
            },
        },
        [CONST_1.default.REPORT.SECONDARY_ACTIONS.HOLD]: {
            text: translate('iou.hold'),
            icon: Expensicons.Stopwatch,
            value: CONST_1.default.REPORT.SECONDARY_ACTIONS.HOLD,
            onSelected: () => {
                if (!requestParentReportAction) {
                    throw new Error('Parent action does not exist');
                }
                if (isDelegateAccessRestricted) {
                    showDelegateNoAccessModal();
                    return;
                }
                (0, ReportUtils_1.changeMoneyRequestHoldStatus)(requestParentReportAction);
            },
        },
        [CONST_1.default.REPORT.SECONDARY_ACTIONS.REMOVE_HOLD]: {
            text: translate('iou.unhold'),
            icon: Expensicons.Stopwatch,
            value: CONST_1.default.REPORT.SECONDARY_ACTIONS.REMOVE_HOLD,
            onSelected: () => {
                if (!requestParentReportAction) {
                    throw new Error('Parent action does not exist');
                }
                (0, ReportUtils_1.changeMoneyRequestHoldStatus)(requestParentReportAction);
            },
        },
        [CONST_1.default.REPORT.SECONDARY_ACTIONS.SPLIT]: {
            text: translate('iou.split'),
            icon: Expensicons.ArrowSplit,
            value: CONST_1.default.REPORT.SECONDARY_ACTIONS.SPLIT,
            onSelected: () => {
                if (Number(transactions?.length) !== 1) {
                    return;
                }
                const currentTransaction = transactions.at(0);
                (0, IOU_1.initSplitExpense)(currentTransaction);
            },
        },
        [CONST_1.default.REPORT.SECONDARY_ACTIONS.MERGE]: {
            text: translate('common.merge'),
            icon: Expensicons.ArrowCollapse,
            value: CONST_1.default.REPORT.SECONDARY_ACTIONS.MERGE,
            onSelected: () => {
                const currentTransaction = transactions.at(0);
                if (!currentTransaction) {
                    return;
                }
                (0, MergeTransaction_1.setupMergeTransactionData)(currentTransaction.transactionID, { targetTransactionID: currentTransaction.transactionID });
                Navigation_1.default.navigate(ROUTES_1.default.MERGE_TRANSACTION_LIST_PAGE.getRoute(currentTransaction.transactionID, Navigation_1.default.getActiveRoute()));
            },
        },
        [CONST_1.default.REPORT.SECONDARY_ACTIONS.CHANGE_WORKSPACE]: {
            text: translate('iou.changeWorkspace'),
            icon: Expensicons.Buildings,
            value: CONST_1.default.REPORT.SECONDARY_ACTIONS.CHANGE_WORKSPACE,
            onSelected: () => {
                if (!moneyRequestReport) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID_CHANGE_WORKSPACE.getRoute(moneyRequestReport.reportID, Navigation_1.default.getActiveRoute()));
            },
        },
        [CONST_1.default.REPORT.SECONDARY_ACTIONS.CHANGE_APPROVER]: {
            text: translate('iou.changeApprover.title'),
            icon: Expensicons.Workflows,
            value: CONST_1.default.REPORT.SECONDARY_ACTIONS.CHANGE_APPROVER,
            onSelected: () => {
                if (!moneyRequestReport) {
                    Log_1.default.warn('Change approver secondary action triggered without moneyRequestReport data.');
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.REPORT_CHANGE_APPROVER.getRoute(moneyRequestReport.reportID, Navigation_1.default.getActiveRoute()));
            },
        },
        [CONST_1.default.REPORT.SECONDARY_ACTIONS.DELETE]: {
            text: translate('common.delete'),
            icon: Expensicons.Trashcan,
            value: CONST_1.default.REPORT.SECONDARY_ACTIONS.DELETE,
            onSelected: () => {
                if (Object.keys(transactions).length === 1) {
                    setIsDeleteExpenseModalVisible(true);
                }
                else {
                    setIsDeleteReportModalVisible(true);
                }
            },
        },
        [CONST_1.default.REPORT.SECONDARY_ACTIONS.RETRACT]: {
            text: translate('iou.retract'),
            icon: Expensicons.CircularArrowBackwards,
            value: CONST_1.default.REPORT.SECONDARY_ACTIONS.RETRACT,
            onSelected: () => {
                (0, IOU_1.retractReport)(moneyRequestReport);
            },
        },
        [CONST_1.default.REPORT.SECONDARY_ACTIONS.REOPEN]: {
            text: translate('iou.retract'),
            icon: Expensicons.CircularArrowBackwards,
            value: CONST_1.default.REPORT.SECONDARY_ACTIONS.REOPEN,
            onSelected: () => {
                if (isExported) {
                    setIsReopenWarningModalVisible(true);
                    return;
                }
                (0, IOU_1.reopenReport)(moneyRequestReport);
            },
        },
        [CONST_1.default.REPORT.SECONDARY_ACTIONS.REJECT]: {
            text: translate('common.reject'),
            icon: Expensicons.ThumbsDown,
            value: CONST_1.default.REPORT.SECONDARY_ACTIONS.REJECT,
            onSelected: () => {
                if (dismissedRejectUseExplanation) {
                    if (requestParentReportAction) {
                        (0, ReportUtils_1.rejectMoneyRequestReason)(requestParentReportAction);
                    }
                }
                else {
                    setIsRejectEducationalModalVisible(true);
                }
            },
            shouldShow: transactions.length === 1,
        },
        [CONST_1.default.REPORT.SECONDARY_ACTIONS.ADD_EXPENSE]: {
            text: translate('iou.addExpense'),
            backButtonText: translate('iou.addExpense'),
            icon: Expensicons.Plus,
            rightIcon: Expensicons.ArrowRight,
            value: CONST_1.default.REPORT.SECONDARY_ACTIONS.ADD_EXPENSE,
            subMenuItems: addExpenseDropdownOptions,
            onSelected: () => {
                if (!moneyRequestReport?.reportID) {
                    return;
                }
                if (policy && (0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(policy.id)) {
                    Navigation_1.default.navigate(ROUTES_1.default.RESTRICTED_ACTION.getRoute(policy.id));
                    return;
                }
                (0, IOU_1.startMoneyRequest)(CONST_1.default.IOU.TYPE.SUBMIT, moneyRequestReport?.reportID);
            },
        },
        [CONST_1.default.REPORT.SECONDARY_ACTIONS.PAY]: {
            text: translate('iou.settlePayment', { formattedAmount: totalAmount }),
            icon: Expensicons.Cash,
            value: CONST_1.default.REPORT.SECONDARY_ACTIONS.PAY,
            backButtonText: translate('iou.settlePayment', { formattedAmount: totalAmount }),
            subMenuItems: Object.values(paymentButtonOptions),
        },
    };
    const applicableSecondaryActions = secondaryActions
        .map((action) => secondaryActionsImplementation[action])
        .filter((action) => action?.shouldShow !== false && action?.value !== primaryAction);
    (0, react_1.useEffect)(() => {
        if (!transactionThreadReportID) {
            return;
        }
        clearSelectedTransactions(true);
        // We don't need to run the effect on change of clearSelectedTransactions since it can cause the infinite loop.
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactionThreadReportID]);
    const shouldShowBackButton = shouldDisplayBackButton || shouldUseNarrowLayout;
    const connectedIntegrationName = connectedIntegration ? translate('workspace.accounting.connectionName', { connectionName: connectedIntegration }) : '';
    const unapproveWarningText = (0, react_1.useMemo)(() => (<Text_1.default>
                <Text_1.default style={[styles.textStrong, styles.noWrap]}>{translate('iou.headsUp')}</Text_1.default>{' '}
                <Text_1.default>{translate('iou.unapproveWithIntegrationWarning', { accountingIntegration: connectedIntegrationName })}</Text_1.default>
            </Text_1.default>), [connectedIntegrationName, styles.noWrap, styles.textStrong, translate]);
    const isMobileSelectionModeEnabled = (0, useMobileSelectionMode_1.default)();
    if (isMobileSelectionModeEnabled) {
        // If mobile selection mode is enabled but only one or no transactions remain, turn it off
        if (transactions.length <= 1) {
            (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
        }
        return (<HeaderWithBackButton_1.default title={translate('common.selectMultiple')} onBackButtonPress={() => {
                clearSelectedTransactions(true);
                (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
            }}/>);
    }
    const reopenExportedReportWarningText = (<Text_1.default>
            <Text_1.default style={[styles.textStrong, styles.noWrap]}>{translate('iou.headsUp')} </Text_1.default>
            <Text_1.default>{translate('iou.reopenExportedReportConfirmation', { connectionName: integrationNameFromExportMessage ?? '' })}</Text_1.default>
        </Text_1.default>);
    const onPaymentSelect = (event, iouPaymentType, triggerKYCFlow) => (0, PaymentUtils_1.selectPaymentType)(event, iouPaymentType, triggerKYCFlow, policy, confirmPayment, isUserValidated, confirmApproval, moneyRequestReport);
    const KYCMoreDropdown = (<KYCWall_1.default onSuccessfulKYC={(payment) => confirmPayment(payment)} enablePaymentsRoute={ROUTES_1.default.ENABLE_PAYMENTS} isDisabled={isOffline} source={CONST_1.default.KYC_WALL_SOURCE.REPORT} chatReportID={chatReport?.reportID} iouReport={moneyRequestReport} anchorAlignment={{
            horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT, // button is at left, so horizontal anchor is at LEFT
            vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP, // we assume that popover menu opens below the button, anchor is at TOP
        }}>
            {(triggerKYCFlow, buttonRef) => (<ButtonWithDropdownMenu_1.default success={false} onPress={() => { }} onSubItemSelected={(item, index, event) => {
                if (!(0, PaymentUtils_1.isSecondaryActionAPaymentOption)(item)) {
                    return;
                }
                onPaymentSelect(event, item.value, triggerKYCFlow);
            }} buttonRef={buttonRef} shouldAlwaysShowDropdownMenu shouldPopoverUseScrollView={shouldDisplayNarrowVersion && applicableSecondaryActions.length >= 5} customText={translate('common.more')} options={applicableSecondaryActions} isSplitButton={false} wrapperStyle={shouldDisplayNarrowVersion && [!primaryAction && styles.flex1]} shouldUseModalPaddingStyle/>)}
        </KYCWall_1.default>);
    const hasOtherItems = (shouldShowNextStep && !!optimisticNextStep?.message?.length) || (shouldShowNextStep && !optimisticNextStep && !!isLoadingInitialReportActions && !isOffline) || !!statusBarProps;
    const moreContentUnfiltered = [
        shouldShowSelectedTransactionsButton && shouldDisplayNarrowVersion && (<react_native_1.View style={[styles.dFlex, styles.w100, !hasOtherItems && styles.pb3]} key="1">
                <ButtonWithDropdownMenu_1.default onPress={() => null} options={selectedTransactionsOptions} customText={translate('workspace.common.selected', { count: selectedTransactionIDs.length })} isSplitButton={false} shouldAlwaysShowDropdownMenu wrapperStyle={styles.w100}/>
            </react_native_1.View>),
        shouldShowNextStep && !!optimisticNextStep?.message?.length && (<MoneyReportHeaderStatusBar_1.default nextStep={optimisticNextStep} key="2"/>),
        shouldShowNextStep && !optimisticNextStep && !!isLoadingInitialReportActions && !isOffline && <MoneyReportHeaderStatusBarSkeleton_1.default key="3"/>,
        !!statusBarProps && (<MoneyRequestHeaderStatusBar_1.default icon={statusBarProps.icon} description={statusBarProps.description} key="4"/>),
    ];
    const moreContent = moreContentUnfiltered.filter(Boolean);
    const isMoreContentShown = moreContent.length > 0;
    const shouldAddGapToContents = moreContent.length > 1;
    return (<react_native_1.View style={[styles.pt0, styles.borderBottom]}>
            <HeaderWithBackButton_1.default shouldShowReportAvatarWithDisplay shouldDisplayStatus shouldShowPinButton={false} report={moneyRequestReport} shouldShowBackButton={shouldShowBackButton} shouldDisplaySearchRouter={shouldDisplaySearchRouter} onBackButtonPress={onBackButtonPress} shouldShowBorderBottom={false} shouldEnableDetailPageNavigation>
                {!shouldDisplayNarrowVersion && (<react_native_1.View style={[styles.flexRow, styles.gap2]}>
                        {!!primaryAction && !shouldShowSelectedTransactionsButton && primaryActionsImplementation[primaryAction]}
                        {!!applicableSecondaryActions.length && !shouldShowSelectedTransactionsButton && KYCMoreDropdown}
                        {shouldShowSelectedTransactionsButton && (<react_native_1.View>
                                <ButtonWithDropdownMenu_1.default onPress={() => null} options={selectedTransactionsOptions} customText={translate('workspace.common.selected', { count: selectedTransactionIDs.length })} isSplitButton={false} shouldAlwaysShowDropdownMenu/>
                            </react_native_1.View>)}
                    </react_native_1.View>)}
            </HeaderWithBackButton_1.default>
            {shouldDisplayNarrowVersion && !shouldShowSelectedTransactionsButton && (<react_native_1.View style={[styles.flexRow, styles.gap2, styles.pb3, styles.ph5, styles.w100, styles.alignItemsCenter, styles.justifyContentCenter]}>
                    {!!primaryAction && <react_native_1.View style={[styles.flex1]}>{primaryActionsImplementation[primaryAction]}</react_native_1.View>}
                    {!!applicableSecondaryActions.length && KYCMoreDropdown}
                </react_native_1.View>)}

            {isMoreContentShown && <react_native_1.View style={[styles.dFlex, styles.flexColumn, shouldAddGapToContents && styles.gap3, styles.pb3, styles.ph5]}>{moreContent}</react_native_1.View>}

            <LoadingBar_1.default shouldShow={shouldShowLoadingBar && shouldUseNarrowLayout}/>
            {isHoldMenuVisible && requestType !== undefined && (<ProcessMoneyReportHoldMenu_1.default nonHeldAmount={!hasOnlyHeldExpenses && hasValidNonHeldAmount ? nonHeldAmount : undefined} requestType={requestType} fullAmount={fullAmount} onClose={() => setIsHoldMenuVisible(false)} isVisible={isHoldMenuVisible} paymentType={paymentType} chatReport={chatReport} moneyRequestReport={moneyRequestReport} startAnimation={() => {
                if (requestType === CONST_1.default.IOU.REPORT_ACTION_TYPE.APPROVE) {
                    startApprovedAnimation();
                }
                else {
                    startAnimation();
                }
            }} transactionCount={transactionIDs?.length ?? 0}/>)}
            <DecisionModal_1.default title={translate('common.downloadFailedTitle')} prompt={translate('common.downloadFailedDescription')} isSmallScreenWidth={isSmallScreenWidth} onSecondOptionSubmit={() => setDownloadErrorModalVisible(false)} secondOptionText={translate('common.buttonConfirm')} isVisible={downloadErrorModalVisible} onClose={() => setDownloadErrorModalVisible(false)}/>
            <ConfirmModal_1.default title={translate('iou.cancelPayment')} isVisible={isCancelPaymentModalVisible} onConfirm={() => {
            if (!chatReport) {
                return;
            }
            (0, IOU_1.cancelPayment)(moneyRequestReport, chatReport);
            setIsCancelPaymentModalVisible(false);
        }} onCancel={() => setIsCancelPaymentModalVisible(false)} prompt={translate('iou.cancelPaymentConfirmation')} confirmText={translate('iou.cancelPayment')} cancelText={translate('common.dismiss')} danger shouldEnableNewFocusManagement/>
            <ConfirmModal_1.default title={translate('iou.deleteExpense', { count: 1 })} isVisible={isDeleteExpenseModalVisible} onConfirm={() => {
            let goBackRoute;
            setIsDeleteExpenseModalVisible(false);
            if (transactionThreadReportID) {
                if (!requestParentReportAction || !transaction?.transactionID) {
                    throw new Error('Missing data!');
                }
                // it's deleting transaction but not the report which leads to bug (that is actually also on staging)
                // Money request should be deleted when interactions are done, to not show the not found page before navigating to goBackRoute
                react_native_1.InteractionManager.runAfterInteractions(() => {
                    (0, IOU_1.deleteMoneyRequest)(transaction?.transactionID, requestParentReportAction, duplicateTransactions, duplicateTransactionViolations);
                    removeTransaction(transaction.transactionID);
                });
                goBackRoute = (0, IOU_1.getNavigationUrlOnMoneyRequestDelete)(transaction.transactionID, requestParentReportAction, false);
            }
            if (goBackRoute) {
                Navigation_1.default.setNavigationActionToMicrotaskQueue(() => (0, ReportUtils_1.navigateOnDeleteExpense)(goBackRoute));
            }
        }} onCancel={() => setIsDeleteExpenseModalVisible(false)} prompt={translate('iou.deleteConfirmation', { count: 1 })} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger shouldEnableNewFocusManagement/>
            <ConfirmModal_1.default title={translate('iou.deleteExpense', { count: selectedTransactionIDs.length })} isVisible={hookDeleteModalVisible} onConfirm={() => {
            if (transactions.filter((trans) => trans.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE).length === selectedTransactionIDs.length) {
                Navigation_1.default.goBack(route.params?.backTo);
            }
            handleDeleteTransactions();
        }} onCancel={hideDeleteModal} prompt={translate('iou.deleteConfirmation', { count: selectedTransactionIDs.length })} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger shouldEnableNewFocusManagement/>
            <ConfirmModal_1.default title={translate('iou.deleteReport')} isVisible={isDeleteReportModalVisible} onConfirm={() => {
            setIsDeleteReportModalVisible(false);
            Navigation_1.default.goBack();
            react_native_1.InteractionManager.runAfterInteractions(() => {
                (0, Report_1.deleteAppReport)(moneyRequestReport?.reportID);
            });
        }} onCancel={() => setIsDeleteReportModalVisible(false)} prompt={translate('iou.deleteReportConfirmation')} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger shouldEnableNewFocusManagement/>
            {!!connectedIntegration && (<ConfirmModal_1.default title={translate('workspace.exportAgainModal.title')} onConfirm={confirmExport} onCancel={() => setExportModalStatus(null)} prompt={translate('workspace.exportAgainModal.description', { connectionName: connectedIntegration, reportName: moneyRequestReport?.reportName ?? '' })} confirmText={translate('workspace.exportAgainModal.confirmText')} cancelText={translate('workspace.exportAgainModal.cancelText')} isVisible={!!exportModalStatus}/>)}
            <ConfirmModal_1.default title={translate('iou.unapproveReport')} isVisible={isUnapproveModalVisible} danger confirmText={translate('iou.unapproveReport')} onConfirm={() => {
            setIsUnapproveModalVisible(false);
            (0, IOU_1.unapproveExpenseReport)(moneyRequestReport);
        }} cancelText={translate('common.cancel')} onCancel={() => setIsUnapproveModalVisible(false)} prompt={unapproveWarningText}/>
            <ConfirmModal_1.default title={translate('iou.reopenReport')} isVisible={isReopenWarningModalVisible} danger confirmText={translate('iou.reopenReport')} onConfirm={() => {
            setIsReopenWarningModalVisible(false);
            (0, IOU_1.reopenReport)(moneyRequestReport);
        }} cancelText={translate('common.cancel')} onCancel={() => setIsReopenWarningModalVisible(false)} 
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    prompt={reopenExportedReportWarningText}/>
            <DecisionModal_1.default title={translate('common.downloadFailedTitle')} prompt={translate('common.downloadFailedDescription')} isSmallScreenWidth={isSmallScreenWidth} onSecondOptionSubmit={() => setIsDownloadErrorModalVisible(false)} secondOptionText={translate('common.buttonConfirm')} isVisible={isDownloadErrorModalVisible} onClose={() => setIsDownloadErrorModalVisible(false)}/>
            {!!isRejectEducationalModalVisible && (<HoldOrRejectEducationalModal_1.default onClose={dismissModalAndUpdateUseReject} onConfirm={dismissModalAndUpdateUseReject}/>)}
            <DecisionModal_1.default title={translate('common.youAppearToBeOffline')} prompt={translate('common.offlinePrompt')} isSmallScreenWidth={isSmallScreenWidth} onSecondOptionSubmit={() => setOfflineModalVisible(false)} secondOptionText={translate('common.buttonConfirm')} isVisible={offlineModalVisible} onClose={() => setOfflineModalVisible(false)}/>
            <Modal_1.default onClose={() => setIsPDFModalVisible(false)} isVisible={isPDFModalVisible} type={isSmallScreenWidth ? CONST_1.default.MODAL.MODAL_TYPE.BOTTOM_DOCKED : CONST_1.default.MODAL.MODAL_TYPE.CONFIRM} innerContainerStyle={styles.pv0}>
                <react_native_1.View style={[styles.m5]}>
                    <react_native_1.View>
                        <react_native_1.View style={[styles.flexRow, styles.mb4]}>
                            <Header_1.default title={translate('reportDetailsPage.generatingPDF')} containerStyles={[styles.alignItemsCenter]}/>
                        </react_native_1.View>
                        <react_native_1.View>
                            <Text_1.default>{messagePDF}</Text_1.default>
                            {!reportPDFFilename && (<react_native_1.ActivityIndicator size={CONST_1.default.ACTIVITY_INDICATOR_SIZE.LARGE} color={theme.textSupporting} style={styles.mt3}/>)}
                        </react_native_1.View>
                    </react_native_1.View>
                    {!!reportPDFFilename && reportPDFFilename !== 'error' && (<Button_1.default isLoading={isDownloadingPDF} style={[styles.mt3, styles.noSelect]} onPress={() => (0, Report_1.downloadReportPDF)(reportPDFFilename ?? '', moneyRequestReport?.reportName ?? '')} text={translate('common.download')}/>)}
                    {(!reportPDFFilename || reportPDFFilename === 'error') && (<Button_1.default style={[styles.mt3, styles.noSelect]} onPress={() => setIsPDFModalVisible(false)} text={translate('common.close')}/>)}
                </react_native_1.View>
            </Modal_1.default>
            <ConfirmModal_1.default onConfirm={() => {
            setIsExportWithTemplateModalVisible(false);
            clearSelectedTransactions(undefined, true);
        }} onCancel={() => setIsExportWithTemplateModalVisible(false)} isVisible={isExportWithTemplateModalVisible} title={translate('export.exportInProgress')} prompt={translate('export.conciergeWillSend')} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false}/>
        </react_native_1.View>);
}
MoneyReportHeader.displayName = 'MoneyReportHeader';
exports.default = MoneyReportHeader;
