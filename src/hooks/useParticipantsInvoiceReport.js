"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const mapOnyxCollectionItems_1 = require("@src/utils/mapOnyxCollectionItems");
const useOnyx_1 = require("./useOnyx");
/*
 Since invoice chat rooms have `type === CONST.REPORT.TYPE.CHAT`,
 we filter on that value to minimize the number of rNVPs being subscribed to.
*/
const reportNameValuePairsSelector = (reportNameValuePairs) => {
    if (reportNameValuePairs && 'type' in reportNameValuePairs && reportNameValuePairs?.type !== CONST_1.default.REPORT.TYPE.CHAT) {
        return;
    }
    return (reportNameValuePairs &&
        {
            private_isArchived: reportNameValuePairs.private_isArchived,
        });
};
const reportSelector = (report) => {
    if (!report || !(0, ReportUtils_1.isInvoiceRoom)(report)) {
        return;
    }
    return report;
};
function useParticipantsInvoiceReport(receiverID, receiverType, policyID) {
    const [allInvoiceReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: true, selector: (c) => (0, mapOnyxCollectionItems_1.default)(c, reportSelector) });
    const [reportNameValuePairs] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}`, {
        canBeMissing: true,
        selector: (c) => (0, mapOnyxCollectionItems_1.default)(c, reportNameValuePairsSelector),
    });
    const invoiceReport = (0, react_1.useMemo)(() => {
        const existingInvoiceReport = Object.values(allInvoiceReports ?? {}).find((report) => {
            if (!report || !reportNameValuePairs) {
                return false;
            }
            const isReportArchived = (0, ReportUtils_1.isArchivedReport)(reportNameValuePairs[`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report?.reportID}`]);
            if ((0, ReportUtils_1.isArchivedNonExpenseReport)(report, isReportArchived)) {
                return false;
            }
            const isSameReceiver = report.invoiceReceiver &&
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
