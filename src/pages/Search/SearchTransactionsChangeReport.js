"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var SearchContext_1 = require("@components/Search/SearchContext");
var useOnyx_1 = require("@hooks/useOnyx");
var Transaction_1 = require("@libs/actions/Transaction");
var Navigation_1 = require("@libs/Navigation/Navigation");
var Permissions_1 = require("@libs/Permissions");
var IOURequestEditReportCommon_1 = require("@pages/iou/request/step/IOURequestEditReportCommon");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
function SearchTransactionsChangeReport() {
    var _a;
    var _b = (0, SearchContext_1.useSearchContext)(), selectedTransactions = _b.selectedTransactions, clearSelectedTransactions = _b.clearSelectedTransactions;
    var selectedTransactionsKeys = (0, react_1.useMemo)(function () { return Object.keys(selectedTransactions); }, [selectedTransactions]);
    var allReportNextSteps = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.NEXT_STEP, { canBeMissing: true })[0];
    var allPolicies = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true })[0];
    var allBetas = (0, useOnyx_1.default)(ONYXKEYS_1.default.BETAS, { canBeMissing: true })[0];
    var isASAPSubmitBetaEnabled = Permissions_1.default.isBetaEnabled(CONST_1.default.BETAS.ASAP_SUBMIT, allBetas);
    var session = (0, OnyxListItemProvider_1.useSession)();
    var firstTransactionKey = selectedTransactionsKeys.at(0);
    var firstTransactionReportID = firstTransactionKey ? (_a = selectedTransactions[firstTransactionKey]) === null || _a === void 0 ? void 0 : _a.reportID : undefined;
    var selectedReportID = Object.values(selectedTransactions).every(function (transaction) { return transaction.reportID === firstTransactionReportID; }) && firstTransactionReportID !== CONST_1.default.REPORT.UNREPORTED_REPORT_ID
        ? firstTransactionReportID
        : undefined;
    var selectReport = function (item) {
        var _a, _b;
        if (selectedTransactionsKeys.length === 0) {
            return;
        }
        var reportNextStep = allReportNextSteps === null || allReportNextSteps === void 0 ? void 0 : allReportNextSteps["".concat(ONYXKEYS_1.default.COLLECTION.NEXT_STEP).concat(item.value)];
        (0, Transaction_1.changeTransactionsReport)(selectedTransactionsKeys, item.value, isASAPSubmitBetaEnabled, (_a = session === null || session === void 0 ? void 0 : session.accountID) !== null && _a !== void 0 ? _a : CONST_1.default.DEFAULT_NUMBER_ID, (_b = session === null || session === void 0 ? void 0 : session.email) !== null && _b !== void 0 ? _b : '', allPolicies === null || allPolicies === void 0 ? void 0 : allPolicies["".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(item.policyID)], reportNextStep);
        react_native_1.InteractionManager.runAfterInteractions(function () {
            clearSelectedTransactions();
        });
        Navigation_1.default.goBack();
    };
    var removeFromReport = function () {
        var _a, _b;
        if (selectedTransactionsKeys.length === 0) {
            return;
        }
        (0, Transaction_1.changeTransactionsReport)(selectedTransactionsKeys, CONST_1.default.REPORT.UNREPORTED_REPORT_ID, isASAPSubmitBetaEnabled, (_a = session === null || session === void 0 ? void 0 : session.accountID) !== null && _a !== void 0 ? _a : CONST_1.default.DEFAULT_NUMBER_ID, (_b = session === null || session === void 0 ? void 0 : session.email) !== null && _b !== void 0 ? _b : '');
        clearSelectedTransactions();
        Navigation_1.default.goBack();
    };
    return (<IOURequestEditReportCommon_1.default backTo={undefined} transactionIDs={selectedTransactionsKeys} selectedReportID={selectedReportID} selectReport={selectReport} removeFromReport={removeFromReport} isEditing/>);
}
SearchTransactionsChangeReport.displayName = 'SearchTransactionsChangeReport';
exports.default = SearchTransactionsChangeReport;
