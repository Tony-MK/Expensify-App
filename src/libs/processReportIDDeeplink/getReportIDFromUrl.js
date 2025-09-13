"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getReportIDFromUrl;
const ReportUtils_1 = require("@libs/ReportUtils");
function getReportIDFromUrl(url) {
    const currentParams = new URLSearchParams(url);
    const currentExitToRoute = currentParams.get('exitTo') ?? '';
    const { reportID } = (0, ReportUtils_1.parseReportRouteParams)(currentExitToRoute);
    return reportID;
}
