"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var SearchContext_1 = require("@components/Search/SearchContext");
var useOnyx_1 = require("@hooks/useOnyx");
var useShowNotFoundPageInIOUStep_1 = require("@hooks/useShowNotFoundPageInIOUStep");
var Transaction_1 = require("@libs/actions/Transaction");
var Navigation_1 = require("@libs/Navigation/Navigation");
var Permissions_1 = require("@libs/Permissions");
var ReportUtils_1 = require("@libs/ReportUtils");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var IOURequestEditReportCommon_1 = require("./IOURequestEditReportCommon");
var withFullTransactionOrNotFound_1 = require("./withFullTransactionOrNotFound");
var withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
function IOURequestStepReport(_a) {
    var _b, _c;
    var route = _a.route, transaction = _a.transaction;
    var _d = route.params, backTo = _d.backTo, action = _d.action, iouType = _d.iouType, transactionID = _d.transactionID, reportIDFromRoute = _d.reportID, reportActionID = _d.reportActionID;
    var allReports = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT), { canBeMissing: false })[0];
    var isUnreported = (transaction === null || transaction === void 0 ? void 0 : transaction.reportID) === CONST_1.default.REPORT.UNREPORTED_REPORT_ID;
    var transactionReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.reportID) === (transaction === null || transaction === void 0 ? void 0 : transaction.reportID); });
    var participantReportID = (_c = (_b = transaction === null || transaction === void 0 ? void 0 : transaction.participants) === null || _b === void 0 ? void 0 : _b.at(0)) === null || _c === void 0 ? void 0 : _c.reportID;
    var participantReport = Object.values(allReports !== null && allReports !== void 0 ? allReports : {}).find(function (report) { return (report === null || report === void 0 ? void 0 : report.reportID) === participantReportID; });
    var shouldUseTransactionReport = (!!transactionReport && (0, ReportUtils_1.isReportOutstanding)(transactionReport, transactionReport === null || transactionReport === void 0 ? void 0 : transactionReport.policyID)) || isUnreported;
    var outstandingReportID = (0, ReportUtils_1.isPolicyExpenseChat)(participantReport) ? participantReport === null || participantReport === void 0 ? void 0 : participantReport.iouReportID : participantReportID;
    var selectedReportID = shouldUseTransactionReport ? transactionReport === null || transactionReport === void 0 ? void 0 : transactionReport.reportID : outstandingReportID;
    var allPolicies = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true })[0];
    var removeTransaction = (0, SearchContext_1.useSearchContext)().removeTransaction;
    var reportOrDraftReport = (0, ReportUtils_1.getReportOrDraftReport)(reportIDFromRoute);
    var isEditing = action === CONST_1.default.IOU.ACTION.EDIT;
    var isCreateReport = action === CONST_1.default.IOU.ACTION.CREATE;
    var isFromGlobalCreate = !!(transaction === null || transaction === void 0 ? void 0 : transaction.isFromGlobalCreate);
    var allBetas = (0, useOnyx_1.default)(ONYXKEYS_1.default.BETAS, { canBeMissing: true })[0];
    var isASAPSubmitBetaEnabled = Permissions_1.default.isBetaEnabled(CONST_1.default.BETAS.ASAP_SUBMIT, allBetas);
    var session = (0, OnyxListItemProvider_1.useSession)();
    var handleGoBack = function () {
        if (isEditing) {
            Navigation_1.default.dismissModal();
        }
        else {
            Navigation_1.default.goBack(backTo);
        }
    };
    var handleGlobalCreateReport = function (item) {
        if (!transaction) {
            return;
        }
        var reportOrDraftReportFromValue = (0, ReportUtils_1.getReportOrDraftReport)(item.value);
        var participants = [
            {
                selected: true,
                accountID: 0,
                isPolicyExpenseChat: true,
                reportID: reportOrDraftReportFromValue === null || reportOrDraftReportFromValue === void 0 ? void 0 : reportOrDraftReportFromValue.chatReportID,
                policyID: reportOrDraftReportFromValue === null || reportOrDraftReportFromValue === void 0 ? void 0 : reportOrDraftReportFromValue.policyID,
            },
        ];
        (0, Transaction_1.setTransactionReport)(transaction.transactionID, {
            reportID: item.value,
            participants: participants,
        }, true);
        var iouConfirmationPageRoute = ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(action, iouType, transactionID, reportOrDraftReportFromValue === null || reportOrDraftReportFromValue === void 0 ? void 0 : reportOrDraftReportFromValue.chatReportID);
        // If the backTo parameter is set, we should navigate back to the confirmation screen that is already on the stack.
        if (backTo) {
            Navigation_1.default.goBack(iouConfirmationPageRoute, { compareParams: false });
        }
        else {
            Navigation_1.default.navigate(iouConfirmationPageRoute);
        }
    };
    var handleRegularReportSelection = function (item) {
        if (!transaction) {
            return;
        }
        handleGoBack();
        react_native_1.InteractionManager.runAfterInteractions(function () {
            var _a, _b;
            (0, Transaction_1.setTransactionReport)(transaction.transactionID, {
                reportID: item.value,
            }, !isEditing);
            if (isEditing) {
                (0, Transaction_1.changeTransactionsReport)([transaction.transactionID], item.value, isASAPSubmitBetaEnabled, (_a = session === null || session === void 0 ? void 0 : session.accountID) !== null && _a !== void 0 ? _a : CONST_1.default.DEFAULT_NUMBER_ID, (_b = session === null || session === void 0 ? void 0 : session.email) !== null && _b !== void 0 ? _b : '', allPolicies === null || allPolicies === void 0 ? void 0 : allPolicies["".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(item.policyID)]);
                removeTransaction(transaction.transactionID);
            }
        });
    };
    var selectReport = function (item) {
        if (!transaction) {
            return;
        }
        var isSameReport = item.value === transaction.reportID;
        // Early return for same report selection
        if (isSameReport) {
            handleGoBack();
            return;
        }
        // Handle global create report
        if (isCreateReport && isFromGlobalCreate) {
            handleGlobalCreateReport(item);
            return;
        }
        // Handle regular report selection
        handleRegularReportSelection(item);
    };
    var removeFromReport = function () {
        if (!transaction) {
            return;
        }
        Navigation_1.default.dismissModal();
        react_native_1.InteractionManager.runAfterInteractions(function () {
            var _a, _b;
            (0, Transaction_1.changeTransactionsReport)([transaction.transactionID], CONST_1.default.REPORT.UNREPORTED_REPORT_ID, isASAPSubmitBetaEnabled, (_a = session === null || session === void 0 ? void 0 : session.accountID) !== null && _a !== void 0 ? _a : CONST_1.default.DEFAULT_NUMBER_ID, (_b = session === null || session === void 0 ? void 0 : session.email) !== null && _b !== void 0 ? _b : '');
            removeTransaction(transaction.transactionID);
        });
    };
    // eslint-disable-next-line rulesdir/no-negated-variables
    var shouldShowNotFoundPage = (0, useShowNotFoundPageInIOUStep_1.default)(action, iouType, reportActionID, reportOrDraftReport, transaction);
    return (<IOURequestEditReportCommon_1.default backTo={backTo} selectReport={selectReport} transactionIDs={transaction ? [transaction.transactionID] : []} selectedReportID={selectedReportID} selectedPolicyID={!isEditing && !isFromGlobalCreate ? reportOrDraftReport === null || reportOrDraftReport === void 0 ? void 0 : reportOrDraftReport.policyID : undefined} removeFromReport={removeFromReport} isEditing={isEditing} isUnreported={isUnreported} shouldShowNotFoundPage={shouldShowNotFoundPage}/>);
}
IOURequestStepReport.displayName = 'IOURequestStepReport';
exports.default = (0, withWritableReportOrNotFound_1.default)((0, withFullTransactionOrNotFound_1.default)(IOURequestStepReport));
