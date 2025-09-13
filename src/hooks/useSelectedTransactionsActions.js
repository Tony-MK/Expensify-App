"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Expensicons = require("@components/Icon/Expensicons");
var SearchContext_1 = require("@components/Search/SearchContext");
var IOU_1 = require("@libs/actions/IOU");
var MergeTransaction_1 = require("@libs/actions/MergeTransaction");
var Report_1 = require("@libs/actions/Report");
var Navigation_1 = require("@libs/Navigation/Navigation");
var ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
var ReportSecondaryActionUtils_1 = require("@libs/ReportSecondaryActionUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var useDuplicateTransactionsAndViolations_1 = require("./useDuplicateTransactionsAndViolations");
var useLocalize_1 = require("./useLocalize");
var useOnyx_1 = require("./useOnyx");
var useReportIsArchived_1 = require("./useReportIsArchived");
// We do not use PRIMARY_REPORT_ACTIONS or SECONDARY_REPORT_ACTIONS because they weren't meant to be used in this situation. `value` property of returned options is later ignored.
var HOLD = 'HOLD';
var UNHOLD = 'UNHOLD';
var MOVE = 'MOVE';
var MERGE = 'MERGE';
function useSelectedTransactionsActions(_a) {
    var report = _a.report, reportActions = _a.reportActions, allTransactionsLength = _a.allTransactionsLength, session = _a.session, onExportFailed = _a.onExportFailed, policy = _a.policy, beginExportWithTemplate = _a.beginExportWithTemplate;
    var _b = (0, SearchContext_1.useSearchContext)(), selectedTransactionIDs = _b.selectedTransactionIDs, clearSelectedTransactions = _b.clearSelectedTransactions;
    var allTransactions = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, { canBeMissing: false })[0];
    var outstandingReportsByPolicyID = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.OUTSTANDING_REPORTS_BY_POLICY_ID, { canBeMissing: true })[0];
    var integrationsExportTemplates = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_INTEGRATION_SERVER_EXPORT_TEMPLATES, { canBeMissing: true })[0];
    var csvExportLayouts = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_CSV_EXPORT_LAYOUTS, { canBeMissing: true })[0];
    // Collate the list of user-created in-app export templates
    var customInAppTemplates = (0, react_1.useMemo)(function () {
        var _a;
        var policyTemplates = Object.entries((_a = policy === null || policy === void 0 ? void 0 : policy.exportLayouts) !== null && _a !== void 0 ? _a : {}).map(function (_a) {
            var templateName = _a[0], layout = _a[1];
            return (__assign(__assign({}, layout), { templateName: templateName, description: policy === null || policy === void 0 ? void 0 : policy.name, policyID: policy === null || policy === void 0 ? void 0 : policy.id }));
        });
        // Collate a list of the user's account level in-app export templates, excluding the Default CSV template
        var csvTemplates = Object.entries(csvExportLayouts !== null && csvExportLayouts !== void 0 ? csvExportLayouts : {})
            .filter(function (_a) {
            var layout = _a[1];
            return layout.name !== CONST_1.default.REPORT.EXPORT_OPTION_LABELS.DEFAULT_CSV;
        })
            .map(function (_a) {
            var templateName = _a[0], layout = _a[1];
            return (__assign(__assign({}, layout), { templateName: templateName, description: '', policyID: undefined }));
        });
        return __spreadArray(__spreadArray([], policyTemplates, true), csvTemplates, true);
    }, [csvExportLayouts, policy]);
    var _c = (0, useDuplicateTransactionsAndViolations_1.default)(selectedTransactionIDs), duplicateTransactions = _c.duplicateTransactions, duplicateTransactionViolations = _c.duplicateTransactionViolations;
    var isReportArchived = (0, useReportIsArchived_1.default)(report === null || report === void 0 ? void 0 : report.reportID);
    var selectedTransactions = (0, react_1.useMemo)(function () {
        return selectedTransactionIDs.reduce(function (acc, transactionID) {
            var transaction = allTransactions === null || allTransactions === void 0 ? void 0 : allTransactions["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID)];
            if (transaction) {
                acc.push(transaction);
            }
            return acc;
        }, []);
    }, [allTransactions, selectedTransactionIDs]);
    var translate = (0, useLocalize_1.default)().translate;
    var _d = (0, react_1.useState)(false), isDeleteModalVisible = _d[0], setIsDeleteModalVisible = _d[1];
    var isTrackExpenseThread = (0, ReportUtils_1.isTrackExpenseReport)(report);
    var isInvoice = (0, ReportUtils_1.isInvoiceReport)(report);
    var iouType = CONST_1.default.IOU.TYPE.SUBMIT;
    if (isTrackExpenseThread) {
        iouType = CONST_1.default.IOU.TYPE.TRACK;
    }
    if (isInvoice) {
        iouType = CONST_1.default.IOU.TYPE.INVOICE;
    }
    var handleDeleteTransactions = (0, react_1.useCallback)(function () {
        var iouActions = reportActions.filter(function (action) { return (0, ReportActionsUtils_1.isMoneyRequestAction)(action); });
        var transactionsWithActions = selectedTransactionIDs.map(function (transactionID) { return ({
            transactionID: transactionID,
            action: iouActions.find(function (action) {
                var _a;
                var IOUTransactionID = (_a = (0, ReportActionsUtils_1.getOriginalMessage)(action)) === null || _a === void 0 ? void 0 : _a.IOUTransactionID;
                return transactionID === IOUTransactionID;
            }),
        }); });
        var deletedTransactionIDs = [];
        transactionsWithActions.forEach(function (_a) {
            var transactionID = _a.transactionID, action = _a.action;
            if (!action) {
                return;
            }
            (0, IOU_1.deleteMoneyRequest)(transactionID, action, duplicateTransactions, duplicateTransactionViolations, false, deletedTransactionIDs);
            deletedTransactionIDs.push(transactionID);
        });
        clearSelectedTransactions(true);
        setIsDeleteModalVisible(false);
    }, [duplicateTransactions, duplicateTransactionViolations, reportActions, selectedTransactionIDs, clearSelectedTransactions]);
    var showDeleteModal = (0, react_1.useCallback)(function () {
        setIsDeleteModalVisible(true);
    }, []);
    var hideDeleteModal = (0, react_1.useCallback)(function () {
        setIsDeleteModalVisible(false);
    }, []);
    var computedOptions = (0, react_1.useMemo)(function () {
        if (!selectedTransactionIDs.length) {
            return [];
        }
        var options = [];
        var isMoneyRequestReport = (0, ReportUtils_1.isMoneyRequestReport)(report);
        var isReportReimbursed = (report === null || report === void 0 ? void 0 : report.stateNum) === CONST_1.default.REPORT.STATE_NUM.APPROVED && (report === null || report === void 0 ? void 0 : report.statusNum) === CONST_1.default.REPORT.STATUS_NUM.REIMBURSED;
        var canHoldTransactions = selectedTransactions.length > 0 && isMoneyRequestReport && !isReportReimbursed;
        var canUnholdTransactions = selectedTransactions.length > 0 && isMoneyRequestReport;
        selectedTransactions.forEach(function (selectedTransaction) {
            if (!canHoldTransactions && !canUnholdTransactions) {
                return;
            }
            if (!(selectedTransaction === null || selectedTransaction === void 0 ? void 0 : selectedTransaction.transactionID)) {
                canHoldTransactions = false;
                canUnholdTransactions = false;
                return;
            }
            var iouReportAction = (0, ReportActionsUtils_1.getIOUActionForTransactionID)(reportActions, selectedTransaction.transactionID);
            var _a = (0, ReportUtils_1.canHoldUnholdReportAction)(iouReportAction), canHoldRequest = _a.canHoldRequest, canUnholdRequest = _a.canUnholdRequest;
            canHoldTransactions = canHoldTransactions && canHoldRequest;
            canUnholdTransactions = canUnholdTransactions && canUnholdRequest;
        });
        if (canHoldTransactions) {
            options.push({
                text: translate('iou.hold'),
                icon: Expensicons.Stopwatch,
                value: HOLD,
                onSelected: function () {
                    if (!(report === null || report === void 0 ? void 0 : report.reportID)) {
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
                onSelected: function () {
                    selectedTransactionIDs.forEach(function (transactionID) {
                        var action = (0, ReportActionsUtils_1.getIOUActionForTransactionID)(reportActions, transactionID);
                        if (!(action === null || action === void 0 ? void 0 : action.childReportID)) {
                            return;
                        }
                        (0, IOU_1.unholdRequest)(transactionID, action === null || action === void 0 ? void 0 : action.childReportID);
                    });
                    clearSelectedTransactions(true);
                },
            });
        }
        // Gets the list of options for the export sub-menu
        var getExportOptions = function () {
            // We provide the basic and expense level export options by default
            var exportOptions = [
                {
                    text: translate('export.basicExport'),
                    icon: Expensicons.Table,
                    onSelected: function () {
                        if (!report) {
                            return;
                        }
                        (0, Report_1.exportReportToCSV)({ reportID: report.reportID, transactionIDList: selectedTransactionIDs }, function () {
                            onExportFailed === null || onExportFailed === void 0 ? void 0 : onExportFailed();
                        });
                        clearSelectedTransactions(true);
                    },
                },
                {
                    text: translate('export.expenseLevelExport'),
                    icon: Expensicons.Table,
                    onSelected: function () {
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
                    onSelected: function () {
                        // The report level export template is not policy specific, so we don't need to pass a policyID
                        return beginExportWithTemplate(CONST_1.default.REPORT.EXPORT_OPTIONS.REPORT_LEVEL_EXPORT, CONST_1.default.EXPORT_TEMPLATE_TYPES.INTEGRATIONS, selectedTransactionIDs);
                    },
                });
            }
            // If the user has any custom integration export templates, add them as export options
            if (integrationsExportTemplates && integrationsExportTemplates.length > 0) {
                var _loop_1 = function (template) {
                    exportOptions.push({
                        text: template.name,
                        icon: Expensicons.Table,
                        onSelected: function () { return beginExportWithTemplate(template.name, CONST_1.default.EXPORT_TEMPLATE_TYPES.INTEGRATIONS, selectedTransactionIDs); },
                    });
                };
                for (var _i = 0, integrationsExportTemplates_1 = integrationsExportTemplates; _i < integrationsExportTemplates_1.length; _i++) {
                    var template = integrationsExportTemplates_1[_i];
                    _loop_1(template);
                }
            }
            // If the user has any custom in-app export templates, add them as export options
            if (customInAppTemplates && customInAppTemplates.length > 0) {
                var _loop_2 = function (template) {
                    exportOptions.push({
                        text: template.name,
                        icon: Expensicons.Table,
                        description: template.description,
                        onSelected: function () { return beginExportWithTemplate(template.templateName, CONST_1.default.EXPORT_TEMPLATE_TYPES.IN_APP, selectedTransactionIDs, template.policyID); },
                    });
                };
                for (var _a = 0, customInAppTemplates_1 = customInAppTemplates; _a < customInAppTemplates_1.length; _a++) {
                    var template = customInAppTemplates_1[_a];
                    _loop_2(template);
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
        var canSelectedExpensesBeMoved = selectedTransactions.every(function (transaction) {
            if (!transaction) {
                return false;
            }
            var iouReportAction = (0, ReportActionsUtils_1.getIOUActionForTransactionID)(reportActions, transaction.transactionID);
            var canMoveExpense = (0, ReportUtils_1.canEditFieldOfMoneyRequest)(iouReportAction, CONST_1.default.EDIT_REQUEST_FIELD.REPORT, undefined, undefined, outstandingReportsByPolicyID);
            return canMoveExpense;
        });
        var canUserPerformWriteAction = (0, ReportUtils_1.canUserPerformWriteAction)(report, isReportArchived);
        if (canSelectedExpensesBeMoved && canUserPerformWriteAction) {
            options.push({
                text: translate('iou.moveExpenses', { count: selectedTransactionIDs.length }),
                icon: Expensicons.DocumentMerge,
                value: MOVE,
                onSelected: function () {
                    var shouldTurnOffSelectionMode = allTransactionsLength - selectedTransactionIDs.length <= 1;
                    var route = ROUTES_1.default.MONEY_REQUEST_EDIT_REPORT.getRoute(CONST_1.default.IOU.ACTION.EDIT, iouType, report === null || report === void 0 ? void 0 : report.reportID, shouldTurnOffSelectionMode);
                    Navigation_1.default.navigate(route);
                },
            });
        }
        // In phase 1, we only show merge action if report is eligible for merge and only one transaction is selected
        var canMergeTransaction = selectedTransactions.length === 1 && report && (0, ReportSecondaryActionUtils_1.isMergeAction)(report, selectedTransactions, policy);
        if (canMergeTransaction) {
            options.push({
                text: translate('common.merge'),
                icon: Expensicons.ArrowCollapse,
                value: MERGE,
                onSelected: function () {
                    var targetTransaction = selectedTransactions.at(0);
                    if (!report || !targetTransaction) {
                        return;
                    }
                    (0, MergeTransaction_1.setupMergeTransactionData)(targetTransaction.transactionID, { targetTransactionID: targetTransaction.transactionID });
                    Navigation_1.default.navigate(ROUTES_1.default.MERGE_TRANSACTION_LIST_PAGE.getRoute(targetTransaction.transactionID, Navigation_1.default.getActiveRoute()));
                },
            });
        }
        var canAllSelectedTransactionsBeRemoved = Object.values(selectedTransactions).every(function (transaction) {
            var canRemoveTransaction = (0, ReportUtils_1.canDeleteCardTransactionByLiabilityType)(transaction);
            var action = (0, ReportActionsUtils_1.getIOUActionForTransactionID)(reportActions, transaction.transactionID);
            var isActionDeleted = (0, ReportActionsUtils_1.isDeletedAction)(action);
            var isIOUActionOwner = typeof (action === null || action === void 0 ? void 0 : action.actorAccountID) === 'number' && typeof (session === null || session === void 0 ? void 0 : session.accountID) === 'number' && action.actorAccountID === (session === null || session === void 0 ? void 0 : session.accountID);
            return canRemoveTransaction && isIOUActionOwner && !isActionDeleted;
        });
        var canRemoveReportTransaction = (0, ReportUtils_1.canDeleteTransaction)(report, isReportArchived);
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
        session === null || session === void 0 ? void 0 : session.accountID,
        showDeleteModal,
        outstandingReportsByPolicyID,
        policy,
        beginExportWithTemplate,
        integrationsExportTemplates,
        customInAppTemplates,
    ]);
    return {
        options: computedOptions,
        handleDeleteTransactions: handleDeleteTransactions,
        isDeleteModalVisible: isDeleteModalVisible,
        showDeleteModal: showDeleteModal,
        hideDeleteModal: hideDeleteModal,
    };
}
exports.default = useSelectedTransactionsActions;
