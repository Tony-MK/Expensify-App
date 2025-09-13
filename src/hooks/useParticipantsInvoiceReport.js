"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var ReportUtils_1 = require("@libs/ReportUtils");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var mapOnyxCollectionItems_1 = require("@src/utils/mapOnyxCollectionItems");
var useOnyx_1 = require("./useOnyx");
/*
 Since invoice chat rooms have `type === CONST.REPORT.TYPE.CHAT`,
 we filter on that value to minimize the number of rNVPs being subscribed to.
*/
var reportNameValuePairsSelector = function (reportNameValuePairs) {
    if (reportNameValuePairs && 'type' in reportNameValuePairs && (reportNameValuePairs === null || reportNameValuePairs === void 0 ? void 0 : reportNameValuePairs.type) !== CONST_1.default.REPORT.TYPE.CHAT) {
        return;
    }
    return (reportNameValuePairs &&
        {
            private_isArchived: reportNameValuePairs.private_isArchived,
        });
};
var reportSelector = function (report) {
    if (!report || !(0, ReportUtils_1.isInvoiceRoom)(report)) {
        return;
    }
    return report;
};
function useParticipantsInvoiceReport(receiverID, receiverType, policyID) {
    var allInvoiceReports = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: true, selector: function (c) { return (0, mapOnyxCollectionItems_1.default)(c, reportSelector); } })[0];
    var reportNameValuePairs = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS), {
        canBeMissing: true,
        selector: function (c) { return (0, mapOnyxCollectionItems_1.default)(c, reportNameValuePairsSelector); },
    })[0];
    var invoiceReport = (0, react_1.useMemo)(function () {
        var existingInvoiceReport = Object.values(allInvoiceReports !== null && allInvoiceReports !== void 0 ? allInvoiceReports : {}).find(function (report) {
            if (!report || !reportNameValuePairs) {
                return false;
            }
            var isReportArchived = (0, ReportUtils_1.isArchivedReport)(reportNameValuePairs["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS).concat(report === null || report === void 0 ? void 0 : report.reportID)]);
            if ((0, ReportUtils_1.isArchivedNonExpenseReport)(report, isReportArchived)) {
                return false;
            }
            var isSameReceiver = report.invoiceReceiver &&
                report.invoiceReceiver.type === receiverType &&
                (('accountID' in report.invoiceReceiver && report.invoiceReceiver.accountID === receiverID) ||
                    ('policyID' in report.invoiceReceiver && report.invoiceReceiver.policyID === receiverID));
            return report.policyID === policyID && isSameReceiver;
        });
        return existingInvoiceReport;
    }, [allInvoiceReports, reportNameValuePairs, receiverID, receiverType, policyID]);
    return invoiceReport;
}
exports.default = useParticipantsInvoiceReport;
