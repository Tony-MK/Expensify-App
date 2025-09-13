"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var SearchContext_1 = require("@components/Search/SearchContext");
var useOnyx_1 = require("@hooks/useOnyx");
var MobileSelectionMode_1 = require("@libs/actions/MobileSelectionMode");
var Transaction_1 = require("@libs/actions/Transaction");
var Navigation_1 = require("@libs/Navigation/Navigation");
var Permissions_1 = require("@libs/Permissions");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var IOURequestEditReportCommon_1 = require("./IOURequestEditReportCommon");
var withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
function IOURequestEditReport(_a) {
    var route = _a.route;
    var _b = route.params, backTo = _b.backTo, reportID = _b.reportID, action = _b.action, shouldTurnOffSelectionMode = _b.shouldTurnOffSelectionMode;
    var _c = (0, SearchContext_1.useSearchContext)(), selectedTransactionIDs = _c.selectedTransactionIDs, clearSelectedTransactions = _c.clearSelectedTransactions;
    var selectedReport = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportID), { canBeMissing: false })[0];
    var reportNextStep = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.NEXT_STEP).concat(reportID), { canBeMissing: true })[0];
    var allBetas = (0, useOnyx_1.default)(ONYXKEYS_1.default.BETAS, { canBeMissing: true })[0];
    var isASAPSubmitBetaEnabled = Permissions_1.default.isBetaEnabled(CONST_1.default.BETAS.ASAP_SUBMIT, allBetas);
    var session = (0, OnyxListItemProvider_1.useSession)();
    var allPolicies = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true })[0];
    var selectReport = function (item) {
        var _a, _b;
        if (selectedTransactionIDs.length === 0 || item.value === reportID) {
            Navigation_1.default.dismissModal();
            return;
        }
        (0, Transaction_1.changeTransactionsReport)(selectedTransactionIDs, item.value, isASAPSubmitBetaEnabled, (_a = session === null || session === void 0 ? void 0 : session.accountID) !== null && _a !== void 0 ? _a : CONST_1.default.DEFAULT_NUMBER_ID, (_b = session === null || session === void 0 ? void 0 : session.email) !== null && _b !== void 0 ? _b : '', allPolicies === null || allPolicies === void 0 ? void 0 : allPolicies["".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(item.policyID)], reportNextStep);
        (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
        clearSelectedTransactions(true);
        Navigation_1.default.dismissModal();
    };
    var removeFromReport = function () {
        var _a, _b;
        if (!selectedReport || selectedTransactionIDs.length === 0) {
            return;
        }
        (0, Transaction_1.changeTransactionsReport)(selectedTransactionIDs, CONST_1.default.REPORT.UNREPORTED_REPORT_ID, isASAPSubmitBetaEnabled, (_a = session === null || session === void 0 ? void 0 : session.accountID) !== null && _a !== void 0 ? _a : CONST_1.default.DEFAULT_NUMBER_ID, (_b = session === null || session === void 0 ? void 0 : session.email) !== null && _b !== void 0 ? _b : '');
        if (shouldTurnOffSelectionMode) {
            (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
        }
        clearSelectedTransactions(true);
        Navigation_1.default.dismissModal();
    };
    return (<IOURequestEditReportCommon_1.default backTo={backTo} selectedReportID={reportID} transactionIDs={selectedTransactionIDs} selectReport={selectReport} removeFromReport={removeFromReport} isEditing={action === CONST_1.default.IOU.ACTION.EDIT}/>);
}
IOURequestEditReport.displayName = 'IOURequestEditReport';
exports.default = (0, withWritableReportOrNotFound_1.default)(IOURequestEditReport);
