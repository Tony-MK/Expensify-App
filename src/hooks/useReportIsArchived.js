"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ReportUtils_1 = require("@libs/ReportUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useOnyx_1 = require("./useOnyx");
function useReportIsArchived(reportID) {
    const [reportNameValuePairs] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${reportID}`, { canBeMissing: true });
    const isReportArchived = (0, ReportUtils_1.isArchivedReport)(reportNameValuePairs);
    return isReportArchived;
}
exports.default = useReportIsArchived;
