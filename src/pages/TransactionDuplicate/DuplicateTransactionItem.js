"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var ReportActionItem_1 = require("@pages/home/report/ReportActionItem");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
function DuplicateTransactionItem(_a) {
    var _b, _c, _d;
    var transaction = _a.transaction, index = _a.index, allReports = _a.allReports, policies = _a.policies;
    var styles = (0, useThemeStyles_1.default)();
    var userWalletTierName = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_WALLET, { selector: function (wallet) { return wallet === null || wallet === void 0 ? void 0 : wallet.tierName; }, canBeMissing: false })[0];
    var isUserValidated = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { selector: function (account) { return account === null || account === void 0 ? void 0 : account.validated; }, canBeMissing: true })[0];
    var personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    var userBillingFundID = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_BILLING_FUND_ID, { canBeMissing: true })[0];
    var report = allReports === null || allReports === void 0 ? void 0 : allReports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(transaction === null || transaction === void 0 ? void 0 : transaction.reportID)];
    var reportActions = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(report === null || report === void 0 ? void 0 : report.reportID), { canBeMissing: false })[0];
    var tryNewDot = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_TRY_NEW_DOT, { canBeMissing: false })[0];
    var isTryNewDotNVPDismissed = !!((_b = tryNewDot === null || tryNewDot === void 0 ? void 0 : tryNewDot.classicRedirect) === null || _b === void 0 ? void 0 : _b.dismissed);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/non-nullable-type-assertion-style
    var action = (_c = Object.values(reportActions !== null && reportActions !== void 0 ? reportActions : {})) === null || _c === void 0 ? void 0 : _c.find(function (reportAction) {
        var _a;
        var IOUTransactionID = (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction) ? (_a = (0, ReportActionsUtils_1.getOriginalMessage)(reportAction)) === null || _a === void 0 ? void 0 : _a.IOUTransactionID : CONST_1.default.DEFAULT_NUMBER_ID;
        return IOUTransactionID === (transaction === null || transaction === void 0 ? void 0 : transaction.transactionID);
    });
    var originalReportID = (0, ReportUtils_1.getOriginalReportID)(report === null || report === void 0 ? void 0 : report.reportID, action);
    var draftMessage = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS).concat(originalReportID), {
        canBeMissing: true,
    })[0];
    var emojiReactions = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS).concat(action === null || action === void 0 ? void 0 : action.reportActionID), {
        canBeMissing: true,
    })[0];
    var linkedTransactionRouteError = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat((0, ReportActionsUtils_1.isMoneyRequestAction)(action) && ((_d = (0, ReportActionsUtils_1.getOriginalMessage)(action)) === null || _d === void 0 ? void 0 : _d.IOUTransactionID)), {
        canBeMissing: true,
        selector: function (transactionItem) { var _a, _b; return (_b = (_a = transactionItem === null || transactionItem === void 0 ? void 0 : transactionItem.errorFields) === null || _a === void 0 ? void 0 : _a.route) !== null && _b !== void 0 ? _b : null; },
    })[0];
    if (!action || !report) {
        return null;
    }
    var reportDraftMessage = draftMessage === null || draftMessage === void 0 ? void 0 : draftMessage[action.reportActionID];
    var matchingDraftMessage = typeof reportDraftMessage === 'string' ? reportDraftMessage : reportDraftMessage === null || reportDraftMessage === void 0 ? void 0 : reportDraftMessage.message;
    return (<react_native_1.View style={styles.pb2}>
            <ReportActionItem_1.default allReports={allReports} policies={policies} action={action} report={report} parentReportAction={(0, ReportActionsUtils_1.getReportAction)(report === null || report === void 0 ? void 0 : report.parentReportID, report === null || report === void 0 ? void 0 : report.parentReportActionID)} index={index} reportActions={Object.values(reportActions !== null && reportActions !== void 0 ? reportActions : {})} displayAsGroup={false} shouldDisplayNewMarker={false} isMostRecentIOUReportAction={false} isFirstVisibleReportAction={false} shouldDisplayContextMenu={false} userWalletTierName={userWalletTierName} isUserValidated={isUserValidated} personalDetails={personalDetails} draftMessage={matchingDraftMessage} emojiReactions={emojiReactions} linkedTransactionRouteError={linkedTransactionRouteError} userBillingFundID={userBillingFundID} isTryNewDotNVPDismissed={isTryNewDotNVPDismissed}/>
        </react_native_1.View>);
}
DuplicateTransactionItem.displayName = 'DuplicateTransactionItem';
exports.default = DuplicateTransactionItem;
