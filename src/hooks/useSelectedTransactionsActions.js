"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Expensicons = require("@components/Icon/Expensicons");
const SearchContext_1 = require("@components/Search/SearchContext");
const IOU_1 = require("@libs/actions/IOU");
const MergeTransaction_1 = require("@libs/actions/MergeTransaction");
const Report_1 = require("@libs/actions/Report");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportSecondaryActionUtils_1 = require("@libs/ReportSecondaryActionUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const useDuplicateTransactionsAndViolations_1 = require("./useDuplicateTransactionsAndViolations");
const useLocalize_1 = require("./useLocalize");
const useOnyx_1 = require("./useOnyx");
const useReportIsArchived_1 = require("./useReportIsArchived");
// We do not use PRIMARY_REPORT_ACTIONS or SECONDARY_REPORT_ACTIONS because they weren't meant to be used in this situation. `value` property of returned options is later ignored.
const HOLD = 'HOLD';
const UNHOLD = 'UNHOLD';
const MOVE = 'MOVE';
const MERGE = 'MERGE';
function useSelectedTransactionsActions({ report, reportActions, allTransactionsLength, session, onExportFailed, policy, beginExportWithTemplate, }) {
    const { selectedTransactionIDs, clearSelectedTransactions } = (0, SearchContext_1.useSearchContext)();
    const [allTransactions] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, { canBeMissing: false });
    const [outstandingReportsByPolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.OUTSTANDING_REPORTS_BY_POLICY_ID, { canBeMissing: true });
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
    const { duplicateTransactions, duplicateTransactionViolations } = (0, useDuplicateTransactionsAndViolations_1.default)(selectedTransactionIDs);
    const isReportArchived = (0, useReportIsArchived_1.default)(report?.reportID);
    const selectedTransactions = (0, react_1.useMemo)(() => selectedTransactionIDs.reduce((acc, transactionID) => {
        const transaction = allTransactions?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`];
        if (transaction) {
            acc.push(transaction);
        }
        return acc;
    }, []), [allTransactions, selectedTransactionIDs]);
    const { translate } = (0, useLocalize_1.default)();
    const [isDeleteModalVisible, setIsDeleteModalVisible] = (0, react_1.useState)(false);
    const isTrackExpenseThread = (0, ReportUtils_1.isTrackExpenseReport)(report);
    const isInvoice = (0, ReportUtils_1.isInvoiceReport)(report);
    let iouType = CONST_1.default.IOU.TYPE.SUBMIT;
    if (isTrackExpenseThread) {
        iouType = CONST_1.default.IOU.TYPE.TRACK;
    }
    if (isInvoice) {
        iouType = CONST_1.default.IOU.TYPE.INVOICE;
    }
    const handleDeleteTransactions = (0, react_1.useCallback)(() => {
        const iouActions = reportActions.filter((action) => (0, ReportActionsUtils_1.isMoneyRequestAction)(action));
        const transactionsWithActions = selectedTransactionIDs.map((transactionID) => ({
            transactionID,
            action: iouActions.find((action) => {
                const IOUTransactionID = (0, ReportActionsUtils_1.getOriginalMessage)(action)?.IOUTransactionID;
                return transactionID === IOUTransactionID;
            }),
        }));
        const deletedTransactionIDs = [];
        transactionsWithActions.forEach(({ transactionID, action }) => {
            if (!action) {
                return;
            }
            (0, IOU_1.deleteMoneyRequest)(transactionID, action, duplicateTransactions, duplicateTransactionViolations, false, deletedTransactionIDs);
            deletedTransactionIDs.push(transactionID);
        });
        clearSelectedTransactions(true);
        setIsDeleteModalVisible(false);
    }, [duplicateTransactions, duplicateTransactionViolations, reportActions, selectedTransactionIDs, clearSelectedTransactions]);
    const showDeleteModal = (0, react_1.useCallback)(() => {
        setIsDeleteModalVisible(true);
    }, []);
    const hideDeleteModal = (0, react_1.useCallback)(() => {
        setIsDeleteModalVisible(false);
    }, []);
    const computedOptions = (0, react_1.useMemo)(() => {
        if (!selectedTransactionIDs.length) {
            return [];
        }
        const options = [];
        const isMoneyRequestReport = (0, ReportUtils_1.isMoneyRequestReport)(report);
        const isReportReimbursed = report?.stateNum === CONST_1.default.REPORT.STATE_NUM.APPROVED && report?.statusNum === CONST_1.default.REPORT.STATUS_NUM.REIMBURSED;
        let canHoldTransactions = selectedTransactions.length > 0 && isMoneyRequestReport && !isReportReimbursed;
        let canUnholdTransactions = selectedTransactions.length > 0 && isMoneyRequestReport;
        selectedTransactions.forEach((selectedTransaction) => {
            if (!canHoldTransactions && !canUnholdTransactions) {
                return;
            }
            if (!selectedTransaction?.transactionID) {
                canHoldTransactions = false;
                canUnholdTransactions = false;
                return;
            }
            const iouReportAction = (0, ReportActionsUtils_1.getIOUActionForTransactionID)(reportActions, selectedTransaction.transactionID);
            const { canHoldRequest, canUnholdRequest } = (0, ReportUtils_1.canHoldUnholdReportAction)(iouReportAction);
            canHoldTransactions = canHoldTransactions && canHoldRequest;
            canUnholdTransactions = canUnholdTransactions && canUnholdRequest;
        });
        if (canHoldTransactions) {
            options.push({
                text: translate('iou.hold'),
                icon: Expensicons.Stopwatch,
                value: HOLD,
                onSelected: () => {
                    if (!report?.reportID) {
                        return;
                    }
                    Navigation_1.default.navigate(ROUTES_1.default.SEARCH_MONEY_REQUEST_REPORT_HOLD_TRANSACTIONS.getRoute({ reportID: report.reportID }));
                },
            });
        }
        if (canUnholdTransactions) {
            options.push({
                text: translate('iou.unhold'),
                icon: Expensicons.Stopwatch,
                value: UNHOLD,
                onSelected: () => {
                    selectedTransactionIDs.forEach((transactionID) => {
                        const action = (0, ReportActionsUtils_1.getIOUActionForTransactionID)(reportActions, transactionID);
                        if (!action?.childReportID) {
                            return;
                        }
                        (0, IOU_1.unholdRequest)(transactionID, action?.childReportID);
                    });
                    clearSelectedTransactions(true);
                },
            });
        }
        // Gets the list of options for the export sub-menu
        const getExportOptions = () => {
            // We provide the basic and expense level export options by default
            const exportOptions = [
                {
                    text: translate('export.basicExport'),
                    icon: Expensicons.Table,
                    onSelected: () => {
                        if (!report) {
                            return;
                        }
                        (0, Report_1.exportReportToCSV)({ reportID: report.reportID, transactionIDList: selectedTransactionIDs }, () => {
                            onExportFailed?.();
                        });
                        clearSelectedTransactions(true);
                    },
                },
                {
                    text: translate('export.expenseLevelExport'),
                    icon: Expensicons.Table,
                    onSelected: () => {
                        if (!report) {
                            return;
                        }
                        beginExportWithTemplate(CONST_1.default.REPORT.EXPORT_OPTIONS.EXPENSE_LEVEL_EXPORT, CONST_1.default.EXPORT_TEMPLATE_TYPES.INTEGRATIONS, selectedTransactionIDs);
                    },
                },
            ];
            // If we've selected all the transactions on the report, we can also provide the report level export option
            if (allTransactionsLength === selectedTransactionIDs.length) {
                exportOptions.push({
                    text: translate('export.reportLevelExport'),
                    icon: Expensicons.Table,
                    onSelected: () => 
                    // The report level export template is not policy specific, so we don't need to pass a policyID
                    beginExportWithTemplate(CONST_1.default.REPORT.EXPORT_OPTIONS.REPORT_LEVEL_EXPORT, CONST_1.default.EXPORT_TEMPLATE_TYPES.INTEGRATIONS, selectedTransactionIDs),
                });
            }
            // If the user has any custom integration export templates, add them as export options
            if (integrationsExportTemplates && integrationsExportTemplates.length > 0) {
                for (const template of integrationsExportTemplates) {
                    exportOptions.push({
                        text: template.name,
                        icon: Expensicons.Table,
                        onSelected: () => beginExportWithTemplate(template.name, CONST_1.default.EXPORT_TEMPLATE_TYPES.INTEGRATIONS, selectedTransactionIDs),
                    });
                }
            }
            // If the user has any custom in-app export templates, add them as export options
            if (customInAppTemplates && customInAppTemplates.length > 0) {
                for (const template of customInAppTemplates) {
                    exportOptions.push({
                        text: template.name,
                        icon: Expensicons.Table,
                        description: template.description,
                        onSelected: () => beginExportWithTemplate(template.templateName, CONST_1.default.EXPORT_TEMPLATE_TYPES.IN_APP, selectedTransactionIDs, template.policyID),
                    });
                }
            }
            return exportOptions;
        };
        options.push({
            value: CONST_1.default.REPORT.SECONDARY_ACTIONS.EXPORT,
            text: translate('common.export'),
            backButtonText: translate('common.export'),
            icon: Expensicons.Export,
            rightIcon: Expensicons.ArrowRight,
            subMenuItems: getExportOptions(),
        });
        const canSelectedExpensesBeMoved = selectedTransactions.every((transaction) => {
            if (!transaction) {
                return false;
            }
            const iouReportAction = (0, ReportActionsUtils_1.getIOUActionForTransactionID)(reportActions, transaction.transactionID);
            const canMoveExpense = (0, ReportUtils_1.canEditFieldOfMoneyRequest)(iouReportAction, CONST_1.default.EDIT_REQUEST_FIELD.REPORT, undefined, undefined, outstandingReportsByPolicyID);
            return canMoveExpense;
        });
        const canUserPerformWriteAction = (0, ReportUtils_1.canUserPerformWriteAction)(report, isReportArchived);
        if (canSelectedExpensesBeMoved && canUserPerformWriteAction) {
            options.push({
                text: translate('iou.moveExpenses', { count: selectedTransactionIDs.length }),
                icon: Expensicons.DocumentMerge,
                value: MOVE,
                onSelected: () => {
                    const shouldTurnOffSelectionMode = allTransactionsLength - selectedTransactionIDs.length <= 1;
                    const route = ROUTES_1.default.MONEY_REQUEST_EDIT_REPORT.getRoute(CONST_1.default.IOU.ACTION.EDIT, iouType, report?.reportID, shouldTurnOffSelectionMode);
                    Navigation_1.default.navigate(route);
                },
            });
        }
        // In phase 1, we only show merge action if report is eligible for merge and only one transaction is selected
        const canMergeTransaction = selectedTransactions.length === 1 && report && (0, ReportSecondaryActionUtils_1.isMergeAction)(report, selectedTransactions, policy);
        if (canMergeTransaction) {
            options.push({
                text: translate('common.merge'),
                icon: Expensicons.ArrowCollapse,
                value: MERGE,
                onSelected: () => {
                    const targetTransaction = selectedTransactions.at(0);
                    if (!report || !targetTransaction) {
                        return;
                    }
                    (0, MergeTransaction_1.setupMergeTransactionData)(targetTransaction.transactionID, { targetTransactionID: targetTransaction.transactionID });
                    Navigation_1.default.navigate(ROUTES_1.default.MERGE_TRANSACTION_LIST_PAGE.getRoute(targetTransaction.transactionID, Navigation_1.default.getActiveRoute()));
                },
            });
        }
        const canAllSelectedTransactionsBeRemoved = Object.values(selectedTransactions).every((transaction) => {
            const canRemoveTransaction = (0, ReportUtils_1.canDeleteCardTransactionByLiabilityType)(transaction);
            const action = (0, ReportActionsUtils_1.getIOUActionForTransactionID)(reportActions, transaction.transactionID);
            const isActionDeleted = (0, ReportActionsUtils_1.isDeletedAction)(action);
            const isIOUActionOwner = typeof action?.actorAccountID === 'number' && typeof session?.accountID === 'number' && action.actorAccountID === session?.accountID;
            return canRemoveTransaction && isIOUActionOwner && !isActionDeleted;
        });
        const canRemoveReportTransaction = (0, ReportUtils_1.canDeleteTransaction)(report, isReportArchived);
        if (canRemoveReportTransaction && canAllSelectedTransactionsBeRemoved) {
            options.push({
                text: translate('common.delete'),
                icon: Expensicons.Trashcan,
                value: CONST_1.default.REPORT.SECONDARY_ACTIONS.DELETE,
                onSelected: showDeleteModal,
            });
        }
        return options;
    }, [
        selectedTransactionIDs,
        report,
        selectedTransactions,
        translate,
        isReportArchived,
        reportActions,
        clearSelectedTransactions,
        onExportFailed,
        allTransactionsLength,
        iouType,
        session?.accountID,
        showDeleteModal,
        outstandingReportsByPolicyID,
        policy,
        beginExportWithTemplate,
        integrationsExportTemplates,
        customInAppTemplates,
    ]);
    return {
        options: computedOptions,
        handleDeleteTransactions,
        isDeleteModalVisible,
        showDeleteModal,
        hideDeleteModal,
    };
}
exports.default = useSelectedTransactionsActions;
