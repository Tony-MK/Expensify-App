"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var ScrollView_1 = require("@components/ScrollView");
var useOnyx_1 = require("@hooks/useOnyx");
var ReportActionItem_1 = require("@pages/home/report/ReportActionItem");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
function DebugReportActionPreview(_a) {
    var _b;
    var reportAction = _a.reportAction, reportID = _a.reportID;
    var allReports = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: false })[0];
    var policies = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: false })[0];
    var userWalletTierName = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_WALLET, { selector: function (wallet) { return wallet === null || wallet === void 0 ? void 0 : wallet.tierName; }, canBeMissing: false })[0];
    var isUserValidated = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { selector: function (account) { return account === null || account === void 0 ? void 0 : account.validated; }, canBeMissing: true })[0];
    var personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    var userBillingFundID = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_BILLING_FUND_ID, { canBeMissing: true })[0];
    var report = allReports === null || allReports === void 0 ? void 0 : allReports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportID)];
    var tryNewDot = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_TRY_NEW_DOT, { canBeMissing: false })[0];
    var isTryNewDotNVPDismissed = !!((_b = tryNewDot === null || tryNewDot === void 0 ? void 0 : tryNewDot.classicRedirect) === null || _b === void 0 ? void 0 : _b.dismissed);
    return (<ScrollView_1.default>
            <ReportActionItem_1.default allReports={allReports} policies={policies} action={reportAction !== null && reportAction !== void 0 ? reportAction : {}} report={report !== null && report !== void 0 ? report : {}} reportActions={[]} parentReportAction={undefined} displayAsGroup={false} isMostRecentIOUReportAction={false} shouldDisplayNewMarker={false} index={0} isFirstVisibleReportAction={false} shouldDisplayContextMenu={false} userWalletTierName={userWalletTierName} isUserValidated={isUserValidated} personalDetails={personalDetails} userBillingFundID={userBillingFundID} isTryNewDotNVPDismissed={isTryNewDotNVPDismissed}/>
        </ScrollView_1.default>);
}
DebugReportActionPreview.displayName = 'DebugReportActionPreview';
exports.default = DebugReportActionPreview;
