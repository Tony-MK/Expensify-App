"use strict";
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
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const ApiUtils_1 = require("@libs/ApiUtils");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const fileDownload_1 = require("@libs/fileDownload");
const enhanceParameters_1 = require("@libs/Network/enhanceParameters");
const NumberUtils_1 = require("@libs/NumberUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const SearchUIUtils_1 = require("@libs/SearchUIUtils");
const Sound_1 = require("@libs/Sound");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SearchAdvancedFiltersForm_1 = require("@src/types/form/SearchAdvancedFiltersForm");
function handleActionButtonPress(hash, item, goToItem, isInMobileSelectionMode, snapshotReport, snapshotPolicy, lastPaymentMethod, currentSearchKey) {
    // The transactionIDList is needed to handle actions taken on `status:""` where transactions on single expense reports can be approved/paid.
    // We need the transactionID to display the loading indicator for that list item's action.
    const transactionID = (0, SearchUIUtils_1.isTransactionListItemType)(item) ? [item.transactionID] : undefined;
    const allReportTransactions = ((0, SearchUIUtils_1.isTransactionGroupListItemType)(item) ? item.transactions : [item]);
    const hasHeldExpense = (0, ReportUtils_1.hasHeldExpenses)('', allReportTransactions);
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
            const policy = (snapshotPolicy ?? {});
            const connectedIntegration = (0, PolicyUtils_1.getValidConnectedIntegration)(policy);
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
function getLastPolicyBankAccountID(policyID, lastPaymentMethods, reportType = 'lastUsed') {
    if (!policyID) {
        return undefined;
    }
    const lastPolicyPaymentMethod = lastPaymentMethods?.[policyID];
    return typeof lastPolicyPaymentMethod === 'string' ? undefined : lastPolicyPaymentMethod?.[reportType]?.bankAccountID;
}
function getLastPolicyPaymentMethod(policyID, lastPaymentMethods, reportType = 'lastUsed', isIOUReport) {
    if (!policyID) {
        return undefined;
    }
    const personalPolicy = (0, PolicyUtils_1.getPersonalPolicy)();
    const lastPolicyPaymentMethod = lastPaymentMethods?.[policyID] ?? (isIOUReport && personalPolicy ? lastPaymentMethods?.[personalPolicy.id] : undefined);
    const result = typeof lastPolicyPaymentMethod === 'string' ? lastPolicyPaymentMethod : lastPolicyPaymentMethod?.[reportType]?.name;
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
    const lastPolicyPaymentMethod = getLastPolicyPaymentMethod(item.policyID, lastPaymentMethod, getReportType(item.reportID));
    if (!lastPolicyPaymentMethod || !Object.values(CONST_1.default.IOU.PAYMENT_TYPE).includes(lastPolicyPaymentMethod)) {
        goToItem();
        return;
    }
    const amount = Math.abs((snapshotReport?.total ?? 0) - (snapshotReport?.nonReimbursableTotal ?? 0));
    const transactionID = (0, SearchUIUtils_1.isTransactionListItemType)(item) ? [item.transactionID] : undefined;
    if (lastPolicyPaymentMethod === CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE) {
        payMoneyRequestOnSearch(hash, [{ reportID: item.reportID, amount, paymentType: lastPolicyPaymentMethod }], transactionID, currentSearchKey);
        return;
    }
    const hasVBBA = !!snapshotPolicy?.achAccount?.bankAccountID;
    if (hasVBBA) {
        payMoneyRequestOnSearch(hash, [{ reportID: item.reportID, amount, paymentType: lastPolicyPaymentMethod }], transactionID, currentSearchKey);
        return;
    }
    goToItem();
}
function getOnyxLoadingData(hash, queryJSON) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${hash}`,
            value: {
                search: {
                    isLoading: true,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${hash}`,
            value: {
                errors: null,
            },
        },
    ];
    const finallyData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${hash}`,
            value: {
                search: {
                    isLoading: false,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${hash}`,
            value: {
                data: [],
                search: {
                    status: queryJSON?.status,
                    type: queryJSON?.type,
                    isLoading: false,
                },
                errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('common.genericErrorMessage'),
            },
        },
    ];
    return { optimisticData, finallyData, failureData };
}
function saveSearch({ queryJSON, newName }) {
    const saveSearchName = newName ?? queryJSON?.inputQuery ?? '';
    const jsonQuery = JSON.stringify(queryJSON);
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.SAVED_SEARCHES}`,
            value: {
                [queryJSON.hash]: {
                    pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    name: saveSearchName,
                    query: queryJSON.inputQuery,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.SAVED_SEARCHES}`,
            value: {
                [queryJSON.hash]: null,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.SAVED_SEARCHES}`,
            value: {
                [queryJSON.hash]: {
                    pendingAction: null,
                },
            },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.SAVE_SEARCH, { jsonQuery, newName: saveSearchName }, { optimisticData, failureData, successData });
}
function deleteSavedSearch(hash) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.SAVED_SEARCHES}`,
            value: {
                [hash]: {
                    pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.SAVED_SEARCHES}`,
            value: {
                [hash]: null,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.SAVED_SEARCHES}`,
            value: {
                [hash]: {
                    pendingAction: null,
                },
            },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.DELETE_SAVED_SEARCH, { hash }, { optimisticData, failureData, successData });
}
function openSearchPage() {
    API.read(types_1.READ_COMMANDS.OPEN_SEARCH_PAGE, null);
}
function search({ queryJSON, searchKey, offset, shouldCalculateTotals = false, }) {
    const { optimisticData, finallyData, failureData } = getOnyxLoadingData(queryJSON.hash, queryJSON);
    const { flatFilters, ...queryJSONWithoutFlatFilters } = queryJSON;
    const query = {
        ...queryJSONWithoutFlatFilters,
        searchKey,
        offset,
        shouldCalculateTotals,
    };
    const jsonQuery = JSON.stringify(query);
    API.read(types_1.READ_COMMANDS.SEARCH, { hash: queryJSON.hash, jsonQuery }, { optimisticData, finallyData, failureData });
}
/**
 * It's possible that we return legacy transactions that don't have a transaction thread created yet.
 * In that case, when users select the search result row, we need to create the transaction thread on the fly and update the search result with the new transactionThreadReport
 */
function updateSearchResultsWithTransactionThreadReportID(hash, transactionID, reportID) {
    const onyxUpdate = {
        data: {
            [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`]: {
                transactionThreadReportID: reportID,
            },
        },
    };
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${hash}`, onyxUpdate);
}
function holdMoneyRequestOnSearch(hash, transactionIDList, comment, transactions, transactionsIOUActions) {
    const { optimisticData, finallyData } = getOnyxLoadingData(hash);
    transactionIDList.forEach((transactionID) => {
        if (!transactions) {
            return;
        }
        const transaction = transactions[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`];
        const iouReportAction = transactionsIOUActions[transactionID];
        if (iouReportAction) {
            optimisticData.push({
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transaction?.reportID}`,
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                value: {
                    [iouReportAction.reportActionID]: {
                        childVisibleActionCount: (iouReportAction?.childVisibleActionCount ?? 0) + 1,
                    },
                },
            });
        }
    });
    API.write(types_1.WRITE_COMMANDS.HOLD_MONEY_REQUEST_ON_SEARCH, { hash, transactionIDList, comment }, { optimisticData, finallyData });
}
function submitMoneyRequestOnSearch(hash, reportList, policy, transactionIDList, currentSearchKey) {
    const createOnyxData = (update) => [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${hash}`,
            value: {
                data: transactionIDList
                    ? Object.fromEntries(transactionIDList.map((transactionID) => [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, update]))
                    : Object.fromEntries(reportList.map((report) => [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`, update])),
            },
        },
    ];
    const optimisticData = createOnyxData({ isActionLoading: true });
    const failureData = createOnyxData({ isActionLoading: false });
    // If we are on the 'Submit' suggested search, remove the report from the view once the action is taken, don't wait for the view to be re-fetched via Search
    const successData = currentSearchKey === CONST_1.default.SEARCH.SEARCH_KEYS.SUBMIT ? createOnyxData(null) : createOnyxData({ isActionLoading: false });
    const report = (reportList.at(0) ?? {});
    const parameters = {
        reportID: report.reportID,
        managerAccountID: (0, PolicyUtils_1.getSubmitToAccountID)(policy.at(0), report) ?? report?.managerID,
        reportActionID: (0, NumberUtils_1.rand64)(),
    };
    // The SubmitReport command is not 1:1:1 yet, which means creating a separate SubmitMoneyRequestOnSearch command is not feasible until https://github.com/Expensify/Expensify/issues/451223 is done.
    // In the meantime, we'll call SubmitReport which works for a single expense only, so not bulk actions are possible.
    API.write(types_1.WRITE_COMMANDS.SUBMIT_REPORT, parameters, { optimisticData, successData, failureData });
}
function approveMoneyRequestOnSearch(hash, reportIDList, transactionIDList, currentSearchKey) {
    const createOnyxData = (update) => [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${hash}`,
            value: {
                data: transactionIDList
                    ? Object.fromEntries(transactionIDList.map((transactionID) => [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, update]))
                    : Object.fromEntries(reportIDList.map((reportID) => [`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, update])),
            },
        },
    ];
    const optimisticData = createOnyxData({ isActionLoading: true });
    const failureData = createOnyxData({ isActionLoading: false, errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('common.genericErrorMessage') });
    // If we are on the 'Approve', `Unapproved cash` or the `Unapproved company cards` suggested search, remove the report from the view once the action is taken, don't wait for the view to be re-fetched via Search
    const approveActionSuggestedSearches = [CONST_1.default.SEARCH.SEARCH_KEYS.APPROVE, CONST_1.default.SEARCH.SEARCH_KEYS.UNAPPROVED_CASH, CONST_1.default.SEARCH.SEARCH_KEYS.UNAPPROVED_CARD];
    const successData = approveActionSuggestedSearches.includes(currentSearchKey) ? createOnyxData(null) : createOnyxData({ isActionLoading: false });
    (0, Sound_1.default)(Sound_1.SOUNDS.SUCCESS);
    API.write(types_1.WRITE_COMMANDS.APPROVE_MONEY_REQUEST_ON_SEARCH, { hash, reportIDList }, { optimisticData, failureData, successData });
}
function exportToIntegrationOnSearch(hash, reportID, connectionName, currentSearchKey) {
    const optimisticAction = (0, ReportUtils_1.buildOptimisticExportIntegrationAction)(connectionName);
    const successAction = { ...optimisticAction, pendingAction: null };
    const optimisticReportActionID = optimisticAction.reportActionID;
    const createOnyxData = (update, reportAction) => [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${hash}`,
            value: {
                data: {
                    [`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`]: update,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [optimisticReportActionID]: reportAction,
            },
        },
    ];
    const optimisticData = createOnyxData({ isActionLoading: true }, optimisticAction);
    const failureData = createOnyxData({ errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('common.genericErrorMessage'), isActionLoading: false }, null);
    // If we are on the 'Export' suggested search, remove the report from the view once the action is taken, don't wait for the view to be re-fetched via Search
    const successData = currentSearchKey === CONST_1.default.SEARCH.SEARCH_KEYS.EXPORT ? createOnyxData(null, successAction) : createOnyxData({ isActionLoading: false }, successAction);
    const params = {
        reportIDList: reportID,
        connectionName,
        type: 'MANUAL',
        optimisticReportActions: JSON.stringify({
            [reportID]: optimisticReportActionID,
        }),
    };
    API.write(types_1.WRITE_COMMANDS.REPORT_EXPORT, params, { optimisticData, failureData, successData });
}
function payMoneyRequestOnSearch(hash, paymentData, transactionIDList, currentSearchKey) {
    const createOnyxData = (update) => [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${hash}`,
            value: {
                data: transactionIDList
                    ? Object.fromEntries(transactionIDList.map((transactionID) => [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, update]))
                    : Object.fromEntries(paymentData.map((item) => [`${ONYXKEYS_1.default.COLLECTION.REPORT}${item.reportID}`, update])),
            },
        },
    ];
    const optimisticData = createOnyxData({ isActionLoading: true });
    const failureData = createOnyxData({ isActionLoading: false, errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('common.genericErrorMessage') });
    // If we are on the 'Pay' suggested search, remove the report from the view once the action is taken, don't wait for the view to be re-fetched via Search
    const successData = currentSearchKey === CONST_1.default.SEARCH.SEARCH_KEYS.PAY ? createOnyxData(null) : createOnyxData({ isActionLoading: false });
    // eslint-disable-next-line rulesdir/no-api-side-effects-method
    API.makeRequestWithSideEffects(types_1.SIDE_EFFECT_REQUEST_COMMANDS.PAY_MONEY_REQUEST_ON_SEARCH, { hash, paymentData: JSON.stringify(paymentData) }, { optimisticData, failureData, successData }).then((response) => {
        if (response?.jsonCode !== CONST_1.default.JSON_CODE.SUCCESS) {
            return;
        }
        (0, Sound_1.default)(Sound_1.SOUNDS.SUCCESS);
    });
}
function unholdMoneyRequestOnSearch(hash, transactionIDList) {
    const { optimisticData, finallyData } = getOnyxLoadingData(hash);
    API.write(types_1.WRITE_COMMANDS.UNHOLD_MONEY_REQUEST_ON_SEARCH, { hash, transactionIDList }, { optimisticData, finallyData });
}
function deleteMoneyRequestOnSearch(hash, transactionIDList) {
    const { optimisticData: loadingOptimisticData, finallyData } = getOnyxLoadingData(hash);
    const optimisticData = [
        ...loadingOptimisticData,
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${hash}`,
            value: {
                data: Object.fromEntries(transactionIDList.map((transactionID) => [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, { pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE }])),
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${hash}`,
            value: {
                data: Object.fromEntries(transactionIDList.map((transactionID) => [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, { pendingAction: null }])),
            },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.DELETE_MONEY_REQUEST_ON_SEARCH, { hash, transactionIDList }, { optimisticData, failureData, finallyData });
}
function exportSearchItemsToCSV({ query, jsonQuery, reportIDList, transactionIDList }, onDownloadFailed) {
    const finalParameters = (0, enhanceParameters_1.default)(types_1.WRITE_COMMANDS.EXPORT_SEARCH_ITEMS_TO_CSV, {
        query,
        jsonQuery,
        reportIDList,
        transactionIDList,
    });
    const formData = new FormData();
    Object.entries(finalParameters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            formData.append(key, value.join(','));
        }
        else {
            formData.append(key, String(value));
        }
    });
    (0, fileDownload_1.default)((0, ApiUtils_1.getCommandURL)({ command: types_1.WRITE_COMMANDS.EXPORT_SEARCH_ITEMS_TO_CSV }), 'Expensify.csv', '', false, formData, CONST_1.default.NETWORK.METHOD.POST, onDownloadFailed);
}
function queueExportSearchItemsToCSV({ query, jsonQuery, reportIDList, transactionIDList }) {
    const finalParameters = (0, enhanceParameters_1.default)(types_1.WRITE_COMMANDS.EXPORT_SEARCH_ITEMS_TO_CSV, {
        query,
        jsonQuery,
        reportIDList,
        transactionIDList,
    });
    API.write(types_1.WRITE_COMMANDS.QUEUE_EXPORT_SEARCH_ITEMS_TO_CSV, finalParameters);
}
function queueExportSearchWithTemplate({ templateName, templateType, jsonQuery, reportIDList, transactionIDList, policyID }) {
    const finalParameters = (0, enhanceParameters_1.default)(types_1.WRITE_COMMANDS.QUEUE_EXPORT_SEARCH_WITH_TEMPLATE, {
        templateName,
        templateType,
        jsonQuery,
        reportIDList,
        transactionIDList,
        policyID,
    });
    API.write(types_1.WRITE_COMMANDS.QUEUE_EXPORT_SEARCH_WITH_TEMPLATE, finalParameters);
}
/**
 * Updates the form values for the advanced filters search form.
 */
function updateAdvancedFilters(values, shouldUseOnyxSetMethod = false) {
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
    const values = {};
    Object.values(SearchAdvancedFiltersForm_1.FILTER_KEYS)
        .filter((key) => key !== SearchAdvancedFiltersForm_1.FILTER_KEYS.GROUP_BY)
        .forEach((key) => {
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
