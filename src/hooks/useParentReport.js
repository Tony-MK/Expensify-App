"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useOnyx_1 = require("./useOnyx");
function useParentReport(reportID) {
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, { canBeMissing: true });
    const [parentReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.parentReportID}`, { canBeMissing: true });
    return parentReport;
}
exports.default = useParentReport;
