"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = shouldOpenLastVisitedPath;
const ReportUtils_1 = require("@libs/ReportUtils");
function shouldOpenLastVisitedPath(lastVisitedPath) {
    return !!lastVisitedPath && !!(0, ReportUtils_1.getReportIDFromLink)(lastVisitedPath);
}
