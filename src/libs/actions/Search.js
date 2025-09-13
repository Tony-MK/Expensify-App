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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
exports.saveSearch = saveSearch;
exports.search = search;
exports.updateSearchResultsWithTransactionThreadReportID = updateSearchResultsWithTransactionThreadReportID;
exports.deleteMoneyRequestOnSearch = deleteMoneyRequestOnSearch;
exports.holdMoneyRequestOnSearch = holdMoneyRequestOnSearch;
exports.unholdMoneyRequestOnSearch = unholdMoneyRequestOnSearch;
exports.exportSearchItemsToCSV = exportSearchItemsToCSV;
exports.queueExportSearchItemsToCSV = queueExportSearchItemsToCSV;
exports.queueExportSearchWithTemplate = queueExportSearchWithTemplate;
exports.updateAdvancedFilters = updateAdvancedFilters;
exports.clearAllFilters = clearAllFilters;
exports.clearAdvancedFilters = clearAdvancedFilters;
exports.deleteSavedSearch = deleteSavedSearch;
exports.payMoneyRequestOnSearch = payMoneyRequestOnSearch;
exports.approveMoneyRequestOnSearch = approveMoneyRequestOnSearch;
exports.handleActionButtonPress = handleActionButtonPress;
exports.submitMoneyRequestOnSearch = submitMoneyRequestOnSearch;
exports.openSearch = openSearchPage;
exports.getLastPolicyPaymentMethod = getLastPolicyPaymentMethod;
exports.getLastPolicyBankAccountID = getLastPolicyBankAccountID;
exports.exportToIntegrationOnSearch = exportToIntegrationOnSearch;
var react_native_onyx_1 = require("react-native-onyx");
var API = require("@libs/API");
var types_1 = require("@libs/API/types");
var ApiUtils_1 = require("@libs/ApiUtils");
var ErrorUtils_1 = require("@libs/ErrorUtils");
var fileDownload_1 = require("@libs/fileDownload");
var enhanceParameters_1 = require("@libs/Network/enhanceParameters");
var NumberUtils_1 = require("@libs/NumberUtils");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var SearchUIUtils_1 = require("@libs/SearchUIUtils");
var Sound_1 = require("@libs/Sound");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var SearchAdvancedFiltersForm_1 = require("@src/types/form/SearchAdvancedFiltersForm");
function handleActionButtonPress(hash, item, goToItem, isInMobileSelectionMode, snapshotReport, snapshotPolicy, lastPaymentMethod, currentSearchKey) {
    // The transactionIDList is needed to handle actions taken on `status:""` where transactions on single expense reports can be approved/paid.
    // We need the transactionID to display the loading indicator for that list item's action.
    var transactionID = (0, SearchUIUtils_1.isTransactionListItemType)(item) ? [item.transactionID] : undefined;
    var allReportTransactions = ((0, SearchUIUtils_1.isTransactionGroupListItemType)(item) ? item.transactions : [item]);
    var hasHeldExpense = (0, ReportUtils_1.hasHeldExpenses)('', allReportTransactions);
    if (hasHeldExpense || isInMobileSelectionMode) {
        goToItem();
        return;
    }
    switch (item.action) {
        case CONST_1.default.SEARCH.ACTION_TYPES.PAY:
            getPayActionCallback(hash, item, goToItem, snapshotReport, snapshotPolicy, lastPaymentMethod, currentSearchKey);
            return;
        case CONST_1.default.SEARCH.ACTION_TYPES.APPROVE:
            approveMoneyRequestOnSearch(hash, [item.reportID], transactionID, currentSearchKey);
            return;
        case CONST_1.default.SEARCH.ACTION_TYPES.SUBMIT: {
            submitMoneyRequestOnSearch(hash, [item], [snapshotPolicy], transactionID, currentSearchKey);
            return;
        }
        case CONST_1.default.SEARCH.ACTION_TYPES.EXPORT_TO_ACCOUNTING: {
            if (!item) {
                return;
            }
            var policy = (snapshotPolicy !== null && snapshotPolicy !== void 0 ? snapshotPolicy : {});
            var connectedIntegration = (0, PolicyUtils_1.getValidConnectedIntegration)(policy);
            if (!connectedIntegration) {
                return;
            }
            exportToIntegrationOnSearch(hash, item.reportID, connectedIntegration, currentSearchKey);
            return;
        }
        default:
            goToItem();
    }
}
function getLastPolicyBankAccountID(policyID, lastPaymentMethods, reportType) {
    var _a;
    if (reportType === void 0) { reportType = 'lastUsed'; }
    if (!policyID) {
        return undefined;
    }
    var lastPolicyPaymentMethod = lastPaymentMethods === null || lastPaymentMethods === void 0 ? void 0 : lastPaymentMethods[policyID];
    return typeof lastPolicyPaymentMethod === 'string' ? undefined : (_a = lastPolicyPaymentMethod === null || lastPolicyPaymentMethod === void 0 ? void 0 : lastPolicyPaymentMethod[reportType]) === null || _a === void 0 ? void 0 : _a.bankAccountID;
}
function getLastPolicyPaymentMethod(policyID, lastPaymentMethods, reportType, isIOUReport) {
    var _a, _b;
    if (reportType === void 0) { reportType = 'lastUsed'; }
    if (!policyID) {
        return undefined;
    }
    var personalPolicy = (0, PolicyUtils_1.getPersonalPolicy)();
    var lastPolicyPaymentMethod = (_a = lastPaymentMethods === null || lastPaymentMethods === void 0 ? void 0 : lastPaymentMethods[policyID]) !== null && _a !== void 0 ? _a : (isIOUReport && personalPolicy ? lastPaymentMethods === null || lastPaymentMethods === void 0 ? void 0 : lastPaymentMethods[personalPolicy.id] : undefined);
    var result = typeof lastPolicyPaymentMethod === 'string' ? lastPolicyPaymentMethod : (_b = lastPolicyPaymentMethod === null || lastPolicyPaymentMethod === void 0 ? void 0 : lastPolicyPaymentMethod[reportType]) === null || _b === void 0 ? void 0 : _b.name;
    return result;
}
function getReportType(reportID) {
    if ((0, ReportUtils_1.isIOUReport)(reportID)) {
        return CONST_1.default.REPORT.TYPE.IOU;
    }
    if ((0, ReportUtils_1.isInvoiceReport)(reportID)) {
        return CONST_1.default.REPORT.TYPE.INVOICE;
    }
    if ((0, ReportUtils_1.isExpenseReport)(reportID)) {
        return CONST_1.default.REPORT.TYPE.EXPENSE;
    }
    return undefined;
}
function getPayActionCallback(hash, item, goToItem, snapshotReport, snapshotPolicy, lastPaymentMethod, currentSearchKey) {
    var _a, _b, _c;
    var lastPolicyPaymentMethod = getLastPolicyPaymentMethod(item.policyID, lastPaymentMethod, getReportType(item.reportID));
    if (!lastPolicyPaymentMethod || !Object.values(CONST_1.default.IOU.PAYMENT_TYPE).includes(lastPolicyPaymentMethod)) {
        goToItem();
        return;
    }
    var amount = Math.abs(((_a = snapshotReport === null || snapshotReport === void 0 ? void 0 : snapshotReport.total) !== null && _a !== void 0 ? _a : 0) - ((_b = snapshotReport === null || snapshotReport === void 0 ? void 0 : snapshotReport.nonReimbursableTotal) !== null && _b !== void 0 ? _b : 0));
    var transactionID = (0, SearchUIUtils_1.isTransactionListItemType)(item) ? [item.transactionID] : undefined;
    if (lastPolicyPaymentMethod === CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE) {
        payMoneyRequestOnSearch(hash, [{ reportID: item.reportID, amount: amount, paymentType: lastPolicyPaymentMethod }], transactionID, currentSearchKey);
        return;
    }
    var hasVBBA = !!((_c = snapshotPolicy === null || snapshotPolicy === void 0 ? void 0 : snapshotPolicy.achAccount) === null || _c === void 0 ? void 0 : _c.bankAccountID);
    if (hasVBBA) {
        payMoneyRequestOnSearch(hash, [{ reportID: item.reportID, amount: amount, paymentType: lastPolicyPaymentMethod }], transactionID, currentSearchKey);
        return;
    }
    goToItem();
}
function getOnyxLoadingData(hash, queryJSON) {
    var optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: "".concat(ONYXKEYS_1.default.COLLECTION.SNAPSHOT).concat(hash),
            value: {
                search: {
                    isLoading: true,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: "".concat(ONYXKEYS_1.default.COLLECTION.SNAPSHOT).concat(hash),
            value: {
                errors: null,
            },
        },
    ];
    var finallyData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: "".concat(ONYXKEYS_1.default.COLLECTION.SNAPSHOT).concat(hash),
            value: {
                search: {
                    isLoading: false,
                },
            },
        },
    ];
    var failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: "".concat(ONYXKEYS_1.default.COLLECTION.SNAPSHOT).concat(hash),
            value: {
                data: [],
                search: {
                    status: queryJSON === null || queryJSON === void 0 ? void 0 : queryJSON.status,
                    type: queryJSON === null || queryJSON === void 0 ? void 0 : queryJSON.type,
                    isLoading: false,
                },
                errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('common.genericErrorMessage'),
            },
        },
    ];
    return { optimisticData: optimisticData, finallyData: finallyData, failureData: failureData };
}
function saveSearch(_a) {
    var _b, _c, _d;
    var _e;
    var queryJSON = _a.queryJSON, newName = _a.newName;
    var saveSearchName = (_e = newName !== null && newName !== void 0 ? newName : queryJSON === null || queryJSON === void 0 ? void 0 : queryJSON.inputQuery) !== null && _e !== void 0 ? _e : '';
    var jsonQuery = JSON.stringify(queryJSON);
    var optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: "".concat(ONYXKEYS_1.default.SAVED_SEARCHES),
            value: (_b = {},
                _b[queryJSON.hash] = {
                    pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    name: saveSearchName,
                    query: queryJSON.inputQuery,
                },
                _b),
        },
    ];
    var failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: "".concat(ONYXKEYS_1.default.SAVED_SEARCHES),
            value: (_c = {},
                _c[queryJSON.hash] = null,
                _c),
        },
    ];
    var successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: "".concat(ONYXKEYS_1.default.SAVED_SEARCHES),
            value: (_d = {},
                _d[queryJSON.hash] = {
                    pendingAction: null,
                },
                _d),
        },
    ];
    API.write(types_1.WRITE_COMMANDS.SAVE_SEARCH, { jsonQuery: jsonQuery, newName: saveSearchName }, { optimisticData: optimisticData, failureData: failureData, successData: successData });
}
function deleteSavedSearch(hash) {
    var _a, _b, _c;
    var optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: "".concat(ONYXKEYS_1.default.SAVED_SEARCHES),
            value: (_a = {},
                _a[hash] = {
                    pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
                },
                _a),
        },
    ];
    var successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: "".concat(ONYXKEYS_1.default.SAVED_SEARCHES),
            value: (_b = {},
                _b[hash] = null,
                _b),
        },
    ];
    var failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: "".concat(ONYXKEYS_1.default.SAVED_SEARCHES),
            value: (_c = {},
                _c[hash] = {
                    pendingAction: null,
                },
                _c),
        },
    ];
    API.write(types_1.WRITE_COMMANDS.DELETE_SAVED_SEARCH, { hash: hash }, { optimisticData: optimisticData, failureData: failureData, successData: successData });
}
function openSearchPage() {
    API.read(types_1.READ_COMMANDS.OPEN_SEARCH_PAGE, null);
}
function search(_a) {
    var queryJSON = _a.queryJSON, searchKey = _a.searchKey, offset = _a.offset, _b = _a.shouldCalculateTotals, shouldCalculateTotals = _b === void 0 ? false : _b;
    var _c = getOnyxLoadingData(queryJSON.hash, queryJSON), optimisticData = _c.optimisticData, finallyData = _c.finallyData, failureData = _c.failureData;
    var flatFilters = queryJSON.flatFilters, queryJSONWithoutFlatFilters = __rest(queryJSON, ["flatFilters"]);
    var query = __assign(__assign({}, queryJSONWithoutFlatFilters), { searchKey: searchKey, offset: offset, shouldCalculateTotals: shouldCalculateTotals });
    var jsonQuery = JSON.stringify(query);
    API.read(types_1.READ_COMMANDS.SEARCH, { hash: queryJSON.hash, jsonQuery: jsonQuery }, { optimisticData: optimisticData, finallyData: finallyData, failureData: failureData });
}
/**
 * It's possible that we return legacy transactions that don't have a transaction thread created yet.
 * In that case, when users select the search result row, we need to create the transaction thread on the fly and update the search result with the new transactionThreadReport
 */
function updateSearchResultsWithTransactionThreadReportID(hash, transactionID, reportID) {
    var _a;
    var onyxUpdate = {
        data: (_a = {},
            _a["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID)] = {
                transactionThreadReportID: reportID,
            },
            _a),
    };
    react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.SNAPSHOT).concat(hash), onyxUpdate);
}
function holdMoneyRequestOnSearch(hash, transactionIDList, comment, transactions, transactionsIOUActions) {
    var _a = getOnyxLoadingData(hash), optimisticData = _a.optimisticData, finallyData = _a.finallyData;
    transactionIDList.forEach(function (transactionID) {
        var _a;
        var _b;
        if (!transactions) {
            return;
        }
        var transaction = transactions["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID)];
        var iouReportAction = transactionsIOUActions[transactionID];
        if (iouReportAction) {
            optimisticData.push({
                key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(transaction === null || transaction === void 0 ? void 0 : transaction.reportID),
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: (_a = {},
                    _a[iouReportAction.reportActionID] = {
                        childVisibleActionCount: ((_b = iouReportAction === null || iouReportAction === void 0 ? void 0 : iouReportAction.childVisibleActionCount) !== null && _b !== void 0 ? _b : 0) + 1,
                    },
                    _a),
            });
        }
    });
    API.write(types_1.WRITE_COMMANDS.HOLD_MONEY_REQUEST_ON_SEARCH, { hash: hash, transactionIDList: transactionIDList, comment: comment }, { optimisticData: optimisticData, finallyData: finallyData });
}
function submitMoneyRequestOnSearch(hash, reportList, policy, transactionIDList, currentSearchKey) {
    var _a, _b;
    var createOnyxData = function (update) { return [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: "".concat(ONYXKEYS_1.default.COLLECTION.SNAPSHOT).concat(hash),
            value: {
                data: transactionIDList
                    ? Object.fromEntries(transactionIDList.map(function (transactionID) { return ["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID), update]; }))
                    : Object.fromEntries(reportList.map(function (report) { return ["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(report.reportID), update]; })),
            },
        },
    ]; };
    var optimisticData = createOnyxData({ isActionLoading: true });
    var failureData = createOnyxData({ isActionLoading: false });
    // If we are on the 'Submit' suggested search, remove the report from the view once the action is taken, don't wait for the view to be re-fetched via Search
    var successData = currentSearchKey === CONST_1.default.SEARCH.SEARCH_KEYS.SUBMIT ? createOnyxData(null) : createOnyxData({ isActionLoading: false });
    var report = ((_a = reportList.at(0)) !== null && _a !== void 0 ? _a : {});
    var parameters = {
        reportID: report.reportID,
        managerAccountID: (_b = (0, PolicyUtils_1.getSubmitToAccountID)(policy.at(0), report)) !== null && _b !== void 0 ? _b : report === null || report === void 0 ? void 0 : report.managerID,
        reportActionID: (0, NumberUtils_1.rand64)(),
    };
    // The SubmitReport command is not 1:1:1 yet, which means creating a separate SubmitMoneyRequestOnSearch command is not feasible until https://github.com/Expensify/Expensify/issues/451223 is done.
    // In the meantime, we'll call SubmitReport which works for a single expense only, so not bulk actions are possible.
    API.write(types_1.WRITE_COMMANDS.SUBMIT_REPORT, parameters, { optimisticData: optimisticData, successData: successData, failureData: failureData });
}
function approveMoneyRequestOnSearch(hash, reportIDList, transactionIDList, currentSearchKey) {
    var createOnyxData = function (update) { return [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: "".concat(ONYXKEYS_1.default.COLLECTION.SNAPSHOT).concat(hash),
            value: {
                data: transactionIDList
                    ? Object.fromEntries(transactionIDList.map(function (transactionID) { return ["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID), update]; }))
                    : Object.fromEntries(reportIDList.map(function (reportID) { return ["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportID), update]; })),
            },
        },
    ]; };
    var optimisticData = createOnyxData({ isActionLoading: true });
    var failureData = createOnyxData({ isActionLoading: false, errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('common.genericErrorMessage') });
    // If we are on the 'Approve', `Unapproved cash` or the `Unapproved company cards` suggested search, remove the report from the view once the action is taken, don't wait for the view to be re-fetched via Search
    var approveActionSuggestedSearches = [CONST_1.default.SEARCH.SEARCH_KEYS.APPROVE, CONST_1.default.SEARCH.SEARCH_KEYS.UNAPPROVED_CASH, CONST_1.default.SEARCH.SEARCH_KEYS.UNAPPROVED_CARD];
    var successData = approveActionSuggestedSearches.includes(currentSearchKey) ? createOnyxData(null) : createOnyxData({ isActionLoading: false });
    (0, Sound_1.default)(Sound_1.SOUNDS.SUCCESS);
    API.write(types_1.WRITE_COMMANDS.APPROVE_MONEY_REQUEST_ON_SEARCH, { hash: hash, reportIDList: reportIDList }, { optimisticData: optimisticData, failureData: failureData, successData: successData });
}
function exportToIntegrationOnSearch(hash, reportID, connectionName, currentSearchKey) {
    var _a;
    var optimisticAction = (0, ReportUtils_1.buildOptimisticExportIntegrationAction)(connectionName);
    var successAction = __assign(__assign({}, optimisticAction), { pendingAction: null });
    var optimisticReportActionID = optimisticAction.reportActionID;
    var createOnyxData = function (update, reportAction) {
        var _a, _b;
        return [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: "".concat(ONYXKEYS_1.default.COLLECTION.SNAPSHOT).concat(hash),
                value: {
                    data: (_a = {},
                        _a["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportID)] = update,
                        _a),
                },
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(reportID),
                value: (_b = {},
                    _b[optimisticReportActionID] = reportAction,
                    _b),
            },
        ];
    };
    var optimisticData = createOnyxData({ isActionLoading: true }, optimisticAction);
    var failureData = createOnyxData({ errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('common.genericErrorMessage'), isActionLoading: false }, null);
    // If we are on the 'Export' suggested search, remove the report from the view once the action is taken, don't wait for the view to be re-fetched via Search
    var successData = currentSearchKey === CONST_1.default.SEARCH.SEARCH_KEYS.EXPORT ? createOnyxData(null, successAction) : createOnyxData({ isActionLoading: false }, successAction);
    var params = {
        reportIDList: reportID,
        connectionName: connectionName,
        type: 'MANUAL',
        optimisticReportActions: JSON.stringify((_a = {},
            _a[reportID] = optimisticReportActionID,
            _a)),
    };
    API.write(types_1.WRITE_COMMANDS.REPORT_EXPORT, params, { optimisticData: optimisticData, failureData: failureData, successData: successData });
}
function payMoneyRequestOnSearch(hash, paymentData, transactionIDList, currentSearchKey) {
    var createOnyxData = function (update) { return [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: "".concat(ONYXKEYS_1.default.COLLECTION.SNAPSHOT).concat(hash),
            value: {
                data: transactionIDList
                    ? Object.fromEntries(transactionIDList.map(function (transactionID) { return ["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID), update]; }))
                    : Object.fromEntries(paymentData.map(function (item) { return ["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(item.reportID), update]; })),
            },
        },
    ]; };
    var optimisticData = createOnyxData({ isActionLoading: true });
    var failureData = createOnyxData({ isActionLoading: false, errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('common.genericErrorMessage') });
    // If we are on the 'Pay' suggested search, remove the report from the view once the action is taken, don't wait for the view to be re-fetched via Search
    var successData = currentSearchKey === CONST_1.default.SEARCH.SEARCH_KEYS.PAY ? createOnyxData(null) : createOnyxData({ isActionLoading: false });
    // eslint-disable-next-line rulesdir/no-api-side-effects-method
    API.makeRequestWithSideEffects(types_1.SIDE_EFFECT_REQUEST_COMMANDS.PAY_MONEY_REQUEST_ON_SEARCH, { hash: hash, paymentData: JSON.stringify(paymentData) }, { optimisticData: optimisticData, failureData: failureData, successData: successData }).then(function (response) {
        if ((response === null || response === void 0 ? void 0 : response.jsonCode) !== CONST_1.default.JSON_CODE.SUCCESS) {
            return;
        }
        (0, Sound_1.default)(Sound_1.SOUNDS.SUCCESS);
    });
}
function unholdMoneyRequestOnSearch(hash, transactionIDList) {
    var _a = getOnyxLoadingData(hash), optimisticData = _a.optimisticData, finallyData = _a.finallyData;
    API.write(types_1.WRITE_COMMANDS.UNHOLD_MONEY_REQUEST_ON_SEARCH, { hash: hash, transactionIDList: transactionIDList }, { optimisticData: optimisticData, finallyData: finallyData });
}
function deleteMoneyRequestOnSearch(hash, transactionIDList) {
    var _a = getOnyxLoadingData(hash), loadingOptimisticData = _a.optimisticData, finallyData = _a.finallyData;
    var optimisticData = __spreadArray(__spreadArray([], loadingOptimisticData, true), [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: "".concat(ONYXKEYS_1.default.COLLECTION.SNAPSHOT).concat(hash),
            value: {
                data: Object.fromEntries(transactionIDList.map(function (transactionID) { return ["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID), { pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE }]; })),
            },
        },
    ], false);
    var failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: "".concat(ONYXKEYS_1.default.COLLECTION.SNAPSHOT).concat(hash),
            value: {
                data: Object.fromEntries(transactionIDList.map(function (transactionID) { return ["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID), { pendingAction: null }]; })),
            },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.DELETE_MONEY_REQUEST_ON_SEARCH, { hash: hash, transactionIDList: transactionIDList }, { optimisticData: optimisticData, failureData: failureData, finallyData: finallyData });
}
function exportSearchItemsToCSV(_a, onDownloadFailed) {
    var query = _a.query, jsonQuery = _a.jsonQuery, reportIDList = _a.reportIDList, transactionIDList = _a.transactionIDList;
    var finalParameters = (0, enhanceParameters_1.default)(types_1.WRITE_COMMANDS.EXPORT_SEARCH_ITEMS_TO_CSV, {
        query: query,
        jsonQuery: jsonQuery,
        reportIDList: reportIDList,
        transactionIDList: transactionIDList,
    });
    var formData = new FormData();
    Object.entries(finalParameters).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        if (Array.isArray(value)) {
            formData.append(key, value.join(','));
        }
        else {
            formData.append(key, String(value));
        }
    });
    (0, fileDownload_1.default)((0, ApiUtils_1.getCommandURL)({ command: types_1.WRITE_COMMANDS.EXPORT_SEARCH_ITEMS_TO_CSV }), 'Expensify.csv', '', false, formData, CONST_1.default.NETWORK.METHOD.POST, onDownloadFailed);
}
function queueExportSearchItemsToCSV(_a) {
    var query = _a.query, jsonQuery = _a.jsonQuery, reportIDList = _a.reportIDList, transactionIDList = _a.transactionIDList;
    var finalParameters = (0, enhanceParameters_1.default)(types_1.WRITE_COMMANDS.EXPORT_SEARCH_ITEMS_TO_CSV, {
        query: query,
        jsonQuery: jsonQuery,
        reportIDList: reportIDList,
        transactionIDList: transactionIDList,
    });
    API.write(types_1.WRITE_COMMANDS.QUEUE_EXPORT_SEARCH_ITEMS_TO_CSV, finalParameters);
}
function queueExportSearchWithTemplate(_a) {
    var templateName = _a.templateName, templateType = _a.templateType, jsonQuery = _a.jsonQuery, reportIDList = _a.reportIDList, transactionIDList = _a.transactionIDList, policyID = _a.policyID;
    var finalParameters = (0, enhanceParameters_1.default)(types_1.WRITE_COMMANDS.QUEUE_EXPORT_SEARCH_WITH_TEMPLATE, {
        templateName: templateName,
        templateType: templateType,
        jsonQuery: jsonQuery,
        reportIDList: reportIDList,
        transactionIDList: transactionIDList,
        policyID: policyID,
    });
    API.write(types_1.WRITE_COMMANDS.QUEUE_EXPORT_SEARCH_WITH_TEMPLATE, finalParameters);
}
/**
 * Updates the form values for the advanced filters search form.
 */
function updateAdvancedFilters(values, shouldUseOnyxSetMethod) {
    if (shouldUseOnyxSetMethod === void 0) { shouldUseOnyxSetMethod = false; }
    if (shouldUseOnyxSetMethod) {
        react_native_onyx_1.default.set(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, values);
        return;
    }
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, values);
}
/**
 * Clears all values for the advanced filters search form.
 */
function clearAllFilters() {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, null);
}
function clearAdvancedFilters() {
    var values = {};
    Object.values(SearchAdvancedFiltersForm_1.FILTER_KEYS)
        .filter(function (key) { return key !== SearchAdvancedFiltersForm_1.FILTER_KEYS.GROUP_BY; })
        .forEach(function (key) {
        if (key === SearchAdvancedFiltersForm_1.FILTER_KEYS.TYPE) {
            values[key] = CONST_1.default.SEARCH.DATA_TYPES.EXPENSE;
            return;
        }
        if (key === SearchAdvancedFiltersForm_1.FILTER_KEYS.STATUS) {
            values[key] = CONST_1.default.SEARCH.STATUS.EXPENSE.ALL;
            return;
        }
        values[key] = null;
    });
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, values);
}
